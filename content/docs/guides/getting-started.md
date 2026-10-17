+++
title = "Choose an integration path"
description = "Choose a web, native, terminal or agent integration and the services your application owns."
weight = 2
+++

**Status: integration contract; package installation tutorial pending qualification.** The [status page](@/docs/reference/status.md) distinguishes unpublished local packed evidence from a released consumer.

| Your application | Planned integration | Your application owns |
|---|---|---|
| Browser app | `@edit-ac/core` and `@edit-ac/web` | Authentication, assets, transport and lifecycle |
| React app | `@edit-ac/react` over the web SDK | The same services plus component lifecycle |
| iOS, Android, macOS, Windows or Linux app | Native SDK for that OS | Native view lifecycle, key storage and host services |
| Terminal workflow | edit.ac CLI/TUI | Local file targets or configured hosted authority |
| Agent-enabled app | Shared editing service through the app's existing MCP | Tool registration, authorization and request identity |

Start with one document, one editor view and a local store. Add collaboration after local save, recovery and disposal work. An editor view and a transport share the same document session; attaching transport does not create or import a second writable document.

Check the exact [capability profile](@/docs/reference/compatibility.md) before choosing extensions. A missing native presenter can preserve content without offering full editing support. Released setup commands require registry qualification; local tarball instructions must name exact unpublished artifacts and their own consumer evidence.

For something to inspect now, the [examples gallery](@/docs/examples/_index.md) links a local rendered web editor with a project brief, bug report and meeting notes. It uses pinned development source, version 0.0.0, and needs no backend. Package setup examples will follow their qualified artifacts; local tarball instructions will be labeled unpublished when available.

## Plan adoption

Read [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) for planned source-specific migration and evidence requirements. These entries do not qualify converters or benchmarks.

Browse the [Getting started paths](@/docs/getting-started/_index.md), including [Astro](@/docs/getting-started/astro.md) without React.


## Before you start

**Prerequisites:** Choose one host platform and a local document store.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

The [web source preview](@/docs/examples/web.md) is inspectable now; qualified package tutorials will exercise save/reopen and disposal.

## Failure and recovery

If no compatible artifact exists, keep the original source. Do not install a guessed package version.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
