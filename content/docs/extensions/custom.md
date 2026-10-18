+++
title = "Design a callout, highlight and local command"
description = "A source-backed custom-authoring walkthrough with explicit runtime and preservation limits."
weight = 1
+++

**Status: conceptual source prerequisite. Enhanced executable tutorial pending candidate admission.** This walkthrough has checked source links and independently authored reader expectations, with **zero runtime cases**. It does not qualify a custom block, a new presenter or an installed tutorial. The exact EXT-1.20 source is available; the required EQL-1.9 candidate identities and this tutorial's full packaged consumer are still pending.

## Before you start

**Prerequisites:** Read the [extension catalog](@/docs/extensions/_index.md), [document structure](@/docs/concepts/structure.md) and [version compatibility](@/docs/reference/compatibility.md). Use the [complete source study](@/docs/examples/custom-extensions.md) alongside this page.

**Tested version:** reader/download checks use Zola 0.23.6. The recipe source is pinned to core `16a0a28048fd10e45284dce4b07331e3d0a15e6a`, facade API version 1 and `editac.registry.editor.v5`. Its owning local packs are version **0.0.0, unpublished**, authenticated separately by the [configuration consumer](@/docs/examples/extension-configurations.md). Those packed results are not this tutorial's runtime proof or registry qualification. Historical low-level sources have their own commit/hash in the <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/manifest.json") }}">source manifest</a>.

Download the <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/transcript.json") }}">reader transcript</a>. Its JSON is a reader model, **not an engine document schema**. Keep one existing Rust/Session document, history and dispatcher throughout a future implementation.

## Start with Project kickoff

The redistributable fixture contains a heading **Project kickoff**, Owner: Alex, Due **Friday**, a two-item checklist (Draft brief; Review plan) and the safe fixture link `https://example.test/kickoff`. The command transcript starts from an explicitly unbolded Friday so applying emphasis has an observable result; ordinary fixture formatting is retained elsewhere.

| Reader task | Input and action | Independently expected outcome | Current boundary |
| --- | --- | --- | --- |
| Callout | Place the kickoff title and owner/due paragraphs in a callout design | Title and body remain readable with the same text | A structural callout remains pending; the existing note codec uses heading/bold semantics |
| Highlight | Annotate Friday, UTF-16 range `<a href="{{ get_url(path="reference-inputs/custom-authoring-v1/upstream/tutorial.mjs.txt") }}">4,10)` in “Due Friday” | Text remains “Due Friday”; a version-1 mark identifies the annotation | Descriptor source study; this exact highlight consumer is pending |
| Local command | Select Friday and activate an emphasis button | Friday becomes bold; one undo restores the unbolded selection, redo restores emphasis | Reuse the owning public command recipe; this fixture's consumer remains pending |

These expectations describe the desired editing outcome. They are not recorded runtime observations.

## 1. Design the callout without inventing a block API

