# Project kickoff saving and lifecycle consumer

This complete local browser consumer uses the immutable PIN-1.3 production core
and web tarballs, version 0.0.0, **unpublished**. It is not a registry installation
tutorial. Keep the sibling architecture checkout's exact retained tarballs and
authenticated runtime members listed in manifest.json. Never replace them with
current workspace output. The fixtures are original Apache-2.0 Project kickoff
content; the Rust/WASM engine, BrowserEditor and IndexedDB own all document state.

Use Node 24.19.0/npm 11.17.0 and existing Playwright 1.64.0 Chromium. From docs:

```sh
export PATH="$HOME/.nvm/versions/node/v24.19.0/bin:$PATH"
DOCS_PLAYWRIGHT_MODULE="$PWD/../core/node_modules/playwright/index.mjs" \
  DOCS_LIFECYCLE_OUTPUT="$PWD/../evidence/dwf-1.33-20261018/browser" \
  node --test tests/docs-lifecycle.test.mjs
```

The harness authenticates and installs packs offline with scripts disabled,
authenticates JS/WASM members, and serves installed package bytes on one temporary
loopback listener. Set DOCS_LIFECYCLE_ARCHITECTURE only to a directory containing
the same immutable inputs. No browser/package download, provider, key or remote
service is used. The harness closes contexts/browser/server and removes temporary
installs even on failure. Browser metadata records the port, observations and
cleanup; the test runner retains independent assertions.

The consumer explicitly creates the Project kickoff checkpoint once. Opening
always recovers that identity, never creates replacement content after an error.
Select Friday, replace it with Thursday, flush locally, switch read-only, close
and reopen. Keep the paragraph text and local receipt distinct from selection
notifications. A previous receipt can remain present while a newer update fails;
the save indicator checks the captured flush barrier and unchanged revision.

Prepared host faults throw at the real IndexedDB transaction boundary or delay
the exported EditorOptions.recover port and return from a real local flush, delegating successful work to the exact
installed internal recovery owner. The private /web/entry.js import is test
instrumentation, not a supported new public package API. Successful saves return
the real journal's transaction-completion receipts. A failed flush is retained;
report mode exports real recovery bytes before release. The test retains those
bytes and publishes their checkpoint into a different explicit local database,
then compares reopened text. It does not silently clear the original database.
Opening cancellation releases a late real replica before a fresh remount.

The native DB open/close instrumentation and Web Locks query prove local cleanup;
subscription counters track this host's three unsubscribe handles. They are not
a process-memory or performance benchmark. Reentrant destruction and observer
exceptions use the actual exported lifecycle owner. The initial fixture has bold
Friday, a heading, two checklist items and a safe fixture link; optional rich
content, remote service and platform support are not inferred.

react-sources.json pins the existing React effect/SSR consumer and owner as source
explanation only. It is not run by this browser suite or promoted to a qualified
framework tutorial. React's existing consumer owns its own complete artifact
qualification. This suite establishes local headless Chromium mechanics, not OS,
IME, assistive technology, native, remote durability, registry release or hosted
deployment. Remote save remains explicitly not configured.
