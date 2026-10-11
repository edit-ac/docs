# edit.ac documentation

Developer guides for embedding the Rust-first edit.ac editor and building clients, extensions and document services.

**Development status:** the SDK is under development. These guides describe integration contracts; they do not advertise a released editor or a working public demo. Versioned API tutorials and the public playground are delivery milestones.

[Start reading](docs/index.md) · [Capability status](docs/reference/status.md) · [Architecture and roadmaps](https://github.com/edit-ac/architecture) · [Core](https://github.com/edit-ac/core) · [CLI](https://github.com/edit-ac/cli)

## Repository structure

- `docs/guides/`: task-oriented integration guides.
- `docs/reference/`: terminology, compatibility and release status.
- `examples/`: entry point for qualified, executable SDK examples.
- `navigation.json`: the public reading order, checked in CI.
- `scripts/`: dependency-free documentation checks.

Run `npm run check` with Node 24. Site publication, search, generated API references and the public demo are tracked in architecture roadmap 29. This repository owns public learning material; architecture owns design decisions and development tasks.

Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md). Source and documentation use [Apache-2.0](LICENSE).
