+++
title = "Build a keyboard toolbar"
description = "A checked input, action, outcome and recovery using the owning consumer."
weight = 1
+++

Project kickoff has heading level 1 and bold Friday. The owning commands consumer selects Friday.

## Before you start

**Tested version:** exact local SDK **0.0.0, unpublished**, profile pinned by the [recipe manifest](/reference-inputs/recipes-v1/manifest.json). This recipe uses the separate immutable PIN-1.3 commands profile, version 0.0.0 unpublished. Do not combine its runtime replacement members with sdk-framework-v1. The complete commands consumer and manifest describe its exact JS/WASM pins.

Open the [complete gallery source](@/docs/examples/gallery.md#toolbar) and [download the complete recipe sources](/reference-inputs/recipes-v1/source.zip). This is local source/build proof; registry/release, public hosting, native/device/OS/AT and performance/budget qualification remain open.

## Example and expected outcome

**Input:** Project kickoff has heading level 1 and bold Friday. The owning commands consumer selects Friday.

**Action:** Mount the commands consumer, then attachToolbar(window.commandsExample). Tab to Bold and press Enter to remove bold. Activate Heading 2, then Undo.

**Expected output:** Friday keeps its text and loses bold. The first block becomes heading level 2, then Undo restores heading level 1. Read-only disables every formatting button.

This checked excerpt comes from `examples/recipes/toolbar.mjs`, lines 1–23. The [downloadable excerpt](/reference-inputs/recipes-v1/toolbar.mjs) has SHA-256 `40cc51566060b238a9a2af821dccba38313e5a968aedebb79a6810f13dad2304`; the manifest pins full source, profile and fixture hashes.

```js
// Host composition over the owning command consumer, not another command model.
export function attachToolbar(owner, parent = document.body) {
 const toolbar=document.createElement('div');toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Document formatting');
 const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-label','Formatting status');
 const buttons=[];let bold;
 const capture=()=>{if(document.activeElement!==owner.editor.root)return;bold?.dispose();bold=owner.editor.captureCommand('bold',undefined,toolbar);};
 const check=result=>{owner.releaseResult(result);if(['rejected','unavailable'].includes(result.disposition))throw Error(result.reason||'Formatting unavailable; return to the editor and select text');};
 const run=(label,action)=>{
  const button=document.createElement('button');button.type='button';button.textContent=label;
  button.onpointerdown=event=>{capture();event.preventDefault();};
  button.onclick=()=>{try{action();status.textContent=label+' applied';}catch(error){status.textContent=error.message;}};
  buttons.push(button);toolbar.append(button);
 };
 run('Bold',()=>{const target=bold;bold=undefined;if(!target)throw Error('Select text in the editor first');try{check(target.execute());}finally{target.dispose();}});
 run('Heading 2',()=>{if(!owner.heading(2))throw Error('Heading unavailable');});
 run('Undo',()=>check(owner.history('undo')));
 // Capture before Tab moves focus. The SDK retained target permits this group,
 // and rejects revision changes, read-only, disposal or unrelated focus owners.
 owner.editor.root.addEventListener('keydown',capture);document.addEventListener('selectionchange',capture);
 const unsubscribe=owner.editor.subscribe(state=>{for(const button of buttons)button.disabled=!state.ready||state.readOnly;});
 if(owner.editor.root.parentElement===parent)owner.editor.root.after(toolbar,status);else parent.append(toolbar,status);capture();
 return ()=>{unsubscribe();bold?.dispose();owner.editor.root.removeEventListener('keydown',capture);document.removeEventListener('selectionchange',capture);for(const button of buttons){button.onclick=null;button.onpointerdown=null;}toolbar.remove();status.remove();};
}
```

## Failure and recovery

Buttons use native keyboard activation and a named group. A polite status region reports errors. CaptureCommand and captureHistory remain the authority; the consumer releases returned anchors. Disabled controls do not authorize document writes. This checks keyboard DOM behavior, not OS assistive technology.

## Cleanup

Call the returned toolbar disposer before commandsExample.close(). Unsubscribe, remove handlers and DOM, then await the SDK flush/disposal report.

## Migration and compatibility

Use [compatibility](@/docs/reference/compatibility.md), [versioned lifecycle APIs](@/docs/reference/api-lifecycle.md), [migration](@/docs/migrate/_index.md) and the [recipe index](@/docs/guides/recipes/_index.md). Prepared failure transports and synthetic paste are deterministic checks; real OS input and service durability need their own evidence.
