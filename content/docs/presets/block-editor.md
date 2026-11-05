+++
title = "Block editor"
description = "Collaborative blocks with slash commands and drag and drop."
weight = 2
+++

A block editor in the style of Notion: slash commands, collaboration and drag and drop, with no fixed toolbar.

<iframe src="/demos/presets/block-editor/" title="Block editor preset demo" style="width:100%;height:900px;border:1px solid #ddd;border-radius:8px" loading="lazy"></iframe>

[Open demo](/demos/presets/block-editor/) · [Dedicated configuration](/demos/presets/block-editor/config.mjs)

The preset selects Block reorder, Block actions, Images, Tables, Code, Math notation and Slash commands. The default slash menu offers text and three heading levels. Supply `blockEditorPreset({ collaboration })`; pass `slashCommands` to replace the menu.

In the unpublished 0.0.0 source demo, type `/` on a new line and choose a heading. Use a block handle to move a block and verify the second view follows. Both views use page-local synchronization and browser storage. Remote collaboration and presence remain application services. [Preset setup and scope](@/docs/presets/_index.md).
