+++
title = "Integrate extensions and host services"
description = "Run prepared resolver and asset recipes through the public editor APIs."
weight = 4
+++

Start with the [complete extension/resolver example](@/docs/examples/extensions-resolvers.md). It uses real public production packages, the shared engine, BrowserEditor and IndexedDB with prepared host responses. Tested package identity is the unpublished `extension-authoring-v1` local candidate (`@edit-ac/core` and `@edit-ac/web` `0.0.0`), pinned by source and tarball hashes. [Release and platform status](@/docs/reference/status.md) remains separate; no registry or durable-host support is inferred.

## Preserve content while optional work runs

Register portable, versioned data separately from its host presenter. Document content contains inert identities, bounded metadata and authored fallbacks. Presenters and host services do not maintain another writable document. Apply accepted results through the existing prepared command and history boundary. Unknown bounded extension data stays available through its declared fallback.

For [public preview and internal-reference recipes](@/docs/guides/references.md), opening the Project kickoff document makes zero resolver calls. Public previews remain transient. Permission-denied internal targets never fall back to public fetching. Automatic local-paste metadata is an explicit policy, distinct from authorization and document-open behavior.

## Cancel an asset upload and recover

**Input:** the prepared local `notes.txt` bytes are `Project kickoff attachment` followed by a newline. **Action:** run a prepared host upload through the public `ServiceLifecycle` with a captured document/session/revision/permission scope, then cancel it. **Output:** cancellation aborts the host signal; even if the host returns late, no asset enters the document. The local bytes remain available for recovery.

Once the first host operation actually settles, retry as a new explicit intent. Its prepared success returns a stable nonsecret asset identity (`prepared` / `kickoff_notes`), never a bearer URL. The existing editor fragment command inserts one inert file descriptor and `notes.txt` fallback. Flush locally, destroy and reopen: the descriptor survives. Read-only, revoked permission and an intervening document edit invalidate the pending upload before insertion.

This is an executable prepared-host upload recipe. It does not send a binary, claim remote durability or implement the host's storage, encryption, binary reference counts or garbage collection. Production hosts must authorize each operation, retain recovery bytes, support cancellation and distinguish transport acknowledgment from durable receipts. A document-open operation must not upload or resolve arbitrary stored assets.

## Bound work and release resources

The example's service policy allows one active operation, no queued work, 1,024 bytes, one item and a 30-second deadline. Oversized work fails before the host callback. Cancellation settles the caller promptly, but an uncooperative host keeps its occupied slot until it finishes; retrying in a loop would cause unnecessary work. Revalidate current scope before accepting a result. Keep failure and recovery visible to the reader.

Dispose lookup subscriptions and service lifecycles, then flush/destroy the editor. Release captured anchors and controls. The browser harness checks subscriptions, pending work and server/browser teardown. It blocks external browser requests and records exact executed/passed/failed/skipped counts.

For authoring rather than host integration, see [custom extensions](@/docs/extensions/custom.md). Each independent feature profile retains its own qualification; these recipes do not establish Tiptap runtime compatibility or native/device support.
