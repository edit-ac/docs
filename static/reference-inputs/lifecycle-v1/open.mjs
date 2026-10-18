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
