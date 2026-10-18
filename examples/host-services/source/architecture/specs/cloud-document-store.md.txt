# Cloud document store and reference host

Qualification amendment (user decision, 2026-10-14): Named target-platform simulators/emulators and desktop OS VMs/test hosts may satisfy platform and release gates when physical hardware is unavailable. Follow the [platform qualification policy](../specs/verification.md#platform-qualification-with-simulators-emulators-and-vms) for required runtime checks, tested virtual equivalents for hardware-only observations, counts and physical/virtual provenance. Earlier physical-only/manual-only wording in this document is superseded. This changes accepted evidence, not required implementation or correctness.

Status: planned delivery contract. No cloud service, provider, deployment, or durability claim is established by this document.

This companion service lets authorized clients locate documents, exchange durable updates, and store their assets. The Rust document/session contracts remain authoritative. A single deployable reference host lives in `core/services/document-store/`; provider adapters implement its ports. Keep catalog, update storage, authorization, relay, and asset modules in that host initially. Separate services require measured operational need, not an anticipated scale claim.

Entry gates are `06-synchronization.md`, `12-client-contracts.md`, and `25-rich-content-extensions.md`, including actual blob ports. Follow [storage-sync](storage-sync.md), [client-contracts](client-contracts.md), [rich-content-extensions](rich-content-extensions.md), and [security-encryption](security-encryption.md). The prepared-auth loopback relay from SYN-1.5 is a protocol fixture; it does not satisfy this service contract.

## Ownership and adapters

The reference host must run locally against a real durable transactional backend and immutable blob storage. CLD-1.1 selects and records the smallest maintained backend/library combination that meets the contract, verifies versions, license, migrations, and restart behavior, then creates the harness. This is an implementation dependency decision, not cloud-provider provisioning. In-memory and fault-injected adapters supplement the real backend; they cannot be the sole delivery evidence.

| Port | Owns | Required invariant |
| --- | --- | --- |
| `IdentityVerifier` / `AuthorizationPolicy` | Verified principals, tenant membership, document actions | Untrusted tenant/document selectors never grant access; current policy is checked at admission |
| `CatalogStore` | Tenant-scoped document identity, authority mapping, epoch, ACL references, lifecycle, catalog revision | Atomic conditional metadata changes; no CRDT payload in catalog records |
| `UpdateStore` | Immutable updates, operation ledger, checkpoints, coverage, publication records | Acknowledged content survives the backend's declared failure class |
| `BlobStore` | Staging, immutable versioned objects, byte integrity, finalized-object receipts | A published reference identifies verified immutable bytes; upload completion alone is insufficient |
| `CommitCoordinator` | Serialized publication of catalog changes, update identities, finalized blob references, request outcomes | One authoritative durable commit record; failed publication cannot emit success |
| `Relay` | Negotiated wire profile, bounded subscriptions, awareness, resume | Uses durable commits for replay; ephemeral presence never establishes durability |

Interfaces use owned buffers, explicit cancellation/deadlines, bounded pagination, typed retryability, document/tenant context, and capability declarations. Adapter errors preserve whether a commit was definitely rejected or its outcome is unknown. Drivers stay outside `editac-core`; provider SDK objects do not cross these ports. Ship one working adapter set first and reusable conformance tests for future sets.

## Identity, authorization, and control plane

Document identity is `(tenant_id, document_id, epoch)`. Catalog revisions and content revisions are separate values. Human titles, paths, aliases, and source locators are metadata, not identity; list/search results are scoped before pagination and counting. Catalog discovery, document reads/writes, asset downloads, upload intents, history, exports, and deletion each require authorization. Do not leak existence through another tenant's errors, counts, object keys, caches, queues, or metrics.

The deployable host needs a real credential-verification adapter. For a JWT adapter, pin allowed algorithms, trusted issuer/audience and key discovery policy; validate signatures, expiry and token purpose using maintained libraries. Prepared signed tokens and a local key fixture cover automated tests. Tenant membership and document roles remain server-authoritative and revocable; possession of a document ID or valid login token is insufficient. Trust proxy headers only from explicitly configured proxies. Never log tokens or place them in `ac://` locators.

Catalog mutations require an exact expected catalog revision, checked inside the same transaction as mutation and operation-ledger publication. Content preconditions use the CAP content revision and serialized admission boundary; a Yjs state vector does not detect every deletion. A rejected precondition returns a typed conflict and performs no mutation. HTTP `If-Match`, when exposed, maps a strong validator to the selected representation's exact server revision. An object-store ETag, modification timestamp, or upload checksum is not automatically a catalog/content revision or transaction fence. See [RFC 9110 validators and conditional requests](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match).

## Durable publication and idempotency

An admitted operation binds verified actor, tenant/document/epoch, writer sequence or request ID, profile, input digest, expected revisions, and intended effects. Repeating the same key and input returns the same recorded outcome; the same key with different input rejects. Authorization is rechecked before an old result is disclosed. Deduplication retention and resume floors are advertised; expired operation keys reject or use an explicit reconciliation flow, never silently become a new mutation.

Document-update receipts and asset-finalization receipts remain distinct, matching RCH. Ordinary CRDT updates may describe local/queued assets; their receipt does not make those assets remotely available or block local editing. A document commit may refer to a pending descriptor, but only a finalized asset receipt may establish availability.

For an operation explicitly publishing available assets, first finalize immutable object versions and obtain backend evidence that their bytes meet the declared durability class. Then atomically publish catalog effects, update identities, finalized asset references, new revisions, and the operation outcome in the authoritative transactional store. That transaction is the logical commit boundary. Object stores generally cannot join it: staged/finalized unreferenced bytes may become recoverable orphans, but references must never point to unverified or mutable objects. The adapter must prevent overwrite/deletion of referenced versions under its qualified ownership and retention policy.

Only after commit confirmation may the host send a remote receipt or relay a committed publication. Bind receipts to tenant/document/epoch, immutable update identity/digest, operation and commit revision, profile, finalized asset receipt references where relevant, and the promised durability class. A combined publication manifest links these distinct receipts without merging their promises. A lost response permits idempotent recovery. An uncertain commit outcome requires ledger lookup before retry publication. No receipt follows enqueueing, socket send, cache acknowledgment, upload request success, or a transaction that later rolls back. Checkpoints and relay replay cannot expose an uncommitted predecessor.

`remoteCommitted` proves only the negotiated service/backend promise. Record process-crash, host-loss, replica-loss, and disaster-recovery guarantees separately with evidence; never infer them from a successful local transaction. Backup policy and receipt durability are related but distinct.

## Assets and resource limits

Use the actual RCH blob/attachment ports. Upload intents bind tenant, actor, document/epoch, size bound, expiry, allowed content handling, and an unguessable staging key. A provider may issue a narrowly scoped direct-upload capability; the reference host uses the same stage/finalize protocol. Do not expose credentials or accept arbitrary remote fetch URLs. Reserve quota atomically before upload; release or expire reservations safely.

Finalize verifies object existence, immutable version, measured length and integrity according to the selected profile; do not trust client declarations or confuse provider ETags with digests. Finalization is idempotent and reauthorizes the actor. Object keys and capabilities are tenant scoped. Failed checks leave no document reference. Only published attachments may be fetched through authorized download grants; failed, expired, and abandoned stages are reclaimed after the documented grace period. Serving user content uses safe disposition, media handling, and origin policy. Encrypted objects remain opaque; plaintext scanning cannot be claimed for them.

Bound frame size, decoded updates, uploads, documents, per-tenant bytes, connections, in-flight operations, subscription buffers and pagination. Quotas include reservations, journals, checkpoints, asset versions, exports, and retained backups where charged to a tenant. Durable usage accounting reconciles after crashes. Apply per-principal and per-tenant rate limits, fair scheduling and typed retry hints. A slow consumer reconnects from a durable resume cursor; an overflowing queue does not drop an acknowledged update or clear a client outbox.

## Relay, compaction, and document lifecycle

Each connection negotiates supported schema/wire/security profiles. Browser-origin validation complements authentication; every action checks document authority. Expiry, logout, membership changes, and tenant changes invalidate access during a long-lived connection. Bound handshake time and unauthenticated traffic. Relay updates come from the durable commit log; awareness remains ephemeral. The client retains pending writes until matching receipts.

Compaction publishes a verified checkpoint and exact coverage atomically, retaining the recovery tail and deduplication/resume evidence needed by declared offline windows. Peer state vectors alone are not permission to remove tombstones, replay barriers, or unpublished data. A peer below the supported resume floor receives an explicit resnapshot/reconciliation response preserving its unacknowledged local changes. Epoch migration has an explicit old-epoch admission policy; silent merge or reset is forbidden.

Lifecycle is explicit: active, tombstoned, retention-held, purge-eligible, purged. Tombstones/retired epochs prevent stale offline clients from resurrecting deleted documents. IDs are not recycled within the retained admission domain. A client facing deletion can export/recover its local draft through a new authorized document, never silently recreate the old one. Keep minimal rejection markers for the advertised offline window; if markers expire, require a new admission token/epoch so an old request cannot become creation.

Export captures an authorized, stable manifest revision with document bytes, catalog metadata appropriate to the caller, attachment versions and integrity metadata; pagination/retry does not mix revisions. Protected profiles export ciphertext unless an explicitly authorized endpoint owns keys. Retention holds, deletion deadlines, backups, legal/operator policy and restore restrictions are documented capabilities. Purge invalidates access immediately, then removes scoped data and unreferenced objects with resumable audit evidence. Historical backups may retain data until their stated expiry; a deletion ledger must prevent restore from republishing deleted content. Do not promise immediate physical erasure from third-party backups.

## Operations and qualification

Backup captures a mutually consistent catalog/journal/checkpoint/asset manifest and versioned configuration. Restore runs into an isolated destination, validates hashes and commit coverage, applies deletion/epoch barriers, and demonstrates that acknowledged operations and required assets remain usable. Never overwrite an active store to test restore. State recovery-point and recovery-time objectives separately from measured drill results. Include schema migration rollback/forward-recovery and failed partial restores.

The first deployment may be a single writer with fenced ownership and durable storage; the capability manifest must say so. Test restart, crash during commit, duplicate delivery, storage exhaustion, dependency timeout, stale writer, slow reader and lost receipt. If multiple hosts are supported, prove fencing/CAS and committed-log fanout under concurrent publication before enabling replicas; an in-process mutex cannot establish distributed exclusion. Scale limits come from deterministic local load fixtures and separately qualified provider evidence, not extrapolation.

Expose readiness/liveness, commit latency, queue depth, rejected admission, quota pressure, replay lag and recovery failures without document contents, tokens or unbounded identifier labels. Trace one operation across upload/finalize/commit/receipt using a non-secret correlation ID. Define alert thresholds, drain/shutdown behavior and a small operator runbook.

Package one runnable service, migrations, example non-secret configuration, capability manifest, and a local consumer example. A versioned deployment manifest binds build digest, adapter versions, schema/profile support, trusted identity issuers, allowed origins, limits, retention and secret references. Verify its signature against an operator-established trust root before startup; disallow silent override/downgrade. Plan key rotation and emergency rollback explicitly. Secret values live in the deployment's secret facility, not signed public files or test fixtures. Development unsigned mode is explicit, loopback-only, and cannot report deployment-qualified status.

Evidence levels must remain distinct:

1. **Reference-ready:** real local backend, reusable adapter contracts, restart/fault tests, packaged consumer and restore drill pass at recorded revisions. Mocked transports and prepared identities are labeled.
2. **Configured-provider qualified:** separately authorized testing of the exact selected backend, credentials/roles, region, consistency settings, encryption/retention, signed config and deployment topology proves the same contracts and failure guarantees. Local emulators cannot establish this claim. No provider is selected or provisioned by this roadmap preparation.
3. **Public deployment approved:** operator-owned service, budget, data policy, monitoring, rollback and qualified artifacts are reviewed in the final release gate. Provisioning and publication need their concrete delivery scope; this roadmap does not incur charges.

Opaque envelope storage/transport is a compatibility requirement, not E2EE qualification. Baseline CLD work may use prepared opaque bytes and must reject unsupported profile IDs. Actual protected clients/server combinations require tracks19/24 plus the final server/profile release gate; key custody, membership, metadata leakage and authorized plaintext endpoints remain governed by their security contracts.

## Primary guidance checked

- [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) and [multi-tenant security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) support per-action authorization and server-verified tenant context. They do not certify an adapter.
- [OWASP WebSocket security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) covers origin checks, session expiry and per-message authority for long-lived connections.
- [JWT best current practices, RFC 8725](https://www.rfc-editor.org/rfc/rfc8725.html) informs issuer/audience/algorithm verification; it does not supply tenant membership policy.
- [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) distinguishes representation validators and conditional requests. Storage transactions and crash durability remain adapter obligations.
