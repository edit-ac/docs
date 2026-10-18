+++
title = "Selection and captured intent"
weight = 2
+++

**Status: local packed browser, unpublished 0.0.0 PIN-1.3 inputs.** Read the [commands walkthrough](@/docs/reference/commands.md) with its [complete tested consumer](@/docs/examples/commands.md). This page describes the actual [generated anchor and toolbar declarations](@/docs/reference/api-selection.md), not a native or IME contract.

## Before you start

**Prerequisites:** await editor readiness; identify a currently visible editable block and its UTF16 offsets. Native DOM selection is host input; the production engine owns stable ranges and text semantics. Keep schema/profile and package hashes from the [manifest](/reference-inputs/commands-v1/manifest.json).

**Tested version:** local-packed project-kickoff-commands/1 on headless Chromium. The fixture's Friday occupies offsets 4–10 in `Due Friday`. A backward selection has anchor 10 and focus 4; it must not be normalized into an unintended caret. This corpus uses ASCII; it supplies no new grapheme, IME or Unicode qualification.

## Example and expected outcome

Select Friday, capture the command while focus is in the editor, execute and dispose the capture. The independent test checks the range remains backward after bold off/on, content is unchanged and other blocks are identical. Split at offset 4 yields a new paragraph with caret 0; Backspace there rejoins at offset 4. Undo/redo restores independently expected semantic and selection snapshots.

`anchor(node, offset, bias?)` returns a caller-owned token; `releaseAnchor` releases it. Pass an optional `StableRange` to `captureCommand` only when its tokens belong to this editor. Supplied anchors are copied by the capture. Do not persist opaque tokens or reuse them in another document/engine. The captured target owns its retained anchors; dispose it even after rejection. `commit` can return additional caret or selection tokens; the example explicitly releases those.

## Failure and recovery

Capture can return `undefined`; a previously captured command may later reject with `stale-or-unavailable-command-target`. Revision changes invalidate the single-use command. Read-only invalidates intent and disables new captures. A disposed target cannot fall back to the new DOM caret. Keep the rejected text outside the document until the user chooses a fresh authorized target. The consumer checks each preservation outcome separately.

Configuration-disabled italic is a view-level command gate, not application authorization or a schema restriction. The consumer asserts its toolbar state is disabled and an explicit apply is rejected. Unknown helper names remain unavailable. Other protected table/asset/extension targets require their own profiles and evidence.

## History and cleanup

See [ordinary versus collaboration-aware history](@/docs/reference/commands.md). Release captures on dismissal, unsubscribe before view disposal, flush and destroy the view, and retain recovery data on save failure. The downloaded harness closes its isolated browser and server in failure paths as well as success. No remote/provider services run.

## Migration and compatibility

Check [capabilities](@/docs/reference/api-capabilities.md) and [version compatibility](@/docs/reference/compatibility.md). Do not replace stable engine anchors with DOM offsets for delayed edits or claim Tiptap helper compatibility.
