+++
title = "Versions and capabilities"
description = "Track schema, protocol, extension and platform capability versions."
weight = 9
+++

Compatibility includes more than the SDK package version. Record the document schema, update/sync protocol, extension descriptor versions, native ABI, Markdown dialect and format-converter profile used by a document and client.

A capability report distinguishes available, enabled, authorized and qualified behavior. A client advertising a feature does not grant permission to use it. Importers and renderers preserve unknown bounded data, while unsupported editing operations fail explicitly.

Before the editor's first publication, the target is one current production document format and one current SDK/API/ABI contract. The selected document format keeps the existing `editac.registry.editor.v5` schema and `editac.yrs-yjs.editor.v5` profile identifiers. Earlier development formats are fixture history, not a supported compatibility matrix. This policy is being applied to the implementation; it is not a claim that the runtime cleanup or durability qualification is complete.

Use immutable package versions in examples and test independently packed current consumers. Keep protocol framing, update encoding, external file formats and document revisions distinct where they represent different contracts; do not add parallel implementations for unpublished editor iterations. Unknown or retired document formats must fail explicitly before mutation, while retaining original checkpoint and journal bytes for recovery.

The current format must preserve document identity and epoch, initialized empty documents, Unicode anchors, immutable structural history and unknown bounded data across save, replay and reopen. Later SDK builds must not require the exact old development Git revision to reopen the same supported data. Any necessary development-data conversion is an explicit offline operation into a new destination/epoch with the original preserved; opening a document must never silently relabel, reseed, downgrade or rewrite it.

At the first publication, freeze and record the actual supported format and artifacts, with a reviewed recovery/migration policy. Compatibility promises then follow real published data and packages rather than hypothetical older releases. Publication remains separately authorized.

Performance claims name the document sizes, enabled features, hardware and OS/browser profile. Stress-fixture success does not automatically expand the supported envelope. Each platform and converter direction needs its own evidence.

## Plan adoption

Read [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) for planned source-specific migration and evidence requirements. These entries do not qualify converters or benchmarks.

## Pinned profile inventory

The [generated capability table](@/docs/reference/api-capabilities.md) preserves the exact historical core profile states and version tuples. It does not promote stale release-producer inputs or pending native records into support claims.
