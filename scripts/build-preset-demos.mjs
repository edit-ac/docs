import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { buildPresetDemos } from '../../core/examples/presets/build.mjs';
export const buildPresets = () => buildPresetDemos(fileURLToPath(new URL('../static/demos/presets/', import.meta.url)));
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildPresets()));
