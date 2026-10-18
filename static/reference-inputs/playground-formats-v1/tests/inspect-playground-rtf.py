"""Independently read the actual browser export with macOS textutil."""
import json, pathlib, subprocess, sys
out, fixtures=map(pathlib.Path,sys.argv[1:3])
original=(fixtures/'media.rtf').read_bytes()
assert (out/'rtf-original.rtf').read_bytes()==original
assert (out/'playground.rtf').is_file()
result=subprocess.run(['textutil','-convert','txt','-stdout',str(out/'playground.rtf')],capture_output=True)
assert result.returncode==0,result.stderr
text=result.stdout.decode('utf-8')
for token in ['Hello ', 'bold', 'both', '€', 'é', '🙂', '{literal}', '=1+1', 'Tail', 'Owner: Alex']:
 assert token in text,token
assert (out/'playground.rtf').read_bytes().startswith(b'{\\rtf1')
recovery=json.loads((out/'rtf-recovery.json').read_text());assert recovery
receipt={'reader':'macOS textutil','assertions':14,'passed':14,'failed':0,'skipped':0,'text':text}
(out/'rtf-independent.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
