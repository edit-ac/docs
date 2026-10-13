+++
title = "Examples"
description = "Concrete editor examples, from a first document to recovery, collaboration and extensions."
weight = 2
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

Start with a document you recognize: a project brief, a bug report, or meeting notes. Each released example will include an editable result, its complete source, sample content, reset controls, and the exact tested SDK version.

**Current status: source preview available; public SDK examples are planned.** The [local web preview source](https://github.com/edit-ac/core/tree/main/examples/web) contains three rendered, editable documents built on the current Rust/WASM engine and browser adapter, version **0.0.0**. It runs from a source checkout with a static file server. Changes stay in the browser tab; there is no backend or account. See the source README for build instructions and limits. This preview is not a released package or a browser support claim.

## Start with the web editor

Follow the [rendered web editor walkthrough](@/docs/examples/web.md) for editing tasks, expected results, export and cleanup.

| Example | What to try | Status |
|---|---|---|
| Project kickoff | Edit a brief with headings, a bold phrase and a bullet list. Undo your change, reset the sample, or export its text. | Local source preview |
| Bug report | Replace a ticket's reproduction steps and expected result. Switch to read-only mode to inspect the document. | Local source preview |
| Meeting notes | Write decisions and action items. Try selection, paragraph splitting and keyboard formatting. | Local source preview |

These samples share one small browser integration. They demonstrate current source behavior, with edits cleared on reload or when switching samples. Plain-text export keeps words and paragraph breaks and omits rich formatting. The preview shows loading failures and text retained for recovery after an unsupported edit.

## Examples coming with the SDK

| Example family | Concrete result | Related guide |
|---|---|---|
| Minimal web and React editors | Create, mount, edit, read content, toggle read-only, and dispose a document view. | [Choose an integration path](@/docs/guides/getting-started.md) |
| Accessible formatting toolbar | Apply a mark or heading to a selection; inspect before and after states, undo, and rejected actions. | [Extension contracts](@/docs/guides/extensions.md) |
| Local save and recovery | Save a note, reopen it, and recover from a prepared storage failure without replacing existing work. | [Local edits and saving](@/docs/guides/local-first.md) |
| Two-view collaborative note | Edit the same note in two local views, disconnect, reconnect, and inspect which changes are durable. | [Cloud host contracts](@/docs/guides/cloud-hosting.md) |
| Import and export | Preview an imported document, review preserved and unsupported content, cancel, then export through a qualified format route. | [Document formats](@/docs/guides/document-formats.md) |
| Structured report | Combine code, tables and assets with each required extension and presenter named explicitly. | [Extension contracts](@/docs/guides/extensions.md) |
| Custom callout and highlight | Add a portable block or inline mark with a command and an accessible menu entry. | [Extension contracts](@/docs/guides/extensions.md) |
| Host agent editing | Review a prepared proposal, apply permitted edits, and handle cancellation or denied access. | [Agent editing](@/docs/guides/agents.md) |
| Native and terminal clients | Follow the same document fixture through each client's qualified lifecycle and editing profile. | [Compatibility](@/docs/reference/compatibility.md) |

Each family will become runnable as its corresponding package and capability profile qualify. Unavailable features remain labeled here until their own consumers pass. Examples use redistributable content and prepared service responses; trying them will not require model-provider credentials.

## What each completed example includes

- A rendered document and a specific editing task with an expected outcome.
- Complete downloadable source and copyable snippets checked against the same version.
- Setup, loading, read-only, reset, export and disposal paths where applicable.
- Failure and cancellation behavior, retained recovery content, and accessibility notes.
- Exact package versions, capability requirements, platform limits, and validation evidence.

Follow [capability status](@/docs/reference/status.md) for released artifacts. A source preview or a planned recipe does not establish release, mobile, native, or IME support.
