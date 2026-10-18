+++
title = "Document structure and schema"
weight = 1
+++

**Status: conceptual walkthrough; not runtime qualification.**

## Before you start

**Prerequisites:** Read the [fixture overview](@/docs/concepts/_index.md) and identify your document, view, storage and transport owners.

**Tested version:** Project kickoff teaching fixture **project-kickoff/1**; source-only, conceptual. No SDK version or platform is qualified by this walkthrough. The [versioned declarations](@/docs/reference/api-capabilities.md) and [separate qualified consumer](@/docs/examples/qualified-local.md) retain their exact artifact scope.

## Example and expected outcome

[Download the original fixture](/concepts/project-kickoff-v1/kickoff-v1.md) and [source manifest](/concepts/project-kickoff-v1/manifest.json). It contains a heading, two paragraphs, a two-item checklist and an inert link. Friday is bold within its paragraph; the mark changes inline meaning without adding another paragraph.

```text
Project kickoff (teaching tree, not serialized schema)
├── heading: Project kickoff
├── paragraph: Owner: Alex
├── paragraph: Due [bold: Friday]
├── checklist
│   ├── unchecked: Draft agenda
│   └── unchecked: Confirm attendees
└── paragraph: link Reference → https://example.invalid/project-kickoff
```

Snapshot `kickoff-v1` is the independently authored starting expectation for PK-01. Its Markdown is human-readable notation, not an invented edit.ac JSON shape or a promise that a profile imports checklists. A schema defines permitted structure and attributes; a version identifies how stored data is interpreted. A fixture version identifies this lesson, and does not substitute for a document schema, package version or capability profile.

A block defines structural grouping. Inline text and marks live within a text-bearing block. A link carries a target; recognizing one does not authorize fetching it. Optional code, table and asset nodes are absent here because this lesson makes no profile claim for them.

Follow [selection and history](@/docs/concepts/editing.md) through the same blocks, then [saving and collaboration](@/docs/concepts/persistence.md). The [document reference](@/docs/reference/api-document.md) supplies the actual versioned declarations, and [extensions](@/docs/extensions/_index.md) records qualification limits.

## Failure and recovery

If a stored schema or extension is unknown, preserve the original data and diagnostics. Do not coerce it into this teaching tree or silently discard content. Reopen with a compatible qualified implementation or export recovery data before attempting a migration.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). A Markdown teaching snapshot is not a schema migration or lossless import guarantee.
