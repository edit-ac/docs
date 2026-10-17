+++
title = "Local edits, saving and reconnect"
description = "Understand local durability, remote receipts, storage failures and reconnect."
weight = 3
+++

**Status: planned integration contract.** See [release status](@/docs/reference/status.md) before assuming an API or service is available.

An accepted edit, a durable local save and a remote durable receipt are different states. Show them separately in your application. Network delivery alone does not mean a server has persisted an update.

A cached or new local document can become editable before network connection. An uncached remote document still needs to be retrieved. A browser store is subject to the host browser's persistence and eviction behavior; provide exports and recovery appropriate to your product.

Persist the update journal and outbox under the session's storage contract. When persistence fails after an in-memory commit, keep recovery data and expose the failure. The shared session freezes dependent writes and outbound publication until ordered recovery succeeds. Keep reading and clearly labeled recovery export available.

On reconnect, recheck authorization and exchange retained updates. Rejected uploads must not erase recoverable local work. Sharing a database between tabs or processes does not itself deliver live updates to each view.

For contract details, see [storage and sync](https://github.com/edit-ac/architecture/blob/main/specs/storage-sync.md) and [shared clients](https://github.com/edit-ac/architecture/blob/main/specs/client-contracts.md).


## Before you start

**Prerequisites:** Identify local storage, document authority and transport ownership.

**Tested version:** documentation navigation checked with Zola 0.23.6 and DevLab 0.9.0. No SDK consumer is qualified by this page; see [capability and release status](@/docs/reference/status.md).

## Example and expected outcome

A save/reopen consumer must prove retained content independently; this guide explains the contract without runnable API code.

## Failure and recovery

On quota or transport failure preserve unsaved work and any backup. A sync event alone cannot establish durable saving.

## Migration and compatibility

Check [versions and capabilities](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md) before moving existing content.
