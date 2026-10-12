+++
title = "Versions and capabilities"
description = "Track schema, protocol, extension and platform capability versions."
weight = 9
+++

Compatibility includes more than the SDK package version. Record the document schema, update/sync protocol, extension descriptor versions, native ABI, Markdown dialect and format-converter profile used by a document and client.

A capability report distinguishes available, enabled, authorized and qualified behavior. A client advertising a feature does not grant permission to use it. Importers and renderers preserve unknown bounded data, while unsupported editing operations fail explicitly.

Use immutable package versions in examples. Test independently packed consumers and the supported previous/current version combinations. Schema migration requires a recovery path; rolling back an application must not silently downgrade a newer document.

Performance claims name the document sizes, enabled features, hardware and OS/browser profile. Stress-fixture success does not automatically expand the supported envelope. Each platform and converter direction needs its own evidence.
