# Two local Project kickoff views

Local source/build only: unpublished `sdk-framework-v1`, core/web **0.0.0**, production v5 profile. Exact manifest SHA-256: `27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729`; source `aa5b7d21064bd6d694ba243ffe528f58288b8a92`. Do not mix same-version archives across families. `profile.json` records archive and source hashes. Project kickoff is Apache-2.0 prepared public content. No workspace aliases, providers, credentials, network peers or hidden backend.

With Node24.19.0/npm11.17.0 and admitted architecture artifacts:

```sh
npm run build:collaboration
python3 -m http.server 8087 --bind 127.0.0.1 --directory dist/playground
```

Open localhost:8087/scenarios/collaboration/. Stop the server with Ctrl-C afterwards. Relative asset URLs work below a static subdirectory. Use localhost or a secure origin for Web Locks/IndexedDB. This is private local sample code, not a hosted product or published release.

Both BrowserEditor handles open separate IndexedDB databases from one real engine checkpoint. Local creation saves its identity before publication; failed creation/reopen never overwrites that identity. StorageWriter restores each real replica; the engine/Session owns schema, history, anchors and update merging. `attachSync` uses production SyncSession/outbox and committed journal notifications. `channel.mjs` only copies bounded byte frames; it has no document model, serializer, history, relay, receipts or periodic idle polling. An event-driven bounded exchange awaits local flush, pumps both attachments and forwards frames. Closing disconnects the transport, releases subscriptions, flushes/destroys both editors and retains failed-save reports for export. Reload after saving requires an explicit new connection.

Connect, edit A, and observe B. Disconnect, edit Owner: Alex independently in both views, then reconnect: both independent edits remain exactly once. Undo A reverses A's local action while retaining B's action; Redo A restores it. Read-only B disables B's input/history while allowing authorized peer updates. Save both locally before closing/reloading. Browser-local storage may be evicted; peer equality and accepted frames **never** imply a remote durable receipt. Remote durability is not configured. Each view owns its local store/history; a shared checkpoint does not mean shared live handles.

If saving fails, keep the page open, export both recovery copies and resolve storage access. A faulted journal cannot be fixed by merely clicking Save again. Recovery JSON preserves checkpoint and pending update bytes with `{encoding:"bytes",data:[...]}`; it is not portable Markdown. Close retains SDK failure reports for export. No silent reset, schema downgrade or overwrite is offered. Missing checkpoints require recovering a validated copy through the SDK recovery workflow; preserve the original identity and backup first. Read-only does not revoke remote authorization.

Optional remote mode is documentation only, gated by roadmap28's actual qualified host. A host would need an explicit endpoint, current authorization, same document identity/schema, bounded transport/backpressure, teardown and an independently negotiated durable receipt protocol. This page accepts no remote endpoint and opens no anonymous room or proxy. Historical local SQLite relay proof does not qualify a deployed host. Original EQL1.9/roadmap10 registry/release, native/device/OS/AT/performance/budget/cloud/public-hosted gates remain open.

Run `npm run check:playground -- --suite collaboration`. The canonical harness installs/copies the exact public production tarballs into its own static build, launches real Chromium editors/WASM/IndexedDB and blocks external requests. It checks independent expected content, overlapping offline edits, local-only history, persistence/reopen, read-only peer updates, prepared storage/load faults, recovery export and explicit cleanup. A separate channel control checks copied frames and bounded backpressure; it cannot replace browser proof. Screenshots and exact counts distinguish prepared browser observations from device/OS/manual qualification. All temporary browsers, HTTP listeners and directories close in teardown, including failed cases. Use a fresh `DOCS_PLAYGROUND_OUTPUT` directory to preserve prior failures. No partial-case override is accepted for this suite.
