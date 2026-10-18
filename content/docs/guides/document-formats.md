+++
title = "Import and export documents"
description = "Preview conversion losses, preserve the original and cancel safely."
weight = 6
+++

**Status: conceptual host workflow over locally tested converter subsets.** The
[version and fidelity matrix](@/docs/guides/format-support.md) names the exact
source evidence. Packaged conversion-host consumers remain pending. This page
contains no install-ready editor API or working file-picker claim.

## Before you start

**Prerequisites:** choose a direction and exact profile from the matrix, retain
an original-file backup, and require a qualified execution/isolation capability.
Converters are optional; their ZIP/XML codecs, fonts and media dependencies do
not belong in the minimum editor bundle. There is no remote fallback.

**Tested version:** the matrix pins nine immutable roadmap27 implementation
commits and their original receipt counts. Their native shared Session tests use
prepared execution/asset transports. WASM compilation is not browser execution;
independent output-reader checks are not platform UI qualification.

## Pick a file and preview an import

This is a host integration recipe, pending a packaged host consumer:

1. Let the user choose a local file. If they dismiss the picker, keep the current
   document, selection, undo history and save indicator unchanged. No job starts.
2. Retain the original bytes under the app's retention policy. Fix the input
   digest, direction/profile, resource limits, current revision and insertion
   target before preparing anything. A renamed PDF still fails as export-only.
3. Prepare through the owning converter and shared Session boundary. Show the
   proposed semantic content and complete conversion diagnostics before commit.
   Source filenames, labels, media and links are untrusted input. External
   relationships never authorize a fetch, font download or code execution.
4. Explain retained, changed, omitted and unsupported content separately. A
   semantic subset does not preserve source pagination or every style. Unsupported
   or encrypted input needs an actionable refusal, not a partly opened document.
5. On confirmation, revalidate the target, current capability and original job
   identity. Commit one shared Session insertion only if the applicable loss
   policy and asset staging succeed. A stale target requires a new preview.

### Example and expected outcome

These are independently stated **acceptance targets for the future host
consumer**, not recorded UI observations or invented serialized report fields:

| Source / action | Preview and report | Document / recovery target |
| --- | --- | --- |
| DOCX with direct numbered list, a simple table and a paragraph-isolated PNG | Show the supported semantic subset; diagnose unsupported layout separately | One insertion after confirmation; original file retained |
| DOCX with merged cells or an inline image | Surface the unsupported construct before an explicit lossy decision | Cancel leaves the original and live document intact; no silent flattening |
| PDF selected for import, including a renamed file | Actionable **export-only** diagnostic before conversion | No job, asset staging or document change; OCR is unsupported |
| User cancels after preparation, or an asset is denied | Cancellation/denial shown without a success receipt | No insertion; retire only this job's uncommitted staged resources |
| Revision/target changes while preview is open | Reject the stale proposal and offer a fresh preview | Preserve newer edits and their history; no late callback can insert |

The matrix's DOCX structure profile records the precise list/table/image
boundaries. Its consumer is an owning Rust test, not a Swift or browser example.
The <a href="{{ get_url(path="formats-native/v1/manifest.json") }}">downloadable manifest</a> pins both identities
so a future host walkthrough can reuse the actual converter rather than emulate it.

## Export a fixed revision

1. Capture the requested document revision and exact export profile. Show that
   revision to the user. Later edits cannot be mixed into this output.
2. Prepare a bounded complete artifact with authorized original media. Declined
   losses, exhausted output limits, missing assets and cancellation produce no
   successful partial artifact. PDF is **export-only**; keep an editable source.
3. Ask the host to choose a destination and complete its write/close protocol.
   Picker cancellation, write failure or close failure retains recoverable state.
4. A conversion completion means bytes were prepared. A successful destination
   write/close means that artifact was saved. Neither proves journal durability,
   remote commitment, or that a newer document revision has been saved.

| Event | Required observable result |
| --- | --- |
| Export revision N; document advances to N+1 | Artifact contains only N; N+1 remains unsaved |
| User dismisses destination picker | No destination write and no saved indicator |
| Output exceeds byte/node/page limit | Actionable refusal; no successful truncated file |
| Write or close fails | Preserve document and original/export source; offer retry/export elsewhere |
| Duplicate or foreign completion arrives | Do not mark another job, session or revision saved |

## Failure and recovery

Cancel releases only job-owned temporary resources. Ambiguous cleanup must retain
retry handles; it must not erase committed assets or unrelated jobs. Missing
required isolation is unavailable support, never permission to run unrestricted.

To restore after an unwanted confirmed import, use the existing shared Session
undo path only where the host qualifies it, or reopen the preserved source into
an explicit separate document. Reopening a source file does not recreate live CRDT
identity, collaborative history or every unsupported construct. Keep the current
document/export backup until the restored content and diagnostics are checked.
Never recommend clearing local storage or replacing a newer document silently.

## Migration and compatibility

Read [native host boundaries](@/docs/guides/native-formats.md),
[compatibility](@/docs/reference/compatibility.md),
[Migrate to edit.ac](@/docs/migrate/_index.md) and
[Compare editors](@/docs/compare/_index.md). Content conversion does not migrate
plugins, platform presenters or editor behavior. See the
[examples gallery](@/docs/examples/_index.md) for separately qualified consumers.
