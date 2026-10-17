+++
title = "Capability and release status"
description = "Distinguish source previews, local packed evidence and pending public release qualification."
weight = 8
+++

Reviewed 2026-10-18 against core revision `a20a36c15119c661e47ec0ec7051aed8d94e7ed6` and architecture revision `59a732815fa26f1be40616eb8b528f8927ca0216`. These source revisions are local and unpublished; inspect them in the corresponding checkouts. Implementation has progressed beyond the initial scaffold. This documentation baseline describes the evidence below; it does not qualify an SDK release.

| Surface | Current evidence and limits |
|---|---|
| Web SDK | Unpublished local production tarballs, version 0.0.0. Selected installed-package browser journeys are verified; registry installation tutorials remain pending. |
| Web source preview | Three editable sample documents built from pinned source. In-memory editing and plain-text export; reload/reset clears edits. See the [walkthrough](@/docs/examples/web.md). |
| React and Astro | First-party integration paths. This docs baseline does not supply qualified package quickstarts or establish SSR/navigation support; their exact consumers remain pending here. |
| Native SDKs | Target-platform bindings have separate implementation and qualification tracks. No native support claim is made by this baseline. |
| CLI/TUI | Separate development and qualification tracks; no install-ready CLI tutorial in this baseline. |
| Converters and extensions | Direction- and profile-specific implementation. These guides remain contracts until linked to exact qualified consumers. **PDF is export-only; PDF import and OCR are unsupported.** |
| Cloud storage | Host-owned service contract; no hosted edit.ac service or configured provider qualification is offered here. |
| Public playground | Pending integration and qualification; the local source preview is separate. |
| Security and performance | No production encryption, numerical performance, full-platform or release claim from this documentation baseline. |

## What the local browser evidence proves

The local **PIN-1.3** receipt at `architecture/evidence/integrated-browser/primary-flow-20261018/pin-1.3-receipt.json`, in the architecture revision above, records **12 passed, 0 failed, 0 skipped** installed-package cases: three journeys in each Chromium/WebKit desktop and portable-mobile profile. They cover configured editing and local recovery, prepared host-tool/agent history, and peer disposal/recovery. The receipt pins the installed artifacts, source inputs and retained earlier failure. These are reused results, not new executions by this documentation check.

Host transports and requests were prepared fixtures. Portable-mobile browser automation does not establish actual mobile OS, keyboard, IME, screen-reader or native behavior. No live model/provider, deployment or registry-installation result is implied. Newer extension/loading/authoring work needs its own admitted evidence before examples here claim it.

## Read a guide's status first

A **contract** explains responsibilities without promising a runnable API. A **source preview** requires its named checkout and source build. A **local packed consumer** installs named unpublished production tarballs and proves only its recorded profile. A **released consumer** needs an immutable release and its own qualification; this baseline supplies none.

The [getting-started guide](@/docs/guides/getting-started.md) and [examples gallery](@/docs/examples/_index.md) keep these distinctions visible. No placeholder editor API or speculative install command is presented as ready to use. Architecture owns [implementation tasks and evidence](https://github.com/edit-ac/architecture); roadmap checkboxes alone are not support evidence.
