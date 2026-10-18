#!/usr/bin/env python3
"""Derive task walkthroughs from owning source; never duplicate SDK semantics."""
import hashlib,io,json,sys,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def raw(p):return (ROOT/p).read_bytes()
def sha(b):return hashlib.sha256(b).hexdigest()
def obj(p):return json.loads(raw(p))
outputs={}
def output(p,b):outputs[p]=b.encode() if isinstance(b,str) else b
quick='examples/quickstarts/manifest.json';shared='examples/recipes/shared-profile.json'
qualification=ROOT/'examples/recipes/qualification.json'
if '--check' in sys.argv:
 q=json.loads(qualification.read_bytes());assert q['parent']=='DWF-1.37' and q['published'] is False
 assert q['counts']==dict(tests=9,passed=9,failed=0,skipped=0,cancelled=0,todo=0)
 for p,h in q['sourceFiles'].items():assert sha(raw(p))==h,('Qualification source drift',p)
entries=[
 dict(id='toolbar',title='Build a keyboard toolbar',source='examples/recipes/toolbar.mjs',start=1,end=23,profile='examples/commands/manifest.json',fixture='examples/concepts/kickoff-v1.md',gallery='toolbar',
 input='Project kickoff has heading level 1 and bold Friday. The owning commands consumer selects Friday.',action='Mount the commands consumer, then attachToolbar(window.commandsExample). Tab to Bold and press Enter to remove bold. Activate Heading 2, then Undo.',output='Friday keeps its text and loses bold. The first block becomes heading level 2, then Undo restores heading level 1. Read-only disables every formatting button.',recovery='Buttons use native keyboard activation and a named group. A polite status region reports errors. CaptureCommand and captureHistory remain the authority; the consumer releases returned anchors. Disabled controls do not authorize document writes. This checks keyboard DOM behavior, not OS assistive technology.',cleanup='Call the returned toolbar disposer before commandsExample.close(). Unsubscribe, remove handlers and DOM, then await the SDK flush/disposal report.',extra='This recipe uses the separate immutable PIN-1.3 commands profile, version 0.0.0 unpublished. Do not combine its runtime replacement members with sdk-framework-v1. The complete commands consumer and manifest describe its exact JS/WASM pins.'),
 dict(id='markdown-paste',title='Paste Markdown with a checked semantic result',source='examples/quickstarts/examples/task-editor/markdown.mjs',start=1,end=5,profile=quick,fixture='examples/recipes/markdown-input.md',gallery='browser',
 input='Use the complete browser quickstart with ?markdown. In the bounded recipe check, the shared owner starts with description; place the caret at its end. The downloadable input is a level-2 Release notes heading followed by bold Friday.',action='Paste the plain-text fixture. markdownOptions loads the optional parser only when the host explicitly enables it. The editor paste pipeline owns parsing, insertion, history and the current target.',output='Readback contains a Release notes block with heading level 2 and a Friday run with bold=true; literal ## and ** are not the stored formatting. Save locally, close and reopen the same identity: both texts remain.',recovery='A parser/engine load failure is visible and may be retried; keep the current document identity and recovery export. Plain mode treats the same text literally. Rich HTML and permission-sensitive assets have separate policies; this check uses a synthetic ClipboardEvent with prepared text, not an OS clipboard claim.',cleanup='Await editor.destroy with the appropriate flush/report policy. Release the browser context and any parser waiters through the owning SDK; do not keep a second document model.',extra='Both recipes use sdk-framework-v1 exact unpublished 0.0.0 tarballs. The snippet is the quickstart enablement hook; the shared recipe harness executes the same qualified parser through the owning shared consumer. Inspect tests/docs-recipes.test.mjs for the independent heading/mark assertions.'),
 dict(id='save-recovery',title='Recover from a quota or save failure',source='playground/app.mjs',start=52,end=68,profile='playground/manifest.json',fixture='examples/concepts/kickoff-v1.md',gallery='ticket',
 input='Open the local ticket preset and type a change. The deterministic check injects QuotaExceededError only for the selected database updates store; its sibling has a separate identity.',action='Save locally. On failure, keep the tab open, export recovery, restore storage access, then choose Recover into separate copy. Export the backup download before closing. Never clear the database as a retry.',output='The failed flush produces an unsaved report with checkpoint bytes and pending updates. The sibling still saves independently. Recovery publishes a verified checkpoint in a new database and reopens the same authored text; the original database stays listed as a backup until explicit reset.',recovery='If publication fails, restore the previous read-only setting and keep the old editor/identity. If disposal fails, retain the report outside the component lifetime. A local acknowledgement does not establish remote durability. Reset is destructive, explicit and preceded by an export; do not use it for recovery.',cleanup='Await disposal; retain unsaved reports and downloads before releasing the host. The automated fixture restores IDBObjectStore.add in finally and removes only its own temporary consumer.',extra='Use the real local playground recovery UI. Its unchanged canonical local-editor suite proves the separate-copy recovery and reset path; the named recipe suite adds a scoped failure plus independent sibling preservation check.'),
 dict(id='reconnect',title='Reconnect two local views safely',source='playground/scenarios/collaboration/channel.mjs',start=1,end=17,profile='playground/scenarios/collaboration/manifest.json',fixture='examples/concepts/kickoff-v1.md',gallery='collaborative-note',
 input='Open the prepared local collaboration example. Two real Session replicas start from Project kickoff; the bounded host channel copies update frames and is not a backend.',action='Disconnect the views, edit A and B, reconnect, then Undo A. Save each local replica, close and reopen it.',output='Both replicas converge with each offline edit exactly once. Undo A preserves the contribution from B. Reopened local checkpoints retain the edits. The status distinguishes delivery, local save and absent remote durability.',recovery='A delayed or cancelled host operation cannot gain document authority. Read-only blocks local edits while still allowing admitted peer delivery. Save errors retain an exportable recovery checkpoint. Never expose an anonymous shared room or claim this prepared channel is a durable cloud service.',cleanup='Await each SyncAttachment close and editor destroy, detach channel callbacks and remove both roots. The full canonical collaboration suite checks teardown and local recovery.',extra='The existing gallery entry contains the complete source, not a copied synchronization implementation. Optional remote hosting stays unavailable until the actual roadmap28 host and authorization qualify.'),
 dict(id='two-editors',title='Share assets between description and comment editors',source='examples/recipes/upstream/session.mjs',start=35,end=54,profile=shared,fixture='examples/recipes/shared-input.json',gallery='ticket',
 input='The owning SDK-1.10 consumer seeds description and comment into different databases and identities. Both use one compatible module owner and the same immutable engine URL.',action='Mount both task configurations concurrently. Append authored to description, flush and destroy it, reopen description. Toggle comment read-only, then edit and save comment. Undo in comment.',output='Description reopens as description authored. Comment initially remains comment; read-only denies a write. Its independent edit becomes comment independent and Undo returns comment. Destroying description leaves the sibling usable; final handle count and editor roots are zero.',recovery='SHR-01–SHR-08 receipts cover both mount orders, mixed optional configurations, cancelled waiters, load retry, binding composition, route assets, conflict detection and renderer cleanup. A failed shared load rejects both waiters; dispose failed instances and explicitly remount. A scoped quota failure preserves pending updates without blocking the sibling.',cleanup='Each handle, history, storage and permission configuration belongs to its own editor. Await each destroy and remove host subscriptions/roots. Sharing WASM/module assets never shares a document or undo stack.',extra='Only SHR resource prerequisites are qualified. The union of optional assets needed by live instances can load once, while feature enablement remains per instance. The retained 78 browser cells and exact tarballs are authenticated; no aggregate timing/budget or future document/code feature qualification is claimed.'),
 dict(id='site-routes',title='Reuse immutable assets across task and document routes',source='examples/recipes/upstream/site.mjs',start=31,end=61,profile=shared,fixture='examples/recipes/shared-input.json',gallery='browser',
 input='Use the owning Astro production graph: task and document pages share one client layout, pinned package set, JS chunks and engine URL. The document example only enables the qualified Markdown profile; it is not the future rich document/code preset.',action='Edit and close description on the task route. Reopen and verify it. Await cleanup before client-routing to document; edit that independent document, flush/close, then perform a full navigation and reopen it.',output='Description retains description saved task and document retains document saved document. Same-realm routing releases old handles before mounting new ones; full navigation evaluates the client entry once in a fresh realm. The engine asset URL stays identical across routes.',recovery='Use the exact owning common-layout/chunk configuration in production.mjs, not repeated wrappers with different URLs. Serve content-hashed bodies with stable URLs and appropriate immutable cache headers. SHR-06 retains cold, warm and cache-disabled transfers; cache hits depend on browser/host policy and cannot be guaranteed. Reject conflicting URLs or incompatible build identities and preserve the document for a compatible reopen.',cleanup='Await site.cleanup before client navigation. A full navigation initializes a fresh runtime; compatible bytes may be cached, live JS handles are not transferred. Abrupt shutdown cannot promise a final save. Authenticated SSR imports have no browser side effects.',extra='Source, emitted graph and asset inventories are linked in shared-profile.json and the retained SHR receipt. First load includes engine and required chunks; incremental instances reuse compatible assets. Optional Markdown adds only its owning union. No numerical performance campaign or cross-page cache guarantee is made.'),
]
output('examples/recipes/markdown-input.md','# Prepared paste input\n\n## Release notes\n\n**Friday**\n')
# The browser check pastes precisely the payload below, excluding the explanatory title.
output('examples/recipes/markdown-paste.txt','\n## Release notes\n\n**Friday**')
entries[1]['fixture']='examples/recipes/markdown-paste.txt'
output('examples/recipes/shared-input.json',json.dumps({'license':'Apache-2.0','description':'description','comment':'comment','document':'document','expected':{'description':'description authored','comment':'comment independent','routeDescription':'description saved task','routeDocument':'document saved document'}},indent=2)+'\n')
for e in entries:
 source=raw(e['source']);e['sourceSha256']=sha(source);e['profileSha256']=sha(raw(e['profile']));e['fixtureSha256']=sha(outputs.get(e['fixture'],raw(e['fixture']) if (ROOT/e['fixture']).exists() else b''));lines=source.decode().splitlines();assert 0<e['start']<=e['end']<=len(lines),(e['id'],len(lines));snippet='\n'.join(lines[e['start']-1:e['end']])+'\n';e['snippetSha256']=sha(snippet.encode());e['page']='content/docs/guides/recipes/'+e['id']+'.md';e['snippet']='/reference-inputs/recipes-v1/'+e['id']+'.mjs'
 output('static'+e['snippet'],snippet)
 page=f'''+++
title = "{e['title']}"
description = "A checked input, action, outcome and recovery using the owning consumer."
weight = {entries.index(e)+1}
+++

{e['input']}

## Before you start

**Tested version:** exact local SDK **0.0.0, unpublished**, profile pinned by the [recipe manifest](/reference-inputs/recipes-v1/manifest.json). {e['extra']}

Open the [complete gallery source](@/docs/examples/gallery.md#{e['gallery']}) and [download the complete recipe sources](/reference-inputs/recipes-v1/source.zip). This is local source/build proof; registry/release, public hosting, native/device/OS/AT and performance/budget qualification remain open.

## Example and expected outcome

**Input:** {e['input']}

**Action:** {e['action']}

**Expected output:** {e['output']}

This checked excerpt comes from `{e['source']}`, lines {e['start']}–{e['end']}. The [downloadable excerpt]({e['snippet']}) has SHA-256 `{e['snippetSha256']}`; the manifest pins full source, profile and fixture hashes.

```js
{snippet}```

## Failure and recovery

{e['recovery']}

## Cleanup

{e['cleanup']}

## Migration and compatibility

Use [compatibility](@/docs/reference/compatibility.md), [versioned lifecycle APIs](@/docs/reference/api-lifecycle.md), [migration](@/docs/migrate/_index.md) and the [recipe index](@/docs/guides/recipes/_index.md). Prepared failure transports and synthetic paste are deterministic checks; real OS input and service durability need their own evidence.
'''
 output(e['page'],page)
