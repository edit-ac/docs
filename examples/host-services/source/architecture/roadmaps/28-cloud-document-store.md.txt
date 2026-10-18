# Deliver a cloud document store reference host

Status: IN_PROGRESS

Qualification amendment (user decision, 2026-10-14): Physical devices, named target-platform simulators/emulators and desktop OS VMs/test hosts are accepted for platform and release qualification under the [platform qualification policy](../specs/verification.md#platform-qualification-with-simulators-emulators-and-vms). Missing physical hardware does not block completion. Execute required behavior against the implemented target-platform runtime; document and test virtual equivalents for unavailable hardware-only input/accessibility cases. Record physical versus virtual provenance and measure performance in the tested environment. This supersedes earlier physical-only or manual-only clauses below; it does not complete unchecked tasks or waive implementation, correctness, security or artifact gates.

## Goal and entry conditions

Workspace: `core`; paths are core-relative unless prefixed `../architecture/`. Follow `../architecture/specs/cloud-document-store.md`. This track implements one deployable host with provider-neutral ports and a real local durable adapter; SYN's prepared-auth loopback relay is insufficient.

Required upstream tracks: `06-synchronization.md`, `12-client-contracts.md`, `25-rich-content-extensions.md` complete at reviewed revisions with passing evidence, including actual blob/attachment ports. Whole-track gates are checked before launch; dependencies below are local to this file.

## Execution rules

One parent per iteration, 15–45 minutes plus checks. If a boundary is larger, the controller must split it before implementation. Controller owns source checkboxes; workers write progress in the separate configured file. Planned paths/test targets are created by their named task. Each named Rust integration target must execute nonzero cases; missing targets, zero matches, failures and skips cannot pass acceptance. Reuse upstream semantic cases; do not implement another CRDT.

All automated checks use deterministic credentials, local durable stores, fault fixtures and mocked external transports; no paid inference, `.secrets`, live-provider writes or automatic fixture recording. This track selects implementation libraries, not a hosting provider. Reference tests do not establish configured-provider durability or public deployment readiness. Production encrypted profiles require tracks19/24 and the final server/profile release gate; their absence does not block baseline reference delivery. Do not provision or publish as an implicit check.

## Epic CLD-1 — Durable cloud document store reference delivery

### Task CLD-1.1 — Bootstrap the reference host and adapter checks

- [ ] CLD-1.1 Bootstrap the reference host and adapter checks.

Purpose: bootstrap the reference host and adapter checks.
Context: Cargo.toml; services/document-store/Cargo.toml; services/document-store/tests/bootstrap.rs.
Dependencies: none.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Reviewed SYN/CAP/RCH revisions pass; backend/library choice records maintained versions, licensing and transaction limits. A real local durable backend is selected; mocked relay alone cannot qualify.

Implementation:

- [ ] CLD-1.1-I1 Create the Rust host package and minimal real-store fixture lifecycle; freeze port/error/capability names from the spec and record unresolved compatibility decisions before expanding scope.

Validation:

- [ ] CLD-1.1-V1 `cargo test -p editac-document-store --test bootstrap --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.2 — Verify identity and tenant authorization

- [ ] CLD-1.2 Verify identity and tenant authorization.

Purpose: verify identity and tenant authorization.
Context: services/document-store/src/auth/; services/document-store/tests/authorization.rs.
Dependencies: CLD-1.1.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Valid login never grants another tenant/document; missing, expired, wrong-issuer/audience/algorithm credentials and stale membership reject across catalog, assets and relay admission.

Implementation:

- [ ] CLD-1.2-I1 Implement a maintained credential verifier plus server-owned membership/action policy; use deterministic signed credentials and local key rotation fixtures, with no live issuer calls in checks.

Validation:

- [ ] CLD-1.2-V1 `cargo test -p editac-document-store --test authorization --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.3 — Persist the catalog with exact revision checks

- [ ] CLD-1.3 Persist the catalog with exact revision checks.

Purpose: persist the catalog with exact revision checks.
Context: services/document-store/src/catalog/; services/document-store/tests/catalog.rs.
Dependencies: CLD-1.2.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Tenant-scoped catalog survives restart; concurrent expected-revision writers cannot both replace the same revision. Stale CAS performs no write; listing/counts reveal no other tenant.

Implementation:

- [ ] CLD-1.3-I1 Implement transactional identity/epoch/catalog metadata and pagination; keep CRDT bytes separate. Bind strong HTTP validators to this representation revision rather than provider object ETags.

Validation:

- [ ] CLD-1.3-V1 `cargo test -p editac-document-store --test catalog --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.4 — Persist immutable updates and the operation ledger

- [ ] CLD-1.4 Persist immutable updates and the operation ledger.

Purpose: persist immutable updates and the operation ledger.
Context: services/document-store/src/updates/; services/document-store/tests/update_ledger.rs.
Dependencies: CLD-1.3.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Restart preserves accepted records; same operation/input returns its recorded result, conflicting input rejects, and expired deduplication keys cannot silently become new mutations.

Implementation:

- [ ] CLD-1.4-I1 Implement immutable update identities/digests, actor attribution and durable request outcomes with explicit unknown-commit recovery and retention floors.

Validation:

- [ ] CLD-1.4-V1 `cargo test -p editac-document-store --test update_ledger --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.5 — Issue scoped staged-upload intents

- [ ] CLD-1.5 Issue scoped staged-upload intents.

Purpose: issue scoped staged-upload intents.
Context: services/document-store/src/assets/intents.rs; services/document-store/tests/upload_intents.rs.
Dependencies: CLD-1.2, CLD-1.3.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Intent binds actor/tenant/document/epoch, expiry and bounded size; unauthorized upload and replay outside its scope fail. Concurrent reservations cannot exceed quota.

Implementation:

- [ ] CLD-1.5-I1 Adapt actual RCH blob ports to a reference upload endpoint and provider-neutral direct-upload capability. Persist reservation/expiry state without exposing backend credentials.

Validation:

- [ ] CLD-1.5-V1 `cargo test -p editac-document-store --test upload_intents --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.6 — Finalize immutable asset versions

- [ ] CLD-1.6 Finalize immutable asset versions.

Purpose: finalize immutable asset versions.
Context: services/document-store/src/assets/finalize.rs; services/document-store/tests/asset_finalize.rs.
Dependencies: CLD-1.5.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Missing, changed, oversized or corrupt objects cannot finalize; retry is idempotent. The finalized record identifies immutable bytes and the declared durability class.

Implementation:

- [ ] CLD-1.6-I1 Verify backend-measured length/integrity/version after upload and reauthorize finalize; implement authorized download grants and recoverable orphan stages using RCH attachment identity.

Validation:

- [ ] CLD-1.6-V1 `cargo test -p editac-document-store --test asset_finalize --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.7 — Publish atomic commits and durable receipts

- [ ] CLD-1.7 Publish atomic commits and durable receipts.

Purpose: publish atomic commits and durable receipts.
Context: services/document-store/src/commit.rs; services/document-store/tests/commit_receipts.rs.
Dependencies: CLD-1.4, CLD-1.6.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Failure at each publication boundary exposes no partial catalog/update/reference commit or success receipt. Retry returns the same revision/asset set; document and asset receipts retain distinct promises.

Implementation:

- [ ] CLD-1.7-I1 Atomically store catalog effects, update identity, finalized blob references and ledger outcome. Emit separate bound update/asset receipts after their confirmed commit; pending asset descriptors do not imply availability or block local editing.

Validation:

- [ ] CLD-1.7-V1 `cargo test -p editac-document-store --test commit_receipts --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.8 — Serve a bounded authorized relay

- [ ] CLD-1.8 Serve a bounded authorized relay.

Purpose: serve a bounded authorized relay.
Context: services/document-store/src/relay/; services/document-store/tests/relay.rs.
Dependencies: CLD-1.2, CLD-1.7.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Negotiation rejects unsupported profiles; origin/session expiry and each document action are enforced. Relay replays committed updates only; awareness is ephemeral and slow consumers can resume.

Implementation:

- [ ] CLD-1.8-I1 Reuse SYN wire codecs through the host ports; bound unauthenticated handshakes, frames, decoding, subscriptions and queues. Record durable resume cursors independently from awareness.

Validation:

- [ ] CLD-1.8-V1 `cargo test -p editac-document-store --test relay --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.9 — Enforce fair quotas and backpressure

- [ ] CLD-1.9 Enforce fair quotas and backpressure.

Purpose: enforce fair quotas and backpressure.
Context: services/document-store/src/limits.rs; services/document-store/tests/limits.rs.
Dependencies: CLD-1.5, CLD-1.8.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Prepared floods remain within configured memory/in-flight limits; cross-tenant fairness and quota races pass. Reservation/usage recovery neither double-charges nor loses acknowledged updates.

Implementation:

- [ ] CLD-1.9-I1 Enforce per-principal/tenant limits and typed retry hints; reconcile journal/blob/reservation accounting after restart and stop accepting work before storage exhaustion corrupts publication.

Validation:

- [ ] CLD-1.9-V1 `cargo test -p editac-document-store --test limits --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.10 — Compact with offline resume coverage

- [ ] CLD-1.10 Compact with offline resume coverage.

Purpose: compact with offline resume coverage.
Context: services/document-store/src/compaction.rs; services/document-store/tests/compaction.rs.
Dependencies: CLD-1.7, CLD-1.8.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Checkpoint publication interrupted at every boundary remains recoverable; a long-offline peer either resumes correctly or gets explicit reconciliation without losing its pending local edits.

Implementation:

- [ ] CLD-1.10-I1 Publish checkpoint/hash/exact coverage atomically; retain required tails, deduplication outcomes and resume floors. Do not use peer state vectors alone to discard admission barriers.

Validation:

- [ ] CLD-1.10-V1 `cargo test -p editac-document-store --test compaction --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.11 — Persist tombstones and retention policy

- [ ] CLD-1.11 Persist tombstones and retention policy.

Purpose: persist tombstones and retention policy.
Context: services/document-store/src/lifecycle.rs; services/document-store/tests/lifecycle.rs.
Dependencies: CLD-1.3, CLD-1.10.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: A deleted or retired-epoch document cannot be resurrected by stale offline updates. Holds, deadlines and expired admission windows have explicit outcomes surviving restart.

Implementation:

- [ ] CLD-1.11-I1 Implement active/tombstoned/held/purge-eligible transitions and minimal rejection markers; distinguish local draft recovery into a new authorized document from recreating deleted identity.

Validation:

- [ ] CLD-1.11-V1 `cargo test -p editac-document-store --test lifecycle --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.12 — Export a stable document bundle

- [ ] CLD-1.12 Export a stable document bundle.

Purpose: export a stable document bundle.
Context: services/document-store/src/export.rs; services/document-store/tests/export.rs.
Dependencies: CLD-1.6, CLD-1.10, CLD-1.11.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Concurrent edits cannot mix export revisions; manifest hashes and referenced asset versions verify after re-import into an isolated fixture. Unauthorized/private catalog fields are omitted.

Implementation:

- [ ] CLD-1.12-I1 Stream a bounded authorized bundle from a stable commit manifest with restartable pagination. Respect protected-profile ciphertext boundaries; this bundle export does not add content conversion.

Validation:

- [ ] CLD-1.12-V1 `cargo test -p editac-document-store --test export --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.13 — Purge scoped data and reclaim orphan objects

- [ ] CLD-1.13 Purge scoped data and reclaim orphan objects.

Purpose: purge scoped data and reclaim orphan objects.
Context: services/document-store/src/purge.rs; services/document-store/tests/purge.rs.
Dependencies: CLD-1.6, CLD-1.11.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Revoked access stops immediately; interrupted purge resumes without touching another tenant or live/shared references. Backup retention and deletion-ledger obligations stay visible.

Implementation:

- [ ] CLD-1.13-I1 Implement tenant/document-scoped purge and reference-safe stage/orphan collection with grace periods, holds, minimal anti-resurrection records and auditable progress.

Validation:

- [ ] CLD-1.13-V1 `cargo test -p editac-document-store --test purge --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.14 — Restore a consistent backup into isolation

- [ ] CLD-1.14 Restore a consistent backup into isolation.

Purpose: restore a consistent backup into isolation.
Context: services/document-store/src/backup.rs; services/document-store/tests/backup_restore.rs.
Dependencies: CLD-1.12, CLD-1.13.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: An isolated restore recovers acknowledged commits and their assets, validates coverage/hashes, and reapplies deletion barriers. Missing objects or partial backup reject qualification.

Implementation:

- [ ] CLD-1.14-I1 Capture catalog/journal/checkpoint/blob-version manifests and schema/config versions. Create an isolated restore drill with measured recovery point/time and forward-recovery guidance.

Validation:

- [ ] CLD-1.14-V1 `cargo test -p editac-document-store --test backup_restore --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.15 — Exercise durable commit failure recovery

- [ ] CLD-1.15 Exercise durable commit failure recovery.

Purpose: exercise durable commit failure recovery.
Context: services/document-store/tests/commit_faults.rs; services/document-store/tests/support/fault_store.rs.
Dependencies: CLD-1.7, CLD-1.10, CLD-1.13.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Crash/timeout/disk-full/lost-response fixtures at every named commit phase preserve the receipt invariant. Unknown outcomes reconcile through the ledger before any duplicate publication.

Implementation:

- [ ] CLD-1.15-I1 Add reusable fault points and subprocess restart cases against the real reference backend; preserve failing evidence and verify fenced stale writers cannot commit.

Validation:

- [ ] CLD-1.15-V1 `cargo test -p editac-document-store --test commit_faults --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.16 — Preserve negotiated opaque envelope bytes

- [ ] CLD-1.16 Preserve negotiated opaque envelope bytes.

Purpose: preserve negotiated opaque envelope bytes.
Context: services/document-store/src/profile.rs; services/document-store/tests/profile_bytes.rs.
Dependencies: CLD-1.7, CLD-1.8.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Prepared opaque payloads round-trip byte-exact with bound profile/epoch receipts; unsupported profiles and mismatched envelope bindings reject. No plaintext inspection or E2EE claim is inferred.

Implementation:

- [ ] CLD-1.16-I1 Add profile-aware opaque storage/relay compatibility using the security contract. Record actual SEC/ENC integration as unqualified until those tracks and the server profile gate pass.

Validation:

- [ ] CLD-1.16-V1 `cargo test -p editac-document-store --test profile_bytes --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.17 — Expose bounded operational diagnostics

- [ ] CLD-1.17 Expose bounded operational diagnostics.

Purpose: expose bounded operational diagnostics.
Context: services/document-store/src/telemetry.rs; services/document-store/tests/telemetry.rs.
Dependencies: CLD-1.8, CLD-1.9, CLD-1.13, CLD-1.15.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Metrics/traces identify rejected admission, commit latency, queue/retention pressure and recovery failures without tokens, document bodies or unbounded tenant labels.

Implementation:

- [ ] CLD-1.17-I1 Implement health/readiness and bounded telemetry with non-secret correlation IDs; add redaction fixtures and concrete alert/runbook entries for each emitted failure state.

Validation:

- [ ] CLD-1.17-V1 `cargo test -p editac-document-store --test telemetry --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.18 — Qualify restart and the supported scaling mode

- [ ] CLD-1.18 Qualify restart and the supported scaling mode.

Purpose: qualify restart and the supported scaling mode.
Context: services/document-store/src/runtime.rs; services/document-store/tests/runtime.rs.
Dependencies: CLD-1.8, CLD-1.9, CLD-1.14, CLD-1.15.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Drain/restart preserves accepted operations; stale writer fencing and bounded load fixtures pass. Manifest states tested concurrency and single-writer limits; replicas stay disabled unless qualified.

Implementation:

- [ ] CLD-1.18-I1 Implement graceful admission stop/drain and backend ownership checks. Test supported concurrent publication/fanout; require a separate bounded extension before claiming unsupported multi-host behavior.

Validation:

- [ ] CLD-1.18-V1 `cargo test -p editac-document-store --test runtime --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.19 — Verify signed deployment configuration

- [ ] CLD-1.19 Verify signed deployment configuration.

Purpose: verify signed deployment configuration.
Context: services/document-store/src/config.rs; services/document-store/tests/config.rs.
Dependencies: CLD-1.2, CLD-1.9, CLD-1.11, CLD-1.16, CLD-1.17.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: Tampered, unsigned, stale or unknown-key deployment manifests fail closed outside explicit loopback development mode. Secret values never enter public config, logs or fixtures.

Implementation:

- [ ] CLD-1.19-I1 Verify versioned config signatures with maintained libraries and operator-established trust roots; bind build/adapters/profiles/limits/issuers/origins/retention and test rotation/rollback policy.

Validation:

- [ ] CLD-1.19-V1 `cargo test -p editac-document-store --test config --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.20 — Package a runnable reference deployment

- [ ] CLD-1.20 Package a runnable reference deployment.

Purpose: package a runnable reference deployment.
Context: services/document-store/deploy/; services/document-store/examples/client.rs; services/document-store/tests/package.rs.
Dependencies: CLD-1.14, CLD-1.18, CLD-1.19.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: A clean local consumer starts the packaged host, creates/opens a document, commits an asset-backed update, reconnects and restores a backup using declared adapters and migrations.

Implementation:

- [ ] CLD-1.20-I1 Package the executable, migration procedure, non-secret signed-config example, capability manifest and operator guide. Run entirely local fixtures; record unsupported provider/topology guarantees.

Validation:

- [ ] CLD-1.20-V1 `cargo test -p editac-document-store --test package --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.

### Task CLD-1.21 — Publish adapter conformance and readiness evidence

- [ ] CLD-1.21 Publish adapter conformance and readiness evidence.

Purpose: publish adapter conformance and readiness evidence.
Context: services/document-store/tests/adapter_conformance.rs; ../architecture/evidence/cloud-store-readiness.md.
Dependencies: CLD-1.12, CLD-1.13, CLD-1.15, CLD-1.16, CLD-1.17, CLD-1.20.
Session scope: 15–45 minutes; controller splits before exceeding this boundary.
Acceptance: The real backend and fault adapters run the same nonzero contract cases; reference-ready claims identify revisions, limits and durability classes. Provider/public/E2EE qualification remains explicit and unclaimed.

Implementation:

- [ ] CLD-1.21-I1 Assemble reusable port cases and failure matrix, packaged hashes, restore evidence and provider qualification checklist. Hand exact configured-provider evidence requirements to final release without provisioning.

Validation:

- [ ] CLD-1.21-V1 `cargo test -p editac-document-store --test adapter_conformance --locked`. Prove the acceptance cases; record nonzero passed/failed/skipped counts.

Evidence: Progress entry with changed paths, revisions, command exits, case counts and durable artifact links.
Handoff: Last substep, exact current failure or next bounded action.
Blocked behavior: Leave unchecked; record owner/unblock condition and choose another dependency-ready task.
