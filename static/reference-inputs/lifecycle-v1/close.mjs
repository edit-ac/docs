export async function close(policy='flush') {
  if(!editor) return null;
  const owner=editor;
  unsubscribe();
  const result=await owner.destroy({policy});
  log('disposed',{unsaved:result.unsaved});
  // Report mode returns recoverable bytes; the host must retain them.
  return result;
}
