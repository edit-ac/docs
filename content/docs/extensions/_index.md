+++
title = "Extensions"
description = "Portable content, optional behaviors and host presenter limits."
weight = 3
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

**Status: catalog and configuration consumers planned here.**

Separate semantic blocks/nodes, inline marks and optional behavior/modules. Each needs exact versions, dependencies, options, costs and presenter limits before a configuration example is runnable. Application labels do not restrict which extensions may be composed.

Read the existing [extension integration contract](@/docs/guides/extensions.md). The catalog will cover headings/lists, code highlighting, tables, assets/links and optional menus/drag handles. [Custom extension tutorials](@/docs/extensions/custom.md) have a separate reserved entry. No new facade API is advertised by this index.

## Before you start

**Prerequisites:** Check the host capability profile and exact extension descriptor version.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Planned configuration examples pair an original input/action/output with source, serialization, cancellation and disposal evidence. A browser presenter does not establish native support.

## Failure and recovery

If a capability or presenter is unavailable, retain bounded unknown content and report the limit. Do not drop payloads or start a resolver without host authorization.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
