import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite, siteRoot } from '../scripts/site-build.mjs';
for (const base of ['https://edit.ac/', 'https://docs.invalid/packed-docs/']) {
  test(`format downloads resolve in rendered HTML at ${base}`, () => {
    const work = mkdtempSync(join(siteRoot, '.formats-render-test-'));
    try {
      const output = join(work, "site");
      buildSite({ outputDir: output, baseUrl: base });
      let total = 0;
      for (const [name, count] of [['document-formats',1], ['format-support',10]]) {
        const html = readFileSync(join(output, `docs/guides/${name}/index.html`), 'utf8');
        const links = [...html.matchAll(/href="([^"]*formats-native\/v1\/[^\"]+)"/g)].map(x => x[1]);
        assert.equal(links.length, count);
        for (const url of links) {
          assert.ok(url.startsWith(`${base}formats-native/v1/`), url);
          assert.ok(existsSync(join(output, url.slice(base.length))), url);
        }
        total += links.length;
      }
      assert.equal(total, 11);
    } finally { rmSync(work, { recursive: true, force: true }); }
  });
}
