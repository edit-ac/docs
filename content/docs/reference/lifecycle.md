+++
title = "Open, save and close a document"
description = "A complete local saving example with real receipts, cancellation and recovery."
weight = 2
+++

**Status: local packed browser consumer; unpublished 0.0.0 artifacts.** This walkthrough uses the production BrowserEditor, Rust/WASM engine and IndexedDB journal in the [complete saving example](@/docs/examples/lifecycle.md). It establishes local browser mechanics; framework tutorials, remote durability and registry installation remain separately pending.

## Before you start

**Prerequisites:** Read [core concepts](@/docs/concepts/_index.md), retain the exact PIN-1.3 core/web production tarballs and authenticated JS/WASM members, and use Node 24.19.0/npm 11.17.0 with existing Playwright 1.64.0 Chromium. See the <a href="{{ get_url(path="reference-inputs/lifecycle-v1/README.md") }}">setup instructions</a>.

**Tested version:** local PIN-1.3 core/web 0.0.0, profile v5. The <a href="{{ get_url(path="reference-inputs/lifecycle-v1/manifest.json") }}">source manifest</a> pins packages, declarations, full source and snippet ranges. Version 0.0.0 alone is not an installable release identity. [Versioned lifecycle signatures](@/docs/reference/api-lifecycle.md) remain the declaration authority.

## Open an existing identity and subscribe

Creation is an explicit host action: the complete consumer seeds the original Project kickoff checkpoint once using public engine commands. `createEditor` opens that checkpoint; it does not create replacement content when recovery fails. It returns a handle immediately. Read `editor.state` for the initial state, subscribe to later transitions, then await `editor.ready` before reading or editing. A visible preview is not readiness.

This checked excerpt belongs to the complete host consumer. `open`, `subscription`, `log`, `factory` and `recover` are host functions, not extra SDK APIs. The test-only recovery port delegates to the installed owner; applications normally omit it. Scoped patch subscriptions require readiness.

<!-- snippet:open:start -->
```js
export function open(options={}) {
  if(editor && editor.state.phase!=='destroyed') throw Error('Dispose before remount');
  if(options.record) record=options.record;
  generation++;
  editor=createEditor(root,{...record,assetUrl:options.assetUrl??assetUrl,indexedDB:factory,locks:navigator.locks,extensions:[],plainPasteControl:false,recover});
  log('created',{state:serialState(editor.state)});
  indicator.textContent='Opening local document';
  off.push(subscription(editor.subscribe(state=>{
    log('lifecycle',{state:serialState(state)});
    // A lifecycle event can retain an older receipt while a newer edit is pending.
    // Only save()'s captured flush barrier authorizes this host's Saved label.
    if(state.error) indicator.textContent='Save failed; preserve recovery export';
  })));
  return editor.ready.then(()=>{
    off.push(subscription(editor.subscribe({type:'updates'},patch=>{
      log('document',{operation:patch.operation,revision:patch.revision,sequence:patch.sequence});
      indicator.textContent='Unsaved local changes';
    })));
    // Host DOM notification, deliberately separate from an SDK Patch. The
    // packaged API does not automatically mirror native selections into patches.
    const selected=()=>{const selection=document.getSelection();if(selection?.anchorNode && root.contains(selection.anchorNode))log('selection',{source:'DOM selectionchange',text:selection.toString()});};
    document.addEventListener('selectionchange',selected);
    off.push(subscription(()=>document.removeEventListener('selectionchange',selected)));
    indicator.textContent='Ready locally; remote save not configured';
    return snapshot();
  });
}
```
<!-- snippet:open:end -->

The independent fixture starts with Project kickoff, Owner: Alex, Due **Friday**, two checklist items and a safe inert link. Opening produces a ready transition with no new local receipt. Selecting Friday produces a separate host DOM selection notification and does not save anything. Replacing it with Thursday changes only the due paragraph. See [events and ordering](@/docs/reference/events.md) for the two subscription contracts.

## Show a save indicator from a captured barrier

A document patch is a semantic change, not a transaction receipt. `flush({target:'local'})` captures the currently pending updates; later edits do not extend that barrier. After it resolves, inspect the actual `localCommitted` receipt and ensure the same editor generation and revision are still current before showing Saved. A new edit clears the indicator. Failed updates remain part of future barriers. A prepared delayed return from an actual successful flush verifies that its late completion cannot change a replacement view’s indicator; the original generation stays attached to that timeline entry.

<!-- snippet:save:start -->
```js
export async function save() {
  const owner=editor, token=generation, revision=editor.read().revision;
  log('flush-start',{revision,generation:token});
  try {
    await owner.flush({target:'local'});
    const receipt=owner.state.localCommitted;
    log('flush-complete',{revision,receipt,generation:token});
    if(owner===editor && token===generation && owner.state.ready && owner.read().revision===revision)
      indicator.textContent=receipt ? 'Saved locally; remote save not configured' : 'No new local changes';
    return receipt;
  } catch(error) { log('flush-error',{message:error.message,generation:token}); throw error; }
}
```
<!-- snippet:save:end -->

