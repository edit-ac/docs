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
