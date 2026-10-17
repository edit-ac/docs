+++
title = "Custom extensions"
description = "Planned callout, highlight and behavior authoring tutorials."
weight = 1
+++

**Status: planned authoring tutorials; no runnable authoring API on this page.**

Reserved examples: a callout block containing Project kickoff content, a highlight mark on Friday, and a local command/menu behavior. Later qualified recipes will cover task lookup-and-link, platform-first spelling, custom parsing and safe URL insertion. They require exact public source and artifact evidence; this page does not implement another matcher, resolver or editor.

Platform spelling inherits user settings where supported; unavailable or unknown capability stays explicit. Custom checking requires explicit activation, and autocorrection is a separate policy. There is no implied bundled dictionary or Tiptap plugin compatibility.

## Before you start

**Prerequisites:** Read [extension contracts](@/docs/guides/extensions.md) and the [catalog entry](@/docs/extensions/_index.md).

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Planned walkthroughs include validation, serialization, unknown-data preservation, history, cancellation and teardown. Native/terminal recipes remain conceptual until their presenters qualify.

## Failure and recovery

Not-found resolution leaves literal text unchanged. Stale asynchronous work cannot edit newer content; disposal must invalidate outstanding work.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
