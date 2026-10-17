+++
title = "Inspect the qualified local consumer"
weight = 2
+++

**Status: unpublished local packed consumer; reused PIN-1.3 evidence.** This is a source and evidence walkthrough. The docs quickstarts and interactive playground remain pending their own complete consumers. There is no registry installation command here.

The production BrowserEditor, Rust/WASM Session, IndexedDB journal, history and stable anchors own the document. Only host requests and the peer transport are prepared fixtures. Three views keep document data, permissions, configuration and history isolated while sharing compatible immutable assets.

## Sources and prerequisites

Use core checkout `a20a36c15119c661e47ec0ec7051aed8d94e7ed6` and architecture checkout `59a732815fa26f1be40616eb8b528f8927ca0216`, alongside each other. Node 24.19.0, npm 11.17.0 and Rust 1.97.1 are the recorded tools. Retain the architecture receipt's immutable production packs and authenticated WASM assets. A downloaded source file alone does not replace those inputs. Fixture HTML downloads as inert `.html.txt`; save it as `index.html` only inside the original local consumer.

- [Complete consumer instructions](/reference-inputs/local-pin-1.3/source/tests/integrated-browser/primary-flow-20261018/README.md)
- [Browser consumer and lifecycle](/reference-inputs/local-pin-1.3/source/tests/integrated-browser/primary-flow-20261018/session.mjs)
- [Independent assertions](/reference-inputs/local-pin-1.3/source/tests/integrated-browser/primary-flow-20261018/product.spec.ts)
- [Local host adapter](/reference-inputs/local-pin-1.3/source/tests/integrated-browser/primary-flow-20261018/host.mjs)
- [Preview launcher and teardown](/reference-inputs/local-pin-1.3/source/tests/integrated-browser/primary-flow-20261018/preview.mjs)
- [Artifact admission](/reference-inputs/local-pin-1.3/source/tests/integrated-browser/primary-flow-20261018/artifacts.mjs)
- [Fixture markup](/reference-inputs/local-pin-1.3/source/tests/integrated-browser/primary-flow-20261018/index.html.txt)
- [Manifest with exact declaration, package and source hashes](/reference-inputs/local-pin-1.3/manifest.json)

The complete instructions provide the bounded local build and preview commands. They use offline installed production tarballs and loopback host processes. Keep the preview output directory under your checkout, stop the launcher when finished and retain failures. There are no model/provider calls, credentials or hosted services.

## Actions and independently expected results

| Input and action | Expected result |
|---|---|
| Local note: type ` saved` and apply bold | `Local note saved`; local bold persists; the two peers retain `base` / `other`. Search/Reorder remain disabled in the note. |
| First peer: bold `base`, replace with `found`, move down | Both peers show `other` / `found`, with the intended formatting and order. |
| Remote insertion `R😀`, then prepared host-agent insertion `Agent ` | Both peers show `Agent R😀other` / `found`; same-ID host retry returns the original receipt. |
| Undo local reorder | `found` / `Agent R😀other`; undo preserves remote human and agent content. |
| Flush, dispose and reopen | Identity and semantic state survive the actual local journal/checkpoint recovery. A local receipt does not mean remote settlement. |

The immutable architecture receipt `evidence/integrated-browser/primary-flow-20261018/pin-1.3-receipt.json` records three journeys in each Chromium/WebKit desktop and portable-mobile profile: **12 executed, 12 passed, 0 failed, 0 skipped**. Its SHA-256 and tarball identities are in the manifest. These are reused results; documentation generation runs no browser or provider test. Earlier failure evidence remains with the original receipt.

## Errors, recovery and cleanup

Await readiness; inspect returned command results and state errors. On failed save, keep the checkpoint/journal and recovery export. Detach stale peer/host work before reopening. A host response in this fixture reports local durability separately from pending remote durability. Transport convergence never substitutes for a durable remote receipt.

The consumer destroys views, closes local stores and stops its loopback server/host children in teardown. Disposing a view must not delete recoverable unsent data. Do not clear storage to hide a failed recovery. This scope supplies no actual mobile OS, IME, assistive-technology, native, numerical performance, public deployment or registry-release proof.

## Read the matching contracts

[Lifecycle](@/docs/reference/api-lifecycle.md), [document](@/docs/reference/api-document.md), [commands](@/docs/reference/api-commands.md), [selection](@/docs/reference/api-selection.md), [events](@/docs/reference/api-events.md), [storage](@/docs/reference/api-storage.md), [sync](@/docs/reference/api-sync.md) and [extension subset](@/docs/reference/api-extensions.md) contain exact declaration excerpts. [Core concepts](@/docs/concepts/_index.md) tracks the broader planned teaching fixture. The [capability table](@/docs/reference/api-capabilities.md) keeps historical metadata distinct from these runtime cases.
