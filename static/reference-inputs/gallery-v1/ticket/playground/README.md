# Local Project kickoff playground

This unpublished local-only consumer uses the authenticated `sdk-framework-v1` core/web 0.0.0 tarballs from local-candidates-v5 (SHA-256 27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729). Never substitute archives from another same-version family. The production v5 engine, Session/history, BrowserEditor and IndexedDB own editing and persistence.

With Node24.19.0/npm11.17.0 and the owning architecture artifacts available, run `npm run build:playground` from docs. Serve `dist/playground` through a loopback static server with WASM MIME application/wasm, then open its index. Output is redistributable local build material, not a published release. Relative imports support a static subdirectory. Do not run this private source workspace on an untrusted origin. Browser storage and Web Locks require localhost or a secure origin.

`npm run check:playground -- --suite local-editor` builds its own immutable consumer, launches bounded Chromium cases, blocks external requests and closes browsers, connections and its loopback server in teardown. Set DOCS_PLAYGROUND_OUTPUT to a fresh evidence directory for a repaired run; failures must remain. Generated distributions and temporary extraction/test directories are reproducible and removable after teardown.

The PM ticket and document preset have separate local identities and databases. Both seed the original Apache-2.0 Project kickoff fixture. Content is bounded sample material; no live services, arbitrary URL fetch, model calls, credentials or cloud storage. Basic headings, marks, checklists and links are enabled. The document preset does not qualify optional table/code/asset features. Collaboration, conversions and enhanced extensions are separate unfinished scenarios; registry/release/native/device/performance support is not claimed.

Use Save locally before reload; abrupt tab shutdown cannot promise a flush. Close editor awaits disposal. Retry opens the same identity and never overwrites a missing checkpoint. Export produces the SDK's lossless recovery checkpoint and pending updates as JSON with typed byte arrays encoded as `{encoding:"bytes",data:[...]}`; this is not Markdown/HTML interchange. A failed save keeps this tab's replica and export available. Explicit reset asks for confirmation, exports a backup, closes the selected editor and deletes only its database/identity. Other tabs may block reset; close them first. No automatic clearing or schema downgrade is a recovery strategy.

The page uses labeled native controls, visible focus, 44px action targets and a wrapping toolbar. Automated keyboard/mobile viewport checks are prepared Chromium observations, not physical touch, native IME or assistive-technology qualification.

Restore recovery copy validates and publishes the current or retained SDK checkpoint into a new isolated browser database. The old database remains intact; explicit reset removes the selected configuration’s current and recorded backup databases. This is a separate recovered copy, not a merge with edits in other tabs.

For a relevant repair, `DOCS_PLAYGROUND_CASE` selects one exact named test in the same suite. Such a run is explicitly partial and never qualifies the parent alone; retain the earlier unchanged passing rows and reconcile all required cases against the precise source delta. Use a fresh DOCS_PLAYGROUND_OUTPUT.
