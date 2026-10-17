+++
title = "Lifecycle and events"
description = "Planned event, save receipt and cleanup reference."
weight = 2
+++

**Status: planned versioned reference and consumer; no executable signatures here.**

A complete saving example will distinguish ready, document changes, selection, errors, local commits and qualified remote receipts. Event ordering, unsubscribe/dispose, remount and resource counts require exact artifact evidence. A document-change event is not a durability receipt.

## Before you start

**Prerequisites:** Read [core concepts](@/docs/concepts/_index.md) and [capability status](@/docs/reference/status.md).

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

The [examples gallery](@/docs/examples/_index.md) will link the qualified source. Expected results must be authored independently from the implementation.

## Failure and recovery

Keep the current content on error or cancellation. Save failures require a retained backup and compatible reopen; dispose subscriptions and pending work before remount.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
