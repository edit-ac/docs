+++
title = "Commands and selection"
description = "Versioned commands, independent outcomes and complete local packed consumer."
weight = 1
+++

**Status: local packed browser consumer, version 0.0.0, unpublished.** The [complete example](@/docs/examples/commands.md) uses immutable PIN-1.3 production packages and authenticated Rust/WASM runtime members. It creates the Project kickoff corpus in the real engine, then opens it through production local storage and BrowserEditor. This is local artifact qualification; registry installation and broader platform claims remain pending.

## Before you start

**Prerequisites:** Read [selection and anchors](@/docs/reference/selection.md), [core concepts](@/docs/concepts/editing.md), [exact declarations](@/docs/reference/api-commands.md) and [capability status](@/docs/reference/api-capabilities.md). Await `editor.ready`. Capture while the editor has focus and while the intended selection is current, before moving focus into a host toolbar.

**Tested version:** both packages are 0.0.0, unpublished; version alone is ambiguous. The [manifest](/reference-inputs/commands-v1/manifest.json) pins the tarball, runtime, profile, declaration and complete source hashes. This example uses v5 baseline formatting, no collaboration or optional extension, and configuration-disabled italic commands. Disabled UI does not remove existing data or implement application authorization.

## Parameters, return values and errors

| Public call | Parameters and result | Failure/recovery |
| --- | --- | --- |
| `captureCommand(name, supplied?, focusOwner?)` | Catalog name or alias, optional stable range and permitted host control; returns a captured target or `undefined`. `execute(text?)` returns a `CommandResult`. Text is required for replacement. | Unknown names, unavailable selection, disabled command or blocked view may produce no capture. Never retry against a guessed caret. |
| `target.execute(text?)` | `disposition` is `committed`, `handled` or `rejected`; a rejection can carry `reason`. A captured command is single-use. | Revision change, disposal or changed permission/read-only invalidates intent; dispose on dismissal and capture afresh only after renewed user intent. |
| `captureToolbar()` | Returns a retained formatting target. `state(mark)` is `on`, `off`, `mixed` or `disabled`; `apply(changes)` accepts supported mark fields; `null` removes a field. | `command-permission-denied`, invalid fields and unsupported formatting are rejections. A collapsed selection may change typing state with `handled`, without editing existing content. |
| `can(request)` / `commit(request)` | Public prepared request from the [document contract](@/docs/reference/api-document.md); `can` is a current applicability query, and `commit` returns revision plus optional selection/caret tokens. | Applicability is not a reservation. Inspect thrown errors; read-only commit throws `Editor is read-only`. Release returned tokens and preserve current content. |
| `captureHistory().execute('undo' or 'redo')` | Captures the current history target; returns the same disposition contract. | No group is an ordinary handled outcome. The captured history target still requires disposal. |

Exact [`CommandResult`, `HistoryTarget`](/reference-inputs/local-pin-1.3/web/dist/input/keyboard.d.ts), [`CapturedCommand`](/reference-inputs/local-pin-1.3/web/dist/commands/catalog.d.ts) and [`ToolbarTarget`](/reference-inputs/local-pin-1.3/web/dist/commands/formatting.d.ts) declarations retain their source types. The helper below belongs to the downloadable example. Its `unavailable` value is a consumer status, not an SDK disposition.

<!-- snippet:format:start -->
```js
export function command(name, text) {
  const target = editor.captureCommand(name);
  if (!target) return { disposition:'unavailable' }; // consumer status, not CommandResult
  try { return target.execute(text); } finally { target.dispose(); }
}
```
<!-- snippet:format:end -->

## Before, action and after

The rendered initial document is a **Project kickoff** level-one heading, `Owner: Alex`, `Due ` followed by **Friday**, two unchecked checklist entries `Draft agenda` and `Confirm attendees`, and a `Reference` link to the inert fixture URL. The [checked consumer and independent assertions](@/docs/examples/commands.md) retain every expected state.

