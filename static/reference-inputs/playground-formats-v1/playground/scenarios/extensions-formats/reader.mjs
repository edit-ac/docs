import {ChangeReview} from '@edit-ac/web';
import {ReferenceLookupSession,referenceBlock} from './web/modules/index.js';
const $=id=>document.getElementById(id);
const target={targetId:'ac://team-1/12345678-1234-4234-8234-123456789abc',label:'ASD-123'};
let review,reviewTicket=0;
function current(){const editor=window.playground.editor;if(!editor?.state.ready||editor.state.readOnly)throw Error('Open an editable sample first');return editor;}
function insert(editor,block,origin){
 if(editor!==current())throw Error('Sample changed; retry explicitly');
 const engine=editor.owner.engine,node=engine.read().visible.filter(n=>n.kind==='block').at(-1);
 const at=engine.anchor(node.id,node.runs.reduce((n,r)=>n+Array.from(r.text).length,0),'right');
 try{const result=editor.owner.commit({kind:'fragment',origin,range:{anchor:at,focus:at},blocks:origin==='playground-code'?[{attributes:{type:'paragraph'},runs:[],containers:[]},block,{attributes:{type:'paragraph'},runs:[],containers:[]}]:[block]});
  if(result.caret)engine.releaseAnchor(result.caret);
 }finally{engine.releaseAnchor(at);}
}
async function action(fn){try{$('reader-status').textContent='Working…';await fn();await current().settle();$('reader-status').textContent='Applied with the current sample’s shared owner. Undo, save and reopen remain available.'; $('reader-extensions').textContent=JSON.stringify(current().extensions,null,2);}catch(e){$('reader-status').textContent=e.message;}}
$('reader-code').onclick=()=>void action(()=>insert(current(),{attributes:{type:'code',language:'javascript'},runs:[{text:'const kickoff = "Friday";',marks:[]}],containers:[]},'playground-code'));
$('reader-reference').onclick=()=>void action(async()=>{
 const editor=current(),revision=JSON.stringify(editor.read().revision);
 const lookup=new ReferenceLookupSession({version:1,permission:()=>({revision:'fixture:1',lookup:true,insert:editor===window.playground.editor&&!editor.state.readOnly}),catalog:id=>({targetId:id,status:id===target.targetId?'cached':'unauthorized'}),resolve:()=>[target],subscribe:()=>({dispose(){}})},()=>{},{context:()=>({document:editor.read().identity.documentId,session:'playground-reader',revision:JSON.stringify(editor.read().revision)})});
 try{const found=await lookup.search({query:'ASD-123',requestId:1,signal:new AbortController().signal}),admitted=found[0]&&lookup.admit(found[0]);
  if(!admitted||JSON.stringify(editor.read().revision)!==revision)throw Error('Reference target changed; retry explicitly');insert(editor,referenceBlock(admitted),'playground-reference');
 }finally{lookup.dispose();}
});
$('review-kind').onchange=()=>void showReview();
$('reader-review').onclick=()=>void showReview();
async function showReview(){const ticket=++reviewTicket;try{
 const response=await fetch('./fixtures/review.json');if(!response.ok)throw Error('Review fixture unavailable; retry');const models=await response.json();if(ticket!==reviewTicket)return;
 review?.destroy();review=new ChangeReview($('reader-review-output'),models[$('review-kind').value],{mode:'readonly',limits:{maxInputBytes:65536,pageSize:20,maxValueChars:4096}});
 $('reader-status').textContent='Immutable shared Rust diff example; readonly review does not compare or modify the open sample. Attribution remains unknown.';
 }catch(e){if(ticket===reviewTicket)$('reader-status').textContent=e.message;}}
window.playgroundReader={dispose(){reviewTicket++;review?.destroy();review=undefined;}};
