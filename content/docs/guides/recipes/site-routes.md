+++
title = "Reuse immutable assets across task and document routes"
description = "A checked input, action, outcome and recovery using the owning consumer."
weight = 6
+++

Use the owning Astro production graph: task and document pages share one client layout, pinned package set, JS chunks and engine URL. The document example only enables the qualified Markdown profile; it is not the future rich document/code preset.

## Before you start

**Tested version:** exact local SDK **0.0.0, unpublished**, profile pinned by the [recipe manifest](/reference-inputs/recipes-v1/manifest.json). Source, emitted graph and asset inventories are linked in shared-profile.json and the retained SHR receipt. First load includes engine and required chunks; incremental instances reuse compatible assets. Optional Markdown adds only its owning union. No numerical performance campaign or cross-page cache guarantee is made.

Open the [complete gallery source](@/docs/examples/gallery.md#browser) and [download the complete recipe sources](/reference-inputs/recipes-v1/source.zip). This is local source/build proof; registry/release, public hosting, native/device/OS/AT and performance/budget qualification remain open.

## Example and expected outcome

**Input:** Use the owning Astro production graph: task and document pages share one client layout, pinned package set, JS chunks and engine URL. The document example only enables the qualified Markdown profile; it is not the future rich document/code preset.

**Action:** Edit and close description on the task route. Reopen and verify it. Await cleanup before client-routing to document; edit that independent document, flush/close, then perform a full navigation and reopen it.

**Expected output:** Description retains description saved task and document retains document saved document. Same-realm routing releases old handles before mounting new ones; full navigation evaluates the client entry once in a fresh realm. The engine asset URL stays identical across routes.

This checked excerpt comes from `examples/recipes/upstream/site.mjs`, lines 31–61. The [downloadable excerpt](/reference-inputs/recipes-v1/site-routes.mjs) has SHA-256 `7e44e88452e0ccec716218d4a2287a8c700bc1ef0f12a84566cc24181e998ae1`; the manifest pins full source, profile and fixture hashes.

```js
async function options(name, optional = false) {
  const extension = optional ? await import('@edit-ac/markdown').then(async ({ initMarkdown }) => {
    const { markdownExtension } = await import('@edit-ac/markdown/web');
    const { default: markdownUrl } = await import('@edit-ac/markdown/wasm?url');
    return markdownExtension(await initMarkdown(markdownUrl));
  }) : undefined;
  return { ...records.get(name), ...taskPreset(), assetUrl, indexedDB, locks: navigator.locks,
    markdown: extension, plainTextPolicy: optional ? 'markdown' : 'literal', label: name };
}
async function mount(binding = 'plain', name = 'description', optional = false) {
  const started = performance.now(), opts = await options(name, optional);
  const root = document.createElement('div'); root.id = 'site-' + ++sequence;
  document.querySelector('#editors').append(root);
  let editor, close;
  if (binding === 'react') {
    const [{ createElement }, { createRoot }, { EditorHost }] = await Promise.all([import('react'), import('react-dom/client'), import('@edit-ac/react')]);
    const react = createRoot(root);
    editor = await new Promise((resolve, reject) => react.render(createElement(EditorHost, { options: opts, onReady: resolve, onError: reject, onDispose: report => reports.push(report) })));
    close = async () => { const report = await editor.destroy(); react.unmount(); return report; };
  } else if (binding === 'astro') {
    const { mountEditorHost } = await import('@edit-ac/astro');
    // The HTML surface comes from the installed Editor.astro component, compiled
    // by Astro in the same site graph, rather than a synthetic framework host.
    root.innerHTML = document.querySelector('#astro-template').innerHTML;
    const host = mountEditorHost(root.querySelector('edit-ac-editor'), opts);
    editor = await host.ready; close = () => host.dispose();
  } else { editor = createEditor(root, opts); await editor.ready; close = () => editor.destroy(); }
  await new Promise(resolve => requestAnimationFrame(resolve));
  const sample = { binding, name, optional, readyAndFrameMs: performance.now() - started, realmToFrameMs: performance.now(), timingScope: 'mount invocation through options/runtime/DOM and next animation frame; realm sample includes page bootstrap' };
  timings.push(sample); live.set(root.id, { editor, root, close, sample }); return root.id;
}
```

## Failure and recovery

Use the exact owning common-layout/chunk configuration in production.mjs, not repeated wrappers with different URLs. Serve content-hashed bodies with stable URLs and appropriate immutable cache headers. SHR-06 retains cold, warm and cache-disabled transfers; cache hits depend on browser/host policy and cannot be guaranteed. Reject conflicting URLs or incompatible build identities and preserve the document for a compatible reopen.

## Cleanup

Await site.cleanup before client navigation. A full navigation initializes a fresh runtime; compatible bytes may be cached, live JS handles are not transferred. Abrupt shutdown cannot promise a final save. Authenticated SSR imports have no browser side effects.

## Migration and compatibility

Use [compatibility](@/docs/reference/compatibility.md), [versioned lifecycle APIs](@/docs/reference/api-lifecycle.md), [migration](@/docs/migrate/_index.md) and the [recipe index](@/docs/guides/recipes/_index.md). Prepared failure transports and synthetic paste are deterministic checks; real OS input and service durability need their own evidence.
