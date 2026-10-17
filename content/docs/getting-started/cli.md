+++
title = "CLI and terminal"
description = "CLI and terminal integration status, lifecycle and qualification boundaries."
weight = 5
+++

**Status: Conceptual path; install-ready CLI/TUI tutorial pending here.**

Terminal clients share document contracts but own file targets, key handling and configured host authority. A browser source preview does not qualify terminal behavior.

## Before you start

**Prerequisites:** Require a named CLI artifact, file read/write and cancellation consumer before using commands on real documents.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

The shared [examples gallery](@/docs/examples/_index.md) records available source previews and planned complete consumers. This entry contains no executable SDK snippet.

## Failure and recovery

Keep the original file until a durable successful save is confirmed. Authentication or transport failure must not replace local data with an empty document.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
