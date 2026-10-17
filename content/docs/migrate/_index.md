+++
title = "Migrate to edit.ac"
description = "Planned migration routes, fidelity reports and reversible cutover."
weight = 7
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

**Status: planned migration guides; no qualified converter instructions here.**

Reserved routes include Tiptap, ProseMirror, Lexical, Slate/Plate, Quill, Draft.js, Editor.js, BlockNote, CKEditor 4/5 and TinyMCE, plus shared HTML/Markdown/plain-text routes. These names identify future source-specific guides, not compatible schemas or implemented converters.

A completed guide needs exact source/target versions, a native source export, feature mapping, independent expected semantics, diagnostics, preview/cancel and rollback. Content conversion does not migrate editor plugins, permissions or collaborative history. Tiptap/ProseMirror Yjs bytes do not establish edit.ac schema compatibility.

Start with [import/export direction limits](@/docs/guides/document-formats.md) and [versions and capabilities](@/docs/reference/compatibility.md).

## Before you start

**Prerequisites:** Retain native source exports and record the source schema/plugins before choosing any route.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Planned guides will compare input, preview, rendered content and loss reports before commit. No migration command is ready on this page.

## Failure and recovery

Keep the original data and document-ID mapping. Stop incompatible/offline writers under a declared cutover policy. Rollback must preserve edits made after cutover.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
