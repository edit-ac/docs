// Deterministic public content and prepared host ports. No network service is contacted.
import { init } from '@edit-ac/core';
import { createEditor, CheckpointStorage } from '@edit-ac/web';
import { linkEnrichment } from '@edit-ac/web/links';
import { ReferenceLookupSession, referenceBlock, ServiceLifecycle } from '@edit-ac/web/modules';
import { createKickoff } from './kickoff.mjs';
export const fixtureUrl = 'https://example.invalid/project-kickoff';
export const target = { targetId: 'ac://team-1/12345678-1234-4234-8234-123456789abc', label: 'ASD-123' };
const identity = { documentId: crypto.randomUUID(), epoch: crypto.randomUUID(), schema: 'editac.registry.editor.v5', offsets: 'utf16', profile: 'editac.yrs-yjs.editor.v5', protocolVersion: 1, updateEncoding: 1 };
const runtime = await init('/engine.wasm');
const seed = createKickoff(runtime, { documentId: identity.documentId, epoch: identity.epoch });
const storage = await CheckpointStorage.open(indexedDB, 'extension-recipes');
try {
    await storage.publish(seed.checkpoint(), []);
}
finally {
    storage.close();
    seed.dispose();
}
let permission = { revision: 'permission:1', lookup: true, insert: true };
let policy = 'explicit-refresh', readonly = false, disposed = false, links;
const listeners = new Set(), referenceListeners = new Set(), pending = [], uploads = [];
const calls = { public: 0, private: 0, reference: 0, upload: 0 };
const scope = () => ({ document: identity.documentId, session: 'recipe:1', revision: JSON.stringify(editor.read().revision ?? editor.read().visible), permission: permission.revision, authorized: permission.insert && !readonly && !disposed });
const context = () => ({ principal: 'prepared-reader', tenant: 'prepared-team', authority: null, scope: { ...scope(), revision: 'host-policy:1' }, policyRevision: 'policy:1', readonly, capabilities: { publicMetadata: true, privateLookup: false, title: true, icon: false, preview: true, activate: false, publishMetadata: false } });
const options = { assetUrl: '/engine.wasm', databaseName: 'extension-recipes', identity, indexedDB, locks: navigator.locks, preset: 'minimal', links: linkEnrichment({ policy: () => policy, context, subscribe: cb => { listeners.add(cb); return () => listeners.delete(cb); }, attached: p => { links = p; }, ports: { publicMetadata: (request, signal) => { calls.public++; return new Promise(resolve => pending.push({ request, signal, resolve })); } } }) };
let editor = createEditor(document.querySelector('#editor'), options);
await editor.ready;
const lookup = new ReferenceLookupSession({ version: 1, permission: () => permission, catalog: id => ({ targetId: id, status: id === target.targetId ? 'cached' : 'unauthorized' }), resolve: () => { calls.reference++; return [target]; }, subscribe: cb => { referenceListeners.add(cb); return { dispose: () => referenceListeners.delete(cb) }; } }, () => { }, { context: () => scope() });
const service = new ServiceLifecycle(scope, { concurrency: 1, queue: 0, bytes: 1024, items: 1, deadlineMs: 30000 });
const recovery = new TextEncoder().encode('Project kickoff attachment\n');
const descriptor = { identity: { host: 'prepared', key: 'kickoff_notes' }, kind: 'file', metadata: { filename: 'notes.txt', mediaType: 'text/plain', byteLength: recovery.length, sha256: null, width: null, height: null, durationMs: null, alt: '', caption: '' }, fallback: 'notes.txt', source: '[notes.txt](fixture:notes)' };
function insert(block, origin) {
    const node = editor.read().visible.filter(n => n.kind === 'block').at(-1), at = editor.anchor(node.id, node.runs.reduce((n, r) => n + r.text.length, 0), 'right');
    try {
        const result = editor.commit({ kind: 'fragment', origin, range: { anchor: at, focus: at }, blocks: [block] });
        if (result.caret)
            editor.releaseAnchor(result.caret);
        return { revision: result.revision };
    }
    finally {
        editor.releaseAnchor(at);
    }
}
function selectEnd() { const node = editor.read().visible.filter(n => n.kind === 'block').at(-1); const el = document.querySelector(`[data-node-id="${node.id}"]`), range = document.createRange(); range.selectNodeContents(el); range.collapse(false); editor.root.focus(); getSelection().removeAllRanges(); getSelection().addRange(range); document.dispatchEvent(new Event('selectionchange')); }
export const recipe = {
    get editor() { return editor; },
    history(action) { selectEnd(); const target = editor.captureHistory(); try {
        return target?.execute(action);
    }
    finally {
        target?.dispose();
    } },
    state: () => ({ nodes: editor.read().visible, calls: { ...calls }, preview: document.querySelector('aside[aria-label="Link metadata"]')?.textContent ?? '', requests: pending.map(p => ({ origin: p.request.origin, target: p.request.target, aborted: p.signal.aborted })), uploads: uploads.map(p => ({ aborted: p.signal.aborted })), recovery: Array.from(recovery), service: service.state, listeners: listeners.size + referenceListeners.size, readonly, disposed }),
    refresh() { links.refresh(editor.read().visible.find(n => n.runs.some(r => r.text === 'Reference')).id); },
    respond(index = 0) { const p = pending[index]; p.resolve({ status: 'available', metadata: { kind: 'public', provider: 'prepared-fixture', requestedUrl: p.request.target.url, display: { title: 'Project kickoff preview', description: 'Prepared public metadata' } }, freshness: { fetchedAt: Date.now(), expiresAt: Date.now() + 60000, policyRevision: 'policy:1' } }); },
    setPolicy(value) { policy = value; for (const cb of listeners)
        cb(); },
    paste() { selectEnd(); return editor.paste({ getData: type => type === 'text/plain' ? fixtureUrl : '' }); },
    async reference() { const found = await lookup.search({ query: 'ASD-123', requestId: 1, signal: new AbortController().signal }); const admitted = found[0] && lookup.admit(found[0]); if (admitted)
        return insert(referenceBlock(admitted), 'recipe-reference'); return null; },
    deny() { permission = { revision: 'permission:2', lookup: false, insert: false }; for (const cb of [...referenceListeners, ...listeners])
        cb(); service.revalidate(); },
    readOnly() { readonly = true; editor.setReadOnly(true); service.revalidate(); },
    edit() { const node = editor.read().visible[1]; return editor.commit({ kind: 'editor', origin: 'recipe-edit', commands: [{ type: 'replaceAt', owner: node.id, from: 0, to: 11, text: 'Owner: Robin' }] }); },
    async upload(bytes = recovery.length) { const controller = new AbortController(), request = { scope: scope(), bytes, items: 1, deadline: performance.now() + 30000, signal: controller.signal }; const promise = service.run(request, signal => { calls.upload++; return new Promise(resolve => uploads.push({ signal, resolve })); }).then(result => { if (result.status === 'ready') {
        const commit = insert({ attributes: { type: 'content', tuple: ['module:editac.asset', 1, descriptor] }, runs: [{ text: 'notes.txt', marks: [] }], containers: [] }, 'recipe-upload');
        return { status: result.status, commit };
    } return result; }); return { cancel: () => controller.abort(), promise }; },
    finishUpload(index = 0) { uploads[index].resolve(descriptor); },
    async flush() { await editor.flush({ target: 'local' }); },
    async reopen() { await editor.flush({ target: 'local' }); await editor.destroy({ policy: 'flush' }); editor = createEditor(document.querySelector('#editor'), options); await editor.ready; return this.state(); },
    async close() { disposed = true; lookup.dispose(); service.dispose(); await editor.destroy({ policy: 'flush' }); return { listeners: listeners.size + referenceListeners.size, service: service.state, aborted: pending.every(p => p.signal.aborted), disposed }; }
};
window.recipe = recipe;
