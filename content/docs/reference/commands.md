+++
title = "Commands and selection"
description = "Planned before-and-after command and selection reference."
weight = 1
+++

**Status: planned versioned reference and consumer; no executable signatures here.**

Formatting Friday, heading/list changes, split/join and undo/redo will use generated real signatures, independent semantic/selection/history expectations and complete consumers. Rejected read-only, stale or protected targets need explicit errors. No chain/helper or multi-command atomicity contract is implied.

## Before you start

**Prerequisites:** Read [core concepts](@/docs/concepts/_index.md) and [capability status](@/docs/reference/status.md).

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

The [examples gallery](@/docs/examples/_index.md) will link the qualified source. Expected results must be authored independently from the implementation.

## Failure and recovery

Keep the current content on error or cancellation. Save failures require a retained backup and compatible reopen; dispose subscriptions and pending work before remount.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.

The [pinned declaration reference](@/docs/reference/api-commands.md) is available now; this planned walkthrough still needs its own complete scenario proof.
