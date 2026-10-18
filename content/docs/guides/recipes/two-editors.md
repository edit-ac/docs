+++
title = "Share assets between description and comment editors"
description = "A checked input, action, outcome and recovery using the owning consumer."
weight = 5
+++

The owning SDK-1.10 consumer seeds description and comment into different databases and identities. Both use one compatible module owner and the same immutable engine URL.

## Before you start

**Tested version:** exact local SDK **0.0.0, unpublished**, profile pinned by the [recipe manifest](/reference-inputs/recipes-v1/manifest.json). Only SHR resource prerequisites are qualified. The union of optional assets needed by live instances can load once, while feature enablement remains per instance. The retained 78 browser cells and exact tarballs are authenticated; no aggregate timing/budget or future document/code feature qualification is claimed.

Open the [complete gallery source](@/docs/examples/gallery.md#ticket) and [download the complete recipe sources](/reference-inputs/recipes-v1/source.zip). This is local source/build proof; registry/release, public hosting, native/device/OS/AT and performance/budget qualification remain open.

## Example and expected outcome

**Input:** The owning SDK-1.10 consumer seeds description and comment into different databases and identities. Both use one compatible module owner and the same immutable engine URL.

**Action:** Mount both task configurations concurrently. Append authored to description, flush and destroy it, reopen description. Toggle comment read-only, then edit and save comment. Undo in comment.

**Expected output:** Description reopens as description authored. Comment initially remains comment; read-only denies a write. Its independent edit becomes comment independent and Undo returns comment. Destroying description leaves the sibling usable; final handle count and editor roots are zero.

This checked excerpt comes from `examples/recipes/upstream/session.mjs`, lines 35–54. The [downloadable excerpt](/reference-inputs/recipes-v1/two-editors.mjs) has SHA-256 `f05fa638a157653fa3406abb11b846232e3a9197e0f8f417cc6e4c6eec51f19f`; the manifest pins full source, profile and fixture hashes.

```js
function mount(name, { optional, readOnly = false, preset = 'task' } = {}) {
  const record = records.get(name); if (!record) throw Error(`Seed missing: ${name}`);
  const root = document.createElement('div'); root.id = `${name}-${++sequence}`; document.querySelector('#editors').append(root);
  const key = root.id;
  const started = performance.now();
  const editor = createEditor(root, { ...record, assetUrl, indexedDB, locks: navigator.locks,
    ...(preset === 'task' ? taskPreset() : { preset: 'minimal' }), markdown: optional,
    plainTextPolicy: optional ? 'markdown' : 'literal', readOnly, label: name,
    recover: async options => {
      const session = await recoverLocalDocument(options); observations.recovered++;
      const destroy = session.storage.destroy.bind(session.storage); let released = false;
      session.storage.destroy = async options => { const result = await destroy(options); if (!released) { released = true; observations.released++; } return result; };
      return session;
    },
  });
  observations.timings[key] = { started };
  void editor.ready.then(() => { observations.timings[key].readyMs = performance.now() - started; requestAnimationFrame(() => { observations.timings[key].firstFrameMs = performance.now() - started; }); }, () => {});
  const off = editor.subscribe(state => { observations.callbacks[key] = (observations.callbacks[key] ?? 0) + 1; if (state.phase === 'ready' && !root.isConnected) observations.late.push(key); });
  live.set(key, { editor, root, off }); return key;
}
```

## Failure and recovery

SHR-01–SHR-08 receipts cover both mount orders, mixed optional configurations, cancelled waiters, load retry, binding composition, route assets, conflict detection and renderer cleanup. A failed shared load rejects both waiters; dispose failed instances and explicitly remount. A scoped quota failure preserves pending updates without blocking the sibling.

## Cleanup

Each handle, history, storage and permission configuration belongs to its own editor. Await each destroy and remove host subscriptions/roots. Sharing WASM/module assets never shares a document or undo stack.

## Migration and compatibility

Use [compatibility](@/docs/reference/compatibility.md), [versioned lifecycle APIs](@/docs/reference/api-lifecycle.md), [migration](@/docs/migrate/_index.md) and the [recipe index](@/docs/guides/recipes/_index.md). Prepared failure transports and synthetic paste are deterministic checks; real OS input and service durability need their own evidence.
