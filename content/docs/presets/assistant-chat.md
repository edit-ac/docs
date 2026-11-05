+++
title = "Assistant chat"
description = "A minimal prompt composer with references and custom commands."
weight = 4
+++

A prompt composer in the style of ChatGPT: minimal editing, references and custom slash commands, without a toolbar.

<iframe src="/demos/presets/assistant-chat/" title="Assistant chat preset demo" style="width:100%;height:550px;border:1px solid #ddd;border-radius:8px" loading="lazy"></iframe>

[Open demo](/demos/presets/assistant-chat/) · [Dedicated configuration](/demos/presets/assistant-chat/config.mjs)

The preset selects References and Slash commands. Formatting marks and shortcuts are disabled, and pasted plain text stays literal. Use `assistantChatPreset({ references, slashCommands })` with your application's context lookup and command list.

Type `@` to attach a prepared reference or `/summarize` to insert a prompt. The unpublished 0.0.0 demo saves in this browser. It does not send the prompt or call a model. [Preset setup and scope](@/docs/presets/_index.md).
