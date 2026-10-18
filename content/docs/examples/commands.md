+++
title = "Project kickoff command consumer"
weight = 3
+++

**Status: local packed browser consumer; unpublished 0.0.0 artifacts.** This example proves the named [commands](@/docs/reference/commands.md) and [selection](@/docs/reference/selection.md) outcomes using production BrowserEditor, Rust/WASM Session, IndexedDB storage, history and anchors. There is no registry install command or remote service.

## Before you start

**Prerequisites:** Node24.19.0/npm11.17.0, existing pinned Playwright1.64.0 Chromium installation and the retained immutable architecture artifacts named in the manifest. Use the existing docs/core/architecture workspace layout. No download or provisioning is performed by the test runner.

**Tested version:** core/web0.0.0, historical PIN-1.3 production tarball hashes and separately authenticated runtime members. The exact [manifest](/reference-inputs/commands-v1/manifest.json) identifies profile v5, source revision, artifact hashes, declaration hashes, snippet line ranges and source hashes. This scope does not assert a current release profile or newer facade/authoring readiness.

## Complete source and reproduction

- [Setup and reproduction instructions](/reference-inputs/commands-v1/README.md)
- [Complete browser consumer](/reference-inputs/commands-v1/consumer.mjs)
- [Offline installation, artifact admission, loopback transport and teardown](/reference-inputs/commands-v1/harness.mjs)
- [Independent semantic/selection/history/error assertions](/reference-inputs/commands-v1/docs-commands.test.mjs)
- [Download/snippet drift checker](/reference-inputs/commands-v1/prepare-commands.mjs)

Run the documented `node --test tests/docs-commands.test.mjs` from the docs checkout. The harness serves installed public package bytes without workspace aliases. Seeding through the public engine reconstructs the [Project kickoff fixture](@/docs/concepts/_index.md), persists its checkpoint and disposes the seed engine. BrowserEditor then owns the one active document. Tests never write expected state into the editor.

## Example and expected outcome

The initial rendered document contains a level-one Project kickoff heading, Owner: Alex, Due **Friday**, an unchecked two-item checklist and a safe inert fixture link. The walkthrough pairs every action with a concrete before/after state. Tests retain observations for heading/list changes, exact split/join caret positions, ordinary undo/redo, atomic replacements and data-preserving error paths. The fixture URL is never fetched. All input is redistributable prepared content.

The example's host functions are named in complete source; they are not additional SDK methods. Generated snippets are checked against exact line ranges and hashes. Semantic expectations live in independent assertions, not generated from actual runtime output. A new isolated database/document is used per test; the browser context owns this disposable test data.

## Failure, recovery and cleanup

Read-only, stale, disposed and configuration-protected targets leave the document intact. A failed multi-command transaction cannot partially replace Owner: Alex. Unknown helpers are unavailable. The host releases returned tokens and captures, destroys views with local flush and closes browser/context/server in teardown. Retain recovery exports in production; do not clear documents to fix an error.

This consumer qualifies ordinary local history only. See the separate [PIN-1.3 combined consumer](@/docs/examples/qualified-local.md) for retained collaboration-aware undo observations, with a different corpus and prepared peer/host transport. Neither test suite supplies native/mobile OS, IME, AT, SSR/framework, registry release, performance or deployed behavior proof.

## Migration and compatibility

Read [capabilities](@/docs/reference/api-capabilities.md), [compatibility](@/docs/reference/compatibility.md) and [migration status](@/docs/migrate/_index.md) before adapting existing content or upgrading artifacts.
