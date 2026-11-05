# Checked task recipes

These local-only source overlays reuse owning consumers. No new SDK loader,
semantic model, synchronization or history implementation lives here. Exact SDK
0.0.0 unpublished profiles differ: toolbar uses PIN-1.3; quickstarts and shared
resources use sdk-framework-v1. Never mix same-version packages across families.

The current `toolbar.mjs` source adopts the optional product styles and frozen
part hooks under UIS-1.5. Load `@edit-ac/web/styles.css` and
`@edit-ac/web/ui.css` in its host. Select text, press Escape, then Tab to Bold
and press Enter; plain Tab inside the editor indents. Its focused command proof
belongs to the current core selector `node scripts/ui-integration-delivery.mjs
UIS-1.5`, not the historical PIN-1.3 receipt.

Run `python3 scripts/prepare-recipes.py --toolbar-source-only` to derive the
complete current source and its hash/import manifest in ignored
`.artifacts/toolbar-source/`. This is source inspection with zero runtime cases.
It leaves retained manifests, snippets, downloads and qualification bytes intact.
Those historical outputs describe their pinned source, not this changed toolbar.
Default historical regeneration rejects changed toolbar source until the docs
owner explicitly requalifies that profile; do not copy current hashes into old
receipts or combine its runtime members with the current engine.

Use Node24.19.0/npm11.17.0 and installed Playwright1.64.0. Run from docs:

```sh
export PATH="$HOME/.nvm/versions/node/v24.19.0/bin:$PATH"
python3 scripts/prepare-recipes.py
DOCS_PLAYWRIGHT_MODULE="$PWD/../core/node_modules/playwright/index.mjs" \
  DOCS_RECIPES_OUTPUT="$PWD/evidence/recipes-20261018/run-1" \
  node --test tests/docs-recipes.test.mjs
```

The named check authenticates all 78 retained SHR cells, source blobs and artifact
bodies, then executes independent Chromium toolbar, paste, shared save/failure,
loading retry, cancelled waiter and route navigation cases. Retained matrix admission is integrity
only, not 78 new runtime executions. The owning canonical local-editor and
collaboration suites prove separate-copy recovery and prepared reconnect.

`upstream` contains exact unchanged SDK-1.10 consumer sources from the immutable
commit in shared-profile.json. The shared harness serves actual production
package members plus the retained production Astro site and graph, with isolated
IndexedDB identities. It uses ephemeral loopback ports, blocks external requests,
and closes contexts/browser/server and removes extracted packages in finally.
Full navigation creates a fresh realm; cache behavior depends on host policy.
Tests use prepared failures and synthetic paste, not OS or service qualification.

`prepare-recipes.py` derives snippets, pages, source ZIP and manifests. Its check
mode rejects drift. Sources, fixture hashes, qualified profiles, expected outcomes
and cleanup are explicit. Source downloads overlay the admitted docs workspace;
retained tarballs and tool/browser dependencies remain required, not published.
All fixtures are Apache-2.0. No credentials, providers, publication or deployment.
