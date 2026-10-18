+++
title = "Events, ordering and lifetime"
description = "Separate lifecycle state, document patches, selection and durable receipts."
weight = 4
+++

**Status: local packed browser consumer; unpublished PIN-1.3 core/web 0.0.0.** Read the [saving walkthrough](@/docs/reference/lifecycle.md) alongside the [complete consumer](@/docs/examples/lifecycle.md). The [generated events declarations](@/docs/reference/api-events.md) and <a href="{{ get_url(path="reference-inputs/lifecycle-v1/manifest.json") }}">source manifest</a> identify the exact contracts.

## Two subscription forms

`subscribe(listener)` receives lifecycle state after corresponding transitions. It does **not** replay current state when subscribed: read `state` separately. Phases are visible, ready, failed, closing and destroyed. Readiness, read-only, preview, local commit and error fields have separate meanings. The API does not promise DOM CustomEvents named `change`, `save` or `selection`.

`subscribe(scope, listener)` receives engine `Patch` objects and requires a ready editor. This example uses `{type:'updates'}` for document updates. The declared `{type:'selection'}` engine scope is separate from native DOM selection notifications. A patch includes operation, identity, revision, sequence and optional update/selection details. Consult the frozen <a href="{{ get_url(path="reference-inputs/local-pin-1.3/core/dist/engine.d.ts") }}">core patch declarations</a> for the full union. The example listens to native `selectionchange` on the document and filters it to this editor root. Its timeline labels these as host DOM notifications, not SDK patches. Moving only the DOM selection does not automatically publish an engine selection patch and is not a durable document change.

## Independent expected timeline

| Action | Expected observation | What it establishes |
|---|---|---|
| Create handle | visible, not ready; no local receipt | Initial state only; do not edit yet |
| Recovery and binding finish | ready lifecycle transition | Local input authority, not a new save |
| Select Friday | host DOM selectionchange notification | Target/range change; no document update or receipt |
| Replace Friday with Thursday | document update before its new commit receipt | Semantic mutation; persistence is still separate |
| Await captured local flush | actual journal receipt and completed host barrier | Local persistence of captured updates only |
| Set read-only | lifecycle authority transition; denied input leaves text unchanged | Input policy, not document mutation |
| Unsubscribe | future notifications stop | Host listener lifetime only |
| Destroy | closing then destroyed for retained lifecycle listeners | Teardown; remount only after its promise settles |

The tests compare independently authored text and partial-order constraints. They do not manufacture an exact total order between every renderer/selection notification. Receipt presence alone is insufficient: it can refer to an older update while a new update is pending or failed. Remote durability requires its own applicable service receipt; this consumer has none and labels it not configured.

## Reentrancy and cleanup

The frozen lifecycle owner snapshots its listener set for each synchronous notification and isolates thrown observer errors in a bounded `observerErrors` list. Removing a listener affects subsequent notifications; it does not retract a callback already captured for the current dispatch. State is transitioned before observer delivery. Avoid asynchronous observer work that outlives its editor generation.

`destroy` publishes its shared promise before notifying closing observers. A reentrant destroy call receives that same teardown promise. The independent test verifies that behavior and observer exception isolation on the actual installed owner. Patch handles are disposed at teardown; lifecycle disposal sends destroyed and clears listeners. New lifecycle subscriptions after destruction throw. Application code should still call its own unsubscribe functions to release captured host references.

## Failure and recovery

An exception in a host listener does not authorize data deletion or replace transaction failure reporting. Inspect `state.error` and catch `ready`, `flush` and `destroy` rejections. Keep recovery bytes before using report mode, and ensure stale save callbacks cannot update the replacement view. See the [failure and cancellation cases](@/docs/reference/lifecycle.md#failure-cancellation-and-recovery).