# Complete sources and exact owning metadata at original docs-relative paths.
members={}
for manifest,prefix in [(quick,'examples/quickstarts/'),('playground/manifest.json',''),('playground/scenarios/collaboration/manifest.json','')]:
 m=obj(manifest);members[manifest]=raw(manifest)
 for p in m['files']:members[prefix+p]=raw(prefix+p)
for p in (ROOT/'examples/commands').rglob('*'):
 if p.is_file():members[str(p.relative_to(ROOT))]=p.read_bytes()
for p in (ROOT/'examples/recipes').rglob('*'):
 if p.is_file() and p.name!='manifest.json':members[str(p.relative_to(ROOT))]=p.read_bytes()
for p,b in outputs.items():
 if p.startswith('examples/recipes/'):members[p]=b
members['examples/concepts/kickoff-v1.md']=raw('examples/concepts/kickoff-v1.md')
members['scripts/prepare-recipes.py']=raw('scripts/prepare-recipes.py');members['tests/docs-recipes.test.mjs']=raw('tests/docs-recipes.test.mjs');members['tests/docs-recipes-reader.test.mjs']=raw('tests/docs-recipes-reader.test.mjs')
members['RECIPE-SCOPE.md']=b'# Recipe source overlay\n\nOverlay these repository-relative files in the qualified local docs checkout. Exact unpublished tarballs, pinned Node/npm and installed Playwright are prerequisites, not included SDK releases. Shared-profile.json points at the immutable architecture evidence with complete emitted site assets. README.md in examples/recipes describes commands. No registry, cloud, native, OS or budget qualification.\n'
archive=io.BytesIO()
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p,b in sorted(members.items()):
  info=zipfile.ZipInfo(p,(2026,10,18,0,0,0));info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,b)
