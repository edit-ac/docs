#!/usr/bin/env python3
"""Pin troubleshooting reproductions to owning consumers, fixtures and profiles."""
import hashlib,io,json,sys,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def raw(p):return (ROOT/p).read_bytes()
def sha(b):return hashlib.sha256(b).hexdigest()
def obj(p):return json.loads(raw(p))
outputs={}
qualification=ROOT/'examples/troubleshooting/qualification.json'
qualified=qualification.exists()
if qualified and '--check' in sys.argv:
 q=json.loads(qualification.read_bytes());assert q['parent']=='DWF-1.38' and q['published'] is False
 assert q['counts']==dict(tests=9,passed=9,failed=0,skipped=0,cancelled=0,todo=0)
 for p,h in q['sourceFiles'].items():assert sha(raw(p))==h,('Qualification source drift',p)
def out(p,b):outputs[p]=b.encode() if isinstance(b,str) else b
entries=[
 dict(id='assets',title='Recover from mismatched JS and WASM',diagnostic='Initialization rejects with an EngineError mentioning a missing WASM export (wasm.__wbindgen_add_to_stack_pointer is not a function in the pinned Chromium run). The editor phase is failed, ready is false and no localCommitted receipt is created.',reproduce='Save Due Thursday through the real editor, close it, then open the same database in a fresh browser realm. The prepared transport serves a valid eight-byte empty WASM module at the engine URL. This models incompatible JS/WASM bodies, rather than a network outage.',recover='Retain the database identity and checkpoint. Dispose the failed instance, restore the exact paired JS/WASM assets, and reopen in a fresh realm. A successfully instantiated but incompatible WASM body can poison the generated module cache; retrying within that same realm does not replace its exports. The test independently expects Due Thursday and no error. It never reseeds or deletes the saved database.',profile='examples/lifecycle/manifest.json',source='examples/lifecycle/consumer.mjs'),
 dict(id='content',title='Preserve unsupported schema and custom content',diagnostic='A restore request with schema future.schema.v99 rejects with EngineError / EngineRejected: unsupported identity envelope. Unknown custom data instead has a source fallback: Future kickoff. A fallback does not authorize editing that custom type.',reproduce='Use the structural-callout-v2 production packages. Save an inert future.team-callout envelope at dataVersion 7 and a demo.highlight mark at version 9 with an extra retain field. Attempt restore with a deliberately incompatible expected schema, then reopen with extensions absent.',recover='Keep the original checkpoint and journal unmodified. Reopen with the matching original identity and compatible runtime. The test compares complete block structures before/after and restored serialization, the nested unknown payload, future mark version/extra field and visible fallback. Do not reconstruct a document from fallback text or silently downgrade its schema.',profile='examples/troubleshooting/profile.json',source='examples/troubleshooting/upstream/session.mjs'),
 dict(id='loading',title='Recover from cancelled browser initialization',diagnostic='ready rejects with initialization canceled. A visible host element does not establish ready state. A cancelled instance reaches destroyed and releases subscriptions and recovered storage.',reproduce='Save Due Thursday, close the editor, and hold the prepared recovery port while opening. Dispose before recovery resolves, then release the held real recovery. Await all issued sessions being disposed.',recover='Keep the database and its identity. Dispose the cancelled editor and explicitly remount after late recovery has released its writer/storage resources. The independently expected result is Due Thursday with a live ready instance; final close releases it.',profile='examples/lifecycle/manifest.json',source='examples/lifecycle/consumer.mjs'),
 dict(id='ssr',title='Keep browser initialization behind the client boundary',diagnostic='The deliberate null-host server-side mount reports Invalid value used in weak set in pinned Node 24.19.0. This low-level error means no valid browser host was provided; it is not a user-facing SDK diagnostic contract. Importing the public core/web entries alone accesses none of window, document, indexedDB, navigator, fetch or WebAssembly.',reproduce='Run the pinned production tarballs in a Node child process with throwing getters for browser globals. Import core/web without mounting, then deliberately call createEditor with no browser host. The diagnostic is recorded separately from the import result.',recover='Render a host on the server and mount only after browser hydration. The loading reproduction separately executes real browser mount, cancellation and remount with saved content. The qualified React/SSR and Astro static/SSR/navigation quickstarts provide the complete framework lifecycle; do not run createEditor during SSR.',profile='examples/troubleshooting/profile.json',source='examples/troubleshooting/callout-harness.mjs'),
 dict(id='quota',title='Recover an unsaved edit after quota failure',diagnostic='QuotaExceededError: Prepared local quota failure. localCommitted is null for the failed edit, and the indicator does not claim Saved locally. Remote save remains not-configured.',reproduce='Enable the prepared IndexedDB readwrite failure in the owning lifecycle consumer, replace Friday with Thursday, and await the rejected local flush. Assert Due Thursday remains visible before teardown.',recover='Destroy with policy report and retain the returned recovery checkpoint and unsaved updates. The test requires nonempty bytes and updates, creates a distinct recovery database from the complete checkpoint, and independently reads Due Thursday with no error. Keep the original database and backup until recovery is verified. A production export must retain both checkpoint and journal bytes; do not save only rendered text.',profile='examples/lifecycle/manifest.json',source='examples/lifecycle/consumer.mjs'),
 dict(id='permission',title='Handle revoked host write permission',diagnostic='The captured intent returns rejected / stale-or-unavailable-command-target; new capture is unavailable and direct public commit throws Editor is read-only.',reproduce='Select Friday in the command consumer, capture replace, then have the prepared host revoke write access using setReadOnly(true). Attempt both the old intent and a direct commit. Compare full block snapshots before/after.',recover='Preserve the document and keep editing disabled until the authoritative host explicitly reauthorizes it. The fixture then calls setReadOnly(false), reselects Friday and captures a new replace command. Only that new intent commits Due Thursday. This is a local host-policy fixture, not a remote ACL service or OS permission test.',profile='examples/commands/manifest.json',source='examples/commands/consumer.mjs'),
 dict(id='stale',title='Recover a stale command without retargeting',diagnostic='The captured replace intent returns rejected / stale-or-unavailable-command-target after another admitted edit advances the revision.',reproduce='Select Friday and capture replace. Apply Bold through the owning command consumer before executing the captured replacement with Monday. Compare complete semantic/selection snapshots around the rejected execution.',recover='Discard and dispose the stale intent. Ask for or deliberately establish a new selection, then recapture replace. The old intent leaves Due Friday and all newer formatting intact; the new intent alone changes it to Due Thursday. Never retry against an implicit current caret.',profile='examples/commands/manifest.json',source='examples/commands/consumer.mjs'),
]
fixture={'license':'Apache-2.0','initial':['Project kickoff','Owner: Alex','Due Friday','Draft agenda','Confirm attendees','Reference'],'edited':['Project kickoff','Owner: Alex','Due Thursday','Draft agenda','Confirm attendees','Reference'],'incompatibleWasmHex':'0061736d01000000','unsupportedSchema':'future.schema.v99','futureEnvelope':{'version':1,'type':'future.team-callout','dataVersion':7,'source':'Future kickoff','payload':{'title':'Project kickoff','body':['Owner: Alex','Due Friday'],'unknown':{'flag':True}}},'futureMark':[9,{'label':'future highlight','extra':'retain'}]}
out('examples/troubleshooting/fixtures.json',json.dumps(fixture,indent=2)+'\n')
source=raw('tests/docs-troubleshooting.test.mjs');lines=source.decode().splitlines()
for i,e in enumerate(entries):
 e['testSource']='tests/docs-troubleshooting.test.mjs';e['start']=lines.index('// case:'+e['id']+':start')+2;e['end']=lines.index('// case:'+e['id']+':end');e['testSha256']=sha(source);e['sourceSha256']=sha(raw(e['source']));e['profileSha256']=sha(raw(e['profile']));e['fixture']='examples/troubleshooting/fixtures.json';e['fixtureSha256']=sha(outputs[e['fixture']]);snippet='\n'.join(lines[e['start']-1:e['end']])+'\n';e['snippetSha256']=sha(snippet.encode());e['page']='content/docs/troubleshooting/'+e['id']+'.md';out('static/reference-inputs/troubleshooting-v1/'+e['id']+'.mjs',snippet)
 out(e['page'],f'''+++
title = "{e['title']}"
description = "An observable failure, deterministic reproduction and data-preserving recovery."
weight = {i+1}
+++

## Symptom and diagnostic

{e['diagnostic']}

## Before you start

**Tested version:** local unpublished **0.0.0** production tarballs, with separate exact package families in the [source/profile manifest](/reference-inputs/troubleshooting-v1/manifest.json). These local consumers establish no registry/release, public-hosted, native/device/OS/IME/AT or performance/budget qualification.

Start from the [complete Project kickoff gallery](@/docs/examples/gallery.md) and the [versioned API profile](@/docs/reference/api-capabilities.md). Record diagnostics, profile, identity and asset hashes without private content or credentials.

## Reproduce

{e['reproduce']}

Run `node --test tests/docs-troubleshooting.test.mjs` in the docs checkout with Node 24.19.0, npm 11.17.0 and the installed Playwright 1.64.0 module named by `DOCS_PLAYWRIGHT_MODULE`. No provider, microphone or external host is used. [Download complete test/consumer sources](/reference-inputs/troubleshooting-v1/source.zip); obtain only the immutable local archives identified by the manifest, never substitute a same-version archive from another family.

## Example and expected outcome

The [exact checked reproduction range](/reference-inputs/troubleshooting-v1/{e['id']}.mjs) comes from the named test, lines {e['start']}–{e['end']}. Its complete harness, source, fixtures and package hashes are in the download and manifest; the range alone is not a standalone script.

## Preserve and recover

{e['recover']}

## Failure and recovery

A transport acknowledgement or connected state is not a durable local save or remote-host receipt. Await the captured local flush barrier and its genuine receipt. If saving fails, retain the recovery export and diagnose the original failure before retrying. Do not silently clear documents, delete a database or downgrade a schema.

## Limits and cleanup

Always dispose captured commands and await editor teardown. The harness closes contexts/browsers, HTTP listeners and extracted temporary packages even on failure. Prepared quota, read-only, cancellation and incompatible-asset inputs model host failures; they are not actual disk exhaustion, remote ACL or OS observations. Unsupported custom editing remains unavailable; source fallback is preservation, not feature support.

## Migration and compatibility

Read [compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [lifecycle/save semantics](@/docs/reference/lifecycle.md) and the [upgrade/rollback procedure](@/docs/troubleshooting/upgrades.md). The [release status](@/docs/reference/status.md) keeps original publication/platform gates open.
''')
out('examples/troubleshooting/README.md','''# Reproduce and recover local editor failures

DWF-1.38: local unpublished production consumers only. Run Node 24.19.0 / npm 11.17.0, set DOCS_PLAYWRIGHT_MODULE to installed Playwright 1.64.0, and run `node --test tests/docs-troubleshooting.test.mjs` from docs. No installation/download during browser setup except offline local npm archive installation. Lifecycle/commands use their exact independently admitted PIN-1.3 package/runtime manifests. Structural preservation and SSR use structural-callout-v2 exclusively. Never mix same-version archives across families. The test-only lifecycle recovery observer delegates to the production owner; it is not an advertised public SDK API.

Manifest source ranges are reproducible test functions, not standalone snippets. Fixtures are Apache-2.0 prepared input. Sources require the exact immutable local archives referenced by their profile manifests. Browser/HTTP/temp resources are torn down in finally hooks. Every expected diagnostic and independent preservation/recovery assertion lives in tests/docs-troubleshooting.test.mjs. This supplies no registry, deployment, provider, OS, native, IME/AT, numerical performance or remote service evidence.
''')
files=['tests/docs-troubleshooting.test.mjs','examples/troubleshooting/callout-harness.mjs','examples/troubleshooting/profile.json','examples/troubleshooting/upstream/session.mjs','examples/troubleshooting/upstream/recipe.mjs','examples/troubleshooting/fixtures.json','examples/troubleshooting/README.md','examples/lifecycle/consumer.mjs','examples/lifecycle/harness.mjs','examples/lifecycle/manifest.json','examples/commands/consumer.mjs','examples/commands/harness.mjs','examples/commands/manifest.json','examples/concepts/kickoff-v1.md']
archive=io.BytesIO();hashes={}
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files:
  b=outputs[p] if p in outputs else raw(p);hashes[p]=sha(b);info=zipfile.ZipInfo(p,(2026,10,18,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,b)
download='/reference-inputs/troubleshooting-v1/source.zip';out('static'+download,archive.getvalue())
manifest={'schemaVersion':1,'parent':'DWF-1.38','published':False,'releaseQualified':False,'entries':entries,'files':hashes,'download':download,'downloadSha256':sha(archive.getvalue()),'scope':'Prepared failures through exact local production runtime; no external release/platform qualification'}
out('examples/troubleshooting/manifest.json',json.dumps(manifest,indent=2)+'\n');out('static/reference-inputs/troubleshooting-v1/manifest.json',json.dumps(manifest,indent=2)+'\n')
index='''+++
title = "Troubleshooting"
description = "Reproduce local failures and preserve documents through recovery."
weight = 9
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

Use a bounded reproduction before choosing a recovery. These guides test prepared failures through exact local unpublished production consumers, with independent diagnostic and data-preservation assertions. They do not establish registry/release, hosted service, native/device/OS/IME/AT or performance qualification.

## Before you start

**Prerequisites:** keep the original checkpoint/journal and record schema/profile, document identity, asset hashes and diagnostic. **Tested version:** separate pinned local **0.0.0, unpublished** families in the [manifest](/reference-inputs/troubleshooting-v1/manifest.json), not interchangeable version labels.

## Example and expected outcome

'''+''.join('- ['+e['title']+'](@/docs/troubleshooting/'+e['id']+'.md)\n' for e in entries)+'''
Each page starts with the observed symptom, then a deterministic reproduction and independently expected preserved/recovered data. [Complete checked source](/reference-inputs/troubleshooting-v1/source.zip) reuses the [example gallery](@/docs/examples/gallery.md).

## Failure and recovery

Never silently clear a database, downgrade a schema or replace an original checkpoint with a lossy text export. A connected transport is not durable save. Retain recoverable bytes, dispose failed instances, then retry compatible assets or reopen a separate recovery copy. Prepared failures are not real OS/disk/host-service qualification.

## Migration and compatibility

Read [compatibility](@/docs/reference/compatibility.md), [migration](@/docs/migrate/_index.md), [versioned APIs](@/docs/reference/api-capabilities.md) and [upgrade/rollback](@/docs/troubleshooting/upgrades.md). Public release qualification remains [pending](@/docs/reference/status.md).
'''
out('content/docs/troubleshooting/_index.md',index)
nav=obj('navigation.json')
for p in [e['page'] for e in entries]+['content/docs/troubleshooting/upgrades.md']:
 if p not in nav['pages']:nav['pages'].append(p)
out('navigation.json',json.dumps(nav,indent=2)+'\n')
global_manifest=obj('examples/manifest.json');global_manifest['examples']=[e for e in global_manifest['examples'] if e['id']!='troubleshooting/1'];global_manifest['examples'].insert(next((i for i,e in enumerate(global_manifest['examples']) if e['id']=='recipes/1'),len(global_manifest['examples'])),{'id':'troubleshooting/1','parent':'DWF-1.38','maturity':'local-prepared-failures','runtimeQualified':qualified,'testedSdkVersion':'0.0.0 (unpublished; exact separate families)','source':'examples/troubleshooting/README.md','manifest':'examples/troubleshooting/manifest.json','qualification':'examples/troubleshooting/qualification.json','pages':['content/docs/troubleshooting/_index.md']+[e['page'] for e in entries],'scope':'Prepared host failures; independent production preservation/recovery; no external qualification'})
out('examples/manifest.json',json.dumps(global_manifest,indent=2)+'\n');out('static/concepts/project-kickoff-v1/manifest.json',json.dumps(global_manifest,indent=2)+'\n')
stale=[]
for p,b in outputs.items():
 target=ROOT/p
 if not target.exists() or target.read_bytes()!=b:
  if '--check' in sys.argv:stale.append(p)
  else:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
if stale:print('Stale troubleshooting: '+', '.join(stale),file=sys.stderr);sys.exit(1)
print(json.dumps({'entries':len(entries),'outputs':len(outputs),'check':'--check' in sys.argv}))
