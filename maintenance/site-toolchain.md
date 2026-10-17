# Local static site toolchain

Retain Zola 0.23.6 and DevLab 0.9.0. This preserves the existing canonical Markdown, URLs, search, theme overrides and plaintext reading path without introducing another documentation framework. Zola emits static files; no database, account, credentials or cloud build service is required. The official [installation guide](https://www.getzola.org/documentation/getting-started/installation/) and [static deployment overview](https://www.getzola.org/documentation/deployment/overview/) describe this workflow.

## Pins and maintenance evidence

Reviewed 2026-10-18: [Zola v0.23.6](https://github.com/getzola/zola/releases/tag/v0.23.6) was published 2026-09-12. The generator uses [EUPL-1.2](https://github.com/getzola/zola/blob/v0.23.6/LICENSE); it is a build tool, separate from this site's Apache-2.0 source. DevLab is MIT, pinned by the Git submodule to `2b638831313058ba92d17095fce15454fda02eba` (2026-10-06), and requires Zola 0.23.6. Retain its LICENSE, THIRD_PARTY_NOTICES and bundled notices. These dated source/release observations establish the selected baseline, not a promise of future maintenance.

[The machine-readable toolchain record](site-toolchain.json) records versions, source/license pins and official release archive SHA256 digests. `.zola-version` and the existing checksum-verified Linux installer remain authoritative installer inputs; `npm run build` checks generator version and the committed/initialized theme pin. No tool or theme upgrade is part of this delivery. Follow [maintenance procedures](deployment.md) before upgrading.

## Reproduce locally

Use Node 24.19.0, npm 11.17.0, and Zola 0.23.6 on PATH. Clone recursively or initialize the pinned submodule. `package-lock.json` intentionally contains no npm dependencies; npm only dispatches the local checks/build. Installing npm dependencies does not install Zola.

```sh
git submodule update --init --recursive
npm ci --ignore-scripts
npm run check
zola check --skip-external-links
npm run build
node --test tests/site-build.test.mjs
```

The build writes `public/`. The test builds the actual site twice at `https://edit.ac/` and once at `https://docs.invalid/packed-docs/`, checks identical output hashes, generated page/HTML/CSS asset targets and search URLs, and removes its worktree-owned temporary outputs. External-link crawling is explicitly excluded; this does not qualify remote availability. These are static build checks, not editor runtime, native, accessibility or deployed-site qualification.

Production analytics is an explicitly configured optional Umami script at `cloud.umami.is`, enabled only for the exact production origin. It is absent from localhost and subpath previews; static documentation and search work without it. Builds do not fetch analytics or use a hidden backend. Existing publication configuration is unchanged; a local build never authorizes or proves deployment.

If the generator version differs, install the pinned version before retrying. If the theme is missing/mismatched, initialize its committed submodule; do not switch to upstream HEAD. Fix a broken URL in canonical content or a site-level override, retaining redirects for moved public pages. Preserve source and qualification logs; only generated `public/` and inactive `.site-build-test-*` outputs are reproducible cleanup candidates.
