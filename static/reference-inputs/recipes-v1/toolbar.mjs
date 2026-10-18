// Host composition over the owning command consumer, not another command model.
export function attachToolbar(owner, parent = document.body) {
 const toolbar=document.createElement('div');toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Document formatting');
 const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-label','Formatting status');
 const buttons=[];let bold;
 const capture=()=>{if(document.activeElement!==owner.editor.root)return;bold?.dispose();bold=owner.editor.captureCommand('bold',undefined,toolbar);};
 const check=result=>{owner.releaseResult(result);if(['rejected','unavailable'].includes(result.disposition))throw Error(result.reason||'Formatting unavailable; return to the editor and select text');};
 const run=(label,action)=>{
  const button=document.createElement('button');button.type='button';button.textContent=label;
  button.onpointerdown=event=>{capture();event.preventDefault();};
  button.onclick=()=>{try{action();status.textContent=label+' applied';}catch(error){status.textContent=error.message;}};
  buttons.push(button);toolbar.append(button);
 };
 run('Bold',()=>{const target=bold;bold=undefined;if(!target)throw Error('Select text in the editor first');try{check(target.execute());}finally{target.dispose();}});
 run('Heading 2',()=>{if(!owner.heading(2))throw Error('Heading unavailable');});
 run('Undo',()=>check(owner.history('undo')));
 // Capture before Tab moves focus. The SDK retained target permits this group,
 // and rejects revision changes, read-only, disposal or unrelated focus owners.
 owner.editor.root.addEventListener('keydown',capture);document.addEventListener('selectionchange',capture);
 const unsubscribe=owner.editor.subscribe(state=>{for(const button of buttons)button.disabled=!state.ready||state.readOnly;});
 if(owner.editor.root.parentElement===parent)owner.editor.root.after(toolbar,status);else parent.append(toolbar,status);capture();
 return ()=>{unsubscribe();bold?.dispose();owner.editor.root.removeEventListener('keydown',capture);document.removeEventListener('selectionchange',capture);for(const button of buttons){button.onclick=null;button.onpointerdown=null;}toolbar.remove();status.remove();};
}
