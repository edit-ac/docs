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

The toolbar wraps on narrow screens. Use Tab and Space/Enter for labeled actions. The PM and document modes share a compatible immutable runtime while keeping separate handles, history and storage. For a separate local two-view consumer, see [collaboration](@/docs/examples/collaboration.md). Use the separate extensions and formats scenario below for code, table, retained assets, fixture references, readonly change review and qualified conversion directions. This local playground does not imply cloud, physical-device, native input or performance support.

## Reproduce the checks

```sh
npm run check:playground -- --suite local-editor
```

The bounded runner builds the same consumer, exercises actual WASM editing/storage/history and prepared storage failures, blocks external requests, and tears down its browser and server. Exact counts, package/source hashes and failed evidence are retained in `evidence/playground-local-20261018/`. Prepared Chromium viewport/keyboard observations do not qualify physical touch or assistive technology.

Restore recovery copy validates and publishes the current or retained SDK checkpoint into a new isolated browser database. The old database remains intact; explicit reset removes the selected configuration’s current and recorded backup databases. This is a separate recovered copy, not a merge with edits in other tabs.

Find the [ticket description](@/docs/examples/gallery.md#ticket) in the examples gallery, with its checked source, downloads, fixture and capability limits.

## Extensions, review and formats

The separate local scenario uses authenticated CNV-1.18-C2-EI canonical2 core/web/formats **0.0.0** packages. With Node 24.19.0 and admitted local architecture artifacts, run:

```sh
node scripts/build-playground-formats.mjs
python3 -m http.server 8087 --bind 127.0.0.1 --directory dist/playground
```

Open localhost:8087/scenarios/extensions-formats/. This build also includes the basic editor and owning local collaboration scenario at their linked paths. Stop the server after use. It verifies archive hashes, installed members, prepared fixtures and scenario sources; `profile.json` records their exact identities. No registry installation or publication is implied.

1. Insert the JavaScript example, then the fixture reference ASD-123. Both use the current sample’s storage/history owner. Undo each separately, redo, save, close and reopen. The Document and PM ticket samples keep separate content. Reference admission uses the shared lookup session and an approved in-memory catalog; no remote lookup runs. Installed editing extension status is available after insertion.
2. Open readonly change review. Choose exact source, formatting-only semantic changes or semantic moves with text, references and opaque data. The models come from the shared Rust diff service’s immutable canonical examples; the public package presenter displays them. They do not compare your current edits or accept changes into your sample. Original CRLF bytes and whitespace stay distinguishable from semantic meaning; authorship remains unknown. Layout and whitespace controls are display operations. Closing the editor disposes the review.
3. Enable formats. Installed browser direction/profile/fidelity labels and limits appear. Disabled pages load no optional codec payload; enabling alone loads no conversion worker. PDF input is explicitly export-only. Disabling or closing cancels work and disposes the client. A failed load preserves the document and offers an explicit retry.
4. Choose DOCX, ODT or reflowable EPUB, then preview an approved local fixture. Confirm only after reviewing diagnostics. One shared prepared ingest/atomic commit imports text, lists, a table and exact PNG, retaining the complete package and original media in the asset journal. Undo, redo, save and reopen preserve the same semantic owners. After reload, choose the format and Retrieve stored input. Malformed/loss-rejected input preserves live content; approve reported losses and prepare again if appropriate. The fixture transport acknowledges local ingest without upload.
5. Choose RTF for bounded text, marks, Unicode and rectangular tables. Its original input stays downloadable in this tab; the imported document survives save/reload. Unsupported object groups require explicit loss approval and stay inert; malformed input rejects. RTF does not use the package-media original journal or promise source/layout identity. Export losses require approval; output remains recoverable.
6. Choose CSV or TSV. Set record endings and first-row header explicitly, preview and confirm. Refresh table choices and explicitly select one table for export. Exact output preserves Unicode, quoted/newline cells and formula-like text. Spreadsheet-safe output explicitly prefixes an apostrophe and reports each change; it is a bounded text transform. Unsupported selections and dialects reject visibly.
7. Prepare the chosen export, review losses and download retained output plus its paired recovery checkpoint. For PDF use the separately stored PDF publication sample. The kickoff checklist sample reports unsupported list context; PDF input never imports. Output retains its captured format/revision even after later sample changes. Cancel, stale revisions/targets and close fence unfinished work.

Retained originals, output and recovery remain available for retry after rejected loss, denied file permission, failed writes or canceled sharing. Supporting browsers can request a local file or share destination explicitly. Prepared failure checks do not qualify every operating system dialog. Committed originals survive reload; uncommitted outputs remain in the tab. Abrupt page exit cannot promise asynchronous flushing. Export recovery before resetting or leaving after failure.

[Complete source manifest](/reference-inputs/playground-formats-v1/manifest.json) · [Setup and limits](/reference-inputs/playground-formats-v1/playground/scenarios/extensions-formats/README.md) · [Reader controls](/reference-inputs/playground-formats-v1/playground/scenarios/extensions-formats/reader.mjs) · [Reproduction build](/reference-inputs/playground-formats-v1/scripts/build-playground-formats.mjs) · [Canonical checks](/reference-inputs/playground-formats-v1/tests/playground-extensions.spec.ts). The manifest names every source and independent inspector with SHA-256; the built scenario serves the same complete source tree under `source/`. Reproduction requires the named immutable local producer artifacts, Node, Playwright, Python and macOS PDFKit/Swift. It never substitutes workspace package code.

Run `npm run check:playground -- --suite extensions-formats` for the canonical local suite, with independent ZIP/XML/PNG/EPUB, CSV and PDF readers, extension/history and readonly-review checks, cancellation/delivery failure cases and exact source/package integrity. External requests are blocked. Prepared Chromium keyboard/narrow-viewport observations remain distinct from physical touch, IME or assistive-technology qualification. Native, hosted, registry, device, performance and release predicates remain separately unqualified.
