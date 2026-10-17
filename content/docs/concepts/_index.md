+++
title = "Core concepts"
description = "Document structure, selection, history and persistence through a shared fixture."
weight = 2
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

**Status: planned concept walkthroughs; not an executable API reference.**

The shared Project kickoff fixture will connect structure/schema, blocks and inline formatting, commands/selection/history, local-first saving and collaboration. Friday will be the selected text for formatting examples; independently expected states will distinguish semantics from actual runtime evidence.

For current contracts read [local edits and saving](@/docs/guides/local-first.md), the [glossary](@/docs/reference/glossary.md) and [versions and capabilities](@/docs/reference/compatibility.md). Commands and lifecycle have [reserved reference entries](@/docs/reference/_index.md).

## Before you start

**Prerequisites:** Understand which host owns a document session.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Planned: select Friday, toggle bold, split/join, undo/redo, save/reopen and inspect a prepared remote insertion. No invented JSON shape or command name is supplied.

## Failure and recovery

A change event alone is not a durable save. Preserve unsaved work and inspect actual local or remote commit receipts before claiming recovery.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.

## Match concepts to current declarations

Read the [document](@/docs/reference/api-document.md), [selection](@/docs/reference/api-selection.md), [commands](@/docs/reference/api-commands.md), [events](@/docs/reference/api-events.md), [storage](@/docs/reference/api-storage.md) and [sync](@/docs/reference/api-sync.md) references alongside the [qualified local consumer](@/docs/examples/qualified-local.md). These versioned references do not complete the planned Project kickoff concept fixture.
