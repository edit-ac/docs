export function heading(level) {
  const request = {kind:'format',origin:'docs:heading',marks:[],blocks:[{targets:[blocks()[0].id],attributes:{type:'heading',level},action:'apply'}]};
  if (!editor.can(request)) return false;
  releaseResult(editor.commit(request));return true;
}
