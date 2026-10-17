+++
title = "Astro"
description = "Astro integration status, lifecycle and qualification boundaries."
weight = 3
+++

**Status: Planned package tutorial; static/SSR and navigation qualification pending here.**

Astro integrates the framework-independent SDK without React. Static HTML or SSR output and browser editor initialization are distinct boundaries.

## Before you start

**Prerequisites:** A qualified example must verify static/SSR rendering, browser mount and ClientRouter navigation disposal using its exact packed assets.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

The shared [examples gallery](@/docs/examples/_index.md) records available source previews and planned complete consumers. This entry contains no executable SDK snippet.

## Failure and recovery

Dispose the previous view and cancel pending work before navigation replaces its host. Full navigation creates a new runtime owner; cache reuse is not guaranteed.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
