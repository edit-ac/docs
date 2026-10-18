# Host-app MCP and Markdown edit readiness

Status: planned shared adapter, roadmap 14. The embedding application's existing MCP owns authentication, transport, tool registration and authorization. edit.ac supplies portable editing services and optional adapter helpers. Neither a standalone MCP server nor a CLI MCP mode is required. No model provider belongs in the core.

## Planned service shape

The names below describe host-mappable operations, not a currently exported SDK:

| Operation | Inputs | Outputs |
|---|---|---|
| Read/export | Document locator, representation and optional revision | Markdown/source, observed revision, source hash, schema/dialect, capability and preservation diagnostics |
| Prepare | Expected revision/hash plus bounded Markdown patch, complete candidate Markdown, or anchored semantic edits | Validated proposal ID, semantic/source diff, affected identities, conflict/unsupported diagnostics |
| Apply | Proposal ID, expected revision and stable request ID | Operation/receipt ID, resulting revision, local durability and remote receipt state |
| Receipt lookup | Actor/document-scoped request ID | Original result, pending/unknown/not-found state |
| Observe | Authorized document and cursor/revision | Bounded change metadata, invalidation/resync indication |

A complete candidate Markdown upload is a proposal against its retained export baseline. FMT-1.12 maps it to bounded prepared semantic commands while preserving unchanged identities and unknown data. It is not permission to overwrite the live document wholesale. Chunked uploads use explicit size/checksum/session/expiry limits; partial uploads never mutate the document. Local paths, public URLs and uploaded content do not independently grant document authority.

## Mutation and retry contract

Recheck permissions, readonly mode, schema/capabilities, expected revision and anchors within the host's serialized commit boundary. Stale/ambiguous/deleted-target inputs return structured conflict with no preparation-time mutation. The base/current/proposed comparison is available for a new reviewed proposal. Authorization and capability metadata are not accepted from untrusted document text.

Bind each immutable proposal to the authenticated actor, document/epoch, base revision, schema/dialect profile and content hash. Scope idempotency by authenticated actor, document/epoch and request ID; store the payload hash and result. Apply first authorizes access to that request's outcome, then looks up its durable receipt and compares payload hashes. Same ID/same payload returns the original receipt, including after restart, even if the original proposal has since expired or its base revision is now stale. Same ID/different payload rejects. Only a new request proceeds to proposal ownership/expiry checks and the serialized mutation preconditions above. Retain entries for a documented retry window and return an explicit expired/unknown outcome rather than claiming indefinite exactly-once delivery.

Journal committed update bytes and dedup/result metadata in one durable host-store transaction before acknowledging durable success or releasing that remote request's updates to peers. The engine commit itself cannot roll back. If local persistence fails after mutation, return a pending/unknown-durability result and retain recovery state; never report a clean rejection and silently repeat insertion. Freeze further mutation admission and outbound synchronization for that replica until ordered journal recovery succeeds; bounded incoming updates may be queued without application. Reads and explicitly labeled recovery exports remain available. The barrier covers human edits, state-vector resynchronization, checkpoints and batched updates, any of which could otherwise leak the unjournaled operation. Durable publication always includes all causal predecessors and their required dedup receipts. No acknowledged durable operation may be repeated after crash/retry. Define queue visibility and recovery order in tests before exposing mutation tools.

Agent operations carry authenticated provenance and intentional history groups; they use the same engine, renderer patches, persistence/outbox and sync channel as human edits. Reverting an agent change is a new revision-checked authorized edit, not destructive rewind. Limits apply per request, document and pending queue.

## Queued expiry and uncertain completion

[WCF-02](../tests/wordcraft-regression-cases.md) sharpens AGT-1.4 without changing the receipt protocol. Hosts recheck execution deadlines/cancellation inside serialized admission before mutation. Work that expires while queued is a clean rejection with no edit. A caller timeout after engine commit is not cancellation of that commit: preserve the existing pending/unknown-durability barrier and resolve the same request identity through its durable outcome. Test both sides of the commit boundary with fixed clocks and held queues; no synthetic UI acknowledgement may substitute for semantic execution evidence.

## Realtime and read-only behavior

Open views receive ordinary engine updates without remounting; concurrent human changes are reconciled under the same policy. MCP resources/subscriptions or supported notifications advertise invalidation and bounded revision metadata, with capability-negotiated polling/resync fallback. MCP notification delivery is not the CRDT transport, guaranteed event history, or proof of durable storage.

Read-only means the mutation service denies every write regardless of UI or MCP annotations. Host permissions filter reads, source exports, history, attachments and receipt lookups too. Keep editing content distinct from instructions authorizing new tool actions. Tool response content is untrusted user data; it cannot expand scopes or fetch referenced resources automatically.

## Encryption and hosting

For E2EE, source export, diff and edit application run at an authorized endpoint with document keys. An opaque relay cannot offer plaintext Markdown tools. A server-side app MCP can edit only if that service is explicitly inside the decryption trust boundary; otherwise it routes to an available authorized local client or reports unavailable. No plaintext downgrade or hidden key upload is allowed.

Host integration qualification uses a prepared MCP client/server transport, fake authorization, fixture uploads and real shared engine calls. Verify duplicate retries after crashes, stale revisions, overlapping edits, readonly denial, bounded notifications and browser/native/TUI propagation. No live LLM calls, paid inference or production source uploads are needed for these tests.

Sources: [MCP tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools), [MCP annotations](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/), [HTTP conditional semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-13), [research](../evidence/followup-research.md).
