"""Independent CSV dialect/data and OS PDF reader checks on downloaded output."""
import csv, io, json, pathlib, subprocess, sys
out, fixtures = map(pathlib.Path, sys.argv[1:3])
expected = json.loads((fixtures/'expected.json').read_text())
checks=0
for kind, separator in [('csv',','),('tsv','\t')]:
 source=(fixtures/('quoted.'+kind)).read_bytes()
 assert (out/(kind+'-retained.'+kind)).read_bytes()==source
 observed=json.loads((out/(kind+'-table-observations.json')).read_text())
 # Inspect the actual admitted shared table, not only converter roundtrip bytes.
 table=observed['table']['blockAttributes'][2]
 cells=[[ ''.join(run[0] for paragraph in cell['paragraphs'] for run in paragraph['runs']) for cell in row] for row in table['rows']]
 assert cells==expected['quoted.'+kind],cells
 assert all(cell['header']==(index==0) for index,row in enumerate(table['rows']) for cell in row)
 for newline,ending in [('lf',b'\n'),('crlf',b'\r\n')]:
  for safe in [False,True]:
   path=out/f'{kind}-{newline}-{"safe" if safe else "exact"}.{kind}'
   raw=path.read_bytes();rows=[r[:] for r in expected['quoted.'+kind]]
   if safe: rows[-1][-1]="'"+rows[-1][-1]
   assert raw.endswith(ending)
   assert list(csv.reader(io.StringIO(raw.decode(),newline=''),delimiter=separator,strict=True))==rows
   writer=io.StringIO(newline='');csv.writer(writer,delimiter=separator,lineterminator=ending.decode(),quoting=csv.QUOTE_ALL).writerows(rows)
   assert raw==writer.getvalue().encode(),path
   checks+=1
 assert (out/(kind+'-captured.'+kind)).read_bytes()==(out/f'{kind}-crlf-safe.{kind}').read_bytes()
 checks+=3
assert (out/'pdf-rejected-input.pdf').read_bytes()==b'%PDF-1.7\nPrepared export-only rejection fixture.\n'
pdf=subprocess.run(['swift','tests/inspect-playground-pdf.swift',str(out/'playground.pdf')],capture_output=True,text=True)
assert pdf.returncode==0,pdf.stderr
(out/'pdf-independent.json').write_text(pdf.stdout)
checks+=2
(out/'table-pdf-independent.json').write_text(json.dumps({'checks':checks,'passed':checks,'failed':0,'skipped':0,'readers':['Python stdlib csv','macOS PDFKit']},indent=2)+'\n')
print(f'{checks} independent output/input assertions passed')
