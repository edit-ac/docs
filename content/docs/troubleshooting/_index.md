+++
title = "Troubleshooting"
description = "Reproduce local failures and preserve documents through recovery."
weight = 9
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

Use a bounded reproduction before choosing a recovery. These guides test prepared failures through exact local unpublished production consumers, with independent diagnostic and data-preservation assertions. They do not establish registry/release, hosted service, native/device/OS/IME/AT or performance qualification.

## Before you start

**Prerequisites:** keep the original checkpoint/journal and record schema/profile, document identity, asset hashes and diagnostic. **Tested version:** separate pinned local **0.0.0, unpublished** families in the [manifest](/reference-inputs/troubleshooting-v1/manifest.json), not interchangeable version labels.

## Example and expected outcome

- [Recover from mismatched JS and WASM](@/docs/troubleshooting/assets.md)
- [Preserve unsupported schema and custom content](@/docs/troubleshooting/content.md)
- [Recover from cancelled browser initialization](@/docs/troubleshooting/loading.md)
- [Keep browser initialization behind the client boundary](@/docs/troubleshooting/ssr.md)
- [Recover an unsaved edit after quota failure](@/docs/troubleshooting/quota.md)
- [Handle revoked host write permission](@/docs/troubleshooting/permission.md)
- [Recover a stale command without retargeting](@/docs/troubleshooting/stale.md)

Each page starts with the observed symptom, then a deterministic reproduction and independently expected preserved/recovered data. [Complete checked source](/reference-inputs/troubleshooting-v1/source.zip) reuses the [example gallery](@/docs/examples/gallery.md).

## Failure and recovery

Never silently clear a database, downgrade a schema or replace an original checkpoint with a lossy text export. A connected transport is not durable save. Retain recoverable bytes, dispose failed instances, then retry compatible assets or reopen a separate recovery copy. Prepared failures are not real OS/disk/host-service qualification.

## Migration and compatibility

Read [compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [versioned APIs](@/docs/reference/api-capabilities.md) and [upgrade/rollback](@/docs/troubleshooting/upgrades.md). Public release qualification remains [pending](@/docs/reference/status.md).
