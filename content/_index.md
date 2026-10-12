+++
title = "An editor engine built in Rust"
description = "edit.ac is being developed as a portable editor SDK for web, native and terminal clients."

[extra.devlab.home]
layout = "wide"

[[extra.devlab.home.blocks]]
type = "hero"
eyebrow = "edit.ac · SDK in development"
actions = [
  { label = "Read the docs", path = "@/docs/_index.md" },
  { label = "View source", path = "https://github.com/edit-ac/core", style = "secondary" },
]

[[extra.devlab.home.blocks]]
type = "features"
title = "Plan your integration"
description = "The guides describe the SDK's integration contracts. Package installation tutorials will follow a qualified release."
items = [
  { title = "Embed the editor", description = "Choose a web, native or terminal integration and understand the services your application owns.", path = "@/docs/guides/getting-started.md" },
  { title = "Keep local work", description = "Understand local saves, recovery and reconnect before adding collaboration.", path = "@/docs/guides/local-first.md" },
  { title = "Connect agent editing", description = "Prepare and inspect document changes through your application's MCP, then apply them with a stable request identity.", path = "@/docs/guides/agents.md" },
  { title = "Work with document formats", description = "Check import and export directions, fidelity limits and conversion reports.", path = "@/docs/guides/document-formats.md" },
]

[[extra.devlab.home.blocks]]
type = "cta"
title = "Follow development"
description = "The public API and release-backed playground are still in development. Check capability status for the current public promises."
actions = [
  { label = "Capability status", path = "@/docs/reference/status.md" },
  { label = "Architecture and roadmaps", path = "https://github.com/edit-ac/architecture", style = "secondary" },
]
+++
