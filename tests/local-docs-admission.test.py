"""Negative admission controls; never invoke a browser, provider or package install."""
import importlib.util
import json
from pathlib import Path
import subprocess
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('local_docs', ROOT / 'scripts/admit-local-docs.py')
admission = importlib.util.module_from_spec(spec)
spec.loader.exec_module(admission)


class AdmissionControls(unittest.TestCase):
    def setUp(self):
        self.config = json.loads((ROOT / 'examples/local-candidate-admission.json').read_text())

    def rejected(self, message):
        with self.assertRaisesRegex((ValueError, KeyError, OSError, subprocess.CalledProcessError), message):
            admission.audit(self.config)

    def test_no_registry_identity(self):
        self.config['published'] = True
        self.rejected('Local-only scope')

    def test_no_release_qualification(self):
        self.config['releaseQualified'] = True
        self.rejected('Local-only scope')

    def test_stale_manifest(self):
        self.config['manifest']['sha256'] = '0' * 64
        self.rejected('Changed pin')

    def test_unsafe_checker(self):
        self.config['checker']['path'] = '../outside.py'
        self.rejected('Unsafe pin path')

    def test_changed_checker(self):
        self.config['checker']['sha256'] = '0' * 64
        self.rejected('Changed pin')

    def test_stale_docs_tree(self):
        self.config['docsBaseline'] = self.config['priorDocs']['DWF-1.1']['docsCommit']
        self.rejected('Stale docs baseline')

    def test_missing_prior_parent(self):
        del self.config['priorDocs']['DWF-1.32']
        self.rejected('DWF-1.32')

    def test_prior_receipt_substitution(self):
        self.config['priorDocs']['DWF-1.34']['receipt']['sha256'] = '0' * 64
        self.rejected('Prior docs mapping changed')

    def test_source_only_is_not_runtime_parent(self):
        self.config['priorDocs']['DWF-1.35-C1']['scope'] = 'original-completed-prerequisite'
        self.rejected('Prior docs mapping changed')

    def test_unreviewed_compatibility(self):
        self.config['reviewedCompatibility'] = {}
        # This remains meaningful after package.json is committed: compare to the
        # original consumer baseline, not to the worktree index.
        self.rejected('explicit compatibility review required')

    def test_stale_review(self):
        self.config['reviewedCompatibility']['package.json']['afterSha256'] = '0' * 64
        self.rejected('Changed pin')

    def test_missing_callout_receipt(self):
        self.config['calloutReceipt']['path'] += '.missing'
        self.rejected('missing')

    def test_tampered_producer_return(self):
        self.config['readyRequests'][1]['sha256'] = '0' * 64
        self.rejected('Changed pin')

    def test_missing_producer_return(self):
        self.config['readyRequests'] = []
        self.rejected('Missing versioned producer')

    def test_new_unreviewed_source_edit(self):
        original = admission.git
        def changed(repository, *args):
            if args[:2] == ('diff', '--name-only'):
                return b'content/docs/getting-started/_index.md\0'
            return original(repository, *args)
        with patch.object(admission, 'git', side_effect=changed):
            self.rejected('explicit compatibility review required')


if __name__ == '__main__':
    unittest.main()
