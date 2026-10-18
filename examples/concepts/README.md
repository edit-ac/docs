# Project kickoff, version 1

Status: conceptual source-only transcript. No SDK package, runtime or platform is qualified by these files. License: Apache-2.0, original redistributable teaching content. The `.invalid` fixture link is inert; never fetch it.

Read kickoff-v1.md, then transcript.json. Each step names a before/after Markdown snapshot, selection, history and independent local/remote milestones. Markdown expresses expected meaning, not an edit.ac interchange schema or import promise. Friday starts bold. PK-03 removes bold; PK-04 applies it. Splitting immediately before Friday removes no spaces or text: `Due ` becomes paragraph text `Due` in this teaching representation. Joining restores the single separating space.

PK-16 is a failure branch, not a successful no-op: an attempted new edit exists only in recovery data; the durable snapshot remains remote-owner-v1.md. It makes no claim about a particular editor's post-failure write policy. Preserve unsaved content, retry ordered persistence with the owning storage implementation and verify reopen before claiming success. Do not infer remote durability from local saving or convergence.

Cleanup: these static fixtures open no stores, sockets or subscriptions. Actual consumers must unsubscribe, detach transports, destroy views and close owned stores without deleting unsent recovery data. Follow the pinned qualified-local consumer for its actual teardown.
