+++
title = "Project kickoff saving consumer"
description = "Complete local packed source for subscriptions, save failure recovery and cleanup."
weight = 4
+++

**Status: local packed browser consumer; unpublished 0.0.0 artifacts.** Production BrowserEditor, Rust/WASM engine and real IndexedDB persistence own the document. Prepared inputs inject quota failure and recovery delay only. Remote save is not configured. This is a complete local source example, separate from pending registry/framework/native tutorials.

## Before you start

**Prerequisites:** Node 24.19.0/npm 11.17.0, existing Playwright 1.64.0 Chromium, and the exact retained architecture packs/runtime members in the <a href="{{ get_url(path="reference-inputs/lifecycle-v1/manifest.json") }}">manifest</a>. Follow the <a href="{{ get_url(path="reference-inputs/lifecycle-v1/README.md") }}">offline setup and test command</a>; no credentials, downloads or provisioning are needed.

**Tested version:** historical PIN-1.3 core/web 0.0.0, profile v5, authenticated by hashes rather than a registry version. The [saving walkthrough](@/docs/reference/lifecycle.md) contains source-derived checked excerpts and [events reference](@/docs/reference/events.md) explains ordering/lifetime.

## Complete checked source

- <a href="{{ get_url(path="reference-inputs/lifecycle-v1/consumer.mjs") }}">Browser consumer, seed/open, save, fault ports and cleanup</a>
- <a href="{{ get_url(path="reference-inputs/lifecycle-v1/harness.mjs") }}">Offline package admission, loopback server and browser teardown</a>
- <a href="{{ get_url(path="reference-inputs/lifecycle-v1/docs-lifecycle.test.mjs") }}">Independent lifecycle/event/receipt/resource assertions</a>
- <a href="{{ get_url(path="reference-inputs/lifecycle-v1/prepare-lifecycle.mjs") }}">Source, declaration, snippet and download drift checker</a>
- <a href="{{ get_url(path="reference-inputs/lifecycle-v1/react-sources.json") }}">Existing React/SSR source inventory and qualification limits</a>
- <a href="{{ get_url(path="reference-inputs/lifecycle-v1/react-owner.ts.txt") }}">React owner source</a>, <a href="{{ get_url(path="reference-inputs/lifecycle-v1/react-browser.spec.ts.txt") }}">browser assertions</a> and <a href="{{ get_url(path="reference-inputs/lifecycle-v1/react-ssr.test.mjs") }}">SSR assertions</a>

## Example and expected outcome

The real rendered document starts with a Project kickoff heading, Owner: Alex, Due **Friday**, Draft agenda / Confirm attendees checklist items and a safe inert Reference link. Select Friday and replace it with Thursday. The due paragraph becomes Due Thursday; the rest of the document is unchanged. The live save indicator shows Saved locally only after its captured flush succeeds for the same revision. It always identifies remote save as not configured.

The independent cases also verify selection-only notifications, read-only rejection, retention of an older receipt during a newer failed save, unsubscribe, reentrant destroy, observer error isolation, missing-asset recovery, canceled opening and flush/dispose/remount. A closed host has zero tracked DB connections and subscriptions and no held/pending Web Locks; a remount has one live journal connection and three host subscriptions. These are resource correctness counts, not memory/performance measurements.

## Failure and recovery

The prepared quota failure leaves Due Thursday visible and no new local commit. Failed flush-on-destroy keeps the live replica. Report mode exports real checkpoint/update bytes; retain the report, publish its current checkpoint into a different explicit local database and reopen Due Thursday. The original database remains untouched. A canceled initialization releases late recovery instead of attaching a stale view. The complete harness tears down listeners, contexts, browser and loopback server even on failure; no preview remains running.

For an application, keep recovery exports under an explicit retention policy and provide a visible export/report choice. Never clear storage to hide a failed save. Browser data can be evicted; this example provides no permanent-storage or remote-settlement guarantee. React sources explain existing effect/SSR boundaries only and are not executed as new React qualification. See [compatibility](@/docs/reference/compatibility.md) and [migration](@/docs/migrate/_index.md) before integrating another profile.
