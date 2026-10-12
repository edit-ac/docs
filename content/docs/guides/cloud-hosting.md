+++
title = "Host documents in the cloud"
description = "Plan document authority, access control and durable storage receipts."
weight = 7
+++

**Status: planned integration contract.** See [release status](@/docs/reference/status.md) before assuming an API or service is available.

Reference readiness means implementing the document-store contract and passing its recovery and access-control tests. A production provider claim additionally requires qualification against that configured provider, its deployment and restore behavior; local conformance alone does not establish it. A websocket relay that passes updates between test clients is not a durable document service.

Keep document discovery, membership and access policy in a control plane. Keep collaborative update bytes, durable receipts and recovery in the data plane. Start with one deployable service and explicit storage adapters; these are boundaries, not a requirement for separate microservices.

Authorize every document operation and asset read by tenant and principal. A document ID, `ac://` locator, object key or signed upload URL is not general document authority. Authenticate reconnects and recheck writes after offline periods.

Acknowledge only the promised durability level. Coordinate staged object writes with catalog commits; test partial failure and cleanup instead of assuming the object store and metadata database share a transaction. Bound subscriptions, upload sizes and pending queues.

Define retention, backup/restore, deletion and offline-peer recovery before hosting user documents. Encrypted storage and ciphertext relay support require their own qualified security profile. This repository does not provision a cloud provider or offer a hosted edit.ac service.
