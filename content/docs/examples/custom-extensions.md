+++
title = "Custom extension consumers"
description = "Complete local callout, highlight, command and typed public authoring recipes."
weight = 12
+++

**Status: executable local candidates, unpublished.** Follow [Build a callout, highlight and local command](@/docs/extensions/custom.md). Start with Project kickoff, Owner: Alex and Due Friday; compare exact semantic outputs, history, preservation and cleanup through the real engine/Session/WASM/editor. EQL-1.9 and roadmap10 registry/release remain open.

## Before you start

**Tested version:** separate 0.0.0 unpublished `structural-callout-v2` and `extension-authoring-v1` package families. The <a href="{{ get_url(path="reference-inputs/custom-authoring-v2/manifest.json") }}">source/profile manifest</a> pins their archives, commits, fixtures and source ranges independently. Never combine same-version archives across families. The [configuration example](@/docs/examples/extension-configurations.md) provides the nine typed EXT-1.20 recipes and original owner receipts. Native/terminal, OS/device/IME/AT, Tiptap and performance/budget qualification remain unavailable.

## Complete source and outcomes

Download the <a href="{{ get_url(path="reference-inputs/custom-authoring-v2/source.zip") }}">complete runnable sources</a>, <a href="{{ get_url(path="reference-inputs/custom-authoring-v2/manifest.json") }}">immutable manifest</a> and <a href="{{ get_url(path="reference-inputs/custom-authoring-v2/qualification.json") }}">qualification record</a>. The archive preserves docs-relative paths, both owning fixtures/harnesses, typed recipes and the named test; obtain only the matching admitted local tarballs from the manifest. These unpublished archives are local provenance, not registry identities. Restore this docs checkout's installed dependencies first; no workspace alias or foreign mutable build is used by the editor consumers.

| Task | Independently checked result |
| --- | --- |
| Structural callout | Version-1 NOTE content tuple; bounded TIP source edit preserves identity; invalid/read-only edits leave it unchanged |
| Friday highlight and menu | Versioned mark retained; one local emphasis intent has shared undo/redo |
| Interchange and recovery | Exact checkpoint/IndexedDB reopen, unknown payload retention, callout Markdown roundtrip and explicit highlight loss/recovery |
| Typed authoring | Behavior/mark/atom, validation, lifecycle, ASD-123 lookup/missing/stale, custom spelling, note parser and safe URL insertion through unchanged owning sources |
| Cleanup | Cancel/stale results cannot commit; detached menu cannot write; presenters/listeners and SDK resources dispose |

The earlier <a href="{{ get_url(path="reference-inputs/custom-authoring-v1/transcript.json") }}">v1 transcript</a> remains a conceptual reader study. It has zero runtime cases and does not override this consumer's observed qualification. The bounded callout uses the kickoff title/owner/due subset; separate authoring cases retain their own explicitly pinned input fixtures.

## Reproduce and recover

From this docs checkout with Node24.19.0/npm11.17.0 and an installed Playwright1.64.0 module, set `DOCS_PLAYWRIGHT_MODULE` and a fresh `DOCS_CUSTOM_OUTPUT`, then run `node --test tests/docs-custom-extensions.test.mjs`. The suite installs only exact local production tarballs, compiles the nine public TypeScript recipes, and rejects invalid typed options. Required tests have nonzero counts and no skip-as-pass behavior. Follow with `npm run check`, `zola check --skip-external-links` and `zola build`.

Keep the original checkpoint on invalid schema, unsupported data or failed export; a lossy Markdown fallback is not a backup. Missing tasks stay literal, unsafe links do not apply and newer content is never a target for stale work. All host replies are hand-authored fixtures. No provider/service, credentials or paid inference is used. Browser contexts, ephemeral databases, consumers and loopback servers are disposed; keep durable failure logs and qualification evidence.
