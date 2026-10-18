+++
title = "Markdown, math and highlighting assets"
description = "Versioned local configuration and honest presenter limits."
weight = 5
template = "doc-page.html"
+++

**Tested version:** unpublished local-packed @edit-ac/core and @edit-ac/web 0.0.0, facade API 1, descriptor version 1, v5 schema. Exact hashes and complete source are in the [configuration consumer](@/docs/examples/extension-configurations.md). This is local packed qualification; registry, native, terminal, performance and deployment qualification remain pending.

## Before you start

Optional parser, data mark and presentation behavior. Markdown additionally installs @edit-ac/markdown@0.0.0; MathNotation uses the existing math definition and deferred renderer. [Commands and selection](@/docs/reference/commands.md) describe qualified command signatures and shortcut policy; [compatibility](@/docs/reference/compatibility.md) describes the historical profiles.

## Configuration and limits

```ts
// Fragment of the complete installed consumer; supply the existing host recovery options.
{ extensions: [Markdown.configure({ input: false }), MathNotation.configure()] }
```

**Options:** Markdown.configure({input?: boolean}) defaults input:true; input:false defers exporter loading. MathNotation.configure() takes no options. assets is one host baseURL or manifest.

**Dependencies and conflicts:** Facade configuration cannot mix legacy assembly keys. Code/Pairs descriptors remain contract fixtures, with no qualified Code.configure() example. Advanced managedCodeHighlighting is a separate legacy port.

**Initial and deferred costs:** Markdown required input gates ready; command-lazy export waits for its first call. Math renderer/KaTeX starts at first presentation. Highlight worker/backend starts on code. Baseline/core WASM remains required. These are loading boundaries, not benchmark numbers or a budget pass. The source manifest includes SDK-1.11/1.12 and EXT-1.20 receipts and their retained failures. A later mobile admission found disabled lightweight modules retained in the eager graph; its reduction remains owner work. Package archive bytes are not network transfer or startup measurements.

## Loading cost by selection

| Selection | Initial/ready boundary | Deferred resources |
| --- | --- | --- |
| No extensions | Existing engine JS/WASM, input, local storage/history | No provider, Markdown codec, math renderer or highlight worker activated |
| Search, Reorder, Images, Tables, References, Slash | Lightweight descriptors and selected local presenters | Host resolver/prepared callbacks only on interaction; assets require separate host authority |
| Markdown input:true | Parser module/WASM must finish before input is ready | No extra parser instance per compatible editor |
| Markdown input:false | Factory/status only; typing remains literal | Dedicated Markdown module/WASM on explicit export |
| MathNotation | Data definition and small adapter | Math renderer/KaTeX at first math presentation |
| Advanced highlighting (legacy port) | Source and managed loader | Highlight worker/backend at first code presentation |
| default/document preset | Same baseline plus union of selected factories | Same per-feature boundaries, no service inferred |

These component costs derive from the pinned loading/configuration sources; they are not per-feature byte measurements. Exact archive sizes/hashes in the example manifest identify candidate bytes, while enabled transfer/chunk sizes and numerical budgets remain separately unqualified. No application label changes a feature's loading boundary.

## Input, action and expected outcome

- **Input:** Literal **Friday** for command-lazy Markdown; existing LaTeX x^2 source for math.
- **Action:** Open Markdown with input:false, edit ordinary text, explicitly export; choose MathNotation for a math-marked document.
- **Expected output:** Ordinary input remains literal before export; exporter returns its existing diagnostics/recovery blocks. A missing parser rejects required readiness and preserves the original document.

The [complete checked example](@/docs/examples/extension-configurations.md) supplies initialization once, original source/downloads, independently expected outcomes and cleanup. Headings/lists reuse the [Project kickoff command examples](@/docs/examples/commands.md); this catalog introduces no second implementation.

## Serialization and import

Markdown returns codec output without editing its input blocks. Math keeps canonical LaTeX when rendering fails. Code source stays data even when highlighting is absent. See [format support](@/docs/guides/format-support.md) before conversion. Portable semantics and descriptors do not establish a native or terminal presenter. Only the exact local Chromium/production engine cases in the consumer receipt are newly observed here; other platforms remain planned/unqualified by this catalog.

## Accessibility, cancellation and teardown

Source fallback stays readable; a colorized code view is not a replacement for text or semantic marks. loadExtension retry is bounded to three attempts. Disposed generations cannot attach late; after a failed ESM import repair the versioned URL and remount if needed. Async features remain editor-scoped. Closing a view releases subscriptions and captured resources; do not clear stored documents as teardown.

## Failure and recovery

Report admission errors before mounting, await readiness and expose optional feature failures. Preserve text, source and unknown payloads. Repair compatible assets/permissions and retry only the affected boundary. A local event does not prove a durable or remote save; use the [saving lifecycle](@/docs/reference/lifecycle.md).

## Migration and compatibility

Keep old low-level examples tied to their pinned versions. New facade code consumes the exact unpublished EXT-1.20 candidate; it does not make the pending shared-core merge a main release. [Extension overview](@/docs/extensions/_index.md), [custom extension status](@/docs/extensions/custom.md) and [Migrate to edit.ac](@/docs/migrate/_index.md) distinguish remaining work.
