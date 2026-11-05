+++
title = "Chat message"
description = "A compact message composer with Markdown, references and commands."
weight = 3
+++

A message composer in the style of Slack: minimal editing, a compact toolbar, Markdown input, custom slash commands and references.

<iframe src="/demos/presets/chat-message/" title="Chat message preset demo" style="width:100%;height:550px;border:1px solid #ddd;border-radius:8px" loading="lazy"></iframe>

[Open demo](/demos/presets/chat-message/) · [Dedicated configuration](/demos/presets/chat-message/config.mjs)

The preset selects Markdown, References and Slash commands. Its toolbar offers history, bold, italic, strike, inline code, links and lists. Use `chatMessagePreset({ references, slashCommands })` with your own resolver and commands.

Try `**bold**`, type `@` to select a prepared reference, or type `/status` to insert a prepared status update. The unpublished 0.0.0 demo saves locally. It sends no messages or provider requests. [Preset setup and scope](@/docs/presets/_index.md).
