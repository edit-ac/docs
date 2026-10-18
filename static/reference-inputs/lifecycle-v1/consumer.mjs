import { init } from '@edit-ac/core';
import { createEditor, CheckpointStorage } from '@edit-ac/web';
// Test-only host recovery port delegates to the exact installed production owner.
// This internal module is not advertised as a new public SDK entry point.
import { recoverLocalDocument } from '/web/entry.js';

const assetUrl = new URL('/core/wasm/editac_wasm_bg.wasm', location.href).href;
const root = document.getElementById('editor');
const indicator = document.getElementById('save-status');
const initialTexts = ['Project kickoff', 'Owner: Alex', 'Due Friday', 'Draft agenda', 'Confirm attendees', 'Reference'];
let editor, record, off = [], generation = 0, releaseRecovery, releaseFlush;
const timeline = [], resources = { opened:0, closed:0, live:0, peak:0, recoveries:0, disposed:0, subscriptions:0 };
const fault = { save:false, holdRecovery:false, holdFlush:false, flushHeld:false };
const log = (type, detail={}) => timeline.push({ type, generation, ...detail });
const serialState = state => ({ ...state, error:state.error ? { name:state.error.name, message:state.error.message } : null });

// A prepared host fault at the IDB boundary. All successful transactions, bytes,
// journal receipts and recovery still come from the real installed implementation.
const factory = {
  open(...args) {
    const request = indexedDB.open(...args);
    request.addEventListener('success', () => {
      const database = request.result;
      resources.opened++; resources.live++; resources.peak=Math.max(resources.peak, resources.live);
      const transaction = database.transaction.bind(database), close = database.close.bind(database);
      let closed=false;
      database.transaction = (stores, mode, options) => {
        if (fault.save && mode==='readwrite' && (stores==='updates' || Array.from(stores).includes('updates')))
          throw new DOMException('Prepared local quota failure', 'QuotaExceededError');
        return transaction(stores,mode,options);
      };
      database.close = () => { if(!closed) { closed=true; resources.closed++; resources.live--; } close(); };
    });
    return request;
  }
};

export async function seed(checkpoint) {
  if (checkpoint) {
    record={ identity:checkpoint.identity, databaseName:`docs-lifecycle-recovery-${crypto.randomUUID()}` };
  } else {
    const runtime=await init(assetUrl);
    const engine=runtime.createEngine({ profile:'v5', documentId:crypto.randomUUID(), epoch:crypto.randomUUID(), nodes:initialTexts.map(text=>({text})) });
    try {
      const ids=engine.read().visible.filter(n=>n.kind==='block').map(n=>n.id);
      engine.commit(engine.prepare({kind:'format',origin:'seed',marks:[],blocks:[{targets:[ids[0]],attributes:{type:'heading',level:1},action:'apply'}]}));
      engine.commit(engine.prepare({kind:'editor',origin:'seed',commands:[{type:'wrap',targets:ids.slice(3,5),style:{type:'checklist'}},{type:'markAt',owner:ids[2],from:4,to:10,mark:'bold',action:'apply'},{type:'markAt',owner:ids[5],from:0,to:9,mark:'link',action:'apply',href:'https://example.invalid/project-kickoff'}]}));
      checkpoint=engine.checkpoint();
      record={identity:checkpoint.identity,databaseName:`docs-lifecycle-${crypto.randomUUID()}`};
    } finally { engine.dispose(); }
  }
  const store=await CheckpointStorage.open(indexedDB,record.databaseName);
  try { await store.publish(checkpoint,[]); } finally { store.close(); }
  return record;
}

