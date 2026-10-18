+++
title = "Custom-authoring source study"
description = "Complete conceptual Project kickoff states and immutable owner sources; executable tutorial pending."
weight = 12
+++

**Status: conceptual source prerequisite; runtime cases: 0.** This is a source study, not an install-ready enhanced example. EQL-1.9 immutable candidate admission and the original custom callout/highlight/command consumer remain pending.

## Before you start

**Prerequisites:** Follow [Design a callout, highlight and local command](@/docs/extensions/custom.md), [structure](@/docs/concepts/structure.md) and [compatibility](@/docs/reference/compatibility.md).

**Tested version:** Zola 0.23.6 reader checks. Owner recipes are API version 1, v5 schema, core `16a0a28048fd10e45284dce4b07331e3d0a15e6a`; local 0.0.0 unpublished packs have separate qualification in the [configuration example](@/docs/examples/extension-configurations.md). This page makes no SDK runtime claim.

## Complete source and expected outcome

Download the <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/README.md") }}">README</a>, <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/transcript.json") }}">independent reader transcript</a> and <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/manifest.json") }}">immutable manifest</a>. The manifest includes both historical source files and nine exact public authoring recipe ranges; no workspace aliases, provider, credentials or new service are required to read them.

The Project kickoff corpus traces a callout design, Friday highlight, local emphasis action with undo/redo, rejected validation, unknown version preservation, task lookup/missing/stale results, explicit custom spelling, note parsing, unsafe URL rejection and disposal. Its JSON notation is a reader model, not the engine's serialization format. “Expected” means an independently authored requirement, not observed runtime output. A structural callout is still pending; the available note codec uses existing heading/bold semantics.

## Failure and recovery

Preserve the original checkpoint and unknown payload when a version, presenter or export format is unsupported. Markdown fallback can be lossy; never present it as a lossless backup. Not-found keeps literal text, stale callbacks must not edit newer content, and disposal must remove owned listeners and cancel pending work. The transcript records these expectations without simulating an editor.

## Verify the source study

From this docs checkout, run `node --test tests/docs-custom-extensions.test.mjs`, then `npm run check`, `zola check --skip-external-links` and `zola build`. The named source checks authenticate downloads and conceptual states only; no runtime case is counted or skipped into a pass. Exact candidate consumers and original runtime criteria remain pending. The future consumer must use the real production engine, Session, WASM, BrowserEditor, storage, anchors and history.

## Migration and compatibility

Use [release status](@/docs/reference/status.md) and [compatibility](@/docs/reference/compatibility.md) to assess actual artifacts. Native/terminal presenters, OS spelling, Tiptap plugins and arbitrary structural extension editing are not qualified here. See [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) for the separately labeled adoption boundaries.
