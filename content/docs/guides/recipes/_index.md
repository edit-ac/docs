+++
title = "Task recipes"
description = "Planned walkthroughs linked to complete owning consumers."
weight = 7
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

**Status: planned recipes; complete consumer qualification pending.**

Reserved walkthroughs cover an accessible bold/heading/undo toolbar, Markdown paste, quota/save-failure recovery and prepared two-view reconnect. Shared-resource recipes will cover two isolated editors on one page and document configurations across routes. They must reuse owning consumers and disclose cache limits, loading/retry and disposal.

Use the current [local-first contract](@/docs/guides/local-first.md), [format contract](@/docs/guides/document-formats.md) and [extension contract](@/docs/guides/extensions.md) while these examples are prepared.

## Before you start

**Prerequisites:** Identify the task, artifact version, profile and redistributable fixture.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Every completed recipe will link its complete [gallery source](@/docs/examples/_index.md), with input/action/output and independent expected results.

## Failure and recovery

Cancellation and stale targets must preserve authored data. Do not retry a failed save by replacing the document with an empty one.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
