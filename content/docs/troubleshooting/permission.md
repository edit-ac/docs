+++
title = "Handle revoked host write permission"
description = "An observable failure, deterministic reproduction and data-preserving recovery."
weight = 6
+++

## Symptom and diagnostic

The captured intent returns rejected / stale-or-unavailable-command-target; new capture is unavailable and direct public commit throws Editor is read-only.

## Before you start

**Tested version:** local unpublished **0.0.0** production tarballs, with separate exact package families in the [source/profile manifest](/reference-inputs/troubleshooting-v1/manifest.json). These local consumers establish no registry/release, public-hosted, native/device/OS/IME/AT or performance/budget qualification.

Start from the [complete Project kickoff gallery](@/docs/examples/gallery.md) and the [versioned API profile](@/docs/reference/api-capabilities.md). Record diagnostics, profile, identity and asset hashes without private content or credentials.

## Reproduce

Select Friday in the command consumer, capture replace, then have the prepared host revoke write access using setReadOnly(true). Attempt both the old intent and a direct commit. Compare full block snapshots before/after.

Run `node --test tests/docs-troubleshooting.test.mjs` in the docs checkout with Node 24.19.0, npm 11.17.0 and the installed Playwright 1.64.0 module named by `DOCS_PLAYWRIGHT_MODULE`. No provider, microphone or external host is used. [Download complete test/consumer sources](/reference-inputs/troubleshooting-v1/source.zip); obtain only the immutable local archives identified by the manifest, never substitute a same-version archive from another family.

## Example and expected outcome

The [exact checked reproduction range](/reference-inputs/troubleshooting-v1/permission.mjs) comes from the named test, lines 69–73. Its complete harness, source, fixtures and package hashes are in the download and manifest; the range alone is not a standalone script.

## Preserve and recover

Preserve the document and keep editing disabled until the authoritative host explicitly reauthorizes it. The fixture then calls setReadOnly(false), reselects Friday and captures a new replace command. Only that new intent commits Due Thursday. This is a local host-policy fixture, not a remote ACL service or OS permission test.

## Failure and recovery

A transport acknowledgement or connected state is not a durable local save or remote-host receipt. Await the captured local flush barrier and its genuine receipt. If saving fails, retain the recovery export and diagnose the original failure before retrying. Do not silently clear documents, delete a database or downgrade a schema.

## Limits and cleanup

Always dispose captured commands and await editor teardown. The harness closes contexts/browsers, HTTP listeners and extracted temporary packages even on failure. Prepared quota, read-only, cancellation and incompatible-asset inputs model host failures; they are not actual disk exhaustion, remote ACL or OS observations. Unsupported custom editing remains unavailable; source fallback is preservation, not feature support.

## Migration and compatibility

Read [compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [lifecycle/save semantics](@/docs/reference/lifecycle.md) and the [upgrade/rollback procedure](@/docs/troubleshooting/upgrades.md). The [release status](@/docs/reference/status.md) keeps original publication/platform gates open.
