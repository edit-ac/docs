# Add an extension

**Status: planned integration contract.** See [release status](../reference/status.md) before assuming an API or service is available.

An extension combines portable document data and commands with optional host presentation. Register its namespaced type, version, validated content shape and fallback before mounting the document. Document data never contains executable plugin code.

The planned first-party library includes code blocks, tables, assets and embeds, slash commands, block reordering, references and link display. Each feature has separate read, edit, copy, import/export and platform capabilities. Disabled presentation must preserve bounded unknown data.

Use prepared semantic commands for changes. Presenters receive stable identities and incremental patches; they must not maintain another authoritative writable document. Cancel asynchronous work when its document, revision, target or permission context changes.

Network resolvers and uploads belong to host services. Opening a document does not grant permission to fetch every URL it contains. Private reference metadata belongs to the authorized viewer unless a separate disclosure policy permits sharing it.

See the [extension contract](https://github.com/edit-ac/architecture/blob/main/specs/extension-library.md). Executable authoring tutorials will accompany the matching package release.