Separate stored semantics from decoration. The available [historical tutorial source</a> maps `[note] Project kickoff` onto an existing heading with bold text. Its readable result can inform a callout presentation, but it does not create a new structural container around arbitrary paragraphs. Do not store the remaining owner/due/checklist content inside an invented JavaScript document model.

For a true structural callout, the shared Rust/schema/ABI owner must admit its editing rules, version and migration first. This tutorial leaves that consumer pending. A colored border or heading presenter cannot establish nested editing, selection, clipboard or history semantics. Native/terminal presentation also needs its own binding evidence.

The historical source demonstrates codec preparation and a prepared fragment committed through the existing command session. It is an advanced source study. Beginner setup should consume the owning facade factory and typed options once the exact candidate qualifies; it should not copy codec/registry/worker orchestration.

## 2. Distinguish a highlight mark from an inline atom

The <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/upstream/definitions.json.txt") }}">historical definitions</a> describe `demo.highlight`, version 1, kind `mark`, text fallback and bounded label/content fields. A mark annotates a range without making Friday an independent atomic editing unit. `demo.badge` is an inline atom and has a different semantic role; a CSS class does not make the two interchangeable.

The current <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/data.ts") }}">public data recipe</a> shows `ReviewMark` and `TicketAtom` using admitted mark/inline-atom primitives. It bounds a label to 64 UTF-16 units, declares version-1 module data and returns a prepared fragment. It is not the historical 128-unit highlight definition. Do not mix their type IDs, limits or stored-data versions.

Configure each factory through `.configure()` in the editor's extension list. Options are attachment-local configuration; changing options does not migrate stored data or change an extension's identity/version. Invalid definitions, unknown options and unsupported versions must preserve the original content. A disabled or failed presenter must retain readable fallback and the original payload, rather than flattening unknown data into a purported lossless copy.

## 3. Add an accessible local command/menu entry

The <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/behavior.ts") }}">public behavior recipe</a> exports `Emphasis`, with typed `{ enabled: boolean }` defaults and validation. It captures the current target and returns one prepared format intent. The existing surface applies authority, stable anchors and shared history; host code does not mutate canonical editor DOM or create another undo stack.

A future host button calls the recipe's public `runExtensionCommand` route for `example.documented-emphasis` / `emphasize`. Use a native button labeled “Emphasize selection”; retain the captured editor target when focus moves to the menu, expose disabled/read-only state and return focus after activation. Keyboard and screen-reader behavior must be verified in the eventual consumer. Do not invent a shortcut or claim native accessibility qualification from this design.

The expected command changes only Friday's formatting. Disabled configuration or a missing target declines; read-only execution rejects. No rejected action adds a history intent. Use the [command reference](@/docs/reference/commands.md) for the already qualified ordinary-history boundary. Collaboration-aware history requires its own qualified profile.

## 4. Reuse the owning recipes

All nine ranges and their exact hashes are recorded in the <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/manifest.json") }}">manifest</a>. Read the owning [source/API guides](@/docs/examples/extension-configurations.md) rather than copying another implementation.

| Recipe source | Input, action and expected result | Failure, cancellation and cleanup |
| --- | --- | --- |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/getting-started.ts") }}">Getting started</a> | One public import and typed extension list; create/open using the host recovery configuration | Keep load failure recovery separate from optional features; no implicit provider |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/behavior.ts") }}">Behavior</a> and <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/data.ts") }}">data</a> | Prepare a single format/fragment intent through public ports | Validate options and arguments before mutation; no arbitrary hot schema registration |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/lifecycle.ts") }}">Lifecycle</a> | Register bounded interests, resources and a prepared input action | SDK-owned `context.cleanup` / `context.manage` cancel and dispose late resources |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/task-links.ts") }}">Task links</a> and <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/catalog.ts") }}">catalog</a> | A delimiter after ASD-123 permits lookup; the fixed catalog returns `https://tasks.example.test/ASD-123`, keeping text intact | Missing ASD-999 stays literal; denied, unsafe, failed or stale work does not edit or add history |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/spellcheck.ts") }}">Spelling</a> | Explicit custom fixture offers “the” for “teh”; accept a current suggestion in one shared undo action | No bundled dictionary; code/composition/unknown locale, failure or stale suggestions preserve text; remove transient controls on disposal |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/parsing.ts") }}">Parsing</a> | Prepared note syntax maps to existing admitted semantics | Validate complete input; malformed/literal input stays literal; this is not a structural callout parser |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/url-insert.ts") }}">URL insertion</a> | Insert a validated safe fixture URL through the existing prepared route | Unsafe schemes and denied/stale targets preserve content; no document-open fetch or arbitrary public proxy |

Task lookup uses host-owned permission and resolver callbacks, with bounded matching, principal-scoped caching and abort/revision checks. Editing the target to ASD-124 while ASD-123 is pending invalidates the old result. Undoing linking must not immediately reapply it. Do not implement a second matcher, a template URL substitution or an automatic lookup on reopen/remote updates. Async callbacks cannot retain raw offsets and later overwrite newer content.

## Platform spelling and autocorrection

Start with platform spelling, preserving inherited user settings. An unavailable or unknown capability remains **unsupported** or **unknown**; a requested browser hint is not observed OS behavior. Off mode requests disabling the offered checking feature only where the platform contract permits it. Autocorrection is a separate setting and must not silently change with spelling mode.

Select custom mode deliberately, supplying the host checker and the documented `overlap: 'allow'` policy. Browser hints cannot guarantee exclusive suppression of platform checking; do not promise that both checkers can never overlap. The tiny prepared dictionary recognizes a few fixture words and is not a bundled production dictionary or automatic fallback for unknown platform support. Do not install a duplicate checker/presenter when the selected platform already supplies the needed behavior. See the [platform editing guide](@/docs/guides/extensions.md) and the exact source limits before making a host support claim.

## Failure, preservation and recovery

Keep the original checkpoint before trying unsupported custom content or exporting. The historical source explicitly reports `module-markdown-unrepresentable` for its plain fallback; flattening visible text into Markdown is **lossy** and is not a backup. Semantic interchange must preserve type, version, attributes, unknown payload and readable fallback. A roundtrip/restore claim needs an independent runtime comparison; the conceptual `preservation` case demonstrates what must remain unchanged.

If validation or permission fails, leave text, selection and history intact and show the host-safe diagnostic. If a presenter fails, show source fallback while retaining the payload. If Markdown cannot represent the content, retain/export the original recovery checkpoint and label the fallback's losses. Never fix an unknown version by dropping its fields, clearing the document or silently downgrading its schema.

## Cancellation and disposal

The <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/lifecycle.ts") }}">lifecycle recipe</a> binds resources to the attachment signal, declares interests once and disposes late loaded resources after abort. Keep work off synchronous local input; do not rescan the whole document on every keystroke. The host owns removal of its own menu/button listeners; SDK-owned hooks and subscriptions use the existing cleanup owner.

Unsubscribe host controls, cancel lookup/upload/checker work, dispose transient presenters and destroy the editor through its qualified lifecycle. Repeated disposal must be safe. Settling a late callback after teardown must not edit a new mount. Exact listeners/anchors/connections and unknown-data restore still need the future packaged tutorial proof. See [saving and lifecycle](@/docs/examples/lifecycle.md) for a separate qualified example.

## Verification and remaining limits

The [source study](@/docs/examples/custom-extensions.md) checks immutable inputs, all nine source ranges, independent conceptual states and public links/downloads. Its runtime count is zero. Candidate admission, installed callout/highlight/command outcomes, serialization/history/unknown-data preservation and cleanup remain pending. There is no claim of native/terminal/OS spelling, Tiptap runtime/plugin compatibility, numerical performance or public deployment.

Advanced [asset hosting](@/docs/guides/extensions.md) belongs outside the one-import beginner path. Continue with [compatibility](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before adopting a different schema or editor.
