+++
title = "React"
description = "React integration status, lifecycle and qualification boundaries."
weight = 2
+++

**Status: Planned package tutorial; no SSR support claim from this page.**

React wraps the same framework-independent browser SDK. Component lifecycle owns mounting, subscriptions and disposal; rendering on the server must not initialize browser resources.

## Before you start

**Prerequisites:** A qualified example must test client mount/unmount, remount, read-only and save failures, with a separate SSR/client-boundary consumer.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

The shared [examples gallery](@/docs/examples/_index.md) records available source previews and planned complete consumers. This entry contains no executable SDK snippet.

## Failure and recovery

Cancel pending work and unsubscribe on unmount. A missing browser global during SSR requires a client boundary, not a second document model.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.

See [lifecycle effect cleanup and SSR boundaries](@/docs/reference/lifecycle.md#react-effects-and-ssr-boundaries) for a pinned explanation of the existing React consumer. The accompanying new saving suite qualifies local BrowserEditor behavior only; this React package tutorial remains pending its separate artifact evidence.