The receipt contains `state: 'localCommitted'`, an `updateId` and observed transaction `durability`. It describes local browser storage. This example never shows a remote saved badge: remote save is **not configured**. A selected range, ready event, successful transport send or local receipt supplies no qualified remote receipt. The [separate packed collaboration consumer](@/docs/examples/qualified-local.md) also distinguishes local receipts from pending remote durability. [Storage](@/docs/reference/api-storage.md) and [sync](@/docs/reference/api-sync.md) explain the separate contracts.

## Read-only, unsubscribe, close and remount

`setReadOnly(true)` changes input authority and lifecycle state. The tests attempt typing and a captured replacement, then verify unchanged text, no document update and no extra receipt. Restore authority explicitly; do not rebuild document state in the host.

Call the returned unsubscribe functions before discarding host state. Unsubscribing does not destroy the editor or save its contents. Destroy with an explicit flush policy and await completion before remounting the same document/surface. This checked host helper returns the real report to its caller:

<!-- snippet:close:start -->
```js
export async function close(policy='flush') {
  if(!editor) return null;
  const owner=editor;
  unsubscribe();
  const result=await owner.destroy({policy});
  log('disposed',{unsaved:result.unsaved});
  // Report mode returns recoverable bytes; the host must retain them.
  return result;
}
```
<!-- snippet:close:end -->

After the successful close, the independent check expects zero host subscriptions, zero open tracked database connections and zero held/pending Web Locks. A remount has one live journal connection, three host subscriptions (two SDK listeners and one DOM listener) and Due Thursday. Database counters instrument real opens/closes; they are not memory or timing measurements. The engine remains the document/history owner throughout.

## Failure, cancellation and recovery

| Observable condition | Data-preserving action and expected result |
|---|---|
| Missing WASM in a fresh browser realm | `ready` rejects and phase becomes failed. Dispose the failed view; correct the asset URL and reopen the existing checkpoint. Project kickoff remains unchanged. |
| Prepared IndexedDB quota failure after editing Friday | The paragraph reads Due Thursday, `flush` rejects and state exposes `QuotaExceededError`. No new local receipt exists; preserve the live replica and export. |
| A prior save succeeded but a newer update fails | The older receipt may still be present. The error and failed barrier prevent a Saved label for the new revision. |
| Flush-on-destroy fails | The replica remains available. Preserve its recovery export; explicitly choose report mode only after arranging ownership of those bytes. |
| Explicit recovery demonstration | Retain the returned report, publish its current checkpoint into a different local database, and reopen it. The independent check expects Due Thursday; the original database is never cleared. This is an explicit host checkpoint workflow, not a general recovery-file importer. |
| Opening is canceled before recovery resolves | Destroy the view; `ready` rejects. The SDK releases the late real replica without attaching it. After release, remount with unchanged original content. |

The quota and recovery delays are prepared host inputs. The engine, journal, checkpoint restore and successful transaction receipts remain real. No storage error is hidden by resetting a document. A report can contain unsaved updates, provisional input and clipboard recovery; retain the complete report before discarding a view. See the <a href="{{ get_url(path="reference-inputs/lifecycle-v1/docs-lifecycle.test.mjs") }}">independent assertions</a>.

## React effects and SSR boundaries

The <a href="{{ get_url(path="reference-inputs/lifecycle-v1/react-consumer.mjs") }}">existing React consumer</a> is frozen from core commit `a20a36c15119c661e47ec0ec7051aed8d94e7ed6`; its <a href="{{ get_url(path="reference-inputs/lifecycle-v1/react-sources.json") }}">source inventory</a> also includes the owner and independent browser/SSR assertions. This is a source explanation, not a new React artifact qualification or runnable React tutorial.

Its `useEditor` owner starts browser work from an effect and serializes pending teardown by surface and document identity. Effect cleanup marks callbacks canceled, unsubscribes, and schedules asynchronous flush/disposal. A replacement waits for that teardown; React's synchronous cleanup cannot itself await a promise. Failed flushes go through error/report callbacks with retained recovery data. Do not maintain a second React copy of editable document content.

The existing SSR check installs throwing getters for DOM, IndexedDB, fetch and WebAssembly; server rendering produces only a host element and `useEditorState(null)` remains null. Browser initialization belongs on the client after mount. The frozen source explains this constraint; this suite does not execute or newly qualify SSR/StrictMode. The [React entry page](@/docs/getting-started/react.md) keeps its separate package qualification gate visible.

## Migration and compatibility

Use [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). Preserve checkpoint/journal data across an upgrade; clearing storage is not a recovery procedure. This headless Chromium example supplies no OS, mobile, IME, assistive-technology, native, numerical performance or hosted-service claim.
