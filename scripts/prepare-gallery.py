#!/usr/bin/env python3
"""Curate existing consumers; never build an editor or grant a profile."""
import hashlib, html, io, json, sys, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def digest(b): return hashlib.sha256(b).hexdigest()
def read(p): return (ROOT/p).read_bytes()
def obj(p): return json.loads(read(p))
def text(p): return read(p).decode()
outputs={}
def output(p,b): outputs[p]=b.encode() if isinstance(b,str) else b
quick='examples/quickstarts/manifest.json'; local='playground/manifest.json'; collab='playground/scenarios/collaboration/manifest.json'
q=obj(quick)
# Explicit profile allow-list: source studies never acquire runtime status.
configs=[
 ('browser','Browser basic editor','basic','web',['editing','save'],quick,'examples/quickstarts/qualification.json','examples/quickstarts/examples/task-editor/editor.mjs',14,25,'/docs/getting-started/web/','Append docs; Bold owner; save/reopen retains the edited Owner paragraph.'),
 ('react','React basic editor','basic','react',['editing','save'],quick,'examples/quickstarts/qualification.json','examples/quickstarts/examples/task-editor/react.mjs',1,24,'/docs/getting-started/react/','SSR has no browser side effects; client mount edits and unmount disposes.'),
 ('toolbar','Formatting toolbar','toolbar','web',['formatting','readonly'],quick,'examples/quickstarts/qualification.json','examples/quickstarts/examples/task-editor/controls.mjs',2,17,'/docs/getting-started/web/','Bold owner applies the engine mark; read-only disables formatting.'),
 ('ticket','Ticket description','ticket','web',['editing','recovery','reset'],local,'playground/qualification.json','playground/app.mjs',20,28,'/docs/examples/playground/','PM ticket edits persist after Save locally/reload; reset exports a backup before deleting only the selected identity.'),
 ('collaborative-note','Collaborative note','collaboration','web',['collaboration','history','save'],collab,'playground/scenarios/collaboration/qualification.json','playground/scenarios/collaboration/channel.mjs',1,17,'/docs/examples/collaboration/','Offline A and B edits survive reconnect exactly once; Undo A preserves B. Peer equality is not a remote save.'),
]
entries=[]
for id,title,task,platform,features,manifest,qualification,source,start,end,page,outcome in configs:
 m=obj(manifest); members={}
 for file in m['files']:
  path=('examples/quickstarts/'+file) if manifest==quick else file
  members[path]=read(path)
 for path in [manifest,qualification,'examples/concepts/kickoff-v1.md']:
  members[path]=read(path)
 scripts=['scripts/check-examples.mjs','scripts/check-quickstarts.mjs'] if manifest==quick else ['scripts/check-playground.mjs','scripts/build-playground.mjs']
 if manifest==collab:scripts+=['scripts/build-playground-collaboration.mjs']
 if manifest==local:scripts+=['tests/playground-local.spec.ts']
 if manifest==collab:
  scripts+=['tests/playground-collaboration.spec.ts']
  for path in obj(local)['files']:members[path]=read(path)
 for path in scripts:members[path]=read(path)
 members['SOURCE-README.md']=(f'# {title} source download\n\nOverlay these original repository-relative paths in the admitted docs workspace. This archive contains source and exact artifact metadata, not the unpublished SDK tarballs or Node/Playwright/framework dependencies. Use Node24.19.0/npm11.17.0 and the linked complete guide. No registry, hosting, native, cloud, or release qualification. Project kickoff is Apache-2.0.\n').encode()
 # Artifact metadata is an authenticated pin, not a registry receipt or downloaded package.
 pin='../architecture/evidence/local-consumer-return/20261018/local-candidates-v5.json'
 members['local-candidates-v5.json']=read(pin)
 archive=io.BytesIO()
 with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
  for path,b in sorted(members.items()):
   info=zipfile.ZipInfo(path,(2026,10,18,0,0,0));info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,b)
 base='/reference-inputs/gallery-v1/'+id
 output('static'+base+'/source.zip',archive.getvalue())
 for path,b in members.items():output('static'+base+'/'+path,b)
 lines=text(source).splitlines();assert end<=len(lines),(source,end,len(lines))
 snippet='\n'.join(lines[start-1:end])+'\n'
 entry=dict(id=id,title=title,task=task,platform=platform,features=features,status='local-runtime',published=False,version='0.0.0',candidate='sdk-framework-v1',profile='v5',sourceCommit=q['sourceCommit'],fixture='examples/concepts/kickoff-v1.md',fixtureSha256=digest(read('examples/concepts/kickoff-v1.md')),manifest=manifest,manifestSha256=digest(read(manifest)),qualification=qualification,qualificationSha256=digest(read(qualification)),guide=page,outcome=outcome,download=base+'/source.zip',downloadSha256=digest(archive.getvalue()),files={p:digest(b) for p,b in members.items()},snippet=dict(file=source,start=start,end=end,sha256=digest(snippet.encode()),text=snippet),pinSha256=digest(read(pin)))
 entries.append(entry)
