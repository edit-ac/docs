+++
title = "Recover from mismatched JS and WASM"
description = "An observable failure, deterministic reproduction and data-preserving recovery."
weight = 1
+++

## Symptom and diagnostic

Initialization rejects with an EngineError mentioning a missing WASM export (wasm.__wbindgen_add_to_stack_pointer is not a function in the pinned Chromium run). The editor phase is failed, ready is false and no localCommitted receipt is created.

## Before you start

**Tested version:** local unpublished **0.0.0** production tarballs, with separate exact package families in the [source/profile manifest](/reference-inputs/troubleshooting-v1/manifest.json). These local consumers establish no registry/release, public-hosted, native/device/OS/IME/AT or performance/budget qualification.

Start from the [complete Project kickoff gallery](@/docs/examples/gallery.md) and the [versioned API profile](@/docs/reference/api-capabilities.md). Record diagnostics, profile, identity and asset hashes without private content or credentials.

## Reproduce

Save Due Thursday through the real editor, close it, then open the same database in a fresh browser realm. The prepared transport serves a valid eight-byte empty WASM module at the engine URL. This models incompatible JS/WASM bodies, rather than a network outage.

Run `node --test tests/docs-troubleshooting.test.mjs` in the docs checkout with Node 24.19.0, npm 11.17.0 and the installed Playwright 1.64.0 module named by `DOCS_PLAYWRIGHT_MODULE`. No provider, microphone or external host is used. [Download complete test/consumer sources](/reference-inputs/troubleshooting-v1/source.zip); obtain only the immutable local archives identified by the manifest, never substitute a same-version archive from another family.

## Example and expected outcome

The [exact checked reproduction range](/reference-inputs/troubleshooting-v1/assets.mjs) comes from the named test, lines 18–29. Its complete harness, source, fixtures and package hashes are in the download and manifest; the range alone is not a standalone script.

## Preserve and recover

Retain the database identity and checkpoint. Dispose the failed instance, restore the exact paired JS/WASM assets, and reopen in a fresh realm. A successfully instantiated but incompatible WASM body can poison the generated module cache; retrying within that same realm does not replace its exports. The test independently expects Due Thursday and no error. It never reseeds or deletes the saved database.

## Failure and recovery

A transport acknowledgement or connected state is not a durable local save or remote-host receipt. Await the captured local flush barrier and its genuine receipt. If saving fails, retain the recovery export and diagnose the original failure before retrying. Do not silently clear documents, delete a database or downgrade a schema.

## Limits and cleanup

Always dispose captured commands and await editor teardown. The harness closes contexts/browsers, HTTP listeners and extracted temporary packages even on failure. Prepared quota, read-only, cancellation and incompatible-asset inputs model host failures; they are not actual disk exhaustion, remote ACL or OS observations. Unsupported custom editing remains unavailable; source fallback is preservation, not feature support.

## Migration and compatibility

Read [compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [lifecycle/save semantics](@/docs/reference/lifecycle.md) and the [upgrade/rollback procedure](@/docs/troubleshooting/upgrades.md). The [release status](@/docs/reference/status.md) keeps original publication/platform gates open.
