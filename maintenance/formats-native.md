# Format guide provenance

DWF-1.7 source-documentation prerequisite. `examples/formats/manifest.json` freezes
nine direction-specific core profiles from the exact implementation commits in
roadmap27 receipts. Each record pins the immutable architecture receipt blob,
its original counts, core profile and owning Rust consumer source hash. Counts
are reused historical evidence, never new docs runtime executions.

`node scripts/prepare-formats.mjs` generates downloads and the matrix; `--check`
rejects source/download/page drift. `node --test tests/docs-formats-native.test.mjs`
checks documentation provenance and preservation recipe coverage only.

`npm run check:examples -- --suite formats-native` is the feature admission
boundary. It deliberately fails until a real packaged host consumer is supplied
and integrated. Do not treat source tests, WASM compilation, an empty host list
or a changed status label as host qualification. Add a pinned consumer runner
and independent expected outcomes before enabling success; preserve the initial
admission failure as evidence. No network, provider, platform campaign or registry
publication is required or authorized by this prerequisite.

Refresh profiles by consuming a new owning receipt, never by editing generated
profiles or relabeling a platform. The existing converter/Session remains the
only semantics owner. Future host examples must reuse it.
