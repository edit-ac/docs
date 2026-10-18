+++
title = "Web"
description = "Run the Project kickoff Web consumer with pinned local production packages."
weight = 1
+++

**Status: local-only SDK 0.0.0 quickstart; unpublished candidate artifacts.** Registry installation, public hosting and platform release qualification remain pending. This consumer uses the `sdk-framework-v1` family, distinct from newer configured-extension candidates with the same version number. See [capability and release status](@/docs/reference/status.md).

## Before you start

Use the qualified local workspace with Node **24.19.0**, npm **11.17.0**, and the authenticated `local-candidates-v5.json` (SHA-256 `27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729`). The [source manifest](/reference-inputs/quickstarts-v1/manifest.json) names every tarball, runtime, source range and fixture. All SDK packages are unpublished **0.0.0**; React is **19.3.0**, Astro **7.3.8**, and its Node adapter **11.1.7**.

From the docs repository, execute the complete consumer and reproducible local builds:

```sh
npm run check:examples -- --suite web-react
```

The runner installs the named production tarballs offline into isolated directories. It uses public imports and no workspace aliases. [Complete source and reproduction instructions](/reference-inputs/quickstarts-v1/README.md) accompany the [Project kickoff gallery entry](@/docs/examples/_index.md#project-kickoff-local-package-consumers).

## Create, mount and edit

The browser entry creates the document once, persists its identity, and reopens through the production local storage path. The initial fixture has a heading, **Friday**, two unchecked agenda items and a reference link. The complete entry includes loading diagnostics, save, recovery export and explicit disposal.

<!-- quickstart:web:start -->
```js
import {controls} from './controls.mjs';
import {createKickoff} from './kickoff.mjs';
import {markdownOptions} from './markdown.mjs';
import {retainRecovery,recoveryReports,downloadRecovery} from './recovery.mjs';
import { init } from '@edit-ac/core';
import { CheckpointStorage, createEditor, taskPreset } from '@edit-ac/web';

// This example owns one explicit local document. Recovery never seeds content.
const identity = { documentId: '', epoch: '', schema: 'editac.registry.editor.v5', offsets: 'utf16', profile: 'editac.yrs-yjs.editor.v5', protocolVersion: 1, updateEncoding: 1 };
const options = { assetUrl: '/core/wasm/editac_wasm_bg.wasm', databaseName: 'standalone-task', identity, indexedDB, locks: navigator.locks, ...taskPreset() };
const root = document.querySelector('#editor'), message = document.querySelector('#message');
const save = document.querySelector('#save'), reopen = document.querySelector('#reopen');
let unsubscribe,disposeControls;
export let editor;
async function open() {
  editor = createEditor(root, {...options, ...await markdownOptions()});
  unsubscribe = editor.subscribe(state => {
    if (state.error) message.textContent = 'Local save failed. Keep this tab open and export recovery content.';
    else if (state.localCommitted) message.textContent = 'Saved locally. Remote durability is not confirmed.';
  });
  await editor.ready;
  disposeControls=controls(()=>editor);
  save.disabled = reopen.disabled = false;
  message.textContent = 'Task ready offline';
  return editor;
}
async function start() {
  // Persist creation intent before publishing. Subsequent opening never
  // re-seeds a missing/corrupt checkpoint; a new document uses a fresh identity.
  await navigator.locks.request('standalone-task-creation', async () => {
    const saved = localStorage.getItem('standalone-task-identity');
    if (saved) { Object.assign(identity, JSON.parse(saved)); return; }
    identity.documentId = crypto.randomUUID(); identity.epoch = crypto.randomUUID();
    localStorage.setItem('standalone-task-identity', JSON.stringify(identity));
    const runtime = await init(options.assetUrl);
    const engine = createKickoff(runtime,{documentId:identity.documentId,epoch:identity.epoch});
    let checkpoints;
    try { checkpoints = await CheckpointStorage.open(indexedDB, options.databaseName); await checkpoints.publish(engine.checkpoint(), []); }
    finally { checkpoints?.close(); engine.dispose(); }
  });
  return open();
}
export const ready = start();
export async function saveLocally() { await editor.flush({ target: 'local' }); message.textContent = 'Saved locally. Remote durability is not confirmed.'; }
export async function reopenOffline() {
  save.disabled = reopen.disabled = true;
  unsubscribe?.();disposeControls?.();
  await editor.destroy({ policy: 'flush' });
  return open();
}
export function attachTaskSync(authorizedHostOptions) { return editor.attachSync(authorizedHostOptions); }
export async function close() { unsubscribe?.();disposeControls?.(); try { return await editor.destroy({policy:'flush'}); } catch(error) { const result=await editor.destroy({policy:'report'});retainRecovery(result);report(error);return result; } }
document.querySelector('#export-recovery').onclick=()=>downloadRecovery([...recoveryReports,...(editor?.state.ready?[editor.recoveryExport()]:[])]);
function report(error) { message.textContent = `Unable to open or save task: ${error.message}`; }
save.addEventListener('click', () => { void saveLocally().catch(report); });
reopen.addEventListener('click', () => { void reopenOffline().catch(report); });
void ready.catch(report);

```
<!-- quickstart:web:end -->

The snippet is derived from the tested source range. Download the complete [browser entry](/reference-inputs/quickstarts-v1/examples/task-editor/editor.mjs), [React entry](/reference-inputs/quickstarts-v1/examples/task-editor/react.mjs) and [Astro entry](/reference-inputs/quickstarts-v1/examples/astro/src/client.js), plus the remaining files in the manifest.

## Expected result

Append ` docs`, choose **Bold owner**, then **Save locally**. The actual engine readback and rendered content retain the Project kickoff heading, bold Friday, agenda and reference. Reload or reopen to see the saved text and owner formatting. Toggle **Read-only**: editing disappears and Bold owner is disabled; toggle again to continue. Explicit close releases the view, subscription and local storage.

## Failure and recovery

A prepared opening failure displays a diagnostic without replacing the saved identity. A prepared quota failure leaves the edited content available: choose **Export recovery** before closing. The disposal path retains the unsaved report outside the component/view. “Saved locally” describes IndexedDB durability; transport synchronization does not establish remote durability. Fix storage or use a compatible recovery reader; never clear saved documents to repair loading.

Use matching JS/WASM from one candidate. The browser/React engine asset is `/core/wasm/editac_wasm_bg.wasm`; Astro uses `/engine.wasm` and generated JS/WASM chunks. Host CSS is inline in these examples; the build archive records the actual output assets. SSR never initializes browser resources. Reuse immutable runtime and optional assets within a compatible module owner while keeping each document’s mutable state separate. Stable URLs and host cache headers can support reuse across routes; a full navigation initializes a new owner and a cache hit is not guaranteed. Optional Markdown is disabled in this baseline consumer.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). These local proofs do not qualify native input, IME/AT, performance/budgets, cloud hosts, registry/release or newer configured-extension combinations.
