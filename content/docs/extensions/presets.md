+++
title = "Compose features and inspect presets"
description = "Versioned local configuration and honest presenter limits."
weight = 6
template = "doc-page.html"
+++

**Tested version:** unpublished local-packed @edit-ac/core and @edit-ac/web 0.0.0, facade API 1, descriptor version 1, v5 schema. Exact hashes and complete source are in the [configuration consumer](@/docs/examples/extension-configurations.md). This is local packed qualification; registry, native, terminal, performance and deployment qualification remain pending.

## Before you start

Optional convenience configurations. The same v5 engine and individually selected factories. Presets create no independent document/history owner. [Commands and selection](@/docs/reference/commands.md) describe qualified command signatures and shortcut policy; [compatibility](@/docs/reference/compatibility.md) describes the historical profiles.

## Configuration and limits

```ts
// Fragment of the complete installed consumer; supply the existing host recovery options.
{ ...documentPreset({ remove: ['editac.reorder'] }) }
```

**Options:** defaultPreset() selects no extensions; documentPreset() selects Search+Reorder. Both accept extensions, remove feature IDs and overrides for already selected members.

**Dependencies and conflicts:** Duplicate selection fails; overriding an absent feature fails missing-override. Legacy taskPreset and low-level profile names retain their historical contracts.

**Initial and deferred costs:** Cost is the union of actually selected features, baseline engine and host delivery graph. A preset name does not grant hidden assets or services. These are loading boundaries, not benchmark numbers or a budget pass. The source manifest includes SDK-1.11/1.12 and EXT-1.20 receipts and their retained failures. A later mobile admission found disabled lightweight modules retained in the eager graph; its reduction remains owner work. Package archive bytes are not network transfer or startup measurements.

## Input, action and expected outcome

- **Input:** A local Task/comment/document with Project kickoff text.
- **Action:** Choose documentPreset({remove:["editac.reorder"]}) or configure Search alone without a preset.
- **Expected output:** Both attach Search only; formatting and local data/history are preserved, with no collaboration or presence. A Task can select any qualified factory.

The [complete checked example](@/docs/examples/extension-configurations.md) supplies initialization once, original source/downloads, independently expected outcomes and cleanup. Headings/lists reuse the [Project kickoff command examples](@/docs/examples/commands.md); this catalog introduces no second implementation.

## Serialization and import

Presets are host configuration, not a schema conversion or content migration. Never strip existing marks/unknown data because a control is hidden. See [format support](@/docs/guides/format-support.md) before conversion. Portable semantics and descriptors do not establish a native or terminal presenter. Only the exact local Chromium/production engine cases in the consumer receipt are newly observed here; other platforms remain planned/unqualified by this catalog.

## Accessibility, cancellation and teardown

Keep baseline editing and host labels available regardless of selected optional tools. Await editor.ready, then await destroy({policy:"flush"}) and inspect failure; borrowed surfaces use dispose() while their engine owner persists. Async features remain editor-scoped. Closing a view releases subscriptions and captured resources; do not clear stored documents as teardown.

## Failure and recovery

Report admission errors before mounting, await readiness and expose optional feature failures. Preserve text, source and unknown payloads. Repair compatible assets/permissions and retry only the affected boundary. A local event does not prove a durable or remote save; use the [saving lifecycle](@/docs/reference/lifecycle.md).

## Migration and compatibility

Keep old low-level examples tied to their pinned versions. New facade code consumes the exact unpublished EXT-1.20 candidate; it does not make the pending shared-core merge a main release. [Extension overview](@/docs/extensions/_index.md), [custom extension status](@/docs/extensions/custom.md) and [Migrate to edit.ac](@/docs/migrate/_index.md) distinguish remaining work.
