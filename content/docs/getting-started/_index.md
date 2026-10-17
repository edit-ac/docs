+++
title = "Getting started"
description = "Choose a framework or platform without confusing source previews with released packages."
weight = 1
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

The framework-independent SDK keeps document semantics in one shared engine. Web is the browser adapter; React is a component integration over it. Astro uses browser initialization without requiring React. Each binding needs its own lifecycle and artifact qualification.

| Path | What you can inspect now | Tutorial status |
|---|---|---|
| [Web](@/docs/getting-started/web.md) | Named local source preview and selected unpublished packed evidence | Package quickstart planned |
| [React](@/docs/getting-started/react.md) | Integration responsibilities | Client/SSR quickstart planned here |
| [Astro](@/docs/getting-started/astro.md) | Framework-independent integration responsibilities | Static/SSR and ClientRouter tutorial planned here |
| [Native](@/docs/getting-started/native.md) | Platform and presenter requirements | Platform-specific consumers pending here |
| [CLI and terminal](@/docs/getting-started/cli.md) | File/host authority contract | Install-ready CLI tutorial pending here |

The existing [integration path guide](@/docs/guides/getting-started.md) remains the canonical overview. None of these paths advertises a registry installation.

## Before you start

**Prerequisites:** Choose your host and read its status below.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Follow the [web source walkthrough](@/docs/examples/web.md) for a bounded editing task; complete package consumers will include create/mount, edit/readback, formatting, save/reopen, read-only and disposal.

## Failure and recovery

Do not substitute a workspace alias or an unqualified package when a tutorial is unavailable. Preserve the original document and wait for a named compatible consumer.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
