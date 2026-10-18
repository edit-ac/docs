test('cancelled browser loading rejects ready, releases recovery and remounts saved data',async()=>{
 const page=await freshLifecycle();await page.evaluate(async()=>{const f=window.lifecycleExample;f.editFriday();await f.save();await f.close();f.fault.holdRecovery=true;window.opening=f.open().then(()=>({ready:true}),e=>({error:e.message}));});
 const opening=await page.evaluate(()=>window.lifecycleExample.snapshot());assert.equal(opening.state.ready,false);
 await page.evaluate(()=>window.lifecycleExample.close('report'));const diagnostic=await page.evaluate(()=>window.opening);assert.match(diagnostic.error,/initialization canceled/);
 await page.evaluate(()=>window.lifecycleExample.releaseRecovery());await page.waitForFunction(()=>{const f=window.lifecycleExample;return f.resources.disposed===f.resources.recoveries;});
 const closed=await page.evaluate(()=>window.lifecycleExample.snapshot());assert.equal(closed.resources.live,0);assert.equal(closed.resources.subscriptions,0);
 await page.evaluate(()=>window.lifecycleExample.open());const recovered=await page.evaluate(()=>window.lifecycleExample.snapshot());assert.deepEqual(recovered.texts,edited);await page.evaluate(()=>window.lifecycleExample.close());observe('loading',{opening,diagnostic,closed,recovered});
});
