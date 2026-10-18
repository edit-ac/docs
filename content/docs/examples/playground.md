+++
title = "Local playground"
description = "Run Project kickoff with the real package editor and browser-local saving."
weight = 3
+++

Try a PM ticket or a document with the real package editor. This playground is a **local build of unpublished core/web 0.0.0**, candidate `sdk-framework-v1`, v5 editor profile. Registry installation, a hosted demo and native/device/release qualification remain pending. See [candidate scope](@/docs/examples/qualified-local.md) and [compatibility](@/docs/reference/compatibility.md).

## Run the local build

From the docs checkout, with the authenticated local producer artifacts and Node24.19.0/npm11.17.0:

```sh
npm run build:playground
python3 -m http.server 8087 --bind 127.0.0.1 --directory dist/playground
```

Open localhost:8087. Stop the server with Ctrl-C when finished. Web Locks and browser storage require localhost or a secure origin. The build verifies the exact manifest and public package hashes, then copies their production JS/WASM. It uses no workspace package aliases, hidden backend or model provider. `dist/playground/profile.json` records package and source hashes. No publication is authorized by this local recipe.

[Download the complete consumer](/reference-inputs/playground-v1/README.md), [page](/reference-inputs/playground-v1/index.html), [lifecycle source](/reference-inputs/playground-v1/app.mjs), [fixture](/reference-inputs/playground-v1/kickoff.mjs), [recovery export](/reference-inputs/playground-v1/recovery.mjs) and [build script](/reference-inputs/playground-v1/build-playground.mjs). The Apache-2.0 fixture is the same Project kickoff used by the [browser quickstart](@/docs/getting-started/web.md).

## Edit, save and recover

1. Select PM ticket. Edit Owner: Alex, undo, then redo. Headings, bold Friday, checklist and the safe fixture link remain semantic content.
2. Save locally and reload. Your edit should return. Switch to Document: its independently stored sample starts unchanged. Switch back to recover the ticket.
3. Toggle Read-only. Input and history actions are unavailable until editing is enabled again.
4. Export recovery JSON before resetting. Reset asks for confirmation and exports a backup before deleting only the selected sample. Cancel preserves your edits.
5. Close editor to release its connections and listeners. Open / retry reopens the existing identity. A failed or absent checkpoint is reported; it is never silently reseeded.

Saving confirms browser-local storage only. It does not confirm remote durability, and browser data may be evicted. If saving fails, keep the tab open, export the recovery checkpoint and pending updates, and choose Restore recovery copy after resolving storage access. It validates the checkpoint with the engine, exports another backup and opens a separate local database; the original remains preserved until explicit reset. Failed journal promises cannot be retried by Save locally. A retained report remains exportable after explicit disposal. The JSON preserves SDK byte arrays; it is not a portable Markdown export. See [saving and recovery](@/docs/guides/local-first.md).

The toolbar wraps on narrow screens. Use Tab and Space/Enter for labeled actions. The PM and document modes share a compatible immutable runtime while keeping separate handles, history and storage. For a separate local two-view consumer, see [collaboration](@/docs/examples/collaboration.md). Optional code, table, assets, conversion and diff scenarios remain unavailable here until independently qualified. This local playground does not imply cloud, physical-device, native input or performance support.

## Reproduce the checks

```sh
npm run check:playground -- --suite local-editor
```

The bounded runner builds the same consumer, exercises actual WASM editing/storage/history and prepared storage failures, blocks external requests, and tears down its browser and server. Exact counts, package/source hashes and failed evidence are retained in `evidence/playground-local-20261018/`. Prepared Chromium viewport/keyboard observations do not qualify physical touch or assistive technology.

Restore recovery copy validates and publishes the current or retained SDK checkpoint into a new isolated browser database. The old database remains intact; explicit reset removes the selected configuration’s current and recorded backup databases. This is a separate recovered copy, not a merge with edits in other tabs.

Find the [ticket description](@/docs/examples/gallery.md#ticket) in the examples gallery, with its checked source, downloads, fixture and capability limits.

## Optional format capability scenario

The separate local scenario consumes the authenticated CNV-1.18-C2-EI canonical2 core/web/formats **0.0.0** family. It shows installed browser directions, profiles and fidelity boundaries, including PDF export-only. Formats start disabled; enabling loads the public client and manifest without starting a conversion worker. Disabling or closing disposes the client. A failed load preserves the editor and offers an explicit retry.

With Node 24.19.0 and the admitted local architecture artifacts, run `node scripts/build-playground-formats.mjs`, then serve `dist/playground` on loopback and open `/scenarios/extensions-formats/`. Stop the server after use. The basic editor remains available at `/`; build collaboration separately with its owning command. This is an unpublished local capability scenario. Import/export actions, loss preview and original-media recovery are pending; full DWF-1.10, native, hosted and release qualification remain open.

[Scenario source and exact input manifest](/reference-inputs/playground-formats-v1/manifest.json) · [Scenario setup and limits](/reference-inputs/playground-formats-v1/playground/scenarios/extensions-formats/README.md). Run `npm run check:playground -- --suite extensions-formats` for its DPG-1.1 capability subset, with no paid providers or remote requests.
