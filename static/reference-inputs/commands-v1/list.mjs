export function list(type) {
  const request = {kind:'editor',origin:'docs:list',commands:[{type:'setStyle',container:editor.read().visible.find(n=>n.kind==='list').id,style:{type}}]};
  if (!editor.can(request)) return false;
  releaseResult(editor.commit(request));return true;
}
