+++
title = "Build with edit.ac"
description = "Integration guides and capability references for the edit.ac SDK in development."
weight = 1
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

edit.ac is being developed as a portable editor SDK: one Rust semantic engine, with web, native and terminal clients. Local editing remains available when collaboration transport is disconnected.

The SDK is unreleased. Selected local packed browser checks exist, while registry installation and the public playground remain unqualified. Start with the integration contracts below and read the [status page](@/docs/reference/status.md) before treating a page as runnable setup instructions.

## Reader sections

| Section | What to read | Current status |
|---|---|---|
| [Getting started](@/docs/getting-started/_index.md) | Web, React, Astro, native and CLI paths | Web source preview; package tutorials planned |
| [Core concepts](@/docs/concepts/_index.md) | Structure, formatting, selection, history and saving | Walkthroughs planned; existing contracts linked |
| [Extensions](@/docs/extensions/_index.md) | Catalog and custom authoring | Consumers planned; contract available |
| [API reference](@/docs/reference/_index.md) | Commands/selection, lifecycle/events and capability versions | Generated signatures pending |
| [Guides](@/docs/guides/_index.md) | Host responsibilities and task recipes | Integration contracts |
| [Examples](@/docs/examples/_index.md) | Complete sources and expected outcomes | Named source preview; packed tutorials pending |
| [Migrate to edit.ac](@/docs/migrate/_index.md) | Source exports, fidelity and rollback | Planned |
| [Compare editors](@/docs/compare/_index.md) | Features and benchmark methodology | Planned; not yet measured |
| [Troubleshooting](@/docs/troubleshooting/_index.md) | Diagnostics, preservation and recovery | Tested recipes planned |

## Choose a starting point

1. [Choose an integration path](@/docs/guides/getting-started.md): web, native, terminal or host services.
2. [Understand local edits and saving](@/docs/guides/local-first.md): durability, offline work and reconnect.
3. [Add extensions](@/docs/guides/extensions.md): portable semantics and host presenters.
4. [Connect agent editing](@/docs/guides/agents.md): Markdown proposals through your application's MCP.
5. [Import and export documents](@/docs/guides/document-formats.md): format directions, fidelity and conversion reports.
6. [Host documents in the cloud](@/docs/guides/cloud-hosting.md): identity, access control and durable receipts.
7. [Browse examples](@/docs/examples/_index.md): editable source previews and the concrete examples planned for each integration.

Use the [glossary](@/docs/reference/glossary.md) and [compatibility guide](@/docs/reference/compatibility.md) when working across platforms.
