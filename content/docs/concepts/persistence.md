+++
title = "Local saving and collaboration"
weight = 3
+++

**Status: conceptual walkthrough; not runtime qualification.**

## Before you start

**Prerequisites:** Read the [fixture overview](@/docs/concepts/_index.md) and identify your document, view, storage and transport owners.

**Tested version:** Project kickoff teaching fixture **project-kickoff/1**; source-only, conceptual. No SDK version or platform is qualified by this walkthrough. The [versioned declarations](@/docs/reference/api-capabilities.md) and [separate qualified consumer](@/docs/examples/qualified-local.md) retain their exact artifact scope.

## Example and expected outcome

The [transcript](/concepts/project-kickoff-v1/transcript.json) separates three questions: what is visible, what is locally durable, and what a qualified remote host has durably acknowledged. `localCommitted` and `remoteCommitted` below name conceptual receipt milestones; these files produce no receipts.

| Steps | Observation | Expected content and durability |
| --- | --- | --- |
| PK-09 | Local persistence succeeds | `kickoff-v1`, localCommitted; remote pending. |
| PK-10 | Dispose/reopen from that store | Same durable words and marks; new view, no history/selection restoration claim. |
| PK-11 | Prepared peer inserts ` and Sam` after Alex | `remote-owner-v1`: Owner: Alex and Sam; Friday stays bold. Local and remote persistence of the new update still pending. |
| PK-12 | Local journal commits that update | Same remote-owner-v1, localCommitted; remote pending. |
| PK-13 | Prepared host durably acknowledges the covered update | Same content, localCommitted and remoteCommitted for the acknowledged coverage only. |
| PK-16 | Separate attempted edit encounters local quota failure | Durable remote-owner-v1 unchanged; unsaved edit retained as recovery data, local failed and remote pending. No successful reopen of the attempted edit is claimed. |

```text
accepted in memory → local journal receipt → reopen from local bytes
       │                    │
       └→ transport → convergence → covered durable host receipt
          delivery is not durability; local receipt is not remote receipt
```

[Download the remote state](/concepts/project-kickoff-v1/remote-owner-v1.md). This is a prepared peer transcript, not a running synchronization demo, and does not promise a particular conflict ordering. The change is in the owner paragraph, preserving the other blocks. A local save event cannot establish remote durability. A remote receipt must identify what it covers; later edits may still be pending.

The [separate immutable consumer](@/docs/examples/qualified-local.md) already proves its named local edit/save/reopen and prepared peer cases with another corpus. Its frozen [source manifest](/reference-inputs/local-pin-1.3/manifest.json) pins exact artifacts and profiles. Reuse that evidence only for those cases, never as Project kickoff execution or a general remote-host guarantee. Consult the actual [storage](@/docs/reference/api-storage.md), [sync](@/docs/reference/api-sync.md) and [lifecycle](@/docs/reference/api-lifecycle.md) declarations and the [local-first guide](@/docs/guides/local-first.md).

## Failure and recovery

On local quota failure preserve unsaved content, journal/checkpoint and recovery export. Stop dependent publication according to the owning session's policy; retry ordered storage recovery and verify a compatible reopen before claiming success. A lost network connection or revoked permission leaves remote durability pending or rejected; retain local work and recheck authorization before reconnecting. Never clear a store to conceal a failure.

This static lesson creates no resources. In a runnable consumer, unsubscribe, detach prepared peers/host work, destroy views and close owned stores on disposal. Preserve unsent recovery data. Remount with a fresh lifetime so earlier async callbacks cannot mutate the new view. React, Astro, actual OS/native, registry and deployed-service qualification remain separate gates.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). A Markdown teaching snapshot is not a schema migration or lossless import guarantee.