# Preserve a complete downloadable source study for the unavailable report profile.
report_members={str(p.relative_to(ROOT)):p.read_bytes() for p in (ROOT/'examples/extension-configurations').rglob('*') if p.is_file()}
report_members['examples/concepts/kickoff-v1.md']=read('examples/concepts/kickoff-v1.md')
report_members['REPORT-SCOPE.md']=b'# Structured report source study\n\nInput: Apache-2.0 Project kickoff. The owning catalog describes code/table/asset capabilities separately. A combined report in the admitted sdk-framework-v1 browser candidate is unavailable: zero report runtime cases. Expected conceptual actions: edit a table cell Friday to Thursday and undo; retain original code text and unavailable asset source/alt. These are source-study expectations, not executed report outcomes. Do not run an invented report or mix same-version candidate packages. Loading, read-only, reset/export and disposal must follow the actual owning profile before activation. Use the catalog guide and exact admission manifest; preserve documents on loading/save errors.\n'
report_archive=io.BytesIO()
with zipfile.ZipFile(report_archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for path,b in sorted(report_members.items()):
  info=zipfile.ZipInfo(path,(2026,10,18,0,0,0));info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,b)
output('static/reference-inputs/gallery-v1/structured-report/source-study.zip',report_archive.getvalue())
entries.append(dict(id='structured-report',title='Structured report',task='report',platform='web',features=['code','table','assets'],status='unavailable',published=False,version=None,candidate=None,profile=None,guide='/docs/examples/extension-configurations/',source='examples/extension-configurations/README.md',sourceManifest='examples/extension-configurations/admission.json',sourceManifestSha256=digest(read('examples/extension-configurations/admission.json')),sourceStudyDownload='/reference-inputs/gallery-v1/structured-report/source-study.zip',sourceStudySha256=digest(report_archive.getvalue()),sourceStudyFiles={p:digest(b) for p,b in report_members.items()},fixture='examples/concepts/kickoff-v1.md',fixtureSha256=digest(read('examples/concepts/kickoff-v1.md')),outcome='Source study only. No executable browser report or qualified code/table/asset combination is supplied. Runtime cases: 0.'))
manifest=dict(schemaVersion=1,parent='DWF-1.36',scope='unpublished local source/build only',entries=entries,originalDeferred=['EQL1.9','roadmap10 registry/release','native/device/OS/AT','cloud hosting','performance/budgets'])
output('examples/gallery/manifest.json',json.dumps(manifest,indent=2)+'\n');output('static/reference-inputs/gallery-v1/manifest.json',json.dumps(manifest,indent=2)+'\n')
intro='''+++
title = "Examples gallery"
description = "Complete checked consumers, source downloads and explicit capability limits."
weight = 1
+++

Choose a reader task, then open its complete source and checked outcome. **Local-only, unpublished SDK 0.0.0**: these are reproducible local package consumers, not registry or hosted releases. No backend, model calls or accounts are hidden behind the examples. Project kickoff is Apache-2.0 prepared sample content.

[Download the gallery manifest](/reference-inputs/gallery-v1/manifest.json). Each source archive includes its exact source and qualification manifest, fixture, runner and candidate pin metadata. Run it in the admitted docs workspace using the linked guide: archive metadata does not supply the unpublished tarballs. Obtain the exact local-candidates-v5 sdk-framework-v1 artifacts from the owning local workspace; never mix same-version families. See [compatibility](@/docs/reference/compatibility.md) and [migration](@/docs/migrate/_index.md). EQL1.9 and roadmap10 publication/release, public hosting, native/device/OS/AT and performance/budget acceptance remain open.

<div data-gallery>
<form aria-label="Filter examples">
'''
for kind,values in [('task',['basic','toolbar','ticket','collaboration','report']),('platform',['web','react']),('feature',['editing','save','formatting','readonly','recovery','reset','collaboration','history','code','table','assets']),('status',['local-runtime','unavailable'])]:
 intro+=f'<label>{kind.title()} <select name="{kind}"><option value="">All</option>'+''.join(f'<option value="{v}">{v}</option>' for v in values)+'</select></label>\n'
