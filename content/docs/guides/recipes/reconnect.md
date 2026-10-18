+++
title = "Reconnect two local views safely"
description = "A checked input, action, outcome and recovery using the owning consumer."
weight = 4
+++

Open the prepared local collaboration example. Two real Session replicas start from Project kickoff; the bounded host channel copies update frames and is not a backend.

## Before you start

**Tested version:** exact local SDK **0.0.0, unpublished**, profile pinned by the [recipe manifest](/reference-inputs/recipes-v1/manifest.json). The existing gallery entry contains the complete source, not a copied synchronization implementation. Optional remote hosting stays unavailable until the actual roadmap28 host and authorization qualify.

Open the [complete gallery source](@/docs/examples/gallery.md#collaborative-note) and [download the complete recipe sources](/reference-inputs/recipes-v1/source.zip). This is local source/build proof; registry/release, public hosting, native/device/OS/AT and performance/budget qualification remain open.

## Example and expected outcome

**Input:** Open the prepared local collaboration example. Two real Session replicas start from Project kickoff; the bounded host channel copies update frames and is not a backend.

**Action:** Disconnect the views, edit A and B, reconnect, then Undo A. Save each local replica, close and reopen it.

**Expected output:** Both replicas converge with each offline edit exactly once. Undo A preserves the contribution from B. Reopened local checkpoints retain the edits. The status distinguishes delivery, local save and absent remote durability.

This checked excerpt comes from `playground/scenarios/collaboration/channel.mjs`, lines 1–17. The [downloadable excerpt](/reference-inputs/recipes-v1/reconnect.mjs) has SHA-256 `56be8aee3b91c28143451a197df04fa2a9ff20951ac82a8484bb459c7994c2f2`; the manifest pins full source, profile and fixture hashes.

```js
// Host transport only. Production SyncAttachment owns frames, replay and semantics.
export function createLocalChannel({maxFrames=32,maxBytes=32*1024*1024}={}) {
 const queues=[[],[]];let bytes=0,closed=false,accepted=0,delivered=0;
 return {
  transport(side){if(side!==0&&side!==1)throw Error('Unknown local peer');return {send(frame){
   if(closed)return false;
   if(!(frame instanceof Uint8Array)||frame.byteLength>16*1024*1024)throw Error('Invalid local frame');
   if(queues[0].length+queues[1].length>=maxFrames||bytes+frame.byteLength>maxBytes)return false;
   const copy=frame.slice();queues[1-side].push(copy);bytes+=copy.byteLength;accepted++;return true;
  }};},
  deliver(attachments){if(closed)throw Error('Local channel closed');let count=0;
   for(const side of [0,1])while(queues[side].length){const frame=queues[side].shift();bytes-=frame.byteLength;attachments[side].receive(frame);count++;delivered++;}return count;
  },
  get state(){return {closed,queued:queues[0].length+queues[1].length,bytes,accepted,delivered};},
  close(){closed=true;queues[0].length=queues[1].length=0;bytes=0;}
 };
}
```

## Failure and recovery

A delayed or cancelled host operation cannot gain document authority. Read-only blocks local edits while still allowing admitted peer delivery. Save errors retain an exportable recovery checkpoint. Never expose an anonymous shared room or claim this prepared channel is a durable cloud service.

## Cleanup

Await each SyncAttachment close and editor destroy, detach channel callbacks and remove both roots. The full canonical collaboration suite checks teardown and local recovery.

## Migration and compatibility

Use [compatibility](@/docs/reference/compatibility.md), [versioned lifecycle APIs](@/docs/reference/api-lifecycle.md), [migration](@/docs/migrate/_index.md) and the [recipe index](@/docs/guides/recipes/_index.md). Prepared failure transports and synthetic paste are deterministic checks; real OS input and service durability need their own evidence.
