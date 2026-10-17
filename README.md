# edit.ac website and documentation

<p align="center"><img src="static/brand/editac-github-avatar.png" alt="edit.ac logo" width="120"></p>

The official website at [edit.ac](https://edit.ac), built with [Zola](https://www.getzola.org/) and [DevLab](https://codeberg.org/RiPetitor/devlab-theme).

The editor SDK is in development. These guides describe integration contracts and an unreleased source preview. Selected local packed browser behavior has recorded checks; registry installation and the public playground remain unqualified. Start with [capability status](content/docs/reference/status.md) to distinguish those states.

[Read the docs](content/docs/_index.md) · [Capability status](content/docs/reference/status.md) · [Core](https://github.com/edit-ac/core) · [Architecture](https://github.com/edit-ac/architecture)

See [branding maintenance](maintenance/branding.md) for the shared logo, favicons and GitHub artwork.

## Read in order

Start at [the docs entry](content/docs/_index.md), choose an [integration path](content/docs/guides/getting-started.md), then check [capability status](content/docs/reference/status.md) before following a guide or example. The entry page orders the existing guides by task. [Examples](content/docs/examples/_index.md) distinguish the source preview from planned package consumers.

The [baseline manifest](maintenance/docs-baseline.json) records the reviewed source commits, license metadata and local evidence profile. It is a dated snapshot, not a release or deployment receipt. Public guides live in this repository; implementation roadmaps and acceptance checklists belong to [architecture](https://github.com/edit-ac/architecture).

## Work locally

Install the Zola version in `.zola-version` from the [official releases](https://github.com/getzola/zola/releases), and use Node 24 for the documentation check. Clone with the pinned theme:

```sh
git clone --recurse-submodules git@github.com:edit-ac/docs.git
cd docs
npm run check
zola check --skip-external-links
zola build
zola serve
```

For an existing clone, run `git submodule update --init --recursive`. The preview normally opens at `http://127.0.0.1:1111`. Stop it with Ctrl+C when finished.

## Repository structure

- `content/_index.md`: homepage.
- `content/docs/`: integration guides and reference pages.
- `zola.toml`: site identity, navigation, search and theme settings.
- `themes/devlab-theme/`: upstream theme pinned to v0.9.0 as a Git submodule.
- `sass/ui.scss`: site-owned shadcn-inspired styling, with neutral light and dark palettes. DevLab supplies search, navigation and accessible controls.
- `navigation.json`: inventory of public content, checked in CI.
- `examples/`: qualified SDK examples when released.
- `maintenance/deployment.md`: publishing, domain and upgrade procedures.
- `AGENTS.md`: local agent instructions for maintaining this site.

GitHub Actions checks pull requests and publishes `main` to GitHub Pages. See [deployment maintenance](maintenance/deployment.md) for DNS and HTTPS. This repository owns public learning material; architecture owns design decisions and development tasks.

Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md). Site source and documentation use [Apache-2.0](LICENSE); DevLab and its bundled libraries retain their upstream licenses.
