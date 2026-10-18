import { init } from '@edit-ac/core';
import { createEditor, CheckpointStorage } from '@edit-ac/web';

// Production engine, storage, history and anchors own all state. These functions
// are this downloadable host consumer, not additional SDK methods.
const assetUrl = new URL('/core/wasm/editac_wasm_bg.wasm', location.href).href;
const runtime = await init(assetUrl);
let editor;
export const initialTexts = ['Project kickoff', 'Owner: Alex', 'Due Friday', 'Draft agenda', 'Confirm attendees', 'Reference'];
export async function mount({ code = false } = {}) {
  if (editor) await editor.destroy({ policy: 'flush' });
  const engine = runtime.createEngine({ profile: 'v5', documentId: crypto.randomUUID(), epoch: crypto.randomUUID(), nodes: initialTexts.map(text => ({ text })) });
  let checkpoint;
  try {
    const ids = engine.read().visible.filter(n => n.kind === 'block').map(n => n.id);
    engine.commit(engine.prepare({ kind: 'format', origin: 'seed', marks: [], blocks: [{ targets: [ids[0]], attributes: { type: 'heading', level: 1 }, action: 'apply' }] }));
    engine.commit(engine.prepare({ kind: 'editor', origin: 'seed', commands: [{ type: 'wrap', targets: ids.slice(3,5), style: { type: 'checklist' } }, { type: 'markAt', owner: ids[2], from: 4, to: 10, mark: 'bold', action: 'apply' }, { type: 'markAt', owner: ids[5], from: 0, to: 9, mark: 'link', action: 'apply', href: 'https://example.invalid/project-kickoff' }] }));
    if (code) {
      const a = engine.anchor(ids[2],0), b = engine.anchor(ids[2],10);
      try { engine.commit(engine.prepare({ kind: 'fragment', origin: 'seed-code', range: { anchor:a, focus:b }, blocks: [{ attributes: {type:'code', language:'text'}, runs:[{text:'Due Friday',marks:[]}] }] })); }
      finally { engine.releaseAnchor(a); engine.releaseAnchor(b); }
    }
    checkpoint = engine.checkpoint();
  } finally { engine.dispose(); }
  const databaseName = `docs-commands-${crypto.randomUUID()}`;
  const store = await CheckpointStorage.open(indexedDB, databaseName);
  try { await store.publish(checkpoint, []); } finally { store.close(); }
  editor = createEditor(document.getElementById('editor'), { assetUrl, identity: checkpoint.identity, databaseName, indexedDB, locks: navigator.locks, extensions: [], formatting: { marks: { italic: { commands:false, shortcuts:false, controls:false } } } });
  await editor.ready;
  select(2,4,10);
  return snapshot();
}
export const blocks = () => editor.read().visible.filter(n => n.kind === 'block');
export function select(index, start, end = start) {
  const node = blocks()[index];
  const element = editor.root.querySelector(`[data-node-id="${node.id}"]`);
  const point = offset => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let text;
    while (text = walker.nextNode()) { if (offset <= text.length) return [text,offset]; offset -= text.length; }
    throw Error('Selection outside fixture text');
  };
  editor.root.focus();
  document.getSelection().setBaseAndExtent(...point(start),...point(end));
  document.dispatchEvent(new Event('selectionchange'));
}
export function selection() {
  const native = document.getSelection();
  const point = (node,offset) => {
    const element = (node.nodeType === Node.TEXT_NODE ? node.parentElement : node).closest('[data-node-id]');
    const range = document.createRange();range.selectNodeContents(element);range.setEnd(node,offset);
    return {block:blocks().findIndex(n=>n.id===element.dataset.nodeId),offset:range.toString().length};
  };
  return {anchor:point(native.anchorNode,native.anchorOffset),focus:point(native.focusNode,native.focusOffset),text:native.toString()};
}
export function snapshot() {
  return { blocks: blocks().map(n => ({text:n.runs.map(r=>r.text).join(''),runs:n.runs.map(r=>({text:r.text,attributes:r.attributes})),attributes:n.blockAttributes,container:editor.read().visible.find(parent=>parent.id===n.parent)?.editor?.containerAttributes??null,checked:n.editor?.checked??null})), selection:selection() };
}
// snippet:format:start
export function command(name, text) {
  const target = editor.captureCommand(name);
  if (!target) return { disposition:'unavailable' }; // consumer status, not CommandResult
  try { return target.execute(text); } finally { target.dispose(); }
}
// snippet:format:end
// snippet:history:start
export function history(action) {
  editor.root.focus();
  const target = editor.captureHistory();
  if (!target) return { disposition:'unavailable' };
  try { return target.execute(action); } finally { target.dispose(); }
}
// snippet:history:end
export function releaseResult(result) {
  if (result.caret) editor.releaseAnchor(result.caret);
  if (result.selection) { editor.releaseAnchor(result.selection.anchor);editor.releaseAnchor(result.selection.focus); }
}
// snippet:heading:start
export function heading(level) {
  const request = {kind:'format',origin:'docs:heading',marks:[],blocks:[{targets:[blocks()[0].id],attributes:{type:'heading',level},action:'apply'}]};
  if (!editor.can(request)) return false;
  releaseResult(editor.commit(request));return true;
}
// snippet:heading:end
// snippet:list:start
export function list(type) {
  const request = {kind:'editor',origin:'docs:list',commands:[{type:'setStyle',container:editor.read().visible.find(n=>n.kind==='list').id,style:{type}}]};
  if (!editor.can(request)) return false;
  releaseResult(editor.commit(request));return true;
}
// snippet:list:end
export async function close() { if (editor) { await editor.destroy({policy:'flush'});editor=undefined; } }
window.commandsExample = {mount,blocks,select,selection,snapshot,command,history,heading,list,releaseResult,close,get editor(){return editor;}};
