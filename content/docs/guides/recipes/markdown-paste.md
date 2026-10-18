+++
title = "Paste Markdown with a checked semantic result"
description = "A checked input, action, outcome and recovery using the owning consumer."
weight = 2
+++

Use the complete browser quickstart with ?markdown. In the bounded recipe check, the shared owner starts with description; place the caret at its end. The downloadable input is a level-2 Release notes heading followed by bold Friday.

## Before you start

**Tested version:** exact local SDK **0.0.0, unpublished**, profile pinned by the [recipe manifest](/reference-inputs/recipes-v1/manifest.json). Both recipes use sdk-framework-v1 exact unpublished 0.0.0 tarballs. The snippet is the quickstart enablement hook; the shared recipe harness executes the same qualified parser through the owning shared consumer. Inspect tests/docs-recipes.test.mjs for the independent heading/mark assertions.

Open the [complete gallery source](@/docs/examples/gallery.md#browser) and [download the complete recipe sources](/reference-inputs/recipes-v1/source.zip). This is local source/build proof; registry/release, public hosting, native/device/OS/AT and performance/budget qualification remain open.

## Example and expected outcome

**Input:** Use the complete browser quickstart with ?markdown. In the bounded recipe check, the shared owner starts with description; place the caret at its end. The downloadable input is a level-2 Release notes heading followed by bold Friday.

**Action:** Paste the plain-text fixture. markdownOptions loads the optional parser only when the host explicitly enables it. The editor paste pipeline owns parsing, insertion, history and the current target.

**Expected output:** Readback contains a Release notes block with heading level 2 and a Friday run with bold=true; literal ## and ** are not the stored formatting. Save locally, close and reopen the same identity: both texts remain.

This checked excerpt comes from `examples/quickstarts/examples/task-editor/markdown.mjs`, lines 1–5. The [downloadable excerpt](/reference-inputs/recipes-v1/markdown-paste.mjs) has SHA-256 `f137278fc14c59f4e63aad35398a118139fd3b00085a818d273e7b6a5cb7ea75`; the manifest pins full source, profile and fixture hashes.

```js
export async function markdownOptions(assetUrl = '/markdown/wasm/editac_markdown_wasm_bg.wasm') {
  if (!new URL(location.href).searchParams.has('markdown') && !window.markdownEnabled) return {};
  const [{initMarkdown}, {markdownExtension}] = await Promise.all([import('@edit-ac/markdown'), import('@edit-ac/markdown/web')]);
  return {markdown: markdownExtension(await initMarkdown(assetUrl))};
}
```

## Failure and recovery

A parser/engine load failure is visible and may be retried; keep the current document identity and recovery export. Plain mode treats the same text literally. Rich HTML and permission-sensitive assets have separate policies; this check uses a synthetic ClipboardEvent with prepared text, not an OS clipboard claim.

## Cleanup

Await editor.destroy with the appropriate flush/report policy. Release the browser context and any parser waiters through the owning SDK; do not keep a second document model.

## Migration and compatibility

Use [compatibility](@/docs/reference/compatibility.md), [versioned lifecycle APIs](@/docs/reference/api-lifecycle.md), [migration](@/docs/migrate/_index.md) and the [recipe index](@/docs/guides/recipes/_index.md). Prepared failure transports and synthetic paste are deterministic checks; real OS input and service durability need their own evidence.
