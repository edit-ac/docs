+++
title = "Format versions and fidelity"
description = "Pinned local conversion subsets and their host qualification limits."
weight = 7
+++

**Status: local source evidence; packaged host integration pending.** These are optional converter subsets, not install-ready browser/native support. All artifacts are unpublished. Counts below are reused owning receipts, not new runtime checks.

## Before you start

**Prerequisites:** an exact converter profile, original file retention and a separately qualified host. **Tested version:** each row names its immutable implementation commit. Download the <a href="{{ get_url(path="formats-native/v1/manifest.json") }}">evidence manifest</a> for receipt hashes, profile hashes and owning consumer source identities.

## Directional subsets

| Format / direction | Version and profile | Fidelity and exclusions | Retained proof |
| --- | --- | --- | --- |
| DOCX / import | Core `2dc7275a1b90bb9e9ee1894d37d83aada2cc77b1`; <a href="{{ get_url(path="formats-native/v1/docx-import-structure/profile.json") }}">profile</a> | Direct lists, bounded simple tables, paragraph-isolated original PNGs. No Word layout, inherited numbering, merged cells or inline images. | CNV-1.6: 143 passed, 0 failed/skipped; receipt SHA256 `16bf17d0f7ff84d8656341785540f06bf2989cecba1987ca6100e0048b1a4bd5` |
| DOCX / export | Core `313784b7391db87426601ad65d889d262fcf0b7f`; <a href="{{ get_url(path="formats-native/v1/docx-export/profile.json") }}">profile</a> | Captured semantic paragraphs, marks, lists, simple tables and authorized original PNGs. No source package identity or pagination. | CNV-1.7: 167 passed, 0 failed/skipped; receipt SHA256 `b1c8f68541013e71e3402d97e7b54434520b0fdb82e103c70771397ce9f3c098` |
| PDF / export | Core `7ea2207db5cf01900ad954e3fcdd44e1e8cdf9a5`; <a href="{{ get_url(path="formats-native/v1/pdf-isolated/profile.json") }}">profile</a> | Bounded captured text, rich content, rectangular tables and authorized PNGs. Exact Arabic copy/search qualified only in MuPDF 1.26.5; no PDF/UA, archival or all-reader claim. | CNV-1.9: 92 passed, 0 failed/skipped; receipt SHA256 `7a1a9a873574b3cd53e379f318fe9fa0e2ebbe4c79bf1fc74d90132fb70aee17` |
| ODT 1.3 / import | Core `b82984976c203405c3c86932d3611aaaa316e41b`; <a href="{{ get_url(path="formats-native/v1/odt-import/profile.json") }}">profile</a> | Guarded semantic text, marks, lists, tables and original PNGs. No arbitrary style/layout or encrypted package support. | CNV-1.10: 187 passed, 0 failed/skipped; receipt SHA256 `6e8c56e67e7f10840431da9127a5ebb0eab826c7af19a9ad432491764f6480aa` |
| ODT 1.3 / export | Core `f8c467a602345cc48dd354b57cbeff64337fd3d5`; <a href="{{ get_url(path="formats-native/v1/odt-export/profile.json") }}">profile</a> | Captured semantic subset with deterministic package and original PNGs. No source-package or pagination fidelity. | CNV-1.11: 206 passed, 0 failed/skipped; receipt SHA256 `8ba13bfb1f602f67c5a01ce688883b6901294124cfe7df6ac607c524e28e977c` |
| RTF 1.9.1 / import | Core `02851c6baa05fc5730c67e10ce0e40d9b25ad430`; <a href="{{ get_url(path="formats-native/v1/rtf-import/profile.md") }}">profile</a> | Bounded CP1252/Unicode text, direct marks, paragraphs and simple tables. No OLE, embedded activation or encoding guesses. | CNV-1.12: 85 passed, 0 failed/skipped; receipt SHA256 `d6d654adc0f398fbc65e2585d52f5fc247e7783a4c8558fba482b466932e9a10` |
| RTF 1.9.1 / export | Core `8a8aad4019a49789a4844a703e7a916cd0bd331f`; <a href="{{ get_url(path="formats-native/v1/rtf-export/profile.md") }}">profile</a> | Captured text, direct marks, paragraphs and simple tables. No source font/layout identity; independent macOS textutil inspection is not host integration. | CNV-1.13: 96 passed, 0 failed/skipped; receipt SHA256 `bf043c3dca3ae3fe3d32835e2fc04579d8fb88b31dbc6dfb94781af51ba272bb` |
| EPUB 3.3 / import | Core `7bd8cfe555ab573a43a40af8bb6c1987d7f2cbb0`; <a href="{{ get_url(path="formats-native/v1/epub-import/profile.md") }}">profile</a> | Guarded reflowable chapter/spine/TOC semantics and original PNGs. No scripts, DRM, remote fetch or fixed-layout fidelity. | CNV-1.14: 95 passed, 0 failed/skipped; receipt SHA256 `5a2d77d51960287bfaaa3a0898ec74b1acd1753cbacc0b06271773024a789b12` |
| EPUB 3.3 / export | Core `a2a5c3dc242ea2989af854547f34a1dc61c37a74`; <a href="{{ get_url(path="formats-native/v1/epub-export/profile.json") }}">profile</a> | Captured safe XHTML, spine, flat TOC, metadata and authorized PNGs. Independent EbookLib reopening; no viewer-rendering or EPUB certification claim. | CNV-1.15: 120 passed, 0 failed/skipped; receipt SHA256 `a8d0b70c03d3af5fd95bd688663a349bf60bd3ff5547cb6cce9958caecd7cc16` |

**PDF is export-only.** PDF input and OCR are unsupported, including renamed files detected by signature. CSV/TSV conversion is not qualified by these receipts. Markdown, safe HTML, plain text and semantic JSON are separate baseline codecs; this matrix makes no new baseline install claim.

## Platform admission

| Host | Guide status | Required owner evidence |
| --- | --- | --- |
| iOS / Swift | **conceptual**; no runnable conversion-host claim | Roadmap 31; immutable packaged consumer plus applicable platform proof |
| Android / Kotlin | **conceptual**; no runnable conversion-host claim | Roadmap 32; immutable packaged consumer plus applicable platform proof |
| macOS | **conceptual**; no runnable conversion-host claim | Roadmap 33; immutable packaged consumer plus applicable platform proof |
| Windows | **conceptual**; no runnable conversion-host claim | Roadmap 34; immutable packaged consumer plus applicable platform proof |
| Linux | **conceptual**; no runnable conversion-host claim | Roadmap 35; immutable packaged consumer plus applicable platform proof |
| Terminal / CLI | **conceptual**; no runnable conversion-host claim | Roadmap 36; immutable packaged consumer plus applicable platform proof |
| Browser | **conceptual**; no runnable conversion-host claim | Roadmap 27; immutable packaged consumer plus applicable platform proof |

WASM compilation proves a build target only. A native Rust Session test, macOS output-reader check or isolated PDF executable does not prove a Swift/Kotlin/desktop picker, platform sandbox, browser worker or CLI save lifecycle.

## Example and expected outcome

Follow [preview, cancel and restore](@/docs/guides/document-formats.md) for the host workflow and [native integration boundaries](@/docs/guides/native-formats.md) for platform-specific prerequisites. These guides are conceptual until the named host boundary qualifies.

## Failure and recovery

An unavailable adapter or missing isolation capability must fail before mutation. Retain the original input and current document; never substitute a remote converter or silently accept loss.

## Migration and compatibility

See [compatibility](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). Import/export does not transfer plugin behavior, live CRDT identity or collaborative history.
