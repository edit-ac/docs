// Optional local UI qualification. Supply an already installed, pinned Playwright
// module explicitly; never install browsers or contact services from this runner.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildSite, siteRoot } from '../scripts/site-build.mjs';
let server, browser, context, page, temporary, output, base;
const errors = [], external = [], observations = [];
const artifacts = process.env.DOCS_UI_ARTIFACTS;
const observe = (name, result) => observations.push({ name, result, mode: 'headless Chromium; prepared local static site; no OS/AT qualification' });
before(async () => {
  assert.ok(process.env.DOCS_PLAYWRIGHT_MODULE, 'Set DOCS_PLAYWRIGHT_MODULE to the exact installed Playwright index.mjs; no automatic install');
  const { chromium } = await import(pathToFileURL(resolve(process.env.DOCS_PLAYWRIGHT_MODULE)));
  temporary = mkdtempSync(join(siteRoot, '.site-build-test-ui-')); output = join(temporary, 'site');
  server = createServer((req, res) => {
    let path = resolve(output, '.' + new URL(req.url, base).pathname);
    if (path != output && !path.startsWith(output + sep)) { res.writeHead(403).end(); return; }
    if (!extname(path)) path = join(path, 'index.html');
    try {
      const type = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml' }[extname(path)] || 'application/octet-stream';
      res.writeHead(200, { 'content-type': type }).end(readFileSync(path));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((ok, fail) => { server.once('error', fail); server.listen(0, '127.0.0.1', ok); });
  base = `http://127.0.0.1:${server.address().port}/`;
  buildSite({ outputDir: output, baseUrl: base });
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/*', route => {
    if (route.request().url().startsWith(base)) return route.continue();
    external.push(route.request().url()); return route.abort();
  });
  page = await context.newPage(); page.setDefaultTimeout(10000); page.on('pageerror', e => errors.push(e.message));
});
after(async () => {
  try {
    if (artifacts) { mkdirSync(artifacts, {recursive:true}); writeFileSync(join(artifacts, 'browser-observations.json'), JSON.stringify({observations, errors, externalRequestsBlocked:external, browserVersion:browser?.version(), port:server?.address()?.port, cleanup:'Browser/context and HTTP server closed in finally; temporary output removed.'}, null, 2)+'\n'); }
  } finally {
    try { await context?.close(); } finally {
      try { await browser?.close(); } finally {
        if (server) await new Promise(ok=>server.close(ok));
        if (temporary) rmSync(temporary, {recursive:true,force:true});
      }
    }
  }
});

test('homepage reaches the documentation reader without an external destination', async () => {
  const response = await page.goto(base); assert.equal(response.status(), 200);
  if (artifacts) await page.screenshot({path:join(artifacts,'homepage.png'),fullPage:true});
  await page.getByRole('link', {name:'Explore the docs', exact:true}).click();
  await page.waitForURL(base+'docs/');
  assert.equal(await page.locator('h1').textContent(), 'Build with edit.ac');
  observe('homepage', 'Docs opens local /docs/ with reader landing');
});
test('desktop reader exposes all nine section links and opens a platform path', async () => {
  await page.goto(base+'docs/');
  const sections = ['getting-started','concepts','extensions','reference','guides','examples','migrate','compare','troubleshooting'];
  for (const section of sections) assert.equal(await page.locator(`#docs-sidebar a[href="${base}docs/${section}/"]`).count(), 1);
  await page.locator(`#docs-sidebar a[href="${base}docs/getting-started/"]`).click();
  await page.waitForURL(base+'docs/getting-started/');
  await page.locator('main a').filter({hasText:/^Astro$/}).click();
  await page.waitForURL(base+'docs/getting-started/astro/');
  assert.match(await page.locator('main').innerText(), /without React/);
  if (artifacts) await page.screenshot({path:join(artifacts,'desktop.png'),fullPage:true});
  observe('desktop', 'All nine sidebar destinations present; Getting started → Astro opens local planned page');
});
test('search returns planned material and keyboard selection opens its actual page', async () => {
  await page.goto(base+'docs/getting-started/astro/');
  const input = page.locator('[data-search-input]'); await input.fill('Migrate');
  const result = page.locator('.site-search-result').filter({hasText:/Migrate to edit.ac/}).first();
  await result.waitFor({state:'visible'});
  await input.press('ArrowDown');
  assert.ok(await input.getAttribute('aria-activedescendant'));
  await input.press('Escape'); assert.equal(await input.getAttribute('aria-expanded'), 'false');
  await input.fill('Astro'); await page.locator('.site-search-result').first().waitFor({state:'visible'});
  await input.press('ArrowDown'); await input.press('Enter');
  await page.waitForURL(/\/docs\//);
  assert.match(await page.locator('main').innerText(), /Astro/);
  observe('search keyboard', 'Migrate result visible; ArrowDown sets active descendant; Escape closes; Astro Enter opens a result');
});
test('mobile-width menu opens navigates and closes using keyboard without horizontal overflow', async () => {
  await page.setViewportSize({width:390,height:844}); await page.goto(base+'docs/');
  const toggle = page.locator('[data-site-menu-toggle]'); await toggle.focus(); await toggle.press('Enter');
  const menu = page.locator('[data-site-menu]');
  await menu.waitFor({state:'visible'}); assert.equal(await menu.getAttribute('aria-hidden'), 'false');
  const link = menu.locator(`a[href="${base}docs/troubleshooting/"]`);
  await link.click(); await page.waitForURL(base+'docs/troubleshooting/');
  assert.equal(await page.locator('h1').textContent(), 'Troubleshooting');
  await toggle.focus(); await toggle.press('Enter'); await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-hidden'), 'true');
  const widths = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(widths.scroll <= widths.viewport, JSON.stringify(widths));
  if (artifacts) await page.screenshot({path:join(artifacts,'mobile.png'),fullPage:true});
  observe('mobile width', '390×844 keyboard menu open; Troubleshooting link resolves; Escape closes; no horizontal overflow');
});
test('existing guide URL remains readable and browser reports no JS or external-resource errors', async () => {
  await page.goto(base+'docs/guides/getting-started/');
  assert.equal(await page.locator('h1').textContent(), 'Choose an integration path');
  assert.match(await page.locator('main').innerText(), /Plan adoption/);
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  observe('preserved guide', 'Existing getting-started URL and adoption links readable; no JS errors or attempted external requests');
});
