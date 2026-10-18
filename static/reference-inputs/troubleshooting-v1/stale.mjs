test('stale command target cannot overwrite newer content; reselect and recapture deliberately apply once',async()=>{
 const page=commands.page;await page.evaluate(()=>window.commandsExample.mount());
 const result=await page.evaluate(()=>{const f=window.commandsExample,t=f.editor.captureCommand('replace');try{f.command('bold');const before=f.snapshot(),rejected=t.execute('Monday'),after=f.snapshot();f.select(2,4,10);const recovered=f.command('replace','Thursday');return {before,rejected,after,recovered,final:f.snapshot()};}finally{t.dispose();}});
 assert.deepEqual(result.rejected,{disposition:'rejected',reason:'stale-or-unavailable-command-target'});assert.deepEqual(result.after,result.before);assert.equal(result.after.blocks[2].text,'Due Friday');assert.equal(result.recovered.disposition,'committed');assert.equal(result.final.blocks[2].text,'Due Thursday');await page.evaluate(()=>window.commandsExample.close());observe('stale',result);
});
