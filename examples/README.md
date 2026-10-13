# Qualified examples

This directory will link or contain release-backed examples for web embedding, React lifecycle, local-first recovery, extensions, host MCP editing and native clients. The [public gallery](../content/docs/examples/_index.md) records concrete example families and their status.

An early [rendered web preview](https://github.com/edit-ac/core/tree/main/examples/web) lives with the core source. It uses the real Rust/WASM engine and internal browser adapter, version 0.0.0, for three editable sample documents. It requires a source build and a static file server, has no backend, and keeps edits in the current tab. This is separate from the release-backed consumer suite; it does not pass publication or platform qualification gates.

Each example must identify the exact package versions and capability profile, run as a clean consumer without workspace aliases, and pass its declared checks. Examples use redistributable fixtures and no secrets or model-provider calls. The public playground ships only after the editor and example artifacts qualify.
