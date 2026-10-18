+++
title = "Preserve unsupported schema and custom content"
description = "An observable failure, deterministic reproduction and data-preserving recovery."
weight = 2
+++

## Symptom and diagnostic

A restore request with schema future.schema.v99 rejects with EngineError / EngineRejected: unsupported identity envelope. Unknown custom data instead has a source fallback: Future kickoff. A fallback does not authorize editing that custom type.

## Before you start

**Tested version:** local unpublished **0.0.0** production tarballs, with separate exact package families in the [source/profile manifest](/reference-inputs/troubleshooting-v1/manifest.json). These local consumers establish no registry/release, public-hosted, native/device/OS/IME/AT or performance/budget qualification.

Start from the [complete Project kickoff gallery](@/docs/examples/gallery.md) and the [versioned API profile](@/docs/reference/api-capabilities.md). Record diagnostics, profile, identity and asset hashes without private content or credentials.

## Reproduce

Use the structural-callout-v2 production packages. Save an inert future.team-callout envelope at dataVersion 7 and a demo.highlight mark at version 9 with an extra retain field. Attempt restore with a deliberately incompatible expected schema, then reopen with extensions absent.

Run `node --test tests/docs-troubleshooting.test.mjs` in the docs checkout with Node 24.19.0, npm 11.17.0 and the installed Playwright 1.64.0 module named by `DOCS_PLAYWRIGHT_MODULE`. No provider, microphone or external host is used. [Download complete test/consumer sources](/reference-inputs/troubleshooting-v1/source.zip); obtain only the immutable local archives identified by the manifest, never substitute a same-version archive from another family.

## Example and expected outcome

The [exact checked reproduction range](/reference-inputs/troubleshooting-v1/content.mjs) comes from the named test, lines 32–40. Its complete harness, source, fixtures and package hashes are in the download and manifest; the range alone is not a standalone script.

## Preserve and recover

Keep the original checkpoint and journal unmodified. Reopen with the matching original identity and compatible runtime. The test compares complete block structures before/after and restored serialization, the nested unknown payload, future mark version/extra field and visible fallback. Do not reconstruct a document from fallback text or silently downgrade its schema.

## Failure and recovery

A transport acknowledgement or connected state is not a durable local save or remote-host receipt. Await the captured local flush barrier and its genuine receipt. If saving fails, retain the recovery export and diagnose the original failure before retrying. Do not silently clear documents, delete a database or downgrade a schema.

## Limits and cleanup

Always dispose captured commands and await editor teardown. The harness closes contexts/browsers, HTTP listeners and extracted temporary packages even on failure. Prepared quota, read-only, cancellation and incompatible-asset inputs model host failures; they are not actual disk exhaustion, remote ACL or OS observations. Unsupported custom editing remains unavailable; source fallback is preservation, not feature support.

## Migration and compatibility

Read [compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [lifecycle/save semantics](@/docs/reference/lifecycle.md) and the [upgrade/rollback procedure](@/docs/troubleshooting/upgrades.md). The [release status](@/docs/reference/status.md) keeps original publication/platform gates open.
