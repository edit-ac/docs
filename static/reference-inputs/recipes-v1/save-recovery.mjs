async function restoreRecovery(){
 const wasReadOnly=editor?.state.readOnly;
 if(editor?.state.ready)editor.setReadOnly(true);
 const recovery=editor?.state.ready?editor.recoveryExport():recoveryReports.findLast(r=>r.preset===selected&&!r.recovered)?.recovery;
 if(!recovery)throw Error('No retained recovery checkpoint');
 exportRecovery();
 const key=prefix+selected,prior=JSON.parse(localStorage.getItem(key)),databaseName=key+'-recovery-'+crypto.randomUUID();
 const runtime=await init(assetUrl),verified=runtime.restoreEngine(recovery.checkpoint.identity,recovery.checkpoint);
 let store;
 try{
  // Validate and publish a new isolated copy. Never overwrite the original database.
  store=await CheckpointStorage.open(indexedDB,databaseName);await store.publish(verified.checkpoint(),[]);
 }catch(error){if(editor?.state.ready)editor.setReadOnly(wasReadOnly);throw error;}finally{store?.close();verified.dispose();}
 try{await dispose();}catch{/* dispose retained the failed-save report before closing */}
 localStorage.setItem(key,JSON.stringify({identity:recovery.checkpoint.identity,databaseName,backups:[...(prior?.backups||[]),prior.databaseName]}));
 await open();$('error').textContent='';for(const report of recoveryReports)if(report.preset===selected)report.recovered=true;status('Recovered into a separate local copy. Original database preserved until explicit reset.');
}
