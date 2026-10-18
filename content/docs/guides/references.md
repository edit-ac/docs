+++
title = "Resolve links and insert references"
description = "Keep public previews and permission-scoped internal references separate."
weight = 5
+++

Use the [complete extension/resolver example](@/docs/examples/extensions-resolvers.md) for Project kickoff. Its exact unpublished `extension-authoring-v1` candidate contains `@edit-ac/core` and `@edit-ac/web` version `0.0.0`; the candidate manifest and SHA-256 identities distinguish these local builds from other `0.0.0` families. Registry installation, hosted services and native qualification remain pending.

## Show a public preview

**Input:** the authored Reference link targets `https://example.invalid/project-kickoff`. This reserved fixture address is never fetched. **Action:** call the recipe's explicit refresh. The prepared `publicMetadata` host port returns “Project kickoff preview”. **Output:** the SDK renders transient preview metadata; authored text, link target and history stay unchanged. Metadata is rendered as text, without executable markup or remote image URLs.

Opening a document, rendering, undo and remote updates do not initiate metadata lookup. `explicit-refresh` requires a deliberate action. `disabled` prevents automatic lookup. Opting into `local-paste` enables metadata only after a successful local clipboard command; it does not authorize arbitrary document-open retrieval. Preview authority, internal lookup authority and permission to publish metadata into shared text are separate capabilities.

The host owns actual connection admission, redirects, credential isolation, output limits and principal-scoped caches. A URL in document data grants no network access. This example uses an allowlisted prepared callback and makes no external requests; it does not implement or qualify a production metadata service.

## Insert a permission-scoped custom reference

**Input:** search `ASD-123` through `ReferenceLookupSession`. The prepared catalog admits only `ac://team-1/12345678-1234-4234-8234-123456789abc`. **Action:** obtain the current permission projection, search, re-admit the selected result, and commit `referenceBlock(result)` through the editor's existing fragment command. **Output:** an inert reference atom labeled ASD-123; ordinary undo/redo and local reopen preserve the expected document.

The target is an identifier, not credentials or immutable-content proof. Its authored fallback is shared; private viewer metadata must stay transient. After permission denial, the lookup produces no result, no semantic write and no public-metadata fallback. Revocation invalidates accepted results. Cancel old work on document/session changes, read-only transitions and disposal; a late result cannot edit newer content.

## Source and verification

The [source manifest](/examples/extensions-resolvers/manifest.json) binds the recipe source, input fixture, public packages and upstream25/26 evidence. Download [recipes.mjs](/examples/extensions-resolvers/recipes.mjs) with its [Project kickoff seed](/examples/extensions-resolvers/kickoff.mjs); run the named integration suite described on the example page. The assertions independently compare before/action/after states and reject empty or skipped proof.
