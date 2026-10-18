# Qualified examples

This directory will link or contain release-backed examples for web embedding, React lifecycle, local-first recovery, extensions, host MCP editing and native clients. The [public gallery](../content/docs/examples/_index.md) records concrete example families and their status.

An early [rendered web preview](https://github.com/edit-ac/core/tree/main/examples/web) lives with the core source. It uses the real Rust/WASM engine and internal browser adapter, version 0.0.0, for three editable sample documents. It requires a source build and a static file server, has no backend, and keeps edits in the current tab. This is separate from the release-backed consumer suite; it does not pass publication or platform qualification gates.

Reviewed local source: `a20a36c15119c661e47ec0ec7051aed8d94e7ed6`, `examples/web/`. This revision is unpublished. The upstream source link follows moving `main`; it is a discovery link, not the immutable evidence pin. Use the named local checkout for this baseline.

Each example must identify the exact package versions and capability profile, run as a clean consumer without workspace aliases, and pass its declared checks. Examples use redistributable fixtures and no secrets or model-provider calls. The public playground ships only after the editor and example artifacts qualify.

## Conceptual reading fixture

[Project kickoff version 1](concepts/README.md) supplies static semantic snapshots and a prepared transcript. [manifest.json](manifest.json) records original file hashes, maturity, source links and the distinct immutable runtime evidence. `node scripts/prepare-concepts.mjs --check` verifies source/download identity; `node --test tests/docs-concepts.test.mjs` checks independent teaching expectations. Neither check executes an editor.
