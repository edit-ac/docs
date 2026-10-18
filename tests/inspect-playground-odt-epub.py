"""Independent stdlib package/XML/PNG oracle for actual playground actions."""
import copy, hashlib, json, pathlib, posixpath, struct, sys, zipfile
from xml.etree import ElementTree as ET
out, fixtures = map(pathlib.Path, sys.argv[1:3])
T='urn:oasis:names:tc:opendocument:xmlns:text:1.0'; X='http://www.w3.org/1999/xhtml'; O='http://www.idpf.org/2007/opf'; C='urn:oasis:names:tc:opendocument:xmlns:container'; TAB='urn:oasis:names:tc:opendocument:xmlns:table:1.0'
def content(n):
    value=n.text or ''
    for child in n:
        if child.tag=='{'+T+'}s': value+=' '*int(child.get('{'+T+'}c','1'))
        elif child.tag=='{'+T+'}tab': value+='\t'
        elif child.tag in ['{'+T+'}line-break','{'+X+'}br']: value+='\n'
        else: value+=content(child)
        value+=child.tail or ''
    return value

def publication(z):
    container=ET.fromstring(z.read('META-INF/container.xml'))
    package=container.find('.//{'+C+'}rootfile').get('full-path'); tree=ET.fromstring(z.read(package)); base=posixpath.dirname(package)
    manifest={i.get('id'):i for i in tree.find('{'+O+'}manifest')}
    assert any('nav' in i.get('properties','').split() for i in manifest.values())
    return [ET.fromstring(z.read(posixpath.normpath(posixpath.join(base,manifest[i.get('idref')].get('href'))))) for i in tree.find('{'+O+'}spine')]

receipts=[]
for kind in ['odt','epub']:
    family=fixtures/(kind+'-import-fixtures'); source=(family/('media.'+kind)).read_bytes()
    actual=json.loads((out/(kind+'-observations.json')).read_text())
    with zipfile.ZipFile(family/('media.'+kind)) as z:
        if kind=='odt':
            assert z.read('mimetype')==b'application/vnd.oasis.opendocument.text'
            tree=ET.fromstring(z.read('content.xml')); roots=[tree]; pixel=z.read('Pictures/pixel.png')
            paragraphs=[content(n) for n in tree.iter() if n.tag in ['{'+T+'}p','{'+T+'}h'] and content(n) and not any(c.tag.endswith('}frame') for c in n.iter())]
            cells=[[content(c) for c in row.findall('{'+TAB+'}table-cell')] for row in tree.find('.//{'+TAB+'}table').findall('{'+TAB+'}table-row')]
        else:
            assert z.read('mimetype')==b'application/epub+zip'
            roots=publication(z); pixel=z.read('EPUB/images/pixel.png'); cells=None
            paragraphs=[content(n) for root in roots for n in root.iter() if n.tag in ['{'+X+'}h1','{'+X+'}h2','{'+X+'}p','{'+X+'}li'] and content(n)]
    digest=hashlib.sha256(pixel).hexdigest(); width,height=struct.unpack('>II',pixel[16:24])
    def inspect(v):
        visible=v['visible']; texts=[''.join(r['text'] for r in n.get('runs',[])) for n in visible if n.get('kind')=='block']
        for text in paragraphs:
            if cells is None or text not in [c for row in cells for c in row]: assert text in texts, ('text',text,texts)
        if cells is not None:
            table=next(n['blockAttributes'][2] for n in visible if (n.get('blockAttributes') or [''])[0]=='module:editac.table')
            assert [[''.join(r[0] for r in c) for c in row] for row in table['rows']]==cells
        else:
            assert texts.index('First 🙂') < texts.index('Second')
        assert any(r['attributes'].get('bold') and r['attributes'].get('italic') and 'C🙂' in r['text'] for n in visible for r in n.get('runs',[])), 'nested marks'
        asset=next(n['blockAttributes'][2] for n in visible if (n.get('blockAttributes') or [''])[0]=='module:editac.asset'); m=asset['metadata']
        assert asset['identity']=={'host':'fixture-host','key':kind+'-original-png'}
        assert (m['sha256'],m['byteLength'],m['width'],m['height'])==(digest,len(pixel),width,height)
        assert m['alt']=='alt 🙂' and m['caption']=='caption'
        assert v['original']==list(pixel) and v['retainedPackage']==list(source)
        assert v['reopened']['visible']==visible and v['reopened']['original']==list(pixel) and v['updates']==1
    inspect(actual)
    mutations=[]
    for name,mutate in [('lost-package',lambda v:v['retainedPackage'].pop()),('lost-media',lambda v:v['original'].pop()),('multiple-updates',lambda v:v.update(updates=2)),('lost-semantics',lambda v:v.update(visible=[])),('lost-reopen',lambda v:v['reopened'].update(visible=[]))]:
        v=copy.deepcopy(actual);mutate(v)
        try: inspect(v)
        except (AssertionError,StopIteration,KeyError): mutations.append(name)
        else: raise AssertionError('Accepted corrupt '+kind+' observation: '+name)
    for suffix in ['before','after-reload']: assert (out/(kind+'-retained-'+suffix+'.'+kind)).read_bytes()==source
    for name in ['loss','corrupt']: assert (out/(kind+'-'+name+'-retained.'+kind)).read_bytes()==(family/(('media-loss' if name=='loss' else name)+'.'+kind)).read_bytes()
    with zipfile.ZipFile(out/(kind+'-export.'+kind)) as z:
        assert any(z.read(n)==pixel for n in z.namelist() if n.endswith('.png')), 'exported PNG bytes'
        trees=[ET.fromstring(z.read('content.xml'))] if kind=='odt' else publication(z)
        exported='\n'.join(content(t) for t in trees)
        for text in paragraphs: assert text in exported, ('export text',text)
        if cells is not None:
            table=trees[0].find('.//{'+TAB+'}table'); assert table is not None
            assert [[content(c) for c in row.findall('{'+TAB+'}table-cell')] for row in table.findall('{'+TAB+'}table-row')]==cells
    recovery=json.loads((out/(kind+'-recovery.json')).read_text()); assert recovery['identity'] and recovery['bytes']
    receipts.append({'format':kind,'inputSha256':hashlib.sha256(source).hexdigest(),'pngSha256':digest,'negativeMutations':mutations,'paragraphs':len(paragraphs)})
receipt={'executed':1,'passed':1,'failed':0,'skipped':0,'directions':receipts,'oracle':'Independent ZIP/XML/PNG and EPUB OPF spine; live semantics/marks/table/media, exact input originals/reopen, one update, actual downloaded output'}
(out/'odt-epub-independent.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt))
