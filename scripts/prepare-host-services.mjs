import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('../', import.meta.url));
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFileSync(resolve(root, 'examples/host-services', path));
export function validateHostManifest(m) {
  if (m.schemaVersion !== 1 || m.id !== 'host-services/1' || m.parent !== 'DWF-1.8' ||
      m.maturity !== 'source-prerequisite' || m.runtimeQualified !== false || m.testedSdkVersion !== null)
    throw Error('Host source prerequisite cannot claim SDK/runtime qualification');
  if (!Array.isArray(m.records) || m.records.length !== 18 || new Set(m.records.map(r => r.file)).size !== 18)
    throw Error('Incomplete or duplicate host source inventory');
  for (const r of m.records) {
    if (!['core','architecture'].includes(r.repository) || !/^[a-f0-9]{40}$/.test(r.commit) ||
        !r.file.startsWith(`source/${r.repository}/`) || r.file.split('/').includes('..') ||
        !r.path || digest(read(r.file)) !== r.sha256) throw Error(`Host source drift: ${r.file}`);
  }
  const receipt = JSON.parse(read(m.agent.receiptFile));
  if (digest(read(m.agent.receiptFile)) !== m.agent.receiptSha256 || receipt.implementationRevision !== m.agent.coreCommit ||
      receipt.qualification.caseRevision !== m.agent.caseRevision || m.agent.remoteDurability !== 'pending' ||
      JSON.stringify(receipt.checks) !== JSON.stringify(m.agent.checks)) throw Error('Host receipt identity/count drift');
  if (m.agent.checks.length !== 4 || m.agent.checks.some(c => c.exit !== 0 || c.executed <= 0 || c.passed !== c.executed || c.failed || c.skipped || c.cancelled))
    throw Error('Retained host evidence includes missing/failed/skipped cases');
  if (m.service.status !== 'unavailable' || m.service.consumerReceipt !== null || m.service.deploymentManifest !== null || m.service.runner !== null)
    throw Error('Service admission requires an owning immutable consumer and integrated runner, not a label change');
  return m;
}
export const loadHostManifest = () => validateHostManifest(JSON.parse(read('manifest.json')));
export function renderHostSources(m) {
  return `+++
title = "Host-service sources and prepared outcomes"
description = "Inspect the immutable host-agent consumer and the pending durable-service boundary."
weight = 4
+++

**Status: source prerequisite; no runnable service or installed SDK claim.** These downloads are an inspection bundle, not an independently installable package. The host-agent sources use the real shared Session/SQLite request owner; their retained checks are historical executions. The cloud service remains unavailable. No configured provider or public deployment is qualified.

## Before you start

**Prerequisites:** Read [host-app agent editing](@/docs/guides/agents.md) and [cloud hosting](@/docs/guides/cloud-hosting.md). The application owns authentication, transport and document keys.

**Tested version:** exact host-agent core source revision \`${m.agent.coreCommit}\`; no tested docs SDK version. The owning receipt uses \`${m.agent.caseRevision}\`. Its 10 integration and 27 browser cases passed with zero failures/skips; the separate 71 regression and 29 identity-repair executions overlap and must not be summed as unique cases. None were rerun by these docs checks.

## Example and expected outcome

Download the <a href="{{ get_url(path="reference-inputs/host-services-v1/manifest.json") }}">source manifest</a> and <a href="{{ get_url(path="reference-inputs/host-services-v1/transcripts.json") }}">prepared transcripts</a>. Transcript field names are descriptive oracles, not an SDK or wire schema. Cloud C01–C07 are conceptual requirements. Agent M01–M08 describe selected retained owner cases, not a new docs runtime execution. The downloadable source includes complete owning files so readers can inspect the real consumer rather than copy a divergent snippet.

| Owning file | Immutable revision | SHA256 |
| --- | --- | --- |
${m.records.map(r => `| <a href="{{ get_url(path="reference-inputs/host-services-v1/${r.file}") }}"><code>${r.path}</code></a> | \`${r.commit}\` | \`${r.sha256}\` |`).join('\n')}

Source bytes and the core Apache-2.0 license are retained unchanged. Markdown source downloads use a .txt suffix to show source rather than render it as site prose. The public source repository may not yet contain these local commits; the downloads are the inspected bytes.

## Failure and recovery

The canonical \`npm run check:examples -- --suite host-services\` fails admission until roadmap28 returns a real durable reference-host deployment, immutable consumer receipt and independent save/reconnect/restore outcomes. A prepared transcript, relay, successful notification or flipped status cannot satisfy that boundary. Retain local work and resolve unknown outcomes with the original operation identity.

## Migration and compatibility

Follow [compatibility](@/docs/reference/compatibility.md), [operational recovery](@/docs/guides/host-operations.md) and [Migrate to edit.ac](@/docs/migrate/_index.md). The local host receipt proves local durability; remote storage remains pending.\n`;
}
export function hostOutputs(m) {
  const files = {
    'content/docs/examples/host-services.md': Buffer.from(renderHostSources(m)),
    'static/reference-inputs/host-services-v1/manifest.json': read('manifest.json'),
    'static/reference-inputs/host-services-v1/transcripts.json': read('transcripts.json'),
  };
  for (const r of m.records) files[`static/reference-inputs/host-services-v1/${r.file}`] = read(r.file);
  return files;
}
export function prepareHostServices(check = false) {
  const files = hostOutputs(loadHostManifest());
  for (const [path, bytes] of Object.entries(files)) {
    const target = resolve(root,path);
    if (check) { if (!readFileSync(target).equals(bytes)) throw Error(`Host download/page drift: ${path}`); }
    else { mkdirSync(dirname(target),{recursive:true}); writeFileSync(target,bytes); }
  }
  const count = readdirSync(resolve(root,'static/reference-inputs/host-services-v1'),{recursive:true,withFileTypes:true}).filter(x => x.isFile()).length;
  if (count !== 20) throw Error('Unexpected host download inventory');
  return { inputs:18, downloads:20, preparedSteps:15, runtimeExecutions:0 };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(prepareHostServices(process.argv.includes('--check'))));
