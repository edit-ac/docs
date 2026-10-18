+++
title = "Build a callout, highlight and local command"
description = "Checked local extension recipes with portable data, history, cancellation and recovery."
weight = 1
+++

**Status: executable local candidate walkthrough; unpublished.** Use the [complete custom-authoring example](@/docs/examples/custom-extensions.md) beside this guide. It runs the real production engine, Session, WASM, BrowserEditor, IndexedDB, stable anchors and shared history. Host catalog/checker responses are prepared fixtures. EQL-1.9 and roadmap10 registry/release qualification remain open.

## Before you start

Read [structure](@/docs/concepts/structure.md), the [extension catalog](@/docs/extensions/_index.md), [saving and lifecycle](@/docs/examples/lifecycle.md) and [compatibility](@/docs/reference/compatibility.md). Download the <a href="{{ get_url(path="reference-inputs/custom-authoring-v2/source.zip") }}">complete consumer sources</a> and <a href="{{ get_url(path="reference-inputs/custom-authoring-v2/manifest.json") }}">source/profile manifest</a>.

**Tested version:** two separate **0.0.0, unpublished** package families, schema `editac.registry.editor.v5`, facade API version 1. `structural-callout-v2`, core `7ba6a59998ffc9e2cae840e553e43c3f86a3aa5e`, supplies the kickoff block/mark/menu consumer. `extension-authoring-v1`, core `16a0a28048fd10e45284dce4b07331e3d0a15e6a`, supplies all nine EXT-1.20 typed recipes and their owning runtime fixture. Never substitute or combine archives merely because their version strings match. The manifest records separate exact archive, source, fixture and test hashes. The [configuration example](@/docs/examples/extension-configurations.md) records EXT-1.15/1.17/1.18/1.19/1.20 source and receipt admission.

Start with one public `@edit-ac/web` import and typed `.configure()` options in the checked <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/getting-started.ts") }}">getting-started recipe</a>. Its host supplies the existing storage/identity/asset configuration; it opens no implicit provider. Options belong to each attachment. Changing them does not migrate stored data, authorize a write or enable a sibling editor. Advanced [asset hosting](@/docs/guides/extensions.md) is separate from this beginner path.

## 1. Put Project kickoff in an admitted callout

Open `examples/troubleshooting/upstream/recipe.mjs` and `session.mjs` in the download. These are the unchanged owning structural-callout sources. `prepareCallout` imports the bounded Markdown below through the installed codec with callouts enabled and requires exactly one admitted version-1 content tuple.

```markdown
> [!NOTE]
> # Project kickoff
> Owner: Alex
> Due Friday
```

`createKickoffExtensions(codec)` returns configured public factories. The `demo.kickoff` / `callout` command captures a stable target and returns a prepared fragment. Expected semantic readback contains `module:editac.callout`, version 1, kind NOTE and the owner/due body. It is a real content block. Its body Markdown is retained data; it is not another nested editable document. The shared Rust schema owns validation, edits, history and serialization. Arbitrary new block semantics still need that owner.

For source editing, the advanced `calloutPresenter` uses the qualified public ContentFactory boundary and a bounded source textarea. Invalid source leaves the block unchanged. Applying a TIP source changes kind/body while retaining the block identity; one undo restores NOTE and one redo restores TIP. Read-only disables source editing. This web presenter has its own listener disposal; native/terminal editing and rendering remain conceptual until their actual binding evidence exists.

The full reader corpus also includes Draft brief, Review plan and `https://example.test/kickoff`. These remain outside the bounded callout body. The executable callout input is the four-line subset above; the independent owner recipe cases use their declared Alpha/task/spelling fixtures. The historical <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/transcript.json") }}">reader transcript</a> remains a conceptual source study, not an engine schema or runtime receipt.

## 2. Highlight Friday without replacing its text

The same recipe defines `demo.highlight`: version 1, kind mark, text fallback, label/content bounds of 128 UTF-16 units. Its `highlight` command returns admitted module data through a prepared fragment. The checked case supplies Friday, then selects its UTF-16 range `<a href="{{ get_url(path="reference-inputs/extension-configurations-v1/data.ts") }}">0,6)` and uses the local menu. Highlight text stays Friday; shared undo/redo changes only the accepted emphasis intent.

