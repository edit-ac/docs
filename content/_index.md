+++
title = "Build editing into your product."
description = "A Rust-powered document engine, WebAssembly for the browser, and an architecture designed for responsive editing and collaboration. Embed the experience your product needs."

[extra.devlab.home]
layout = "wide"

[[extra.devlab.home.blocks]]
type = "hero"
eyebrow = "edit.ac · Open source · SDK in development"
actions = [
  { label = "Explore the docs", path = "@/docs/_index.md" },
  { label = "Explore the engine", path = "https://github.com/edit-ac/core", style = "secondary" },
]

[[extra.devlab.home.blocks]]
type = "features"
id = "architecture"
eyebrow = "The architecture"
title = "Less work on every keystroke. More room for your product."
description = "Task descriptions, comments, notes and longer documents share the same demands: responsive input, dependable saves and content that can grow. edit.ac is designed around those demands, from the document store to the rendering boundary."
items = [
  { kicker = "Rust + WebAssembly", title = "Shared document semantics", description = "Rust owns commands, validation, anchors and history. WebAssembly brings that engine to the browser, with a thin adapter for DOM rendering and platform input." },
  { kicker = "Incremental editing", title = "Update the affected range", description = "Compact patches let adapters update changed content. The design keeps whole-document serialization and framework rerenders out of ordinary editing." },
  { kicker = "Local-first foundation", title = "Keep the document close", description = "One Yrs-backed collaborative state underpins local editing, recovery and synchronization. Offline work and collaboration use the same document model." },
  { kicker = "Optional modules", title = "Choose your editing footprint", description = "The architecture separates the core from menus, tables, math and other extensions, so each product can choose the capabilities it needs." },
]

[[extra.devlab.home.blocks]]
type = "workflow"
id = "performance"
eyebrow = "Designed for performance"
title = "A short path from input to visible change"
description = "Each edit has a focused job. The engine and its adapters are designed to bound that work as the document grows."
items = [
  { title = "Prepare one semantic edit", description = "Resolve the affected range and validate the command before changing the collaborative store. Keep expensive parsing outside the mutation phase." },
  { title = "Patch what changed", description = "Commit the edit, emit a compact patch and update the affected DOM or native spans. Scoped subscriptions keep application updates focused." },
  { title = "Queue persistence and sync", description = "Send update bytes to storage and synchronization adapters. Ordinary typing should not wait for a network request or a full document export." },
]

[[extra.devlab.home.blocks]]
type = "learn"
id = "wasm-and-platforms"
eyebrow = "One engine, platform input"
title = "Rust at the center. WebAssembly at the browser boundary."
description = "The shared engine keeps document rules consistent while each adapter handles its platform's input, selection and rendering. This is the direction for the SDK; platform availability follows qualified releases."
items = [
  { title = "A thin browser layer", description = "The browser design pairs a WebAssembly engine with a framework-independent adapter and a thin React wrapper. Native browser input and composition remain part of the editing experience.", path = "@/docs/guides/getting-started.md" },
  { title = "Native controls, shared rules", description = "The original brief calls for iOS and Android adapters using native text controls without a WebView. Native SDKs remain planned, with platform qualification tracked separately.", path = "@/docs/reference/status.md" },
  { title = "Headless and agent workflows", description = "The headless engine provides a foundation for nonvisual consumers. The agent contract lets applications prepare and inspect proposed changes before applying them.", path = "@/docs/guides/agents.md" },
]

[[extra.devlab.home.blocks]]
type = "features"
id = "durability"
eyebrow = "Keep local work"
title = "Collaboration starts with a durable document"
description = "The local-first design carries edits through saves, restarts and reconnects. Your application owns storage and transport; the engine supplies the shared document semantics."
items = [
  { title = "Recover local edits", description = "An update journal and checkpoints form the recovery path. Unsynced updates are retained, and persistence failures are explicit in the host contract.", path = "@/docs/guides/local-first.md" },
  { title = "Reconnect with shared state", description = "Yrs-backed state and a version-pinned Yjs interoperability contract give collaboration a common foundation. Stable anchors identify positions as concurrent edits arrive.", path = "@/docs/guides/local-first.md" },
  { title = "Use your own services", description = "Connect persistence and sync through host adapters. The hosting guide describes application responsibilities for identity, authorization, storage and remote commits.", path = "@/docs/guides/cloud-hosting.md" },
]

