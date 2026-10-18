+++
title = "Connect agent editing through your app"
description = "Inspect and accept a revision-bound proposal using the shared request owner."
weight = 5
+++

**Status: retained local host-agent source evidence; no installed docs SDK or cloud-service claim.** The immutable roadmap14 consumer uses real Session/SQLite request semantics and a WASM human peer over prepared app/auth/control transports. No model or provider call is needed. Download its complete checked source files and exact receipt at [host-service sources](@/docs/examples/host-services.md).

## Before you start

**Prerequisites:** The embedding app already owns MCP authentication, tool registration, transport and document permission. The CLI does not need to become an MCP server. Engine content never authorizes a new tool call or network fetch. Start with [commands and selection](@/docs/reference/commands.md) and [local-first persistence](@/docs/concepts/persistence.md).

**Tested version:** core source `c16ddbf76b04b896ba6bcbab77bfc6743ff458bf`, case revision `AGT-APP-01..10-v1`. This source bundle is not an independently installable release. No tested SDK package version is asserted. Retained owner evidence reports 10 integration cases and 27 browser cases (9 each Chromium/Firefox/WebKit), zero failed/skipped. These docs checks do not rerun them or qualify native/OS/assistive technology behavior.

## Example and expected outcome

The fixed candidate is `uploaded 😀` followed by the unchanged `other` paragraph. Follow **M01–M08** in the [prepared outcome transcript](@/docs/examples/host-services.md); descriptive oracle fields there are not a new MCP schema. The downloadable `register.mjs`, public host adapters, Session receipt owner, full `agent-integration.test.mjs` and fixture helper show the actual composed path.

| Step | Input/action | Expected shared-owner outcome |
| --- | --- | --- |
| M01 | Authorized read/export of `base` and `other` paragraphs | Retain the exact source, profile, hash and opaque revision baseline. |
| M02 | Prepare the fixed candidate against that baseline | Source and semantic diffs are reviewable; live content is unchanged. |
| M03 | Human accepts; host applies with stable request identity | Exactly one edit: `uploaded 😀` and `other`. Local SQLite durability is confirmed; remote durability stays pending. |
| M04 | Reopen Session/SQLite, advance human revision and retry same payload/ID | Return the original durable receipt, with zero new effects even when the proposal is gone. |
| M05 | Try a new stale overlapping proposal | Structured conflict, zero agent effects, newer human content preserved. |
| M06 | Recover from conflict | Read current baseline and prepare a new proposal for review with a new request ID; do not replace live content automatically. |
| M07 | Persistence fails after engine mutation | Pending/unknown result; freeze mutation admission and outbound sync. Reads and explicit recovery export remain available. |
| M08 | Ordered journal recovery | Resolve the same request identity without duplicate effects. Remote durability remains pending. |

These are selected expectations from the retained owner cases, not an executable docs transcript. AGT-APP-01 covers checksummed upload/preparation/apply/peer readback; APP04 covers SQLite/Session reopen and idempotency; APP05/06 cover stale source/commit conflicts; APP08 covers the post-mutation persistence barrier. Session reopen is not a process-crash drill; do not extend that observation beyond its receipt.

## Use the host's public contract

The existing app registers the owning `createHostAgent` adapters through `registerHostAgent`. The host exposes only currently available read/prepare/apply/receipt/observe operations. Its authenticated context supplies actor, document/epoch, permissions and read-only state. Untrusted arguments cannot supply authority. MCP annotations describe tools; they do not enforce policy.

Read/export and checksummed bounded upload retain a revision/profile/hash baseline. Preparation goes through shared Markdown reconciliation and source/semantic diff services. It preserves unsupported content or blocks the proposal explicitly. Partial, oversized, mismatched or expired uploads cannot mutate the document. The engine remains the only document/history owner.

At apply admission, reauthorize the request and lookup its durable identity before treating it as a new proposal. Same ID/same payload returns its recorded outcome even after revision advancement; same ID/different payload rejects. New requests recheck ownership, expiry, read-only state, revision and anchors under serialized admission. Human review does not bypass these checks.

## Observe without claiming a save

Tools return outcomes; ordinary collaboration carries committed update bytes to human views. Optional MCP resource notifications carry invalidation/revision metadata, not CRDT content, guaranteed history or durable receipts. Negotiate subscriptions, or use bounded polling when unavailable. A reconnect reads the current revision and resynchronizes through collaboration.

The retained observation adapter defaults to 16 documents and 16 in-flight reads, a one-second minimum interval and a 60-second lease. The embedding app schedules polling and disposes connection-owned resources; there is no guaranteed event delivery. Reauthorize before reads and before flushing notifications, and remove subscriptions on revocation, unsubscribe, expiry or disposal. Observation reports durability as not reported. A send, notification, render or peer convergence is not remote storage confirmation.

## Failure and recovery

If the caller times out after commit, keep the same request identity and resolve its outcome after authority is restored. Do not generate a new ID to guess whether the insertion committed. A definitely expired/cancelled request before mutation is different from a post-commit unknown outcome.

The engine cannot roll back a mutation after journal failure. Preserve recovery data, block further edits and outgoing synchronization, then recover the journal in order. This barrier also covers human edits, checkpoints and state-vector resync so they cannot leak an unjournaled predecessor. Retain an explicitly labeled salvage export rather than reporting a clean rejection.

Cancel only the request's owned work and release retained preparations/uploads. Dispose Markdown adapters, subscriptions and the host's document handle at their owning lifetime boundary; close the SQLite fixture and delete only disposable fixture state after evidence is saved. No browser remount is needed for ordinary shared updates.

## Endpoint and deployment limits

A local authorized client can export plaintext only when it has the document keys. A hosted app MCP needs an explicitly trusted decrypting endpoint; an opaque ciphertext relay must route to an authorized client or report unavailable. No hidden key upload or plaintext downgrade is part of this example. No configured provider, public server or production authentication service is qualified by fake fixture auth.

## Migration and compatibility

Read [cloud hosting](@/docs/guides/cloud-hosting.md), [host operations](@/docs/guides/host-operations.md), [compatibility](@/docs/reference/compatibility.md) and [Migrate to edit.ac](@/docs/migrate/_index.md). The local source receipt and future remote service receipt have different promises.
