+++
title = "Astro"
description = "Run the Project kickoff Astro consumer with pinned local production packages."
weight = 3
+++

**Status: local-only SDK 0.0.0 quickstart; unpublished candidate artifacts.** Registry installation, public hosting and platform release qualification remain pending. This consumer uses the `sdk-framework-v1` family, distinct from newer configured-extension candidates with the same version number. See [capability and release status](@/docs/reference/status.md).

## Before you start

Use the qualified local workspace with Node **24.19.0**, npm **11.17.0**, and the authenticated `local-candidates-v5.json` (SHA-256 `27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729`). The [source manifest](/reference-inputs/quickstarts-v1/manifest.json) names every tarball, runtime, source range and fixture. All SDK packages are unpublished **0.0.0**; React is **19.3.0**, Astro **7.3.8**, and its Node adapter **11.1.7**.

From the docs repository, execute the complete consumer and reproducible local builds:

```sh
npm run check:examples -- --suite astro
```

The runner installs the named production tarballs offline into isolated directories. It uses public imports and no workspace aliases. [Complete source and reproduction instructions](/reference-inputs/quickstarts-v1/README.md) accompany the [Project kickoff gallery entry](@/docs/examples/_index.md#project-kickoff-local-package-consumers).

## Create, mount and edit

Astro uses the same framework-independent SDK without React. `@edit-ac/astro/Editor.astro` renders the host during static/SSR output; the following browser entry initializes it after loading. Both static and standalone SSR builds include ClientRouter navigation: leaving destroys both document views and returning reopens the same identities. The second editor is read-only and keeps separate storage/history/permissions.

<!-- quickstart:astro:start -->
```js
import {createKickoff} from '../../task-editor/kickoff.mjs';
import {controls as hostControls} from '../../task-editor/controls.mjs';
import {markdownOptions} from './markdown.js';
import { init } from '@edit-ac/core';
import { CheckpointStorage } from '@edit-ac/web';
import { installEditorHosts } from '@edit-ac/astro';
import { downloadRecovery } from '../../task-editor/recovery.mjs';

// Importing the server page never executes this browser script. The host opens
// an existing local identity; first-run creation is an explicit application action.
async function options(name) {
  const assetUrl = '/engine.wasm';
  const runtime = await init(assetUrl);
  const databaseName = `astro-task-${name}`;
  const identityKey = `editac-astro-identity-${name}`;
  let identity;
  await navigator.locks.request(`${databaseName}-creation`, async () => {
    identity = JSON.parse(localStorage.getItem(identityKey) ?? 'null');
    if (identity) return;
    const engine = createKickoff(runtime,{documentId:crypto.randomUUID(),epoch:crypto.randomUUID()});
    let storage;
    try {
      identity = engine.read().identity;
      localStorage.setItem(identityKey, JSON.stringify(identity));
      storage = await CheckpointStorage.open(indexedDB, databaseName);
      await storage.publish(engine.checkpoint(), []);
    } finally { storage?.close(); engine.dispose(); }
  });
  return { ...await markdownOptions('/markdown.wasm'), identity, databaseName, assetUrl, indexedDB, locks:navigator.locks, plainPasteControl:false };
}
export const editors = new Map();
const recoveryReports = [];
let disposeControls;
function status(text) { const node=document.querySelector('#save-status'); if(node) node.textContent=text; }
function retain(result) {
  if (result.unsaved) { recoveryReports.push(result); status('Unsaved content retained. Export recovery before leaving this tab.'); }
}
function controls() {
  disposeControls?.();disposeControls=hostControls(()=>editors.get('task'));
  const save=document.querySelector('#save');
  if(save) save.onclick=async()=>{ try { for(const editor of editors.values()) await editor.flush({target:'local'}); status('Saved locally. Remote durability is not confirmed.'); } catch(error) { status('Local save failed. Export recovery before closing.'); } };
  const recovery=document.querySelector('#export-recovery');
  if(recovery) recovery.onclick=()=>downloadRecovery([...recoveryReports,...[...editors.values()].filter(e=>e.state.phase==='ready').map(e=>e.recoveryExport())]);
  if(recoveryReports.length) status('Unsaved content retained. Export recovery before leaving this tab.');
}
const disposeHosts=installEditorHosts(document, options, {
  onReady(editor,host) { editors.set(host.dataset.editorName,editor); controls(); if(!recoveryReports.length && ![...editors.values()].some(e=>e.state.error)) status('Ready offline. Remote durability is not confirmed.'); },
  onError(_error,_editor,host) { status(editors.has(host.dataset.editorName)?'Local save failed. Export recovery before closing.':'Editor loading/saving failed. Keep recovery content before closing.'); },
  onDispose(result,host) { if(host.dataset.editorName==='task')disposeControls?.();editors.delete(host.dataset.editorName); retain(result); },
});
document.addEventListener('astro:page-load',controls);

export async function cleanup() {document.removeEventListener('astro:page-load',controls);disposeControls?.();await disposeHosts();}
```
<!-- quickstart:astro:end -->

The snippet is derived from the tested source range. Download the complete [browser entry](/reference-inputs/quickstarts-v1/examples/task-editor/editor.mjs), [React entry](/reference-inputs/quickstarts-v1/examples/task-editor/react.mjs) and [Astro entry](/reference-inputs/quickstarts-v1/examples/astro/src/client.js), plus the remaining files in the manifest.

## Expected result

Append ` docs`, choose **Bold owner**, then **Save locally**. The actual engine readback and rendered content retain the Project kickoff heading, bold Friday, agenda and reference. Reload or reopen to see the saved text and owner formatting. Toggle **Read-only**: editing disappears and Bold owner is disabled; toggle again to continue. Leaving the Astro route releases old views before reopening.

## Failure and recovery

A prepared opening failure displays a diagnostic without replacing the saved identity. A prepared quota failure leaves the edited content available: choose **Export recovery** before closing. The disposal path retains the unsaved report outside the component/view. “Saved locally” describes IndexedDB durability; transport synchronization does not establish remote durability. Fix storage or use a compatible recovery reader; never clear saved documents to repair loading.

Use matching JS/WASM from one candidate. The browser/React engine asset is `/core/wasm/editac_wasm_bg.wasm`; Astro uses `/engine.wasm` and generated JS/WASM chunks. Host CSS is inline in these examples; the build archive records the actual output assets. SSR never initializes browser resources. Reuse immutable runtime and optional assets within a compatible module owner while keeping each document’s mutable state separate. Stable URLs and host cache headers can support reuse across routes; a full navigation initializes a new owner and a cache hit is not guaranteed. Optional Markdown is disabled in this baseline consumer.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). These local proofs do not qualify native input, IME/AT, performance/budgets, cloud hosts, registry/release or newer configured-extension combinations.

Find the [browser and React consumers](@/docs/examples/gallery.md#browser) in the examples gallery, with its checked source, downloads, fixture and capability limits.
