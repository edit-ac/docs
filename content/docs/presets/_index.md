+++
title = "Editor presets"
description = "Extension lists, configuration and styling for four editor experiences."
weight = 8
sort_by = "weight"
+++

Presets combine an extension list, editor configuration, toolbar layout and scoped styling. Start with one, supply its application services, then adjust its extensions with `extensions`, `remove` or `overrides`.

| Preset | Editing experience |
| --- | --- |
| [Document editor](@/docs/presets/document-editor.md) | Full formatting toolbar and collaboration; no slash commands. |
| [Block editor](@/docs/presets/block-editor.md) | Slash commands, collaboration and block drag and drop; no toolbar. |
| [Chat message](@/docs/presets/chat-message.md) | Compact toolbar, Markdown, custom slash commands and references. |
| [Assistant chat](@/docs/presets/assistant-chat.md) | Minimal composition, references and custom slash commands; no toolbar. |

Each page renders its own demo and links its dedicated configuration. These are **current source previews of unpublished SDK 0.0.0**. Public deployment and release qualification remain pending. The document and block demos connect two real editor replicas within the page. They do not connect to a remote collaboration service. Chat commands use prepared text and make no AI requests.

## Use a preset

```js
import { createEditor } from '@edit-ac/web';
import { chatMessagePreset, mountPresetUI } from '@edit-ac/web/presets';
import '@edit-ac/web/structure.css';
import '@edit-ac/web/ui.css';
import '@edit-ac/web/presets.css';

const preset = chatMessagePreset({
  references: { host: searchReferences, triggers: ['@'] },
  slashCommands: applicationCommands,
});
const editor = createEditor(root, {
  ...existingDocumentOptions,
  ...preset.configuration,
  extensions: preset.extensions,
});
await editor.ready;
const ui = mountPresetUI(editor, toolsHost, preset);
// On unmount:
ui.dispose();
await editor.destroy({ policy: 'flush' });
```

`existingDocumentOptions` identifies an existing checkpoint and supplies the storage and engine assets. `toolsHost` is an empty connected element outside the editor root. Use a dedicated `.editac-ui` wrapper for module chrome and optional `@edit-ac/web/styles.css` for semantic content styles. Handle readiness and flush errors and retain recovery content before closing; see [local saving](@/docs/guides/local-first.md).

Collaboration presets require `collaboration.connect`, which supplies the application's authorized transport. Chat presets require a reference host and a custom slash command list. Presets never infer endpoints or credentials. See the [complete demo lifecycle](/demos/presets/app.mjs) and [setup instructions](/demos/presets/README.md).

## Build the demos locally

Build the current core packages first (`npm run build` in the core checkout), then run `npm run build` in the docs checkout. The build copies the current production JavaScript, WASM and styles into ignored static output before Zola builds the site. No generated runtime files belong in Git. Serve the output on localhost and open one of the pages below; stop the temporary server afterwards.
