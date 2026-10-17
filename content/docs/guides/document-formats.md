+++
title = "Import and export documents"
description = "Check directional format support, conversion fidelity and unsupported content."
weight = 6
+++

**Status: planned integration contract.** See [release status](@/docs/reference/status.md) before assuming an API or service is available.

Format support is directional and versioned. An exporter does not establish an importer, and extracting text does not establish layout-preserving editing.

The planned baseline covers Markdown, plain text, safe HTML and semantic JSON. Follow-up converters cover DOCX and additional document/table interchange formats in both directions, with PDF available for export only. Every enabled converter must report what it retained, changed, omitted or could not represent before committing an import or saving an export.

DOCX contains document parts, relationships and media. Imported external relationships do not authorize network access. PDF export needs a layout and font strategy. PDF input is rejected with a clear export-only diagnostic; PDF import and OCR are outside the delivery scope. Password-protected or unsupported input in other formats returns a clear diagnostic.

Keep heavy conversion, media decoding and fonts outside the minimal editor bundle. The qualified conversion profile is local-only. Remote converters and hosted fallback are outside this delivery scope; a host policy alone does not make them a supported path.

A live support matrix and fixture-backed examples will be published with qualified converter versions. Do not infer a currently available converter from this roadmap.

## Plan adoption

Read [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) for planned source-specific migration and evidence requirements. These entries do not qualify converters or benchmarks.


## Before you start

**Prerequisites:** Record the input format, source schema and converter profile.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

The direction-specific fixture and loss-report consumers remain pending here. PDF is export-only.

## Failure and recovery

Preview and review before commit. Cancellation or unsupported content must keep the original file and current document.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
