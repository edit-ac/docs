+++
title = "Document editor"
description = "A collaborative document with a full formatting toolbar."
weight = 1
+++

A document editor in the style of Google Docs: a full toolbar, rich document tools and collaboration. Slash commands are absent.

<iframe src="/demos/presets/document-editor/" title="Document editor preset demo" style="width:100%;height:900px;border:1px solid #ddd;border-radius:8px" loading="lazy"></iframe>

[Open demo](/demos/presets/document-editor/) · [Dedicated configuration](/demos/presets/document-editor/config.mjs)

The preset selects Search, Images, Tables, Code and Math notation. The toolbar includes history, marks, links, all six heading levels, lists and indentation. Supply a collaboration connector to `documentEditorPreset({ collaboration })`.

The unpublished 0.0.0 source demo connects two local views. Edit one view and check the other, select text and format it, then reload to reopen the saved sample. Synchronization stays within the page; remote persistence and presence are not configured. [Preset setup and scope](@/docs/presets/_index.md).
