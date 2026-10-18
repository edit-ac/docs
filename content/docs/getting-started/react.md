+++
title = "React"
description = "Run the Project kickoff React consumer with pinned local production packages."
weight = 2
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

React wraps the same framework-independent SDK used by the [plain browser consumer](@/docs/getting-started/web.md). Run this entry only at a client boundary. The separate SSR check forbids browser globals and WASM initialization and renders the empty host. StrictMode mount/unmount uses the binding’s existing lifecycle; unsubscribe and retain failed-save recovery on disposal.

<!-- quickstart:react:start -->
```js
import {controls} from './controls.mjs';
import {markdownOptions} from './markdown.mjs';
import {createElement,StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {EditorHost} from '@edit-ac/react';
import {localOptions} from './document.mjs';
import {retainRecovery,recoveryReports,downloadRecovery} from './recovery.mjs';
export let editor;
export const reactRoot=createRoot(document.querySelector('#editor'));
let unsubscribe,disposeControls;
const status=text=>{document.querySelector('#message').textContent=text;};
// Construct browser ports after the client entry loads, never during SSR.
export const ready=localOptions('react').then(async options=>{
  Object.assign(options, await markdownOptions());
  reactRoot.render(createElement(StrictMode,null,createElement(EditorHost,{options,
    onReady(value) { editor=value;unsubscribe?.();disposeControls?.();disposeControls=controls(()=>editor);unsubscribe=editor.subscribe(state=>status(state.error?'Local save failed. Export recovery before closing.':state.localCommitted?'Saved locally. Remote durability is not confirmed.':'Ready offline. Remote durability is not confirmed.')); },
    onError() {status('Unable to open or save. Keep this tab open and export recovery.');},
    onDispose(result) {unsubscribe?.();disposeControls?.();retainRecovery(result);if(result.unsaved)status('Unsaved content retained. Export recovery before closing.');},
  })));
}).catch(()=>status('Unable to open local document. Existing data was preserved.'));
document.querySelector('#save').onclick=async()=>{try {await editor.flush({target:'local'});}catch {status('Local save failed. Export recovery before closing.');}};
document.querySelector('#export-recovery').onclick=()=>downloadRecovery([...recoveryReports,...(editor?.state.ready?[editor.recoveryExport()]:[])]);
export function close() {reactRoot.unmount();}

```
<!-- quickstart:react:end -->

The snippet is derived from the tested source range. Download the complete [browser entry](/reference-inputs/quickstarts-v1/examples/task-editor/editor.mjs), [React entry](/reference-inputs/quickstarts-v1/examples/task-editor/react.mjs) and [Astro entry](/reference-inputs/quickstarts-v1/examples/astro/src/client.js), plus the remaining files in the manifest.

## Expected result

Append ` docs`, choose **Bold owner**, then **Save locally**. The actual engine readback and rendered content retain the Project kickoff heading, bold Friday, agenda and reference. Reload or reopen to see the saved text and owner formatting. Toggle **Read-only**: editing disappears and Bold owner is disabled; toggle again to continue. Unmounting React releases the view and storage; remounting reopens saved content.

## Failure and recovery

A prepared opening failure displays a diagnostic without replacing the saved identity. A prepared quota failure leaves the edited content available: choose **Export recovery** before closing. The disposal path retains the unsaved report outside the component/view. “Saved locally” describes IndexedDB durability; transport synchronization does not establish remote durability. Fix storage or use a compatible recovery reader; never clear saved documents to repair loading.

Use matching JS/WASM from one candidate. The browser/React engine asset is `/core/wasm/editac_wasm_bg.wasm`; Astro uses `/engine.wasm` and generated JS/WASM chunks. Host CSS is inline in these examples; the build archive records the actual output assets. SSR never initializes browser resources. Reuse immutable runtime and optional assets within a compatible module owner while keeping each document’s mutable state separate. Stable URLs and host cache headers can support reuse across routes; a full navigation initializes a new owner and a cache hit is not guaranteed. Optional Markdown is disabled in this baseline consumer.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). These local proofs do not qualify native input, IME/AT, performance/budgets, cloud hosts, registry/release or newer configured-extension combinations.