output('static/reference-inputs/recipes-v1/source.zip',archive.getvalue())
m=dict(schemaVersion=1,parent='DWF-1.37',published=False,releaseQualified=False,entries=entries,download='/reference-inputs/recipes-v1/source.zip',downloadSha256=sha(archive.getvalue()),files={p:sha(b) for p,b in sorted(members.items())},sharedProfile=shared)
output('examples/recipes/manifest.json',json.dumps(m,indent=2)+'\n');output('static/reference-inputs/recipes-v1/manifest.json',json.dumps(m,indent=2)+'\n')
index='''+++
title = "Task recipes"
description = "Checked tasks using complete local consumers and exact resource profiles."
weight = 7
sort_by = "weight"
template = "docs.html"
page_template = "doc-page.html"
+++

Choose a task and compare its input, action and independently expected output. Each walkthrough reuses its owning production consumer; no alternate editor, loader or synchronization engine is introduced. These are **local-only unpublished 0.0.0** recipes. The exact family/profile and source ranges are pinned in the [recipe manifest](/reference-inputs/recipes-v1/manifest.json); [download all sources](/reference-inputs/recipes-v1/source.zip).

## Checked walkthroughs

'''
for e in entries:index+=f'- [{e["title"]}](@/docs/guides/recipes/{e["id"]}.md) — {e["output"]}\n'
index+='''
## Before you start

Use the configured Node24.19.0/npm11.17.0, installed Playwright1.64.0 and exact retained package artifacts in the admitted local workspace. See the [complete examples gallery](@/docs/examples/gallery.md), [getting started](@/docs/getting-started/_index.md) and [compatibility](@/docs/reference/compatibility.md). SDK-1.10 SHR-01–SHR-08 qualifies resource prerequisites only; aggregate budget/performance, registry/release, public hosting and native/device/OS/AT acceptance remain open.

## Optional recipes and unavailable capabilities

[Cancelled asset upload and internal-link denial](@/docs/guides/references.md) have their own qualified prepared-host resolver source and permission/cancellation evidence under DWF-1.6; they do not authorize fetching private links. [Import preview/cancel](@/docs/guides/native-formats.md) remains a source study until its native/browser conversion profile qualifies. [Host operations](@/docs/guides/cloud-hosting.md) remain pending the real durable host; local fixtures cannot supply DWF-1.8 cloud proof. No absent capability is executed or counted as a passed runtime case.

## Failure and recovery

Keep authored text and exportable recovery on loading or save failure. Await owned cleanup before navigation, preserve an unsaved report and retry only the failed operation. Local storage acknowledgements and peer equality do not prove remote durability. No providers, live model calls, accounts or hidden backend are needed.

## Migration and compatibility

Read [migration](@/docs/migrate/_index.md), [lifecycle](@/docs/reference/lifecycle.md) and [capability status](@/docs/reference/status.md). All fixtures are redistributable Apache-2.0 prepared inputs. The named check is `node --test tests/docs-recipes.test.mjs`; owning canonical suites retain their exact independent evidence.
'''
output('content/docs/guides/recipes/_index.md',index)
nav=obj('navigation.json')
for e in entries:
 if e['page'] not in nav['pages']:nav['pages'].append(e['page'])
output('navigation.json',json.dumps(nav,indent=2)+'\n')
global_manifest=obj('examples/manifest.json');global_manifest['examples']=[e for e in global_manifest['examples'] if e['id']!='recipes/1'];global_manifest['examples'].append(dict(id='recipes/1',parent='DWF-1.37',maturity='local-runtime',runtimeQualified=True,testedSdkVersion='0.0.0 (unpublished; separate pinned families)',source='examples/recipes/README.md',manifest='examples/recipes/manifest.json',profile=shared,qualification='examples/recipes/qualification.json',pages=['content/docs/guides/recipes/_index.md']+[e['page'] for e in entries]))
output('examples/manifest.json',json.dumps(global_manifest,indent=2)+'\n');output('static/concepts/project-kickoff-v1/manifest.json',json.dumps(global_manifest,indent=2)+'\n')
stale=[]
for p,b in outputs.items():
 target=ROOT/p
 if not target.exists() or target.read_bytes()!=b:
  if '--check' in sys.argv:stale.append(p)
  else:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
if stale:print('Stale recipes: '+', '.join(stale),file=sys.stderr);sys.exit(1)
print(json.dumps({'recipes':len(entries),'outputs':len(outputs),'check':'--check' in sys.argv}))
