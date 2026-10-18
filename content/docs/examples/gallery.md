+++
title = "Examples gallery"
description = "Complete checked consumers, source downloads and explicit capability limits."
weight = 1
+++

Choose a reader task, then open its complete source and checked outcome. **Local-only, unpublished SDK 0.0.0**: these are reproducible local package consumers, not registry or hosted releases. No backend, model calls or accounts are hidden behind the examples. Project kickoff is Apache-2.0 prepared sample content.

[Download the gallery manifest](/reference-inputs/gallery-v1/manifest.json). Each source archive includes its exact source and qualification manifest, fixture, runner and candidate pin metadata. Run it in the admitted docs workspace using the linked guide: archive metadata does not supply the unpublished tarballs. Obtain the exact local-candidates-v5 sdk-framework-v1 artifacts from the owning local workspace; never mix same-version families. See [compatibility](@/docs/reference/compatibility.md) and [migration](@/docs/migrate/_index.md). EQL1.9 and roadmap10 publication/release, public hosting, native/device/OS/AT and performance/budget acceptance remain open.

<div data-gallery>
<form aria-label="Filter examples">
<label>Task <select name="task"><option value="">All</option><option value="basic">basic</option><option value="toolbar">toolbar</option><option value="ticket">ticket</option><option value="collaboration">collaboration</option><option value="report">report</option></select></label>
<label>Platform <select name="platform"><option value="">All</option><option value="web">web</option><option value="react">react</option></select></label>
<label>Feature <select name="feature"><option value="">All</option><option value="editing">editing</option><option value="save">save</option><option value="formatting">formatting</option><option value="readonly">readonly</option><option value="recovery">recovery</option><option value="reset">reset</option><option value="collaboration">collaboration</option><option value="history">history</option><option value="code">code</option><option value="table">table</option><option value="assets">assets</option></select></label>
<label>Status <select name="status"><option value="">All</option><option value="local-runtime">local-runtime</option><option value="unavailable">unavailable</option></select></label>
<button type="reset">Clear filters</button></form><p data-gallery-count role="status" aria-live="polite">6 examples</p><p data-copy-status role="status" aria-live="polite"></p>
<article data-gallery-card data-task="basic" data-platform="web" data-feature="editing save" data-status="local-runtime"><h2 id="browser">Browser basic editor</h2><p><strong>local-runtime</strong> · web · editing, save</p><p>Append docs; Bold owner; save/reopen retains the edited Owner paragraph.</p><p><a href="/docs/getting-started/web/">Complete guide and outcome: Browser basic editor</a></p><p>Artifact: sdk-framework-v1 · v5 · 0.0.0 unpublished · source aa5b7d21064bd6d694ba243ffe528f58288b8a92. <a href="/reference-inputs/gallery-v1/browser/examples/quickstarts/manifest.json">Source and artifact manifest</a> · <a href="/reference-inputs/gallery-v1/browser/examples/quickstarts/qualification.json">Exact qualification</a> · <a href="/reference-inputs/gallery-v1/browser/source.zip" download>Download complete Browser basic editor source</a> · <a href="/reference-inputs/gallery-v1/browser/examples/quickstarts/examples/task-editor/editor.mjs">Full snippet source</a> · <a href="/reference-inputs/gallery-v1/browser/examples/concepts/kickoff-v1.md">Input fixture</a></p><p>Checked excerpt: examples/quickstarts/examples/task-editor/editor.mjs:14–25. Context and all imports are in the full source.</p><pre><code id="snippet-browser">export let editor;
async function open() {
  editor = createEditor(root, {...options, ...await markdownOptions()});
  unsubscribe = editor.subscribe(state =&gt; {
    if (state.error) message.textContent = &#x27;Local save failed. Keep this tab open and export recovery content.&#x27;;
    else if (state.localCommitted) message.textContent = &#x27;Saved locally. Remote durability is not confirmed.&#x27;;
  });
  await editor.ready;
  disposeControls=controls(()=&gt;editor);
  save.disabled = reopen.disabled = false;
  message.textContent = &#x27;Task ready offline&#x27;;
  return editor;
</code></pre><button type="button" data-copy="snippet-browser">Copy Browser basic editor snippet</button></article>
<article data-gallery-card data-task="basic" data-platform="react" data-feature="editing save" data-status="local-runtime"><h2 id="react">React basic editor</h2><p><strong>local-runtime</strong> · react · editing, save</p><p>SSR has no browser side effects; client mount edits and unmount disposes.</p><p><a href="/docs/getting-started/react/">Complete guide and outcome: React basic editor</a></p><p>Artifact: sdk-framework-v1 · v5 · 0.0.0 unpublished · source aa5b7d21064bd6d694ba243ffe528f58288b8a92. <a href="/reference-inputs/gallery-v1/react/examples/quickstarts/manifest.json">Source and artifact manifest</a> · <a href="/reference-inputs/gallery-v1/react/examples/quickstarts/qualification.json">Exact qualification</a> · <a href="/reference-inputs/gallery-v1/react/source.zip" download>Download complete React basic editor source</a> · <a href="/reference-inputs/gallery-v1/react/examples/quickstarts/examples/task-editor/react.mjs">Full snippet source</a> · <a href="/reference-inputs/gallery-v1/react/examples/concepts/kickoff-v1.md">Input fixture</a></p><p>Checked excerpt: examples/quickstarts/examples/task-editor/react.mjs:1–24. Context and all imports are in the full source.</p><pre><code id="snippet-react">import {controls} from &#x27;./controls.mjs&#x27;;
import {markdownOptions} from &#x27;./markdown.mjs&#x27;;
import {createElement,StrictMode} from &#x27;react&#x27;;
import {createRoot} from &#x27;react-dom/client&#x27;;
import {EditorHost} from &#x27;@edit-ac/react&#x27;;
import {localOptions} from &#x27;./document.mjs&#x27;;
import {retainRecovery,recoveryReports,downloadRecovery} from &#x27;./recovery.mjs&#x27;;
export let editor;
export const reactRoot=createRoot(document.querySelector(&#x27;#editor&#x27;));
let unsubscribe,disposeControls;
const status=text=&gt;{document.querySelector(&#x27;#message&#x27;).textContent=text;};
// Construct browser ports after the client entry loads, never during SSR.
export const ready=localOptions(&#x27;react&#x27;).then(async options=&gt;{
  Object.assign(options, await markdownOptions());
  reactRoot.render(createElement(StrictMode,null,createElement(EditorHost,{options,
    onReady(value) { editor=value;unsubscribe?.();disposeControls?.();disposeControls=controls(()=&gt;editor);unsubscribe=editor.subscribe(state=&gt;status(state.error?&#x27;Local save failed. Export recovery before closing.&#x27;:state.localCommitted?&#x27;Saved locally. Remote durability is not confirmed.&#x27;:&#x27;Ready offline. Remote durability is not confirmed.&#x27;)); },
    onError() {status(&#x27;Unable to open or save. Keep this tab open and export recovery.&#x27;);},
    onDispose(result) {unsubscribe?.();disposeControls?.();retainRecovery(result);if(result.unsaved)status(&#x27;Unsaved content retained. Export recovery before closing.&#x27;);},
  })));
}).catch(()=&gt;status(&#x27;Unable to open local document. Existing data was preserved.&#x27;));
document.querySelector(&#x27;#save&#x27;).onclick=async()=&gt;{try {await editor.flush({target:&#x27;local&#x27;});}catch {status(&#x27;Local save failed. Export recovery before closing.&#x27;);}};
document.querySelector(&#x27;#export-recovery&#x27;).onclick=()=&gt;downloadRecovery([...recoveryReports,...(editor?.state.ready?[editor.recoveryExport()]:[])]);
export function close() {reactRoot.unmount();}

</code></pre><button type="button" data-copy="snippet-react">Copy React basic editor snippet</button></article>
<article data-gallery-card data-task="toolbar" data-platform="web" data-feature="formatting readonly" data-status="local-runtime"><h2 id="toolbar">Formatting toolbar</h2><p><strong>local-runtime</strong> · web · formatting, readonly</p><p>Bold owner applies the engine mark; read-only disables formatting.</p><p><a href="/docs/getting-started/web/">Complete guide and outcome: Formatting toolbar</a></p><p>Artifact: sdk-framework-v1 · v5 · 0.0.0 unpublished · source aa5b7d21064bd6d694ba243ffe528f58288b8a92. <a href="/reference-inputs/gallery-v1/toolbar/examples/quickstarts/manifest.json">Source and artifact manifest</a> · <a href="/reference-inputs/gallery-v1/toolbar/examples/quickstarts/qualification.json">Exact qualification</a> · <a href="/reference-inputs/gallery-v1/toolbar/source.zip" download>Download complete Formatting toolbar source</a> · <a href="/reference-inputs/gallery-v1/toolbar/examples/quickstarts/examples/task-editor/controls.mjs">Full snippet source</a> · <a href="/reference-inputs/gallery-v1/toolbar/examples/concepts/kickoff-v1.md">Input fixture</a></p><p>Checked excerpt: examples/quickstarts/examples/task-editor/controls.mjs:2–17. Context and all imports are in the full source.</p><pre><code id="snippet-toolbar">export function controls(getEditor) {
  if(!document.querySelector(&#x27;#format&#x27;) || !document.querySelector(&#x27;#readonly&#x27;)) return;
  const format=document.querySelector(&#x27;#format&#x27;),readonly=document.querySelector(&#x27;#readonly&#x27;);
  format.disabled=readonly.disabled=!getEditor()?.state.ready;
  format.onclick=()=&gt;{
    const editor=getEditor();if(!editor?.state.ready)return;
    const owner=editor.read().visible.find(n=&gt;n.runs?.map(r=&gt;r.text).join(&#x27;&#x27;).startsWith(&#x27;Owner: Alex&#x27;));
    editor.chain(&#x27;quickstart:format&#x27;).command({type:&#x27;markAt&#x27;,owner:owner.id,from:0,to:11,mark:&#x27;bold&#x27;,action:&#x27;apply&#x27;}).run();
  };
  readonly.onclick=()=&gt;{
    const editor=getEditor();if(!editor?.state.ready)return;editor.setReadOnly(!editor.state.readOnly);
    document.querySelector(&#x27;#readonly&#x27;).setAttribute(&#x27;aria-pressed&#x27;,String(editor.state.readOnly));
    document.querySelector(&#x27;#format&#x27;).disabled=editor.state.readOnly;
  };
  return ()=&gt;{format.onclick=readonly.onclick=null;format.disabled=readonly.disabled=true;};
}
</code></pre><button type="button" data-copy="snippet-toolbar">Copy Formatting toolbar snippet</button></article>
<article data-gallery-card data-task="ticket" data-platform="web" data-feature="editing recovery reset" data-status="local-runtime"><h2 id="ticket">Ticket description</h2><p><strong>local-runtime</strong> · web · editing, recovery, reset</p><p>PM ticket edits persist after Save locally/reload; reset exports a backup before deleting only the selected identity.</p><p><a href="/docs/examples/playground/">Complete guide and outcome: Ticket description</a></p><p>Artifact: sdk-framework-v1 · v5 · 0.0.0 unpublished · source aa5b7d21064bd6d694ba243ffe528f58288b8a92. <a href="/reference-inputs/gallery-v1/ticket/playground/manifest.json">Source and artifact manifest</a> · <a href="/reference-inputs/gallery-v1/ticket/playground/qualification.json">Exact qualification</a> · <a href="/reference-inputs/gallery-v1/ticket/source.zip" download>Download complete Ticket description source</a> · <a href="/reference-inputs/gallery-v1/ticket/playground/app.mjs">Full snippet source</a> · <a href="/reference-inputs/gallery-v1/ticket/examples/concepts/kickoff-v1.md">Input fixture</a></p><p>Checked excerpt: playground/app.mjs:20–28. Context and all imports are in the full source.</p><pre><code id="snippet-ticket">   // Save creation intent before publication. Failed/missing checkpoints are never silently replaced.
   localStorage.setItem(key,JSON.stringify({identity,databaseName,backups:[]}));
   storage=await CheckpointStorage.open(indexedDB,databaseName);await storage.publish(engine.checkpoint(),[]);
   return {identity,databaseName};
  }finally{storage?.close();engine.dispose();}
 });
}
async function dispose(){
 unsubscribe?.();unsubscribe=undefined;if(!editor)return;
</code></pre><button type="button" data-copy="snippet-ticket">Copy Ticket description snippet</button></article>
<article data-gallery-card data-task="collaboration" data-platform="web" data-feature="collaboration history save" data-status="local-runtime"><h2 id="collaborative-note">Collaborative note</h2><p><strong>local-runtime</strong> · web · collaboration, history, save</p><p>Offline A and B edits survive reconnect exactly once; Undo A preserves B. Peer equality is not a remote save.</p><p><a href="/docs/examples/collaboration/">Complete guide and outcome: Collaborative note</a></p><p>Artifact: sdk-framework-v1 · v5 · 0.0.0 unpublished · source aa5b7d21064bd6d694ba243ffe528f58288b8a92. <a href="/reference-inputs/gallery-v1/collaborative-note/playground/scenarios/collaboration/manifest.json">Source and artifact manifest</a> · <a href="/reference-inputs/gallery-v1/collaborative-note/playground/scenarios/collaboration/qualification.json">Exact qualification</a> · <a href="/reference-inputs/gallery-v1/collaborative-note/source.zip" download>Download complete Collaborative note source</a> · <a href="/reference-inputs/gallery-v1/collaborative-note/playground/scenarios/collaboration/channel.mjs">Full snippet source</a> · <a href="/reference-inputs/gallery-v1/collaborative-note/examples/concepts/kickoff-v1.md">Input fixture</a></p><p>Checked excerpt: playground/scenarios/collaboration/channel.mjs:1–17. Context and all imports are in the full source.</p><pre><code id="snippet-collaborative-note">// Host transport only. Production SyncAttachment owns frames, replay and semantics.
export function createLocalChannel({maxFrames=32,maxBytes=32*1024*1024}={}) {
 const queues=[[],[]];let bytes=0,closed=false,accepted=0,delivered=0;
 return {
  transport(side){if(side!==0&amp;&amp;side!==1)throw Error(&#x27;Unknown local peer&#x27;);return {send(frame){
   if(closed)return false;
   if(!(frame instanceof Uint8Array)||frame.byteLength&gt;16*1024*1024)throw Error(&#x27;Invalid local frame&#x27;);
   if(queues[0].length+queues[1].length&gt;=maxFrames||bytes+frame.byteLength&gt;maxBytes)return false;
   const copy=frame.slice();queues[1-side].push(copy);bytes+=copy.byteLength;accepted++;return true;
  }};},
  deliver(attachments){if(closed)throw Error(&#x27;Local channel closed&#x27;);let count=0;
   for(const side of [0,1])while(queues[side].length){const frame=queues[side].shift();bytes-=frame.byteLength;attachments[side].receive(frame);count++;delivered++;}return count;
  },
  get state(){return {closed,queued:queues[0].length+queues[1].length,bytes,accepted,delivered};},
  close(){closed=true;queues[0].length=queues[1].length=0;bytes=0;}
 };
}
</code></pre><button type="button" data-copy="snippet-collaborative-note">Copy Collaborative note snippet</button></article>
<article data-gallery-card data-task="report" data-platform="web" data-feature="code table assets" data-status="unavailable"><h2 id="structured-report">Structured report</h2><p><strong>unavailable</strong> · web · code, table, assets</p><p>Source study only. No executable browser report or qualified code/table/asset combination is supplied. Runtime cases: 0.</p><p><a href="/docs/examples/extension-configurations/">Complete guide and outcome: Structured report</a></p><p>Unavailable profiles stay visible when filtering. There is no fake interactive report. Input is Project kickoff; the source study records conceptual table edit/undo and unavailable asset preservation expectations, with loading and disposal limits. Runtime cases: 0. <a href="/reference-inputs/extension-configurations-v1/owner-recipes.json">Download owning source study manifest</a> · <a href="/reference-inputs/gallery-v1/structured-report/source-study.zip" download>Download complete report source study and fixture</a> and <a href="/reference-inputs/extension-configurations-v1/admission.json">exact profile admission</a>. Consult the extension catalog source study; activate this entry only after its owning packaged browser consumer qualifies.</p></article>
</div>

## Lifecycle and recovery

Loading: keep actions disabled until the SDK is ready; use the guide's actual missing-WASM diagnostic and compatible asset retry. Do not substitute JS/WASM from another candidate. Each editor owns independent handles, history, permissions and local storage.

Read-only: use the owning SDK permission API; peers may still deliver authorized updates. Save locally before reopening. A local receipt is distinct from transport sync and remote durability. On a quota/save error keep the tab open and export recovery bytes; never silently clear a document or downgrade its schema.

Reset/export: the ticket playground offers explicit confirmed reset with backup, export and compatible recovery into a separate copy. Quickstarts reopen the same identity rather than reset it. The collaborative note exports both copies and preserves its stores; it offers no destructive reset. Do not clear unrelated browser storage.

Dispose: Close editor awaits flush/destroy, removes subscriptions and disables controls. React unmount and Astro navigation use their owning cleanup. Stop your loopback server after use. These links reuse real editors; the gallery loads no editor or network service. Build the ticket with `npm run build:playground` and the note with `npm run build:collaboration`; serve `dist/playground` on localhost as their guides describe.

Continue with [editing concepts](@/docs/concepts/editing.md), [command APIs](@/docs/reference/commands.md), [extension profiles](@/docs/extensions/presets.md), [extension recipes](@/docs/examples/extensions-resolvers.md), and [migration](@/docs/migrate/_index.md).