async function recover(options) {
  resources.recoveries++;
  if (fault.holdRecovery) await new Promise(resolve=>{releaseRecovery=resolve;});
  const session=await recoverLocalDocument(options);
  const flush=session.storage.flush.bind(session.storage);
  session.storage.flush=async options=>{
    await flush(options);
    if(fault.holdFlush) {fault.flushHeld=true;await new Promise(resolve=>{releaseFlush=resolve;});fault.flushHeld=false;}
  };
  const destroy=session.storage.destroy.bind(session.storage);
  session.storage.destroy=async options=>{ const report=await destroy(options); resources.disposed++; return report; };
  return session;
}
function subscription(dispose) {
  resources.subscriptions++;
  let active=true;
  return () => { if(active) { active=false;resources.subscriptions--;dispose(); } };
}
// snippet:open:start
export function open(options={}) {
  if(editor && editor.state.phase!=='destroyed') throw Error('Dispose before remount');
  if(options.record) record=options.record;
  generation++;
  editor=createEditor(root,{...record,assetUrl:options.assetUrl??assetUrl,indexedDB:factory,locks:navigator.locks,extensions:[],plainPasteControl:false,recover});
  log('created',{state:serialState(editor.state)});
  indicator.textContent='Opening local document';
  off.push(subscription(editor.subscribe(state=>{
    log('lifecycle',{state:serialState(state)});
    // A lifecycle event can retain an older receipt while a newer edit is pending.
    // Only save()'s captured flush barrier authorizes this host's Saved label.
    if(state.error) indicator.textContent='Save failed; preserve recovery export';
  })));
  return editor.ready.then(()=>{
    off.push(subscription(editor.subscribe({type:'updates'},patch=>{
      log('document',{operation:patch.operation,revision:patch.revision,sequence:patch.sequence});
      indicator.textContent='Unsaved local changes';
    })));
    // Host DOM notification, deliberately separate from an SDK Patch. The
    // packaged API does not automatically mirror native selections into patches.
    const selected=()=>{const selection=document.getSelection();if(selection?.anchorNode && root.contains(selection.anchorNode))log('selection',{source:'DOM selectionchange',text:selection.toString()});};
    document.addEventListener('selectionchange',selected);
    off.push(subscription(()=>document.removeEventListener('selectionchange',selected)));
    indicator.textContent='Ready locally; remote save not configured';
    return snapshot();
  });
}
// snippet:open:end
// snippet:save:start
export async function save() {
  const owner=editor, token=generation, revision=editor.read().revision;
  log('flush-start',{revision,generation:token});
  try {
    await owner.flush({target:'local'});
    const receipt=owner.state.localCommitted;
    log('flush-complete',{revision,receipt,generation:token});
    if(owner===editor && token===generation && owner.state.ready && owner.read().revision===revision)
      indicator.textContent=receipt ? 'Saved locally; remote save not configured' : 'No new local changes';
    return receipt;
  } catch(error) { log('flush-error',{message:error.message,generation:token}); throw error; }
}
// snippet:save:end
export function selectFriday() {
  const block=editor.read().visible.filter(n=>n.kind==='block')[2];
  const element=root.querySelector(`[data-node-id="${block.id}"]`);
  const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
  const points=[];let offset=0,node;
  while(node=walker.nextNode()) { for(const at of [4,10]) if(at>=offset && at<=offset+node.length && !points[at]) points[at]=[node,at-offset]; offset+=node.length; }
  root.focus();document.getSelection().setBaseAndExtent(...points[4],...points[10]);
  document.dispatchEvent(new Event('selectionchange'));
}
export function editFriday() {
  selectFriday();
  const command=editor.captureCommand('replace');
  if(!command) return {disposition:'unavailable'};
  try { return command.execute('Thursday'); } finally { command.dispose(); }
}
export function unsubscribe() { for(const dispose of off.splice(0)) dispose(); }
// snippet:close:start
export async function close(policy='flush') {
  if(!editor) return null;
  const owner=editor;
  unsubscribe();
  const result=await owner.destroy({policy});
  log('disposed',{unsaved:result.unsaved});
  // Report mode returns recoverable bytes; the host must retain them.
  return result;
}
// snippet:close:end
export function snapshot() {
  return { state:serialState(editor.state),texts:editor.state.ready ? editor.read().visible.filter(n=>n.kind==='block').map(n=>n.runs.map(r=>r.text).join('')) : [],timeline:[...timeline],resources:{...resources},indicator:indicator.textContent,remote:'not-configured' };
}
export function resetTrace() { timeline.length=0; }
window.lifecycleExample={seed,open,save,selectFriday,editFriday,close,unsubscribe,snapshot,resetTrace,fault,resources,
  releaseRecovery:()=>{fault.holdRecovery=false;releaseRecovery?.();releaseRecovery=undefined;},
  releaseFlush:()=>{fault.holdFlush=false;releaseFlush?.();releaseFlush=undefined;},
  get record(){return record;},get editor(){return editor;},get timeline(){return timeline;}};
