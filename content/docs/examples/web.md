+++
title = "Rendered web editor"
description = "Try a project brief, bug report and meeting notes in the development web editor."
weight = 1
+++

**Status: local source preview, version 0.0.0.** This example uses the real Rust/WASM engine and the current internal browser adapter. The public SDK is not released. Build instructions and complete source live in the [core example directory](https://github.com/edit-ac/core/tree/main/examples/web).

The preview needs a source build and a static file server. It opens one editable document in your browser, with no backend, sign-in, collaboration service or AI provider. Pick a sample from the sidebar:

| Document | Editing task | Expected result |
|---|---|---|
| Project kickoff | Add a sentence under “The idea,” then undo and redo it. | The paragraph and rendered content change together; undo removes the edit and redo restores it. |
| Bug report | Replace the expected result, then switch to read-only mode. | Your text remains visible while editing and history controls are disabled. Switch back to continue. |
| Meeting notes | Change an action item, then export text. | A `.txt` download contains your current words and paragraph breaks. Formatting and list markers are omitted. |

## Check the editing behavior

Put the cursor in a paragraph and type. Select a phrase and use **⌘/Ctrl + B** or **I**. Press **Enter** to split a paragraph. Use the document controls to undo, redo, toggle read-only, reset the current sample, or export its text.

Edits stay in this tab. Reloading, switching examples, or choosing **Reset example** clears them. Export a copy before any of those actions if you want to keep your changes. This preview does not demonstrate durable local save or recovery after closing the browser; those examples have their own [local storage requirements](@/docs/guides/local-first.md).

## Loading, recovery and cleanup

The editor stays disabled while its WASM asset loads. A loading failure appears in the status line; rebuild the packages and reload to retry. If an unsupported native edit cannot be applied, the preview shows retained text in a recovery panel. Copy that text before resetting or switching samples.

Each sample replacement and page exit disposes the input owner, selection bridge, renderer subscriptions and engine. Stop the static preview with **Ctrl+C** when finished. The source README also names the deterministic browser check command and its limits.

The preview has labeled controls, visible keyboard focus, a multiline editor label and a responsive layout. Automated desktop and viewport checks do not establish OS IME, actual mobile-device, screen-reader or release support. Consult [capability status](@/docs/reference/status.md) for qualified profiles.

Return to the [examples gallery](@/docs/examples/_index.md) for the complete set of planned release-backed consumers.
