+++
title = "Add an extension"
description = "Plan portable extension semantics and platform presenters."
weight = 4
+++

**Status: integration contract, not a package setup tutorial.** Selected local implementation evidence is described on the [status page](@/docs/reference/status.md); runnable configuration and authoring recipes need their own exact artifact profiles.

An extension combines portable document data and commands with optional host presentation. Register its namespaced type, version, validated content shape and fallback before mounting the document. Document data never contains executable plugin code.

The first-party feature families include code blocks, tables, assets and embeds, slash commands, block reordering, references and link display. Each feature has separate read, edit, copy, import/export and platform capabilities; the family list is not a support matrix. Disabled presentation must preserve bounded unknown data.

Use prepared semantic commands for changes. Presenters receive stable identities and incremental patches; they must not maintain another authoritative writable document. Cancel asynchronous work when its document, revision, target or permission context changes.

Network resolvers and uploads belong to host services. Opening a document does not grant permission to fetch every URL it contains. Private reference metadata belongs to the authorized viewer unless a separate disclosure policy permits sharing it.

See the [extension contract](https://github.com/edit-ac/architecture/blob/main/specs/extension-library.md). Executable authoring tutorials will accompany the matching package release.


## Before you start

**Prerequisites:** Identify descriptor versions, capabilities and host presenters.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

Catalog and [custom extension examples](@/docs/extensions/custom.md) remain planned; this contract is not a runnable configuration.

## Failure and recovery

Cancel stale work, preserve unknown bounded payloads and release owned resources. Never fetch private metadata after permission denial.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
