# Reader guide template

Use this contract for tutorials, task recipes and extension guides. Keep the canonical page under `content/docs/`, use Zola `@/` links, an explicit weight and a navigation entry. Do not move existing guides without a checked redirect. The reader structure and reservations are mapped in [reader-navigation.json](reader-navigation.json).

```toml
+++
title = "A concrete reader task"
description = "The result the reader can verify."
weight = 1
+++
```

Open with **Status**: contract, planned, source preview, local packed consumer (unpublished), or released consumer. Do not upgrade that label until the exact consumer and profile qualify.

## Before you start

State **Prerequisites**: host/platform, services and permissions, assets, enabled capability profile and redistributable input fixture. State **Tested version**: exact immutable SDK/extension/converter artifacts, source-manifest and receipt. For a reservation with no consumer say explicitly that no SDK consumer is qualified. Documentation generator versions establish documentation checks only.

## Example and expected outcome

Name the reader task and show input, action and independently expected semantic/output state. Link a concrete complete source in the [examples gallery](../content/docs/examples/_index.md), exact source ranges, fixture identity and artifact versions. Derive snippets from that source rather than duplicate its implementation. Record rendered behavior only where qualified. If the example is pending, say so; do not invent API/schema shapes or install commands.

## Failure and recovery

Explain observable diagnostics, failure, cancellation and stale-target behavior. Show data preservation, retry/backup/compatible reopen, local versus remote durability and history implications. Include unsubscribe/dispose and other resource cleanup, accessibility and host limits. Do not suggest silently clearing documents or downgrading schemas.

## Migration and compatibility

Link [compatibility](../content/docs/reference/compatibility.md), [migration](../content/docs/migrate/_index.md), [comparison](../content/docs/compare/_index.md) and applicable API/concept entries. Unsupported or planned directions remain explicit. A document change or synchronized frame is not a durable save receipt.

Before completion run docs checks, the task's named consumer checks, Zola link checking/build and any required local UI observations. Prepared fixtures, source previews, packed consumers and real OS observations must remain distinct in evidence.

## Local navigation inspection

`node --test tests/navigation.test.mjs` builds an isolated site and checks routes, search coverage and reader contracts. For actual headless rendered observations, set `DOCS_PLAYWRIGHT_MODULE` to an already installed pinned Playwright `index.mjs`, optionally set `DOCS_UI_ARTIFACTS` to an existing absolute evidence directory, then run `node --test tests/navigation-browser.test.mjs`. The runner starts a loopback-only ephemeral static server, blocks external requests, tests desktop/search/keyboard/mobile-width navigation, and closes its browser, server and temporary output even on failure. It never installs dependencies or browsers. Headless mobile-width results do not establish mobile OS, assistive-technology or manual visual qualification.
