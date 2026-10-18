# Project kickoff quickstarts

These are complete local-only, unpublished SDK 0.0.0 consumers for the browser,
React 19.3.0, and Astro 7.3.8 with @astrojs/node 11.1.7. Use Node 24.19.0 and npm
11.17.0. No registry qualification or public-hosted demo is claimed.

From the docs repository in the qualified workspace, run:

```sh
npm run check:examples -- --suite web-react
npm run check:examples -- --suite astro
```

The runner authenticates `local-candidates-v5.json` and installs only the
`sdk-framework-v1` family from sibling architecture's
`evidence/local-consumer-return/20261018/` offline, using public package imports,
without workspace aliases. It does not rebuild or substitute SDK artifacts.
React/Astro packages from other 0.0.0 families are not interchangeable.

Each suite installs separate temporary consumers inside this docs checkout,
builds the React browser entry and both Astro static and standalone SSR output,
then runs Chromium against the production WASM/BrowserEditor/IndexedDB path.
The framework-independent SDK is shared by both bindings. React SSR rendering
is separately executed with browser globals forbidden; mounting is a client
entry. Astro contains no React installation and uses ClientRouter teardown.

The hand-authored Project kickoff fixture contains a heading, owner, bold
Friday, two unchecked agenda items and a safe reference. Expected edits append
` docs`; Bold owner applies an actual engine command. Save/reopen retains the
text and formatting; read-only removes editing and disables the action.
Prepared IndexedDB failures test opening and quota recovery; they are not
provider or OS qualification. Recovery exports preserve unsaved bytes.

`harness.test.mjs` derives from core's owning packed consumer harness; application
sources derive from its task-editor/Astro examples. `upstream.json` records the
exact original source hashes. This local variant adds the shared kickoff seed
and host controls. The manifest pins complete source, fixture, snippet ranges,
package/runtime identities and capability limits. Generated downloadable files
are checked by `scripts/prepare-quickstarts.mjs --check`.

Logs, actual case outcomes, install locks, compiled assets and cleanup records
are retained under `evidence/quickstarts-20261018/`. Set
`DOCS_QUICKSTART_OUTPUT` to a fresh directory to preserve previous failures.
Browsers, servers and temporary installed dependencies are removed in teardown;
compiled consumer archives are retained as qualification evidence.

The core WASM URL is `/core/wasm/editac_wasm_bg.wasm` for plain/React and
`/engine.wasm` for Astro; generated JS/WASM chunks and inline host CSS are
inventoried in compiled outputs. All matching JS/WASM must come from the same
candidate. Optional Markdown remains disabled for this baseline proof.
Use one runtime initialization per compatible module owner; documents, history,
storage and permissions remain independent. Shared source modules do not imply
HTTP cache hits. Client navigation disposes old views; full navigation creates
a fresh runtime owner. Host cache headers and stable URLs require deployment
verification separately.

Native/IME/AT, performance/budget, registry/release, cloud-host and configured
facade/React/Astro combinations remain unqualified here. No publication,
deployment, provider calls, credentials or paid inference are part of these runs.