| Before | Action | Independently expected after |
| --- | --- | --- |
| `Due Friday`, Friday bold, backward range 10→4 | `command('bold')`, then the `toggleBold` alias | First removes bold, second restores it; text and backward selection remain unchanged. |
| Project kickoff heading level 1 | `heading(2)` | Same text, heading level 2; other blocks preserved. |
| Two checklist entries | `list('unordered')` | Both become unordered list items; their text remains unchanged. |
| Caret after `Due ` | `command('enter')` | Separate `Due ` and bold `Friday` paragraphs; caret at start of Friday. |
| Caret at start of that Friday paragraph | `command('backward')` | Joined `Due Friday`; Friday stays bold, caret offset 4. |
| One formatting change | `history('undo')`, then redo | Exact previous/restored semantics and range. Seed content has no undo group. |
| Read-only, stale or disposed target | Attempt captured edit | Rejected or unavailable; no content mutation or fallback to another caret. |
| Italic commands disabled by configuration | Toolbar `apply({italic: true})` | `command-permission-denied`; data and selection preserved. This case does not qualify protected table cells. |

Heading/list changes use admitted prepared engine operations, not invented named catalog helpers. `toggleHeading` is deliberately tested as unavailable in this version.

<!-- snippet:heading:start -->
```js
export function heading(level) {
  const request = {kind:'format',origin:'docs:heading',marks:[],blocks:[{targets:[blocks()[0].id],attributes:{type:'heading',level},action:'apply'}]};
  if (!editor.can(request)) return false;
  releaseResult(editor.commit(request));return true;
}
```
<!-- snippet:heading:end -->

<!-- snippet:list:start -->
```js
export function list(type) {
  const request = {kind:'editor',origin:'docs:list',commands:[{type:'setStyle',container:editor.read().visible.find(n=>n.kind==='list').id,style:{type}}]};
  if (!editor.can(request)) return false;
  releaseResult(editor.commit(request));return true;
}
```
<!-- snippet:list:end -->

## History grouping and atomic commands

<!-- snippet:history:start -->
```js
export function history(action) {
  editor.root.focus();
  const target = editor.captureHistory();
  if (!target) return { disposition:'unavailable' };
  try { return target.execute(action); } finally { target.dispose(); }
}
```
<!-- snippet:history:end -->

Ordinary local history records this view's accepted editing intents. One `chain(origin).command(EditorCommand).command(EditorCommand).run()` prepares and commits one transaction. The independent consumer verifies two text replacements undo together and a rejected later operation leaves **both** blocks unchanged. `can()` queries applicability; `run()` consumes the chain and returns `CommitResult`. Release returned selection/caret tokens. A second run throws `Command chain consumed`.

There is no inferred `.focus().toggleBold().run()` helper sequence. Only the generated [CommandChain declaration](@/docs/reference/api-commands.md) and admitted `EditorCommand` shapes are supported. A chain does not turn arbitrary host work, transport sends or durable saves into one transaction.

Collaboration-aware history has a separate [PIN-1.3 consumer](@/docs/examples/qualified-local.md): undoing local reorder preserves remote human and host-agent content. Those retained observations use prepared peer/agent transports and a different corpus. The ordinary Project kickoff consumer does not qualify remote history or transport durability. Local undo stacks are not a durable document interchange format.

## Failure and recovery

Treat `undefined` capture, `rejected` outcome and thrown commit error as different observations. Read the current snapshot and diagnostic, keep the original data, dispose stale captures and wait for new user intent. Never silently retarget a rejected command, mutate the DOM as a fallback or clear local storage. Save errors require retained checkpoint/journal or recovery export; command success alone is not a durable-save receipt.

The consumer releases every capture in `finally`, flushes and destroys the view, and closes the browser context and loopback server. Its source includes setup and teardown. A host toolbar should preserve the intended target before focus moves and keep native controls keyboard accessible. Headless selection checks do not establish real OS/IME/assistive-technology behavior.

## Migration and compatibility

Use [version compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md) and [comparison](@/docs/compare/_index.md) for their explicit planned/qualified limits. Future facade and authoring recipes require their own pinned owner returns; these historical packed signatures do not qualify them.
