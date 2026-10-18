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
test('versioned API entry renders signatures and local source downloads on desktop and mobile width', async () => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'docs/reference/');
  await page.locator('main a').filter({hasText:/^Document$/}).click();
  await page.waitForURL(base+'docs/reference/api-document/');
  assert.match(await page.locator('main').innerText(), /commit\(request: PrepareRequest\): CommitResult;/);
  assert.match(await page.locator('main').innerText(), /unpublished local packed artifact/);
  const link = page.locator('main a').filter({hasText:'Complete declaration module'}).first();
  const response = await page.request.get(new URL(await link.getAttribute('href'), base).href);
  assert.equal(response.status(), 200); assert.match(await response.text(), /export declare class BrowserEditor/);
  const manifest = await page.request.get(base+'reference-inputs/local-pin-1.3/manifest.json');
  assert.equal(manifest.status(),200); assert.equal((await manifest.json()).inputs.length,141);
  await page.setViewportSize({width:390,height:844});
  const widths = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(widths.scroll <= widths.viewport, JSON.stringify(widths));
  if (artifacts) await page.screenshot({path:join(artifacts,'reference-mobile.png'),fullPage:true});
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  observe('API reference', 'Desktop navigation opens exact packed declaration; declaration/manifest downloads return200; mobile-width page has no horizontal overflow');
});

test('concept walkthrough links all lessons and serves versioned transcript with honest maturity at mobile width', async () => {
  await page.setViewportSize({width:1440,height:1000}); await page.goto(base+'docs/concepts/');
  assert.match(await page.locator('main').innerText(), /conceptual walkthroughs delivered/);
  await page.locator('main a').filter({hasText:/^Selection, commands and history$/}).click();
  await page.waitForURL(base+'docs/concepts/editing/');
  const content = await page.locator('main').innerText();
  for (const id of ['PK-02','PK-03','PK-04','PK-05','PK-06','PK-07','PK-08','PK-14','PK-15']) assert.ok(content.includes(id));
  const response = await page.request.get(base+'concepts/project-kickoff-v1/transcript.json');
  assert.equal(response.status(), 200); const transcript = await response.json();
  assert.equal(transcript.runtimeQualified, false); assert.equal(transcript.steps.length, 16);
  await page.setViewportSize({width:390,height:844});
  const widths = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(widths.scroll <= widths.viewport, JSON.stringify(widths));
  if (artifacts) await page.screenshot({path:join(artifacts,'concepts-mobile.png'),fullPage:true});
  await page.goto(base+'docs/concepts/persistence/');
  assert.match(await page.locator('main').innerText(), /localCommitted/);
  assert.match(await page.locator('main').innerText(), /remoteCommitted/);
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  observe('concept walkthrough', 'Desktop lesson opens; sixteen-row conceptual transcript downloads; 390px lesson has no horizontal overflow; persistence labels remain distinct');
});

test('command walkthrough exposes real packed snippets and a complete consumer on desktop and mobile', async () => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'docs/reference/commands/');
  assert.equal(await page.locator('h1').textContent(),'Commands and selection');
  assert.match(await page.locator('main').innerText(),/local packed browser consumer/);
  assert.match(await page.locator('main pre').first().innerText(),/captureCommand\(name\)/);
  await page.locator('main a').filter({hasText:'complete example'}).first().click();
  await page.waitForURL(base+'docs/examples/commands/');
  const link=page.locator('main a').filter({hasText:'Complete browser consumer'});
  const href=new URL(await link.getAttribute('href'),base).href;assert.equal(href,base+'reference-inputs/commands-v1/consumer.mjs');
  const response=await context.request.get(href);assert.equal(response.status(),200);
  assert.match(await response.text(),/await editor\.ready/);
  if(artifacts) await page.screenshot({path:join(artifacts,'commands-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.goto(base+'docs/reference/selection/');
  assert.match(await page.locator('main').innerText(),/anchor 10 and focus 4/);
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
  assert.ok(widths.scroll<=widths.viewport,JSON.stringify(widths));
  if(artifacts) await page.screenshot({path:join(artifacts,'selection-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  observe('commands consumer','Versioned snippet and source download; selection guide readable at 390px; no external requests');
});
