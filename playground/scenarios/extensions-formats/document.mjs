import {openEditorStorage,mountEditorSurface} from '@edit-ac/web';
// One real storage/Session owner and a borrowed view. The host owns their lifetime.
export function createEditor(root,options){
 let owner,surface,closed=false,readOnly=false,error;
 const state=()=>({ready:!!surface&&!closed,readOnly,error});
 const listeners=new Set();
 const ready=(async()=>{
  owner=await openEditorStorage(options);
  surface=mountEditorSurface(root,owner.engine,{storageOwner:owner,preset:options.preset,label:options.label});
  await surface.ready;for(const listener of listeners)listener(state());
 })().catch(async e=>{error=e;await surface?.dispose();await owner?.destroy({policy:'report',assetPolicy:'suspend'});for(const listener of listeners)listener(state());throw e;});
 return {ready,root,databaseName:options.databaseName,get owner(){return owner;},get state(){return state();},
  read:()=>owner.engine.read(),recoveryExport:()=>owner.recoveryExport(),flush:o=>owner.flush(o),
  subscribe(kind,fn){if(typeof kind==='function'){listeners.add(kind);return ()=>listeners.delete(kind);}const sub=owner.engine.subscribe(kind,fn);return ()=>sub.dispose();},
  captureHistory:()=>surface.captureHistory(),setReadOnly(value){readOnly=value;surface?.setReadOnly(value);},
  async destroy(o){closed=true;await surface?.dispose();return owner?.destroy({...o,assetPolicy:'suspend'});}
 };
}
