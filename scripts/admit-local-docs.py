#!/usr/bin/env python3
"""Authenticate the local docs continuation; this is not runtime or release proof."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess

DOCS = Path(__file__).resolve().parents[1]
REQUIRED = {'DWF-1.1', 'DWF-1.2', 'DWF-1.3', 'DWF-1.4', 'DWF-1.31',
            'DWF-1.32', 'DWF-1.33', 'DWF-1.34'}


def require(value, message):
    if not value:
        raise ValueError(message)


def git(repository, *args):
    return subprocess.check_output(['git', '-C', str(repository), *args], stderr=subprocess.PIPE)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def pinned(root, pin):
    path = (root / pin['path']).resolve()
    require(root.resolve() in path.parents, 'Unsafe pin path')
    raw = path.read_bytes()
    require(sha(raw) == pin['sha256'], 'Changed pin: ' + pin['path'])
    return raw


def audit(config, docs=DOCS):
    architecture, core = docs.parent / 'architecture', docs.parent / 'core'
    require(config['scope'] == 'local-only' and config['published'] is False
            and config['releaseQualified'] is False, 'Local-only scope required')
    # Authenticate the checker itself before importing executable Python.
    checker = pinned(architecture, config['checker'])
    require(checker == git(architecture, 'show', config['architectureCommit'] + ':'
                           + config['checker']['path']), 'Uncommitted candidate checker')
    manifest_raw = pinned(architecture, config['manifest'])
    require(manifest_raw == git(architecture, 'show', config['architectureCommit'] + ':'
                               + config['manifest']['path']), 'Uncommitted candidate manifest')
    manifest = json.loads(manifest_raw)
    require(config['docsBaseline'] == manifest['docsConsumerCommit'], 'Stale docs baseline')
    for repository, commit in [(architecture, config['architectureCommit']),
                               (core, config['coreCommit']), (docs, config['docsBaseline'])]:
        git(repository, 'merge-base', '--is-ancestor', commit, 'HEAD')
    # A later docs implementation must explicitly review changed compatibility;
    # merely retaining the old commit in history cannot authenticate altered files.
    baseline_paths = git(docs, 'ls-tree', '-r', '--name-only', '-z', config['docsBaseline']).split(b'\0')
    paths = [p.decode() for p in baseline_paths if p]
    changed = git(docs, 'diff', '--name-only', '-z', config['docsBaseline'], '--', *paths)
    changed_paths = {p.decode() for p in changed.split(b'\0') if p}
    reviewed = config.get('reviewedCompatibility', {})
    for path in changed_paths:
        require(path in reviewed, 'Docs baseline changed; explicit compatibility review required: ' + path)
        review = reviewed[path]
        require(bool(review['reason']), 'Compatibility review needs a reason')
        require(sha(git(docs, 'show', config['docsBaseline'] + ':' + path)) == review['beforeSha256'],
                'Compatibility review has stale baseline')
        pinned(docs, {'path': path, 'sha256': review['afterSha256']})
    mappings = manifest['docsPrerequisites']
    ids = [m['task'].split('/')[0] for m in mappings]
    require(len(ids) == len(set(ids)), 'Duplicate prior docs task')
    require(set(ids) == REQUIRED | {'DWF-1.35-C1'}, 'Missing or unexpected prior docs task')
    dependencies = []
    root = (architecture / config['manifest']['path']).parent
    for mapping in mappings:
        task = mapping['task'].split('/')[0]
        require(mapping['scope'] == ('source-prerequisite-only' if task == 'DWF-1.35-C1'
                                    else 'original-completed-prerequisite'),
                'Source prerequisite cannot close a parent')
        expected = config['priorDocs'][task]
        require(mapping == expected, 'Prior docs mapping changed: ' + task)
        git(docs, 'merge-base', '--is-ancestor', mapping['docsCommit'], config['docsBaseline'])
        receipt = json.loads(pinned(root, mapping['receipt']))
        delivery = json.loads(pinned(root, mapping['delivery']))
        if 'receiptSha256' in delivery:
            require(delivery['receiptSha256'] == mapping['receipt']['sha256'], 'Delivery receipt mismatch')
        dependencies.append({'task': task, 'commit': mapping['docsCommit'],
                             'scope': mapping['scope'], 'receiptSha256': mapping['receipt']['sha256'],
                             'state': receipt.get('state', 'source prerequisite only'),
                             'continuations': config['dependencyMap'][task]})
    for name in ['candidateReceipt', 'calloutReceipt']:
        raw = pinned(architecture, config[name])
        require(raw == git(architecture, 'show', config['architectureCommit'] + ':'
                           + config[name]['path']), 'Uncommitted producer receipt')
    callout = json.loads(pinned(architecture, config['calloutReceipt']))
    require(callout['coreCommit'] == config['coreCommit'], 'Callout source differs')
    require(callout['candidate'] == 'structural-callout-v2', 'Missing current callout family')
    require(len(config['readyRequests']) == 2, 'Missing versioned producer ready request')
    initial, current = [json.loads(pinned(docs, pin)) for pin in config['readyRequests']]
    require(initial['task'] == 'LCR-1.1' and current['task'] == 'LCR-1.2'
            and current['parentComplete'] is True, 'Producer return is incomplete')
    require(current['manifest']['sha256'] == config['manifest']['sha256']
            and current['receipt']['sha256'] == config['calloutReceipt']['sha256']
            and current['commits'] == {'core': config['coreCommit'],
                                       'architecture': config['architectureCommit']},
            'Ready request differs from consumed source/artifacts')
    require(current['previous']['sha256'] == config['readyRequests'][0]['sha256'],
            'Producer request chain differs')
    spec = importlib.util.spec_from_file_location('candidate_admission', architecture / config['checker']['path'])
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    result = module.admit(architecture / config['manifest']['path'], core,
                          config['manifest']['sha256'])
    require('structural-callout' in result['supportedCells'], 'Missing structural runtime proof')
    return {'scope': 'local-only', 'published': False, 'releaseQualified': False,
            'newRuntimeExecutions': 0, 'docsBaseline': config['docsBaseline'],
            'reviewedCompatibility': sorted(changed_paths),
            'docsBaselineFiles': len(paths), 'dependencies': dependencies, 'candidateAdmission': result,
            'deferredOriginalGates': config['deferredOriginalGates']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=DOCS / 'examples/local-candidate-admission.json')
    args = parser.parse_args()
    try:
        print(json.dumps(audit(json.loads(args.config.read_text())), indent=2))
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, 'Local docs admission rejected: ' + str(error) + '\n')