Compare the separate typed [data recipe</a>: `ReviewMark` bounds its label to 64 UTF-16 units and `TicketAtom` uses an inline-atom descriptor. Those IDs, limits and storage versions are distinct from `demo.highlight`. A mark annotates text; an atom has its own semantic unit. CSS does not change either contract. Oversized command data and invalid registry definitions reject before mutation.

## 3. Capture the local menu target

`bindEmphasisMenu` binds the native button **Emphasize Friday**. Pointerdown captures the shared Bold command before focus moves; activation executes that intent and releases its target. The checked case verifies the button's result and one shared undo/redo. Execution rechecks current read-only authority; detached listeners cannot mutate the document. The host owns removal of its button listeners. SDK hooks use the existing attachment cleanup owner.

The typed <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/behavior.ts") }}">behavior recipe</a> separately exposes `Emphasis` with `{ enabled: boolean }` options and the public `example.documented-emphasis` / `emphasize` command. Disabled configuration declines, read-only rejects, invalid options identify the extension/option/remedy, and accepted formatting preserves literal text. Do not add a second dispatcher or undo stack. The custom pointer-menu checks establish no new keyboard, screen-reader or native/OS accessibility qualification; use the [command reference](@/docs/reference/commands.md) for its qualified controls.

## 4. Reuse the checked public recipes

All nine exact EXT-1.20 source ranges are downloadable from the [configuration example](@/docs/examples/extension-configurations.md). The custom suite runs the immutable owning runtime cases against its own installed family.

| Recipe | Input/action/output | Failure and recovery |
| --- | --- | --- |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/getting-started.ts") }}">Getting started</a> | One import, typed extension list and independent local content | No implicit provider; retain storage identity on loading errors |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/behavior.ts") }}">Behavior</a> and <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/data.ts") }}">data</a> | Prepare one format/mark/atom intent; undo/redo through shared history | Disabled/read-only/oversized input leaves original data intact |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/lifecycle.ts") }}">Lifecycle</a> | F8 prepares Ready from Alpha; one undo restores Alpha | `context.cleanup` and `context.manage` dispose interests/resources, including late work |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/task-links.ts") }}">Task links</a> and <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/catalog.ts") }}">catalog</a> | Delimited ASD-123 keeps its text and links to `https://tasks.example.test/ASD-123` | ASD-999 is not-found and stays literal; denied/unsafe/stale responses cannot overwrite newer content |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/spellcheck.ts") }}">Spelling</a> | Explicit custom checker suggests the for teh; accessible acceptance is one undoable replacement | Destroy removes suggestion UI; tiny dictionary is a hand-authored fixture |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/parsing.ts") }}">Parsing</a> | `note/1` / `b:Strong` prepares bold Strong atomically | Unsupported `note/2` retains raw recovery and falls through to literal text |
| <a href="{{ get_url(path="reference-inputs/extension-configurations-v1/url-insert.ts") }}">URL insertion</a> | Safe prepared URL result preserves source text and shared undo/redo | `javascript:` responses, denied and missing results stay literal; disposal aborts pending work |

Task lookup uses the fixed catalog only at the declared interaction boundary: no automatic lookup on reopen/remote updates. Real hosts need principal-scoped authorization and safe URL policy. A changed ASD target becomes Changed and receives no late link. Aborted requests cannot mutate a later mount; not-found is not permission to remove the source token. The [resolver guide](@/docs/guides/references.md) separates metadata policy, permission and explicit document-open fetch.

## Platform spelling and separate autocorrection

Use platform mode first, preserving inherited user settings. Browser hints do not establish OS state: capability remains **unknown** or **unsupported** without actual platform observation. Off requests disabling the offered checker where supported. Autocorrection is a separate setting with inherit/on/off choices; spelling must not silently change it. The suite compares these independent browser attributes in platform/off modes without claiming OS behavior.

Select custom mode deliberately with a checker and the documented `overlap: 'allow'` policy. Browser hints cannot guarantee exclusive suppression of platform checking. The tiny prepared dictionary is not a bundled production dictionary, automatic fallback or reason to install a duplicate checker. Other preferences such as capitalization and prediction retain separate contracts. No OS/device/IME/AT spelling qualification is added here.

## Preserve, cancel and dispose

Checkpoint serialization and actual IndexedDB reopen must retain exact block/mark data. Disabling extensions preserves unknown callout, version-9 mark and future envelope payloads, including unknown fields and readable fallback. Never flatten them into a purported lossless backup. The checked Markdown roundtrip preserves the admitted callout; unsupported highlight export returns loss/recovery data. Keep the original recovery checkpoint beside any lossy Markdown export.

Prepared cancellation returns cancelled; revision changes return stale. Neither commits a callout into newer content. Shared semantic undo preserves remote text while removing only local formatting. The host removes menu listeners; SDK-owned `context.cleanup` / `context.manage` abort attachment work. Repeated destroy/disposal is safe, presenter/listener counts reach zero, and detached controls cannot write. See [troubleshooting](@/docs/troubleshooting/_index.md) for compatible reopen and recovery; never clear documents or silently downgrade a schema.

## Verify and keep the limits visible

Run `node --test tests/docs-custom-extensions.test.mjs` with Node 24.19.0, npm 11.17.0 and installed Playwright 1.64.0 named by `DOCS_PLAYWRIGHT_MODULE`, then `npm run check`, `zola check --skip-external-links` and `zola build`. The [complete example](@/docs/examples/custom-extensions.md) links observed counts and all source/profile hashes. Tests use deterministic prepared hosts with no provider, credentials or external service.

No Tiptap runtime/plugin compatibility, native/terminal support, OS spelling, numerical performance/budget, registry/release or public deployment is implied. Continue with [compatibility](@/docs/reference/compatibility.md) and [migration](@/docs/migrate/_index.md).
