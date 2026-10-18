+++
title = "Preserve data through upgrades and rollback"
description = "A bounded procedure while public release qualification remains pending."
weight = 8
+++

## Before you start

**Tested version:** the local unpublished 0.0.0 package families in the [troubleshooting manifest](/reference-inputs/troubleshooting-v1/manifest.json). This is a data-preservation procedure, not a qualified public release or cross-version migration matrix. The broader release drift gate (DOC-1.14) and registry/release qualification remain pending.

Record the exact JS/WASM/CSS archive and member hashes, document schema/protocol, extension descriptor versions, converter profile and host version. A package version alone cannot identify these unpublished candidates. The [gallery](@/docs/examples/gallery.md) links complete consumers and immutable profiles.

## Example and expected outcome

Before an upgrade, preserve an untouched checkpoint, journal/unsaved-update bytes and identity in a separate backup. Open a copy using the intended compatible runtime, and compare semantic content, unknown payloads and save/reopen outcomes against independent expectations. Use the [unsupported-content reproduction](@/docs/troubleshooting/content.md) and [quota recovery reproduction](@/docs/troubleshooting/quota.md) for tested local preservation boundaries.

## Failure and recovery

If assets do not pair, stop mounting and [restore matching assets](@/docs/troubleshooting/assets.md). If the target rejects a schema or extension, retain the original bytes; use a compatible application/runtime to reopen the copy. Do not relabel a newer document as an older schema. Rolling back application code is safe only when that code supports the stored schema/profile; otherwise keep the newer compatible reader and the backup until a separately qualified migration exists. Never clear IndexedDB as an upgrade step.

A successful transport sync does not prove durable save. Await the local flush receipt; remote durability requires its own authenticated host receipt. For failed saves retain the recovery report before teardown. Release owners must qualify actual previous/current combinations, converter/source drift, snippet/reference manifests, navigation and release links before publication. These local checks do not close that gate or authorize publishing.

## Migration and compatibility

Read [versions and capabilities](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [versioned APIs](@/docs/reference/api-capabilities.md) and [release status](@/docs/reference/status.md). Restore compatibility rather than silently converting unknown data to text.
