import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadManifest } from './prepare-formats.mjs';
export function selectSuite(args) {
  if (args.length !== 2 || args[0] !== '--suite' || args[1] !== 'formats-native')
    throw Error('Unknown or absent example suite; expected --suite formats-native');
  return args[1];
}
export function requireFormatsConsumer(manifest) {
  // Source documentation is useful but cannot replace the canonical host proof.
  // Installing a future runner requires its pinned consumer and independent oracles.
  if (!manifest.admission.claimedHosts.length)
    throw Error('DWF-1.7 admission blocked: no immutable packaged formats-native host consumer. Source/profile checks are prerequisite evidence only.');
  throw Error('DWF-1.7 admission blocked: packaged consumer runner and independent outcome assertions must be integrated before qualification.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) try {
  selectSuite(process.argv.slice(2));
  requireFormatsConsumer(loadManifest());
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
