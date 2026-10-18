+++
title = "Keep browser initialization behind the client boundary"
description = "An observable failure, deterministic reproduction and data-preserving recovery."
weight = 4
+++

## Symptom and diagnostic

The deliberate null-host server-side mount reports Invalid value used in weak set in pinned Node 24.19.0. This low-level error means no valid browser host was provided; it is not a user-facing SDK diagnostic contract. Importing the public core/web entries alone accesses none of window, document, indexedDB, navigator, fetch or WebAssembly.

## Before you start

**Tested version:** local unpublished **0.0.0** production tarballs, with separate exact package families in the [source/profile manifest](/reference-inputs/troubleshooting-v1/manifest.json). These local consumers establish no registry/release, public-hosted, native/device/OS/IME/AT or performance/budget qualification.

Start from the [complete Project kickoff gallery](@/docs/examples/gallery.md) and the [versioned API profile](@/docs/reference/api-capabilities.md). Record diagnostics, profile, identity and asset hashes without private content or credentials.

## Reproduce

Run the pinned production tarballs in a Node child process with throwing getters for browser globals. Import core/web without mounting, then deliberately call createEditor with no browser host. The diagnostic is recorded separately from the import result.

Run `node --test tests/docs-troubleshooting.test.mjs` in the docs checkout with Node 24.19.0, npm 11.17.0 and the installed Playwright 1.64.0 module named by `DOCS_PLAYWRIGHT_MODULE`. No provider, microphone or external host is used. [Download complete test/consumer sources](/reference-inputs/troubleshooting-v1/source.zip); obtain only the immutable local archives identified by the manifest, never substitute a same-version archive from another family.

## Example and expected outcome

The [exact checked reproduction range](/reference-inputs/troubleshooting-v1/ssr.mjs) comes from the named test, lines 53–57. Its complete harness, source, fixtures and package hashes are in the download and manifest; the range alone is not a standalone script.

## Preserve and recover

Render a host on the server and mount only after browser hydration. The loading reproduction separately executes real browser mount, cancellation and remount with saved content. The qualified React/SSR and Astro static/SSR/navigation quickstarts provide the complete framework lifecycle; do not run createEditor during SSR.

## Failure and recovery

A transport acknowledgement or connected state is not a durable local save or remote-host receipt. Await the captured local flush barrier and its genuine receipt. If saving fails, retain the recovery export and diagnose the original failure before retrying. Do not silently clear documents, delete a database or downgrade a schema.

## Limits and cleanup

Always dispose captured commands and await editor teardown. The harness closes contexts/browsers, HTTP listeners and extracted temporary packages even on failure. Prepared quota, read-only, cancellation and incompatible-asset inputs model host failures; they are not actual disk exhaustion, remote ACL or OS observations. Unsupported custom editing remains unavailable; source fallback is preservation, not feature support.

## Migration and compatibility

Read [compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [lifecycle/save semantics](@/docs/reference/lifecycle.md) and the [upgrade/rollback procedure](@/docs/troubleshooting/upgrades.md). The [release status](@/docs/reference/status.md) keeps original publication/platform gates open.
