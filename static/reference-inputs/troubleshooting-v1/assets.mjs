test('mismatched JS/WASM rejects initialization, preserves saved checkpoint and correct bytes recover',async()=>{
 const p=await freshLifecycle();await p.evaluate(async()=>{const f=window.lifecycleExample;f.editFriday();await f.save();await f.close();});
 const record=await p.evaluate(()=>window.lifecycleExample.record),fresh=await p.context().newPage();
 // A valid WASM module with no required editor exports models an incompatible body.
 const mismatched=Buffer.from([0,97,115,109,1,0,0,0]);
 try{await fresh.route('**/core/wasm/editac_wasm_bg.wasm',r=>r.fulfill({contentType:'application/wasm',body:mismatched}));await fresh.goto(p.url());await fresh.waitForFunction(()=>!!window.lifecycleExample);
 const failed=await fresh.evaluate(async record=>{const f=window.lifecycleExample;let diagnostic;try{await f.open({record});}catch(e){diagnostic={name:e.name,message:e.message};}return {diagnostic,snapshot:f.snapshot()};},record);
 assert.equal(failed.snapshot.state.phase,'failed');assert.equal(failed.snapshot.state.ready,false);assert.equal(failed.snapshot.state.localCommitted,null);assert.match(failed.diagnostic.message,/__wbindgen|undefined|function|export/i);
 await fresh.evaluate(()=>window.lifecycleExample.close('report'));await fresh.unroute('**/core/wasm/editac_wasm_bg.wasm');
 await fresh.reload();await fresh.waitForFunction(()=>!!window.lifecycleExample);await fresh.evaluate(record=>window.lifecycleExample.open({record}),record);const recovered=await fresh.evaluate(()=>window.lifecycleExample.snapshot());assert.deepEqual(recovered.texts,edited);assert.equal(recovered.state.error,null);assert.equal(recovered.remote,'not-configured');await fresh.evaluate(()=>window.lifecycleExample.close());observe('assets',{failed,recovered,preparedWasmSha256:hash(mismatched)});
 }finally{await fresh.close();}
});