[[extra.devlab.home.blocks]]
type = "features"
id = "content-and-extensions"
eyebrow = "Content that fits your product"
title = "Start with everyday writing. Extend where it matters."
description = "The design brings Markdown and structured content into the shared engine, with optional extensions for richer interactions. Explore their contracts as you plan your integration."
items = [
  { title = "Markdown in the engine", description = "A shared Rust parser and serializer are planned for formatted paste, typing shortcuts and explicit literal paste, with a documented CommonMark/GFM profile.", path = "@/docs/guides/document-formats.md" },
  { title = "Portable extensions", description = "Typed nodes, marks and commands pair with platform rendering hooks. Planned modules include slash commands, mentions, block reorder and math.", path = "@/docs/guides/extensions.md" },
  { title = "Understand format fidelity", description = "Import and export have separate contracts. Check supported directions, conversion reports and fidelity limits when planning how content moves into or out of your product.", path = "@/docs/guides/document-formats.md" },
  { title = "Plan an editor migration", description = "Choose your integration surface and check the compatibility boundaries. The migration path must account for document schemas, extension behavior and stored content.", path = "@/docs/reference/compatibility.md" },
]

[[extra.devlab.home.blocks]]
type = "learn"
id = "measurement"
eyebrow = "Measure the whole experience"
title = "Performance claims need more than a small JavaScript wrapper"
description = "The brief sets engineering targets for the complete editing experience. Those targets guide development; they are not published benchmark results or claims of superiority over other editors."
items = [
  { title = "Count the full download", description = "Measure JavaScript, WASM and essential CSS together, including decompression, compilation and document restoration. Optional modules have their own costs." },
  { title = "Time actual editability", description = "Separate a fast first viewport from the first accepted edit. Track cold and warm starts, typing latency, Markdown paste and long-document activation." },
  { title = "Compare equal capabilities", description = "Use reproducible documents and optimized baselines with equivalent collaboration and persistence. Track tail latency, memory and repeated mount/edit/destroy cycles." },
]
actions = [
  { label = "Read the original brief", path = "https://github.com/edit-ac/architecture/blob/main/sources/initial-roadmap.md", style = "secondary" },
]

[[extra.devlab.home.blocks]]
type = "features"
id = "integration"
eyebrow = "Explore the SDK"
title = "Find the path into your application"
description = "Start with the integration contracts, then follow the development evidence for the capabilities your product needs."
items = [
  { title = "Choose your integration", description = "Understand the web, native and terminal surfaces, lifecycle and services your application owns.", path = "@/docs/guides/getting-started.md" },
  { title = "Design local storage", description = "Plan save, recovery and reconnect behavior before adding collaboration.", path = "@/docs/guides/local-first.md" },
  { title = "Connect agent editing", description = "Prepare and inspect document changes through your application's MCP, then apply them with a stable request identity.", path = "@/docs/guides/agents.md" },
  { title = "Shape the editor", description = "Explore extension contracts for content, commands and the UI your product needs.", path = "@/docs/guides/extensions.md" },
]

[[extra.devlab.home.blocks]]
type = "cta"
id = "follow-development"
title = "Build with the architecture. Follow the release."
description = "edit.ac is open source under Apache-2.0 and the SDK is in development. There is no qualified public editor release yet. Installation tutorials and a public playground will follow release qualification; the docs are ready for planning your integration."
actions = [
  { label = "Capability status", path = "@/docs/reference/status.md" },
  { label = "Architecture and roadmaps", path = "https://github.com/edit-ac/architecture", style = "secondary" },
]
+++
