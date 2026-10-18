+++
title = "Task recipes"
description = "Checked tasks using complete local consumers and exact resource profiles."
weight = 7
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

Choose a task and compare its input, action and independently expected output. Each walkthrough reuses its owning production consumer; no alternate editor, loader or synchronization engine is introduced. These are **local-only unpublished 0.0.0** recipes. The exact family/profile and source ranges are pinned in the [recipe manifest](/reference-inputs/recipes-v1/manifest.json); [download all sources](/reference-inputs/recipes-v1/source.zip).

## Checked walkthroughs

- [Build a keyboard toolbar](@/docs/guides/recipes/toolbar.md) — Friday keeps its text and loses bold. The first block becomes heading level 2, then Undo restores heading level 1. Read-only disables every formatting button.
- [Paste Markdown with a checked semantic result](@/docs/guides/recipes/markdown-paste.md) — Readback contains a Release notes block with heading level 2 and a Friday run with bold=true; literal ## and ** are not the stored formatting. Save locally, close and reopen the same identity: both texts remain.
- [Recover from a quota or save failure](@/docs/guides/recipes/save-recovery.md) — The failed flush produces an unsaved report with checkpoint bytes and pending updates. The sibling still saves independently. Recovery publishes a verified checkpoint in a new database and reopens the same authored text; the original database stays listed as a backup until explicit reset.
- [Reconnect two local views safely](@/docs/guides/recipes/reconnect.md) — Both replicas converge with each offline edit exactly once. Undo A preserves the contribution from B. Reopened local checkpoints retain the edits. The status distinguishes delivery, local save and absent remote durability.
- [Share assets between description and comment editors](@/docs/guides/recipes/two-editors.md) — Description reopens as description authored. Comment initially remains comment; read-only denies a write. Its independent edit becomes comment independent and Undo returns comment. Destroying description leaves the sibling usable; final handle count and editor roots are zero.
- [Reuse immutable assets across task and document routes](@/docs/guides/recipes/site-routes.md) — Description retains description saved task and document retains document saved document. Same-realm routing releases old handles before mounting new ones; full navigation evaluates the client entry once in a fresh realm. The engine asset URL stays identical across routes.

## Before you start

Use the configured Node24.19.0/npm11.17.0, installed Playwright1.64.0 and exact retained package artifacts in the admitted local workspace. See the [complete examples gallery](@/docs/examples/gallery.md), [getting started](@/docs/getting-started/_index.md) and [compatibility](@/docs/reference/compatibility.md). SDK-1.10 SHR-01–SHR-08 qualifies resource prerequisites only; aggregate budget/performance, registry/release, public hosting and native/device/OS/AT acceptance remain open.

## Optional recipes and unavailable capabilities

[Cancelled asset upload and internal-link denial](@/docs/guides/references.md) have their own qualified prepared-host resolver source and permission/cancellation evidence under DWF-1.6; they do not authorize fetching private links. [Import preview/cancel](@/docs/guides/native-formats.md) remains a source study until its native/browser conversion profile qualifies. [Host operations](@/docs/guides/cloud-hosting.md) remain pending the real durable host; local fixtures cannot supply DWF-1.8 cloud proof. No absent capability is executed or counted as a passed runtime case.

## Failure and recovery

Keep authored text and exportable recovery on loading or save failure. Await owned cleanup before navigation, preserve an unsaved report and retry only the failed operation. Local storage acknowledgements and peer equality do not prove remote durability. No providers, live model calls, accounts or hidden backend are needed.

## Migration and compatibility

Read [migration](@/docs/migrate/_index.md), [lifecycle](@/docs/reference/lifecycle.md) and [capability status](@/docs/reference/status.md). All fixtures are redistributable Apache-2.0 prepared inputs. The named check is `node --test tests/docs-recipes.test.mjs`; owning canonical suites retain their exact independent evidence.