intro+='<button type="reset">Clear filters</button></form><p data-gallery-count role="status" aria-live="polite">6 examples</p><p data-copy-status role="status" aria-live="polite"></p>\n'
for e in entries:
 intro+=f'<article data-gallery-card data-task="{e["task"]}" data-platform="{e["platform"]}" data-feature="{" ".join(e["features"])}" data-status="{e["status"]}"><h2 id="{e["id"]}">{e["title"]}</h2><p><strong>{e["status"]}</strong> · {e["platform"]} · {", ".join(e["features"])}</p><p>{html.escape(e["outcome"])}</p><p><a href="{e["guide"]}">Complete guide and outcome: {e["title"]}</a></p>'
 if e['status']=='local-runtime':
  base=e['download'].removesuffix('/source.zip');s=e['snippet']
  intro+=f'<p>Artifact: sdk-framework-v1 · v5 · 0.0.0 unpublished · source {q["sourceCommit"]}. <a href="{base}/{e["manifest"]}">Source and artifact manifest</a> · <a href="{base}/{e["qualification"]}">Exact qualification</a> · <a href="{e["download"]}" download>Download complete {e["title"]} source</a> · <a href="{base}/{s["file"]}">Full snippet source</a> · <a href="{base}/{e["fixture"]}">Input fixture</a></p><p>Checked excerpt: {s["file"]}:{s["start"]}–{s["end"]}. Context and all imports are in the full source.</p><pre><code id="snippet-{e["id"]}">{html.escape(s["text"])}</code></pre><button type="button" data-copy="snippet-{e["id"]}">Copy {e["title"]} snippet</button>'
 else:intro+='<p>Unavailable profiles stay visible when filtering. There is no fake interactive report. Input is Project kickoff; the source study records conceptual table edit/undo and unavailable asset preservation expectations, with loading and disposal limits. Runtime cases: 0. <a href="/reference-inputs/extension-configurations-v1/owner-recipes.json">Download owning source study manifest</a> · <a href="/reference-inputs/gallery-v1/structured-report/source-study.zip" download>Download complete report source study and fixture</a> and <a href="/reference-inputs/extension-configurations-v1/admission.json">exact profile admission</a>. Consult the extension catalog source study; activate this entry only after its owning packaged browser consumer qualifies.</p>'
 intro+='</article>\n'
intro+='''</div>

## Lifecycle and recovery

Loading: keep actions disabled until the SDK is ready; use the guide's actual missing-WASM diagnostic and compatible asset retry. Do not substitute JS/WASM from another candidate. Each editor owns independent handles, history, permissions and local storage.

Read-only: use the owning SDK permission API; peers may still deliver authorized updates. Save locally before reopening. A local receipt is distinct from transport sync and remote durability. On a quota/save error keep the tab open and export recovery bytes; never silently clear a document or downgrade its schema.

Reset/export: the ticket playground offers explicit confirmed reset with backup, export and compatible recovery into a separate copy. Quickstarts reopen the same identity rather than reset it. The collaborative note exports both copies and preserves its stores; it offers no destructive reset. Do not clear unrelated browser storage.

Dispose: Close editor awaits flush/destroy, removes subscriptions and disables controls. React unmount and Astro navigation use their owning cleanup. Stop your loopback server after use. These links reuse real editors; the gallery loads no editor or network service. Build the ticket with `npm run build:playground` and the note with `npm run build:collaboration`; serve `dist/playground` on localhost as their guides describe.

Continue with [editing concepts](@/docs/concepts/editing.md), [command APIs](@/docs/reference/commands.md), [extension profiles](@/docs/extensions/presets.md), [extension recipes](@/docs/examples/extensions-resolvers.md), and [migration](@/docs/migrate/_index.md).
'''
output('content/docs/examples/gallery.md',intro)
changed=[]
for p,b in outputs.items():
 target=ROOT/p
 if not target.exists() or target.read_bytes()!=b:
  changed.append(p)
  if '--check' not in sys.argv:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
if '--check' in sys.argv and changed:print('Stale gallery outputs:',', '.join(changed));sys.exit(1)
print(f'Gallery: {len(entries)} entries, {len(outputs)} checked source/download outputs; unavailable runtime claims: 0')
