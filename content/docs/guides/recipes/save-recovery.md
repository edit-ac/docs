+++
title = "Recover from a quota or save failure"
description = "A checked input, action, outcome and recovery using the owning consumer."
weight = 3
+++

Open the local ticket preset and type a change. The deterministic check injects QuotaExceededError only for the selected database updates store; its sibling has a separate identity.

## Before you start

**Tested version:** exact local SDK **0.0.0, unpublished**, profile pinned by the [recipe manifest](/reference-inputs/recipes-v1/manifest.json). Use the real local playground recovery UI. Its unchanged canonical local-editor suite proves the separate-copy recovery and reset path; the named recipe suite adds a scoped failure plus independent sibling preservation check.

Open the [complete gallery source](@/docs/examples/gallery.md#ticket) and [download the complete recipe sources](/reference-inputs/recipes-v1/source.zip). This is local source/build proof; registry/release, public hosting, native/device/OS/AT and performance/budget qualification remain open.

## Example and expected outcome

**Input:** Open the local ticket preset and type a change. The deterministic check injects QuotaExceededError only for the selected database updates store; its sibling has a separate identity.

**Action:** Save locally. On failure, keep the tab open, export recovery, restore storage access, then choose Recover into separate copy. Export the backup download before closing. Never clear the database as a retry.

**Expected output:** The failed flush produces an unsaved report with checkpoint bytes and pending updates. The sibling still saves independently. Recovery publishes a verified checkpoint in a new database and reopens the same authored text; the original database stays listed as a backup until explicit reset.

This checked excerpt comes from `playground/app.mjs`, lines 52–68. The [downloadable excerpt](/reference-inputs/recipes-v1/save-recovery.mjs) has SHA-256 `3d4d33c5ca83354a1605d07219ad9d9f67590865af3322839945762512c0cb75`; the manifest pins full source, profile and fixture hashes.

```js
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
```

## Failure and recovery

If publication fails, restore the previous read-only setting and keep the old editor/identity. If disposal fails, retain the report outside the component lifetime. A local acknowledgement does not establish remote durability. Reset is destructive, explicit and preceded by an export; do not use it for recovery.

## Cleanup

Await disposal; retain unsaved reports and downloads before releasing the host. The automated fixture restores IDBObjectStore.add in finally and removes only its own temporary consumer.

## Migration and compatibility

Use [compatibility](@/docs/reference/compatibility.md), [versioned lifecycle APIs](@/docs/reference/api-lifecycle.md), [migration](@/docs/migrate/_index.md) and the [recipe index](@/docs/guides/recipes/_index.md). Prepared failure transports and synthetic paste are deterministic checks; real OS input and service durability need their own evidence.
