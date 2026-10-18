+++
title = "Native format integration boundaries"
description = "What Swift, Kotlin, desktop and CLI hosts must qualify before runnable recipes."
weight = 8
+++

**Status: conceptual integration guide.** No packaged native conversion consumer
is admitted here. The [directional matrix](@/docs/guides/format-support.md) records
local converter proofs and the missing host boundary separately. No installation
command or Swift/Kotlin API is implied by a converter crate or WASM compile.

## Before you start

**Prerequisites:** the exact binding package, matching engine/schema and optional
converter profile, plus its immutable platform package-consumer receipt. Record
physical or virtual platform checks and any required hardware-only equivalents.
A desktop output parser or Rust unit test cannot substitute for those observations.

**Tested version:** nine converter implementation commits are pinned in the
matrix; **no native host package version is qualified by this guide**. Consume
actual binding evidence before making executable-support claims.

## Platform recipes awaiting their consumer

All rows follow the [preview/cancel/import/export workflow](@/docs/guides/document-formats.md).
They are integration requirements, not API signatures or executed examples.

| Host | Local picker and preview boundary | Cancellation, save and restore boundary | Evidence owner |
| --- | --- | --- | --- |
| iOS / Swift | User-selected document access; bounded original bytes; preview with VoiceOver-readable diagnostics | End scoped access; cancel only owned work; reject stale presentation; retain recoverable source | Roadmap31 packaged Swift consumer and applicable device/simulator proof |
| Android / Kotlin | User-granted document URI access; explicit original retention; accessible diagnostic preview | Close owned streams; respect revoked grants and activity disposal; retain source on failed write | Roadmap32 packaged Kotlin consumer and applicable emulator/device proof |
| macOS | User-selected local document; declared sandbox capability; explicit loss preview | Picker cancel/write/close failure cannot mark saved; restore through qualified Session history or separate reopen | Roadmap33 packaged binding/desktop consumer and platform observations |
| Windows | Explicit file grant; bounded isolated job; diagnostic preview before commit | Reject stale job completions; retain original on destination failure; dispose owned handles | Roadmap34 packaged consumer and platform observations |
| Linux | Explicit local path/destination policy; required isolation; accessible preview | Fail closed without isolation; keep newer edits and recoverable output after cancellation/failure | Roadmap35 packaged consumer and platform observations |
| Terminal / CLI | Explicit input/output paths and direction; print diagnostics before lossy approval | Cancellation/nonzero failure preserves source; atomic destination policy and restore/reopen must be tested | Roadmap36 CLI package consumer; no terminal support inferred from roadmap31–35 |

Swift/Kotlin/desktop/CLI sample code stays pending until a concrete public binding
and its complete consumer qualify. Copying a low-level orchestration sketch into
an app would hide the missing boundary. Use the existing Session, conversion job,
asset work and history owners; do not add another writable document or converter.

## Example and expected outcome

For the future consumer, start with a saved document, select the exact DOCX
fixture named by its source manifest, preview the semantic subset, then cancel.
Compare independently expected source bytes, diagnostics, document content,
selection, history and staged-resource count. Repeat with confirmation and verify
one insertion and qualified undo/reopen. Export a captured revision while making
a later edit; inspect the actual output and assert that the newer revision stays
unsaved. These are pending host assertions, not passed native observations.

## Failure and recovery

Keep permissions, job identity and revision checks at the actual host boundary.
Revocation, cancellation, unsupported input, denied media and late completion
must preserve newer edits. A diagnostic must offer a bounded action: choose a
supported profile, retry after restoring access, retain/export a backup, or reopen
the compatible source separately. Never clear data to hide a schema mismatch.

## Migration and compatibility

See [getting started with native hosts](@/docs/getting-started/native.md),
[CLI status](@/docs/getting-started/cli.md),
[compatibility](@/docs/reference/compatibility.md) and the
[examples gallery](@/docs/examples/_index.md). A public/native support claim waits
for the owning consumer; local source documentation does not close that gate.
