import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFile, writeFile, mkdir, cp, rm, realpath } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
const output = resolve(process.env.DOCS_EXTENSIONS_OUTPUT || 'evidence/extensions-resolvers-20261018/run');
const work = resolve('.extensions-resolvers-work');
const hash = b => createHash('sha256').update(b).digest('hex');
const candidateRoot = resolve('../architecture/evidence/local-consumer-return/20261018');
const facts = { kind: 'real installed production editor with prepared host transports; no durable service qualification', commands: [], packages: [], sources: [], cases: [], teardown: {} };
let browser, server, base, bootstrapFailure;
const logRun = (cmd, args, cwd, label) => { const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 * 1024 }); const log = (r.stdout ?? '') + (r.stderr ?? ''); return writeFile(join(output, label + '.log'), log).then(() => { facts.commands.push({ cmd, args, exit: r.status, error: r.error?.message, log: label + '.log', sha256: hash(log) }); assert.equal(r.status, 0, label); assert.equal(r.error, undefined); }); };
before(async () => {
    assert.equal(process.version, 'v24.19.0');
    await mkdir(output, { recursive: true });
    await mkdir(work);
    await mkdir(join(work, 'public'));
    const raw = await readFile(join(candidateRoot, 'local-candidates-v5.json'));
    assert.equal(hash(raw), '27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729');
    const candidate = JSON.parse(raw).candidates.find(c => c.id === 'extension-authoring-v1');
    facts.candidate = candidate.id;
    facts.sourceCommit = candidate.sourceCommit;
    facts.candidateManifestSha256 = hash(raw);
    const dependencies = { esbuild: '0.25.12' };
    for (const pin of candidate.packages) {
        const bytes = await readFile(join(candidateRoot, pin.path));
        assert.equal(hash(bytes), pin.sha256);
        dependencies[pin.name] = 'file:' + join(candidateRoot, pin.path);
        facts.packages.push(pin);
    }
    await writeFile(join(work, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies }));
    await logRun('npm', ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund'], work, 'install');
    for (const file of ['recipes.mjs', 'kickoff.mjs']) {
        const bytes = await readFile('examples/extensions/' + file);
        facts.sources.push({ path: 'examples/extensions/' + file, sha256: hash(bytes) });
        await writeFile(join(work, file), bytes);
    }
    for (const name of ['core', 'web'])
        assert.equal(await realpath(join(work, 'node_modules/@edit-ac/' + name)), join(work, 'node_modules/@edit-ac/' + name));
    await logRun(join(work, 'node_modules/.bin/esbuild'), ['recipes.mjs', '--bundle', '--format=esm', '--outfile=public/recipes.mjs', '--metafile=public/build.json'], work, 'build');
    await cp(join(work, 'node_modules/@edit-ac/core/dist/wasm/editac_wasm_bg.wasm'), join(work, 'public/engine.wasm'));
    await writeFile(join(work, 'public/index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><title>Prepared extension recipes</title><h1>Project kickoff extension recipes</h1><div id="editor"></div><script type="module" src="/recipes.mjs"></script></html>');
    server = createServer(async (req, res) => { try {
        const path = new URL(req.url, 'http://localhost').pathname;
        assert.ok(['/', '/recipes.mjs', '/engine.wasm'].includes(path));
        res.setHeader('Content-Type', path.endsWith('.wasm') ? 'application/wasm' : path.endsWith('.mjs') ? 'text/javascript' : 'text/html');
        res.end(await readFile(join(work, 'public', path === '/' ? 'index.html' : path.slice(1))));
    }
    catch {
        res.writeHead(404).end();
    } });
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    base = 'http://127.0.0.1:' + server.address().port;
    facts.server = { pid: process.pid, port: server.address().port, base };
    const { chromium } = await import(pathToFileURL(resolve('../core/node_modules/playwright/index.mjs')));
    browser = await chromium.launch({ headless: true });
    facts.browser = browser.version();
});
after(async () => {
    try {
        await browser?.close();
        facts.teardown.browserClosed = !browser?.isConnected();
        if (server)
            await new Promise(r => server.close(r));
        facts.teardown.serverClosed = !server?.listening;
        if (facts.commands.length)
            await logRun('tar', ['-czf', join(output, 'compiled-consumer.tgz'), '-C', work, 'public', 'package.json', 'package-lock.json'], process.cwd(), 'archive');
    }
    finally {
        await writeFile(join(output, 'harness.json'), JSON.stringify(facts, null, 2) + '\n');
        await rm(work, { recursive: true, force: true });
    }
});
async function probe(name, body) {
    assert.ifError(bootstrapFailure);
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const fact = { name, requests: [], snapshots: [], errors: [], passed: false };
    facts.cases.push(fact);
    page.on('pageerror', e => fact.errors.push(e.message));
    await ctx.route('**/*', route => { fact.requests.push(route.request().url()); return new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(); });
    try {
        await page.goto(base);
        try {
            await Promise.race([page.waitForFunction(() => !!window.recipe, null, { timeout: 10000 }), new Promise((_, reject) => page.once('pageerror', error => reject(error)))]);
        }
        catch (error) {
            bootstrapFailure = error;
            throw error;
        }
        fact.snapshots.push(await page.evaluate(() => recipe.state()));
        await body(page, fact);
        fact.snapshots.push(await page.evaluate(() => recipe.state()));
        assert.deepEqual(fact.errors, []);
        assert.ok(fact.requests.every(u => new URL(u).hostname === '127.0.0.1'));
        fact.passed = true;
    }
    catch(error){ if(await page.evaluate(()=>!!window.recipe))fact.failureState=await page.evaluate(()=>recipe.state());throw error; }
    finally {
        try {
            if (await page.evaluate(() => !!window.recipe)) {
                fact.cleanup = await page.evaluate(() => recipe.close());
                assert.equal(fact.cleanup.listeners, 0);
                assert.equal(fact.cleanup.service.active, 0);
                assert.equal(fact.cleanup.service.queued, 0);
                assert.equal(fact.cleanup.service.disposed, true);
            }
        }
        finally {
            await ctx.close();
        }
    }
}
const state = page => page.evaluate(() => recipe.state());
const text = s => s.nodes.filter(n => n.kind === 'block').map(n => n.runs.map(r => r.text).join('')).join('\n');
const settle = () => new Promise(r => setTimeout(r, 0));
test('opening real Project kickoff editor performs zero resolver/upload calls', () => probe('inert-open', async (page) => { const s = await state(page); assert.equal(text(s), 'Project kickoff\nOwner: Alex\nDue Friday\nDraft agenda\nConfirm attendees\nReference'); assert.deepEqual(s.calls, { public: 0, private: 0, reference: 0, upload: 0 }); }));
test('explicit public metadata preview leaves semantic document unchanged', () => probe('public-preview', async (page) => { const before = await state(page); await page.evaluate(() => recipe.refresh()); await page.waitForFunction(() => recipe.state().calls.public === 1); await page.evaluate(() => recipe.respond()); await page.waitForFunction(() => recipe.state().preview.includes('Project kickoff preview')); const after = await state(page); assert.deepEqual(after.nodes, before.nodes); assert.equal(after.requests[0].origin, 'explicit-refresh'); assert.deepEqual(after.requests[0].target, { kind: 'public', url: 'https://example.invalid/project-kickoff' }); }));
test('disabled automatic metadata policy makes no call on local paste', () => probe('disabled-paste', async (page) => { await page.evaluate(() => { recipe.setPolicy('disabled'); recipe.paste(); }); const s = await state(page); assert.equal(s.calls.public, 0); assert.ok(text(s).includes('https://example.invalid/project-kickoff')); }));
test('local-paste opt-in renders metadata without replacing authored text', () => probe('local-paste', async (page) => { await page.evaluate(() => { recipe.setPolicy('local-paste'); recipe.paste(); }); await page.waitForFunction(() => recipe.state().calls.public === 1); const before = await state(page); await page.evaluate(() => recipe.respond()); await page.waitForFunction(() => recipe.state().preview.includes('Project kickoff preview')); const s = await state(page); assert.deepEqual(s.nodes, before.nodes); assert.equal(s.requests[0].origin, 'local-paste'); }));
test('internal permission denial never calls search or public metadata fallback', () => probe('internal-denial', async (page) => { const before = await state(page); const result = await page.evaluate(async () => { recipe.deny(); try {
    return await recipe.reference();
}
catch (e) {
    return { denied: e.message };
} }); const s = await state(page); assert.ok(result === null || result.denied); assert.deepEqual(s.calls, { public: 0, private: 0, reference: 0, upload: 0 }); assert.deepEqual(s.nodes, before.nodes); }));
test('custom reference is admitted by catalog and inserted through engine once', () => probe('custom-reference', async (page) => { await page.evaluate(() => recipe.reference()); const s = await state(page); assert.equal(s.calls.reference, 1); const n = s.nodes.find(n => n.blockAttributes?.[0] === 'module:editac.reference'); assert.ok(n); assert.deepEqual(n.blockAttributes, ['module:editac.reference', 1, { targetId: 'ac://team-1/12345678-1234-4234-8234-123456789abc', label: 'ASD-123' }]); assert.ok(text(s).includes('ASD-123')); await page.evaluate(() => recipe.flush()); const reopened = await page.evaluate(() => recipe.reopen()); assert.deepEqual(reopened.nodes, s.nodes); }));
test('cancelled prepared upload retains recovery bytes and rejects late result; retry succeeds', () => probe('upload-cancel-recovery', async (page) => { const before = await state(page); await page.evaluate(async () => { window.upload = await recipe.upload(); upload.cancel(); window.cancelled = await upload.promise; recipe.finishUpload(); }); assert.equal(await page.evaluate(() => cancelled.status), 'cancelled'); await page.waitForFunction(() => recipe.state().service.active === 0); const cancelled = await state(page); assert.deepEqual(cancelled.nodes, before.nodes); assert.deepEqual(cancelled.recovery, Array.from(new TextEncoder().encode('Project kickoff attachment\n'))); assert.equal(cancelled.uploads[0].aborted, true); await page.evaluate(async () => { window.retry = await recipe.upload(); recipe.finishUpload(1); window.recovered = await retry.promise; }); assert.equal(await page.evaluate(() => recovered.status), 'ready'); const after = await state(page); assert.ok(after.nodes.some(n => n.blockAttributes?.[0] === 'module:editac.asset')); assert.equal(after.calls.upload, 2); assert.deepEqual(after.recovery, before.recovery); await page.evaluate(() => recipe.flush()); const reopened = await page.evaluate(() => recipe.reopen()); assert.deepEqual(reopened.nodes, after.nodes); }));
for (const action of ['deny', 'readOnly', 'edit'])
    test(`${action} invalidates pending upload before semantic insertion`, () => probe('upload-' + action, async (page) => { await page.evaluate(async (action) => { window.upload = await recipe.upload(); recipe[action](); recipe.finishUpload(); window.outcome = await upload.promise; }, action); assert.notEqual(await page.evaluate(() => outcome.status), 'ready'); await page.waitForFunction(() => recipe.state().service.active === 0); const s = await state(page); assert.ok(!s.nodes.some(n => n.blockAttributes?.[0] === 'module:editac.asset')); if (action === 'edit')
        assert.ok(text(s).includes('Owner: Robin')); }));
test('late metadata result after readonly transition cannot change content', () => probe('stale-preview', async (page) => { await page.evaluate(() => recipe.refresh()); const before = await state(page); await page.evaluate(() => { recipe.readOnly(); recipe.respond(); }); await settle(); assert.deepEqual((await state(page)).nodes, before.nodes); assert.ok(!(await state(page)).preview.includes('Project kickoff preview')); }));
test('service policy rejects oversized upload without calling host', () => probe('upload-limit', async (page) => { const before = await state(page); assert.equal(await page.evaluate(async () => { const u = await recipe.upload(1025); return (await u.promise).status; }), 'resource-limit'); const s = await state(page); assert.deepEqual(s.calls, before.calls); assert.deepEqual(s.nodes, before.nodes); }));
test('reference insertion uses ordinary undo and redo', () => probe('reference-history', async (page) => { const before = await state(page); await page.evaluate(() => recipe.reference()); const inserted = await state(page); assert.notDeepEqual(inserted.nodes, before.nodes); assert.equal((await page.evaluate(() => recipe.history('undo'))).disposition, 'committed'); assert.equal(text(await state(page)), text(before)); assert.equal((await page.evaluate(() => recipe.history('redo'))).disposition, 'committed'); assert.equal(text(await state(page)), text(inserted)); }));
