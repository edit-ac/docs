"""Independent ZIP/XML/PNG facts versus the actual installed playground actions."""
import copy, hashlib, json, pathlib, struct, sys, zipfile
from xml.etree import ElementTree as ET
out=pathlib.Path(sys.argv[1]); fixture=pathlib.Path(sys.argv[2]); rejections=pathlib.Path(sys.argv[3]) if len(sys.argv)>3 else out; actual=json.loads((out/'docx-observations.json').read_text())
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'; WP='http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'
with zipfile.ZipFile(fixture/'media.docx') as z:
    source=(fixture/'media.docx').read_bytes(); pixel=z.read('word/media/pixel.png'); tree=ET.fromstring(z.read('word/document.xml'))
body=tree.find('{'+W+'}body'); width,height=struct.unpack('>II',pixel[16:24]); digest=hashlib.sha256(pixel).hexdigest(); props=tree.find('.//{'+WP+'}docPr')
paragraphs=[''.join(n.text or '' for n in p.iter('{'+W+'}t')) for p in body.findall('{'+W+'}p') if not p.findall('.//{'+W+'}drawing')]
cells=[[''.join(n.text or '' for n in c.iter('{'+W+'}t')) for c in row.findall('{'+W+'}tc')] for row in body.find('{'+W+'}tbl').findall('{'+W+'}tr')]
def inspect(v):
    visible=v['visible']; texts=[''.join(r['text'] for r in n.get('runs',[])) for n in visible if n.get('kind')=='block']
    for text in paragraphs: assert text in texts, ('paragraph',text,texts)
    table=next(n['blockAttributes'] for n in visible if (n.get('blockAttributes') or [''])[0]=='module:editac.table')
    assert [[''.join(r[0] for r in cell) for cell in row] for row in table[2]['rows']]==cells, 'table'
    assets=[n for n in visible if (n.get('blockAttributes') or [''])[0]=='module:editac.asset']; assert len(assets)==1
    descriptor=assets[0]['blockAttributes'][2]; m=descriptor['metadata']
    assert descriptor['identity']=={'host':'fixture-host','key':'docx-original-png'}
    assert (m['sha256'],m['byteLength'],m['width'],m['height'])==(digest,len(pixel),width,height)
    assert m['alt']==props.get('descr','') and m['caption']==props.get('title','')
    assert v['original']==list(pixel) and v['reopened']['original']==list(pixel), 'PNG originals'
    assert v['retainedPackage']==list(source) and v['reopened']['retainedPackage']==list(source), 'DOCX originals'
    assert v['reopened']['visible']==visible and v['updates']==1
inspect(actual)
mutations=[]
for name,mutate in [('lost-original',lambda v:v['original'].pop()),('lost-package',lambda v:v['retainedPackage'].pop()),('lost-reopen',lambda v:v['reopened'].update(visible=[])),('multiple-updates',lambda v:v.update(updates=2)),('lost-table',lambda v:v.update(visible=[n for n in v['visible'] if (n.get('blockAttributes') or [''])[0]!='module:editac.table']))]:
    v=copy.deepcopy(actual); mutate(v)
    try: inspect(v)
    except (AssertionError,KeyError,StopIteration): mutations.append(name)
    else: raise AssertionError('Accepted corrupt observation: '+name)
assert (out/'docx-retained-before.docx').read_bytes()==source
assert (out/'docx-retained-after-reload.docx').read_bytes()==source
for name in ['media-loss','corrupt']: assert (rejections/('docx-'+('loss' if name=='media-loss' else name)+'-retained.docx')).read_bytes()==(fixture/(name+'.docx')).read_bytes()
# A separate writer oracle inspects the downloaded output, with no converter reader.
with zipfile.ZipFile(out/'docx-export.docx') as z:
    document=ET.fromstring(z.read('word/document.xml')); text=''.join(n.text or '' for n in document.iter('{'+W+'}t'))
    for paragraph in paragraphs: assert paragraph in text
    output_cells=[[''.join(n.text or '' for n in c.iter('{'+W+'}t')) for c in row.findall('{'+W+'}tc')] for row in document.find('.//{'+W+'}tbl').findall('{'+W+'}tr')]
    assert output_cells==cells
    assert any(z.read(name)==pixel for name in z.namelist() if name.startswith('word/media/'))
recovery=json.loads((out/'docx-recovery.json').read_text()); assert recovery['bytes'] and recovery['identity']
receipt={'executed':1,'passed':1,'failed':0,'skipped':0,'negativeMutations':mutations,'inputSha256':hashlib.sha256(source).hexdigest(),'pngSha256':digest,'oracle':'stdlib ZIP/XML/PNG; downloaded writer output, live tables/text/media, one update, exact package/PNG and durable reopen'}
(out/'docx-independent.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt))
