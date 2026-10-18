// Project kickoff is prepared public content; the production engine owns all semantics.
export function createKickoff(runtime, identity) {
  const engine=runtime.createEngine({profile:'v5',...identity,nodes:[
    {text:'Project kickoff'},{text:'Owner: Alex'},{text:'Due Friday'},
    {text:'Draft agenda'},{text:'Confirm attendees'},{text:'Reference'}]});
  try {
    const ids=engine.read().visible.filter(n=>n.kind==='block').map(n=>n.id);
    engine.commit(engine.prepare({kind:'format',origin:'seed',marks:[],blocks:[
      {targets:[ids[0]],attributes:{type:'heading',level:1},action:'apply'}]}));
    engine.commit(engine.prepare({kind:'editor',origin:'seed',commands:[
      {type:'wrap',targets:ids.slice(3,5),style:{type:'checklist'}},
      {type:'markAt',owner:ids[2],from:4,to:10,mark:'bold',action:'apply'},
      {type:'markAt',owner:ids[5],from:0,to:9,mark:'link',action:'apply',href:'https://example.invalid/project-kickoff'}]}));
    return engine;
  } catch(error) {engine.dispose();throw error;}
}
