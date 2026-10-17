+++
title = "Troubleshooting"
description = "Planned bounded reproductions and data-preserving recovery."
weight = 9
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

**Status: prepared diagnostic recipes planned; no tested recovery consumer on this page.**

Reserved symptoms: mismatched JS/WASM assets, unsupported schema/custom content, SSR/browser loading boundaries, quota/save failure, revoked permission and stale command targets. Each future recipe starts with the observable symptom and exact diagnostic, then a deterministic reproduction and tested recovery.

Until those consumers qualify, use [status](@/docs/reference/status.md), [local save responsibilities](@/docs/guides/local-first.md) and [compatibility](@/docs/reference/compatibility.md).

## Before you start

**Prerequisites:** Record exact assets, schema/profile, host and diagnostic without credentials or private document data.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Planned recipes will show independent failure/preservation/recovery outcomes and link their owning sources in the [examples gallery](@/docs/examples/_index.md).

## Failure and recovery

Preserve a backup/export and retry compatible loading or saving. Never silently clear documents, downgrade schemas or confuse transport sync with durable save. Upgrade/rollback instructions remain planned.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
