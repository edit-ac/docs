+++
title = "Two local collaborative views"
description = "Run two real editor replicas with offline edits and explicit local durability."
weight = 4
+++

Edit Project kickoff in two views, disconnect them, then reconnect without losing either view's edits. This is a **local build of unpublished core/web 0.0.0**, candidate `sdk-framework-v1`, v5 profile. The production editor, engine, Session/history, storage and synchronization own the behavior. A bounded page-local transport only copies frames. No content leaves the page, and no backend, model, private shared room or anonymous proxy is involved.

See [the complete checked consumer](/reference-inputs/collaboration-v1/README.md), [application source](/reference-inputs/collaboration-v1/app.mjs), [frame transport](/reference-inputs/collaboration-v1/channel.mjs), [HTML](/reference-inputs/collaboration-v1/index.html) and [immutable source manifest](/reference-inputs/collaboration-v1/manifest.json). Registry/public-hosted/native/device/cloud/performance/release qualification remains open; see [candidate scope](@/docs/examples/qualified-local.md) and [status](@/docs/reference/status.md).

## Build and try

From the docs checkout, with the authenticated architecture artifacts and Node24.19.0/npm11.17.0:

```sh
npm run build:collaboration
python3 -m http.server 8087 --bind 127.0.0.1 --directory dist/playground
```

Open localhost:8087/scenarios/collaboration/. Stop the server with Ctrl-C after closing the editors. This uses the same pinned public tarballs as the [single-editor playground](@/docs/examples/playground.md), without workspace aliases. Browser storage and Web Locks require localhost or a secure origin.

1. Choose Connect local views. Edit Owner: Alex in A, then B. Both replicas receive the edits.
2. Disconnect. Add different text to Owner: Alex in each view. Neither view changes the other while disconnected.
3. Connect again. Both edits appear exactly once in both replicas. Due Friday and the checklist remain intact.
4. Undo A removes A's action while retaining B's. Redo A restores it. Each handle owns its history.
5. Enable Read-only B. B's input/history controls are disabled; authorized peer changes from A still arrive. Read-only is an input policy, not an authorization revocation.
6. Save both locally, Close both editors, then Open / retry. Both separate local stores retain the result. Reconnection remains opt-in.

The views share an initial checkpoint and compatible immutable assets, with isolated live handles, writers, history and stores. The transport uses bounded copied frames and backpressure. Exchange updates explicitly resumes a bounded exchange; there is no periodic idle polling.

## Know what was saved

“Local views currently match” means semantic equality at that moment. A successful send means the local channel accepted a frame; it is not a durable receipt. Save both locally confirms browser-local persistence only. Browser data may be evicted. **Remote durability is not configured.** See [saving and recovery](@/docs/guides/local-first.md).

If saving fails, keep the page open and Export both recovery copies. Export retains SDK checkpoints and pending updates, including byte arrays, rather than flattening the document to Markdown. Resolve storage access before using the SDK's compatible recovery-copy workflow. A faulted journal cannot be repaired by merely clicking Save again. Close preserves failure reports for export. Retry keeps the original identity and never silently reseeds a missing checkpoint. No clearing or schema downgrade is offered.

## Optional remote host boundary

A remote host remains gated by roadmap28's actual qualified host proof. It would require an explicitly configured endpoint and current authorization, matching document identity/schema, bounded transport/backpressure, lifecycle cleanup and a separately negotiated durable receipt protocol. This consumer accepts no remote URL and provisions nothing. Historical loopback SQLite relay evidence is local proof, not a deployed service claim. Synchronization and durable remote saving remain separate capabilities.

## Reproduce the proof

```sh
npm run check:playground -- --suite collaboration
```

The canonical harness builds the exact public-tarball consumer and checks real WASM edits, two-way convergence, overlapping offline edits, independent history, read-only peer updates, save/reopen, prepared load/storage failures, lossless recovery exports and teardown. It rejects empty/unknown suites and partial collaboration selection, blocks external requests and closes browser processes, IndexedDB handles and its HTTP listener even on failures. Evidence lives in `evidence/playground-collaboration-20261018/`; the source manifest names exact files and artifact identities. Prepared Chromium keyboard/mobile-viewport observations do not qualify native input, physical touch or assistive technology.

Find the [collaborative note](@/docs/examples/gallery.md#collaborative-note) in the examples gallery, with its checked source, downloads, fixture and capability limits.
