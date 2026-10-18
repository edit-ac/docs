// Host controls call the existing editor command and permission owner.
export function controls(getEditor) {
  if(!document.querySelector('#format') || !document.querySelector('#readonly')) return;
  const format=document.querySelector('#format'),readonly=document.querySelector('#readonly');
  format.disabled=readonly.disabled=!getEditor()?.state.ready;
  format.onclick=()=>{
    const editor=getEditor();if(!editor?.state.ready)return;
    const owner=editor.read().visible.find(n=>n.runs?.map(r=>r.text).join('').startsWith('Owner: Alex'));
    editor.chain('quickstart:format').command({type:'markAt',owner:owner.id,from:0,to:11,mark:'bold',action:'apply'}).run();
  };
  readonly.onclick=()=>{
    const editor=getEditor();if(!editor?.state.ready)return;editor.setReadOnly(!editor.state.readOnly);
    document.querySelector('#readonly').setAttribute('aria-pressed',String(editor.state.readOnly));
    document.querySelector('#format').disabled=editor.state.readOnly;
  };
  return ()=>{format.onclick=readonly.onclick=null;format.disabled=readonly.disabled=true;};
}
