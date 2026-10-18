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
