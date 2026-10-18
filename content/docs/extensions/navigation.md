+++
title = "Search and block reorder"
description = "Versioned local configuration and honest presenter limits."
weight = 2
template = "doc-page.html"
+++

**Tested version:** unpublished local-packed @edit-ac/core and @edit-ac/web 0.0.0, facade API 1, descriptor version 1, v5 schema. Exact hashes and complete source are in the [configuration consumer](@/docs/examples/extension-configurations.md). This is local packed qualification; registry, native, terminal, performance and deployment qualification remain pending.

## Before you start

Optional behaviors. editac.search@1 and editac.reorder@1; v5 schema. No declared feature prerequisites or conflicts. [Commands and selection](@/docs/reference/commands.md) describe qualified command signatures and shortcut policy; [compatibility](@/docs/reference/compatibility.md) describes the historical profiles.

## Configuration and limits

```ts
// Fragment of the complete installed consumer; supply the existing host recovery options.
{ extensions: [DocumentSearch.configure(), BlockReorder.configure()] }
```

**Options:** Both configure() accept no options. Search/reorder state belongs to each attached editor.

**Dependencies and conflicts:** Duplicate identities reject before root reservation. Custom authored bindings still pass command conflict admission.

**Initial and deferred costs:** Required-input local presenters; no remote resolver or parser. Disabled modules can still contribute to this package eager graph; no zero-byte claim. These are loading boundaries, not benchmark numbers or a budget pass. The source manifest includes SDK-1.11/1.12 and EXT-1.20 receipts and their retained failures. A later mobile admission found disabled lightweight modules retained in the eager graph; its reduction remains owner work. Package archive bytes are not network transfer or startup measurements.

## Input, action and expected outcome

- **Input:** Project kickoff followed by Due Friday.
- **Action:** Select DocumentSearch and BlockReorder individually; search for Friday using the local search presenter.
- **Expected output:** Both tools attach to the selected editor; a sibling with extensions:[] gets neither. Existing text/history is unchanged by configuration.

The [complete checked example](@/docs/examples/extension-configurations.md) supplies initialization once, original source/downloads, independently expected outcomes and cleanup. Headings/lists reuse the [Project kickoff command examples](@/docs/examples/commands.md); this catalog introduces no second implementation.

## Serialization and import

Search results and drag UI are transient, not document data. Reorder commits through the shared command/history owner. See [format support](@/docs/guides/format-support.md) before conversion. Portable semantics and descriptors do not establish a native or terminal presenter. Only the exact local Chromium/production engine cases in the consumer receipt are newly observed here; other platforms remain planned/unqualified by this catalog.

## Accessibility, cancellation and teardown

Use keyboard search navigation and the existing accessible block move controls; drag handles do not own text selection. Dispose cancels pending requests/controls. Do not move a block captured before a document revision change. Async features remain editor-scoped. Closing a view releases subscriptions and captured resources; do not clear stored documents as teardown.

## Failure and recovery

Report admission errors before mounting, await readiness and expose optional feature failures. Preserve text, source and unknown payloads. Repair compatible assets/permissions and retry only the affected boundary. A local event does not prove a durable or remote save; use the [saving lifecycle](@/docs/reference/lifecycle.md).

## Migration and compatibility

Keep old low-level examples tied to their pinned versions. New facade code consumes the exact unpublished EXT-1.20 candidate; it does not make the pending shared-core merge a main release. [Extension overview](@/docs/extensions/_index.md), [custom extension status](@/docs/extensions/custom.md) and [Migrate to edit.ac](@/docs/migrate/_index.md) distinguish remaining work.
