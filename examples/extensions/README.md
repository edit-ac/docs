# Local extension and resolver consumers

Parent DWF-1.6; this source uses the immutable unpublished extension-authoring-v1
candidate from architecture/evidence/local-consumer-return/20261018. Package
version 0.0.0 alone does not identify an artifact: use manifest.json tarball hashes.

From docs with Node24.19.0/npm11.17.0 and the prepared offline dependency cache:

    npm run check:examples -- --suite extensions-resolvers

This runs real production WASM, BrowserEditor and IndexedDB through public imports.
The browser suite intercepts external requests. Metadata and binary-upload responses
are hand-authored callbacks; no provider, public service or durable asset host is
qualified. The SDK ServiceLifecycle owns transient work admission, while prepared
host responses retain input bytes and return inert descriptors. Existing editor
commands own all document mutations, persistence and history.

Use a fresh DOCS_EXTENSIONS_OUTPUT for a repair, retain the failed directory, and
change the implicated implementation before repeating a failed feature check.
The harness closes contexts/browser/server and removes .extensions-resolvers-work;
logs, before/action/after snapshots and compiled-consumer.tgz remain as evidence.

Readable guides live in content/docs/guides/{extensions,references}.md and the
complete example page in content/docs/examples/extensions-resolvers.md. Generated
source ranges/downloads are owned by scripts/prepare-extensions-resolvers.mjs.
Original EQL/registry/release/native/cloud/performance gates stay open.
