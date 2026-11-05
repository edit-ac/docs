// Host composition over the owning command consumer. Load @edit-ac/web/ui.css
// in the host alongside @edit-ac/web/styles.css; neither import changes commands.
export function attachToolbar(owner, parent = document.body) {
 const wrapper=document.createElement('div');wrapper.className='editac-ui';
 const toolbar=document.createElement('div');toolbar.dataset.editacPart='toolbar';toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Document formatting');
 const status=document.createElement('p');status.dataset.editacPart='status';status.setAttribute('role','status');status.setAttribute('aria-label','Formatting status');
 const buttons=[];let bold;
 const capture=()=>{if(document.activeElement!==owner.editor.root)return;bold?.dispose();bold=owner.editor.captureCommand('bold',undefined,toolbar);};
 const check=result=>{owner.releaseResult(result);if(['rejected','unavailable'].includes(result.disposition))throw Error(result.reason||'Formatting unavailable; return to the editor and select text');};
 const run=(label,action)=>{
  const button=document.createElement('button');button.dataset.editacPart='toolbar-button';button.type='button';button.textContent=label;
  button.onpointerdown=event=>{capture();event.preventDefault();};
  button.onclick=()=>{try{action();status.dataset.editacState='idle';status.textContent=label+' applied';}catch(error){status.dataset.editacState='error';status.textContent=error.message;}};
  buttons.push(button);toolbar.append(button);
 };
 run('Bold',()=>{const target=bold;bold=undefined;if(!target)throw Error('Select text in the editor first');try{check(target.execute());}finally{target.dispose();}});
 run('Heading 2',()=>{if(!owner.heading(2))throw Error('Heading unavailable');});
 run('Undo',()=>check(owner.history('undo')));
 // Press Escape, then Tab to leave the editor for this group (plain Tab indents).
 // Capture before focus moves. The SDK retained target permits this group,
 // and rejects revision changes, read-only, disposal or unrelated focus owners.
 owner.editor.root.addEventListener('keydown',capture);document.addEventListener('selectionchange',capture);
 const unsubscribe=owner.editor.subscribe(state=>{for(const button of buttons)button.disabled=!state.ready||state.readOnly;});
 wrapper.append(toolbar,status);if(owner.editor.root.parentElement===parent)owner.editor.root.after(wrapper);else parent.append(wrapper);capture();
 return ()=>{unsubscribe();bold?.dispose();owner.editor.root.removeEventListener('keydown',capture);document.removeEventListener('selectionchange',capture);for(const button of buttons){button.onclick=null;button.onpointerdown=null;}wrapper.remove();};
}
