// No static dependency on the optional package: the baseline requests no codec payload.
const $=id=>document.getElementById(id);
let client,enabled=false,generation=0;
function disable(message='Formats disabled. Prepared jobs canceled; editor content preserved.'){
 generation++;enabled=false;client?.dispose();client=undefined;
 $('formats-panel').hidden=true;$('formats-capabilities').replaceChildren();
 $('formats-toggle').setAttribute('aria-pressed','false');$('formats-toggle').textContent='Enable format capabilities';
 $('formats-status').textContent=message;
}
async function enable(){
 const ticket=++generation;enabled=true;
 $('formats-toggle').setAttribute('aria-pressed','true');$('formats-toggle').textContent='Disable format capabilities';
 $('formats-status').textContent='Loading local format capabilities…';
 try{
  const [api,response]=await Promise.all([import('./formats/index.js?attempt='+ticket),fetch('./formats/capabilities.json')]);
  if(!response.ok)throw Error('Capability manifest unavailable');
  const manifest=await response.json();
  if(ticket!==generation)return;
  if(manifest.schemaVersion!==1||!Array.isArray(manifest.directions))throw Error('Unsupported capability manifest');
  client=api.createFormatClient();
  const rows=manifest.directions.filter(d=>d.target==='browser-worker-wasm32');
  if(!rows.length||rows.some(d=>d.format==='pdf'&&d.direction==='import'))throw Error('Unsupported browser profile');
  for(const d of rows){const row=document.createElement('tr');for(const key of ['format','direction','profile','fidelity']){const cell=document.createElement('td');cell.textContent=d[key];row.append(cell);}$('formats-capabilities').append(row);}
  $('formats-unavailable').textContent='Unavailable: '+(manifest.unavailable||[]).join(', ');
  $('formats-panel').hidden=false;$('formats-status').textContent='Local public format client ready. No conversion has run; direction-specific fidelity applies.';
 }catch(error){if(ticket===generation)disable(`Format capabilities unavailable: ${error.message}. Editor preserved; enable to retry.`);}
}
$('formats-toggle').onclick=()=>{if(enabled)disable();else void enable();};
$('close').addEventListener('click',()=>disable());
window.addEventListener('pagehide',()=>disable());
// Read-only lifecycle observability for the local qualification harness.
window.playgroundFormats={get enabled(){return enabled;},get ready(){return !!client;}};
