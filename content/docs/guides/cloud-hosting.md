+++
title = "Host documents in the cloud"
description = "Separate document authority, local commits and durable service receipts."
weight = 7
+++

**Status: planned reference-service integration; no runnable service deployment.** The required roadmap28 reference host is not present in the inspected local checkouts. The prepared-auth collaboration relay is a protocol fixture, not durable storage. The host-agent consumer has separate retained local evidence; it does not establish cloud-service readiness.

## Before you start

**Prerequisites:** Your app supplies tenant membership and document authority. Read [persistence and collaboration](@/docs/concepts/persistence.md), [storage reference](@/docs/reference/api-storage.md) and [sync reference](@/docs/reference/api-sync.md). Choose the deployment boundary before accepting user documents.

**Tested version:** no cloud service artifact, adapter version or SDK service consumer is qualified here. Inspect the exact contract and host-agent revisions in [sources and prepared outcomes](@/docs/examples/host-services.md). These pages describe local requirements; no provider is selected or provisioned.

## Identity and admission

Document identity is tenant, document ID and epoch together. A title, object key, document ID or `ac://` locator does not authorize access. Keep discovery, membership, ACLs and catalog revisions in the control plane; keep immutable update bytes, publication records and recovery in the data plane. One deployable host may contain both.

Verify the principal at the host, then authorize each document read/write, receipt lookup, subscription, upload, asset download, history read and export. Recheck current permissions on reconnect and inside serialized write admission. Scope lists before pagination and counts so another tenant's existence does not leak. Token validation and trusted-proxy handling belong to maintained host adapters, not document prose. Do not put credentials in locators, logs or browser examples.

Catalog and content revisions are distinct. Check the relevant exact revision atomically with the mutation. An object-store ETag, checksum or CRDT state vector is not automatically that revision. A stale precondition returns a conflict without mutation; preserve the candidate for a new reviewed proposal.

## Example and expected outcome

Use the downloadable **C01–C07** [prepared transcript](@/docs/examples/host-services.md) as an acceptance target for the future real service. Its fields are descriptive, not public API names.

| Step | Action | Independently expected result |
| --- | --- | --- |
| C01 | A changes Deadline Friday to Deadline Monday while B is offline | A has Monday; B still has Friday. Local commit only. |
| C02 | A sends its outbox and receives a socket acknowledgement | Remote durability remains unconfirmed; no service receipt. |
| C03 | Host commits but its response is lost | Client reports unknown outcome and retains the original operation identity and input digest. |
| C04 | A reconnects with current authority and looks up that operation | Only an authoritative committed ledger outcome may confirm remote durability, bound to the declared backend failure class. Asset availability remains separate. |
| C05 | B reauthenticates and resumes the committed log | Both show Monday; duplicate delivery adds zero effects. |
| C06 | B loses write permission while disconnected | Writes reject; local backup remains available. Reconnect grants no old authority. |
| C07 | Restore a backup into an isolated destination | Verify hashes, commit coverage and acknowledged text; verify asset bytes separately. The source store is not overwritten. |

**These steps have not executed against a reference service.** The docs checks validate the prepared corpus and source identities only. `remoteCommitted` means the negotiated backend promise, not an unmeasured host-loss, replica-loss or disaster-recovery guarantee.

## Publication and assets

Bind a request to verified actor, tenant/document/epoch, stable operation ID, profile, input digest and expected revisions. Repeating the same ID and input returns the recorded outcome; changed input with that ID rejects. Reauthorize before disclosing an old receipt. Advertise retry retention and resume floors; expired IDs need explicit reconciliation rather than silently becoming new writes.

For available-asset publication, finalize immutable object versions first, verifying length, integrity and the adapter's durability evidence. Then atomically publish catalog effects, update identities, finalized asset references and the operation outcome in the authoritative transactional backend. Only a confirmed commit may produce the remote receipt or committed relay replay. An object upload or queued message cannot do so. A lost response requires ledger lookup before publishing again.

Ordinary document updates may contain locally queued attachments. Document receipts and asset-finalization receipts remain distinct: document sync does not prove those bytes are remotely available. Upload capabilities bind tenant, actor, document/epoch, size, expiry and staging key; reserve quota atomically and reauthorize finalization. Failed checks create no available document reference. Reclaim unreferenced staging/orphans only under the documented grace and retention rules. Do not fetch arbitrary URLs or trust client-declared size or provider ETags as content digests.

## Local reference deployment boundary

A runnable local recipe is **pending roadmap28 evidence**, including a maintained real transactional backend, immutable blob adapter, migrations, non-secret configuration, capability manifest and packaged consumer. There is no valid startup command or invented package to install today. A mock-only store cannot satisfy this boundary.

When the owning return arrives, bind the build digest, adapter versions, schema/profile support, identity verifier, origins, limits and retention in the deployment manifest. Follow the owner's exact local command and isolated paths; do not substitute a hosted provider. Development unsigned mode must be explicit and loopback-only. Signed deployment verification and operator trust roots remain a separate deployment requirement.

Use [the operational checklist](@/docs/guides/host-operations.md) to review the return. Reference-ready, configured-provider qualified and public-deployment approved are separate levels. None implies the next. A ciphertext relay does not provide plaintext MCP editing; see [authorized agent endpoints](@/docs/guides/agents.md).

## Failure and recovery

Preserve local outboxes and the original request identity on timeout. Distinguish definitely rejected from unknown outcome. A transport reconnect or UI render cannot mark content saved. Slow clients resume from a durable cursor; bound frames, queues, connections, uploads, pagination and per-tenant reservations rather than dropping acknowledged work.

Restore into a separate store and validate document/asset coverage, deletion/epoch barriers and schema compatibility before cutover. Never clear a document, replay under a new ID or downgrade its schema to make recovery appear successful. Backup/restore, readiness, quota and shutdown criteria are in [host operations](@/docs/guides/host-operations.md).

## Migration and compatibility

Review [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). Provider qualification, encrypted-profile qualification, publication and actual deployment remain pending.
