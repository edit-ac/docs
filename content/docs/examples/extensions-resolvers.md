+++
title = "Extension and resolver recipes"
description = "Prepared host responses with the real installed editor and local persistence."
weight = 7
+++

This local-only example runs the real unpublished `extension-authoring-v1` production candidate: `@edit-ac/core` and `@edit-ac/web` version `0.0.0`, source revision `16a0a28048fd10e45284dce4b07331e3d0a15e6a`. Exact tarball hashes identify this family. Registry/release, public hosted service, native and performance qualification remain pending. Prepared responses demonstrate integration and data preservation, not provider quality or remote durability.

Read the [host integration recipe](@/docs/guides/extensions.md) and [reference policy recipe](@/docs/guides/references.md). Complete sources: [recipes.mjs](/examples/extensions-resolvers/recipes.mjs), [kickoff.mjs](/examples/extensions-resolvers/kickoff.mjs), [browser harness](/examples/extensions-resolvers/harness.test.mjs) and [source/profile manifest](/examples/extensions-resolvers/manifest.json).

| Input | Action | Independently expected result |
| --- | --- | --- |
| Project kickoff corpus | Open editor | No resolver or upload calls |
| Safe fixture link | Explicit refresh / opted-in local paste | Preview title, unchanged authored semantics |
| Internal ASD-123 target | Deny permission, search | No host lookup, no public fallback, unchanged document |
| Catalog-admitted custom reference | Insert, undo/redo, flush/reopen | Stable reference identity and fallback survive |
| Local notes.txt bytes | Cancel upload, return late, retry | No cancelled insertion; recovery bytes retained; retry persists asset |
| Pending upload | Revoke, read-only or edit | Stale result cannot insert asset |
| 1,025-byte request | Start upload | Resource limit before host callback |

## Run locally

Use the sibling `core`, `architecture` and `docs` repositories at the manifest's admitted commits, Node 24.19.0/npm 11.17.0, and the existing offline dependency cache and Playwright Chromium installation. From `docs`, run:

```sh
npm run check:examples -- --suite extensions-resolvers
```

The harness authenticates the immutable candidate manifest and each production tarball, installs public packages into an isolated directory without workspace aliases, bundles this source, serves the production WASM and mounts BrowserEditor with IndexedDB. It uses prepared host callbacks, no external service, credentials or AI. The fixture address is never fetched. Source-only checks cannot substitute for this suite.

The runner refuses an existing evidence log so failed evidence survives. For a repair, set `DOCS_EXTENSIONS_OUTPUT` to a fresh worktree-owned evidence directory. Evidence includes before/action/after snapshots, exact counts, source/package identities, compiled consumer archive and cleanup. On failure, fix the implicated implementation before rerunning. The harness closes its browser contexts, server and browser, then removes its temporary installation; it retains the compiled consumer and logs. No preview remains running.

<!-- checked-source:start -->
## Checked upload boundary

This excerpt is generated from the downloadable source; the host responses are prepared.

```js
    async upload(bytes = recovery.length) { const controller = new AbortController(), request = { scope: scope(), bytes, items: 1, deadline: performance.now() + 30000, signal: controller.signal }; const promise = service.run(request, signal => { calls.upload++; return new Promise(resolve => uploads.push({ signal, resolve })); }).then(result => { if (result.status === 'ready') {
        const commit = insert({ attributes: { type: 'content', tuple: ['module:editac.asset', 1, descriptor] }, runs: [{ text: 'notes.txt', marks: [] }], containers: [] }, 'recipe-upload');
        return { status: result.status, commit };
    } return result; }); return { cancel: () => controller.abort(), promise }; },
    finishUpload(index = 0) { uploads[index].resolve(descriptor); },
```
<!-- checked-source:end -->
