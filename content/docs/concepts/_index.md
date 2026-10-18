+++
title = "Core concepts"
description = "Follow one Project kickoff fixture through structure, editing, saving and collaboration."
weight = 2
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

**Status: conceptual walkthroughs delivered; executable Project kickoff consumers remain planned.**

Follow one original, versioned fixture through three short lessons:

1. [Document structure and schema](@/docs/concepts/structure.md): blocks, inline marks and version boundaries.
2. [Selection, commands and history](@/docs/concepts/editing.md): select Friday, remove/apply bold, split/join, undo/redo and reject read-only/stale work.
3. [Local saving and collaboration](@/docs/concepts/persistence.md): save/reopen, a prepared remote insertion, independent localCommitted/remoteCommitted and quota recovery.

## Before you start

**Prerequisites:** Distinguish the document, view, storage and transport owners. No installation is needed for these reading exercises.

**Tested version:** `project-kickoff/1`, original Apache-2.0 teaching content. No SDK or platform runtime is qualified by this transcript. Markdown is semantic teaching notation, not an edit.ac schema or importer guarantee.

## Example and expected outcome

Read the [original fixture](/concepts/project-kickoff-v1/kickoff-v1.md), [complete transcript](/concepts/project-kickoff-v1/transcript.json), [source notes](/concepts/project-kickoff-v1/README.md) and [versioned manifest](/concepts/project-kickoff-v1/manifest.json). The heading is Project kickoff, the owner is Alex, Friday starts bold, the checklist has two unchecked items and the fixture link is inert. PK-01–PK-16 refer to independently authored before/after snapshots, not executed commands.

The docs checks verify fixture identities, transcript expectations and links. They execute no editor and do not count prepared transcript rows as runtime cases. For actual named runtime observations use the [separate qualified local consumer](@/docs/examples/qualified-local.md) with its original corpus, version and scope. The [document](@/docs/reference/api-document.md), [commands](@/docs/reference/api-commands.md), [selection](@/docs/reference/api-selection.md), [events](@/docs/reference/api-events.md), [storage](@/docs/reference/api-storage.md) and [sync](@/docs/reference/api-sync.md) references contain frozen real declarations.

## Failure and recovery

A visible change or delivered update alone does not prove durability. Preserve recovery data on save failure; reject stale targets and recheck permissions. Static lesson files require no teardown; real consumers must release views, subscriptions and stores without deleting unsent work.

## Migration and compatibility

Read [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). Unsupported schema data must be preserved, not silently simplified to the teaching fixture.
