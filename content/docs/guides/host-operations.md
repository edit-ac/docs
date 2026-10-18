+++
title = "Review host operations and recovery"
description = "Check the durable service boundary before running or trusting a host."
weight = 10
+++

**Status: operational acceptance checklist; reference deployment pending.** This page supplies no startup command, credentials, provider or production service. A local deployment cannot qualify until the owning roadmap28 package and its real durable adapters arrive.

## Before you start

**Prerequisites:** Read [cloud hosting](@/docs/guides/cloud-hosting.md) and the exact downloadable [service contract](@/docs/examples/host-services.md). Keep disposable fixture directories separate from real documents and existing services.

**Tested version:** no service/backend artifact is qualified. This checklist is a source prerequisite. The separately retained host-agent revision is documented in [agent editing](@/docs/guides/agents.md).

## Example and expected outcome

Before enabling a returned local service, require these observable results from its immutable consumer. Every missing row remains unqualified; prepared answers cannot stand in for a backend execution.

| Boundary | Required evidence and bounded action |
| --- | --- |
| Package and config | Pin build digest, adapter/library versions and licenses, migrations, schema/profile IDs, limits, retention and the exact non-secret local command. Record local data paths and how to stop it. Unsigned development mode is explicit and loopback-only. |
| Authentication and tenancy | Prepared signed identities exercise the real verifier. Cross-tenant selectors, expired/revoked authority and forged proxy context cannot read/write/list assets or receipts or leak counts. |
| Commit and replay | Real transactional backend journals immutable update identity and request outcome together. Reopen/crash/lost-response tests recover the same acknowledged result without duplicate effects; reject changed payload under the same ID. |
| Assets | Reserve quota, stage/finalize immutable bytes and verify digest/length. Publication links the distinct document and finalized-asset receipts; upload success is insufficient. Preserve referenced versions. |
| Reconnect | Reauthenticate, negotiate schema/profile/epoch and resume from committed coverage. Slow readers and expired cursors get explicit recovery, not silently dropped acknowledged content. |
| Backup and restore | Capture mutually consistent catalog, journal, checkpoint, asset manifest and versioned config. Restore into an isolated destination; validate hashes, commit coverage, acknowledged operations, required assets and deletion/epoch barriers. |
| Migration | Test compatible reopen, failed partial migration and rollback or forward recovery without losing acknowledged content. Never silently downgrade schema or overwrite active storage. |
| Resource failure | Exercise storage exhaustion, dependency timeout, staged-object failure and failed/unknown commit outcomes. Bound bytes, queues, subscriptions, uploads, pagination, reservations and tenant/principal rates. |
| Readiness and shutdown | Distinguish liveness from writable readiness. Expose commit failures, quota pressure, queue depth, replay lag and recovery barriers without document content/tokens/unbounded identifiers. Drain admitted work and preserve retry outcomes at shutdown. |
| Topology and trust | Declare single-writer fencing and durability limits. Multiple writers need real fencing/CAS and committed-log fanout proof. Verify signed deployment manifests against operator trust roots before claiming deployment qualification. |

For the prepared two-client corpus, the independent destination after reconnect must contain `Deadline Monday`; reconnect with revoked write permission must preserve the local backup and add zero remote effects. Restore checks compare original acknowledged content and required asset bytes in a separate destination. These are pending runtime assertions, not measured restore results.

## Failure and recovery

On an unknown commit, preserve input digest, epoch and operation identity, reauthorize and inspect the authoritative ledger. Do not resubmit under a fresh ID or infer success from a socket acknowledgement. For post-mutation local persistence failure, follow the [shared recovery barrier](@/docs/guides/agents.md); export salvage only through authorized read/recovery access.

Declare recovery-point and recovery-time objectives separately from actual restore-drill observations. A local transaction does not establish host-loss, replica-loss or disaster recovery. Backups include retained immutable assets and deletion barriers, not just a document JSON export. Never test restore over the active store or purge local unsent work as a generic repair.

No service was started for this documentation delivery. When one is started later, track its exact PID, launcher, port, workspace and log; gracefully stop only that fixture service and verify its listener exits. Preserve recovery evidence before removing session-owned reproducible data. Existing user services remain independently owned.

## Migration and compatibility

[Compatibility](@/docs/reference/compatibility.md) and [Migrate to edit.ac](@/docs/migrate/_index.md) describe document boundaries. Reference-ready means a real local backend, packaged consumer, restart/fault and restore proof. Configured-provider qualification additionally needs the exact backend/roles/region/consistency/topology evidence. Public deployment approval additionally needs operator budget, data policy, monitoring and rollback review. This local-only docs delivery establishes none of those deployment levels. Encryption support requires its own profile and key-custody evidence.
