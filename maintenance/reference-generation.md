# Generate the pinned API reference

Run `node scripts/generate-reference.mjs`, then `npm run check:reference`. Normal `npm run check` rejects generated drift. TypeScript 5.9.3 is a build-only pinned declaration parser; no parser ships in the editor or site runtime. Version 7.0.2 exposes no compiler AST API; its failed attempt is retained in the DWF-1.4 evidence.

`releases/local-pin-1.3.json` pins original core/web production tarballs, extracted declaration members, reviewed source blobs, schema and scoped receipts. `static/reference-inputs/local-pin-1.3/` is the frozen downloadable graph. Never regenerate it from mutable dist output. Admit a new version only from exact qualified packs and matching owner receipts; retain earlier versions and failures. `releases/reference-entries.json` selects public exports and supplies contracts, recovery, limits and version history. The generator refuses private, absent and nonexported symbols.

Capability tables derive directly from immutable core profile JSON. Current canonical release-profile generation rejects stale package hashes; historical FIT-1.2/1.3 metadata is separate from current packed PIN-1.3 mechanics and pending native/registry qualification. No stale input is silently repaired or profile relabeled qualified.

Tests check exact declarations, eight families, profile states, source/download links, unsupported claims and negative integrity controls. This is documentation/build proof; no browser/native consumer or provider is run. Update the owning quickstart/recipe gate before advertising new executable examples.
