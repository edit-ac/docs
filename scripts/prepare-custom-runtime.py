#!/usr/bin/env python3
"""Export the separate immutable local authoring consumers without mixing packs."""
import hashlib, io, json, pathlib, sys, zipfile
root=pathlib.Path(__file__).resolve().parents[1]
sha=lambda b:hashlib.sha256(b).hexdigest()
paths=['content/docs/extensions/custom.md','content/docs/examples/custom-extensions.md','tests/docs-custom-extensions.test.mjs','scripts/prepare-custom-extensions.mjs','scripts/prepare-extension-catalog.mjs','scripts/prepare-custom-runtime.py','package.json','examples/troubleshooting/callout-harness.mjs','examples/troubleshooting/profile.json','examples/troubleshooting/upstream/session.mjs','examples/troubleshooting/upstream/recipe.mjs']
for directory in ['examples/custom-extensions','examples/extension-configurations','static/reference-inputs/custom-authoring-v1','static/reference-inputs/extension-configurations-v1']:
 paths += [str(p.relative_to(root)) for p in (root/directory).rglob('*') if p.is_file() and p.name!='qualification.json']
paths=sorted(set(paths)); data={p:(root/p).read_bytes() for p in paths}
profile=json.loads(data['examples/custom-extensions/runtime/profile.json'])
admission=json.loads(data[profile['authoring']['admission']])
manifest={'schemaVersion':2,'parent':'DWF-1.35','scope':'local-only separate installed production families with prepared host inputs','published':False,'releaseQualified':False,'sdkVersion':'0.0.0 (unpublished)','families':[{'id':profile['candidate'],'sourceCommit':profile['sourceCommit'],'packages':profile['packages']},{'id':profile['authoring']['candidate'],'sourceCommit':profile['authoring']['sourceCommit'],'packages':admission['packages']}],'sourceFiles':{p:sha(b) for p,b in data.items()},'ownerCasePins':profile['casePins'],'fixture':'Project kickoff callout/Friday highlight; EXT-1.20 independently expected recipe fixtures','execution':'Node24.19.0/npm11.17.0/Playwright1.64.0; node --test tests/docs-custom-extensions.test.mjs','runtimeClaim':'See qualification.json for observed counts; this manifest authenticates sources only.','notQualified':['registry/release','native/terminal','OS/IME/AT/device spelling','performance/budget','Tiptap runtime/plugin compatibility']}
buf=io.BytesIO()
with zipfile.ZipFile(buf,'w',zipfile.ZIP_DEFLATED) as z:
 for p,b in data.items():
  i=zipfile.ZipInfo(p,(2026,10,18,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,b)
manifest['download']={'path':'source.zip','sha256':sha(buf.getvalue()),'files':len(data)}
outputs={'manifest.json':(json.dumps(manifest,indent=2)+'\n').encode(),'source.zip':buf.getvalue()}
for name,b in outputs.items():
 p=root/'static/reference-inputs/custom-authoring-v2'/name
 if '--check' in sys.argv:assert p.read_bytes()==b,'Custom runtime export drift: '+name
 else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
print(f'Custom runtime source files: {len(data)}; separate candidate families: 2; publication: false')
