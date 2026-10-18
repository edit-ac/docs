+++
title = "Host-service sources and prepared outcomes"
description = "Inspect the immutable host-agent consumer and the pending durable-service boundary."
weight = 4
+++

**Status: source prerequisite; no runnable service or installed SDK claim.** These downloads are an inspection bundle, not an independently installable package. The host-agent sources use the real shared Session/SQLite request owner; their retained checks are historical executions. The cloud service remains unavailable. No configured provider or public deployment is qualified.

## Before you start

**Prerequisites:** Read [host-app agent editing](@/docs/guides/agents.md) and [cloud hosting](@/docs/guides/cloud-hosting.md). The application owns authentication, transport and document keys.

**Tested version:** exact host-agent core source revision `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf`; no tested docs SDK version. The owning receipt uses `AGT-APP-01..10-v1`. Its 10 integration and 27 browser cases passed with zero failures/skips; the separate 71 regression and 29 identity-repair executions overlap and must not be summed as unique cases. None were rerun by these docs checks.

## Example and expected outcome

Download the <a href="{{ get_url(path="reference-inputs/host-services-v1/manifest.json") }}">source manifest</a> and <a href="{{ get_url(path="reference-inputs/host-services-v1/transcripts.json") }}">prepared transcripts</a>. Transcript field names are descriptive oracles, not an SDK or wire schema. Cloud C01–C07 are conceptual requirements. Agent M01–M08 describe selected retained owner cases, not a new docs runtime execution. The downloadable source includes complete owning files so readers can inspect the real consumer rather than copy a divergent snippet.

| Owning file | Immutable revision | SHA256 |
| --- | --- | --- |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/examples/host-mcp/README.md.txt") }}"><code>examples/host-mcp/README.md</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `c17fde3b6ca180ab4d0dcd3dfb2f19901acdca2f6a2fc012a6f9b971b64e0589` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/examples/host-mcp/register.mjs") }}"><code>examples/host-mcp/register.mjs</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `6e2598d5da031cb1e5daeccbb568390fb4362b96533a258e7545afd8f9052663` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/examples/host-mcp/prepared-app.mjs") }}"><code>examples/host-mcp/prepared-app.mjs</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `45a84bbed1a320d366ef187801f8a0058d6ad2d9a51f76374123267912fabbf6` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/examples/host-mcp/realtime-owner.rs") }}"><code>examples/host-mcp/realtime-owner.rs</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `fd61099526a9c1e2f4fc832476c29194ec154fadc76e4e6798584119dd6ce558` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/examples/host-mcp/previews.rs") }}"><code>examples/host-mcp/previews.rs</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `8c3ae88254ed6510256f8aa2ce012ec10bd4945987ff13f53410dd29bf9bc039` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/examples/host-mcp/src/observe.ts") }}"><code>examples/host-mcp/src/observe.ts</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `9e558b857b39d6eac747d934e76678df1a2c7846dc413ac53e77edeb42495b8b` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/tests/agent-integration.test.mjs") }}"><code>tests/agent-integration.test.mjs</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `6f5647d6e65458b337e0581f6558974dcf5abc7808f7bf1df3ffe0f72b6e7349` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/tests/helpers/agent-observe.mjs") }}"><code>tests/helpers/agent-observe.mjs</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `3517a1cd2adf48f89872590fc63186ef1494b76d3cbbbe9216e2351f9133fc9c` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/packages/web/src/host/contract.ts") }}"><code>packages/web/src/host/contract.ts</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `87d7151d14e9feb564b729947e3fa796529dff7edfad664a6b8db67f5fed1052` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/packages/web/src/host/apply.ts") }}"><code>packages/web/src/host/apply.ts</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `2096dd679f1e26eb168951b944a90b7f86d48f3f5a35e31714d0d25a15b0dc67` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/packages/web/src/host/prepare.ts") }}"><code>packages/web/src/host/prepare.ts</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `8f43e25a4ea0a3367c3795635e42ce235f8ffd2cf1600da39b4b4ed4f8d1a8b0` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/packages/web/src/host/markdown.ts") }}"><code>packages/web/src/host/markdown.ts</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `3c8132332e337956921ff5a843f8f9044b6f0459179bbf1a4eccdaa3a9b57fb5` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/crates/editac-session/src/receipts.rs") }}"><code>crates/editac-session/src/receipts.rs</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `b2c0643508ddbc39527129b103517a405719a83ffe7e7d65c3155ea9672af7bf` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/core/LICENSE") }}"><code>LICENSE</code></a> | `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf` | `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/architecture/evidence/agent-integration/agt-1.7-20261017/receipt.json") }}"><code>evidence/agent-integration/agt-1.7-20261017/receipt.json</code></a> | `b0ab84ab950f8fc0a3d4abcde4d93c0db6169544` | `931413ad50eedfaf2e1783ed941b8ef8f846dc3fcd52317b0adcdd1232dd8714` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/architecture/specs/agent-editing.md.txt") }}"><code>specs/agent-editing.md</code></a> | `b0ab84ab950f8fc0a3d4abcde4d93c0db6169544` | `e7eda7c8e1e686aaf54838426d277ece00314be764d8db89992cb10bbcfea2f1` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/architecture/specs/cloud-document-store.md.txt") }}"><code>specs/cloud-document-store.md</code></a> | `59a732815fa26f1be40616eb8b528f8927ca0216` | `88ee7d5a3eb83477b7af5df5818525ce3f07c5f9ce71342cac953b9a4c39d748` |
| <a href="{{ get_url(path="reference-inputs/host-services-v1/source/architecture/roadmaps/28-cloud-document-store.md.txt") }}"><code>roadmaps/28-cloud-document-store.md</code></a> | `59a732815fa26f1be40616eb8b528f8927ca0216` | `989291c7b4ed2c6e12968308898ab0b0fca50dad96b7188f63f06313ac51864d` |

Source bytes and the core Apache-2.0 license are retained unchanged. Markdown source downloads use a .txt suffix to show source rather than render it as site prose. The public source repository may not yet contain these local commits; the downloads are the inspected bytes.

## Failure and recovery

The canonical `npm run check:examples -- --suite host-services` fails admission until roadmap28 returns a real durable reference-host deployment, immutable consumer receipt and independent save/reconnect/restore outcomes. A prepared transcript, relay, successful notification or flipped status cannot satisfy that boundary. Retain local work and resolve unknown outcomes with the original operation identity.

## Migration and compatibility

Follow [compatibility](@/docs/reference/compatibility.md), [operational recovery](@/docs/guides/host-operations.md) and [Migrate to edit.ac](@/docs/migrate/_index.md). The local host receipt proves local durability; remote storage remains pending.
