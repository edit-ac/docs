# edit.ac website and documentation

<p align="center"><img src="static/brand/editac-github-avatar.png" alt="edit.ac logo" width="120"></p>

The official website at [edit.ac](https://edit.ac), built with [Zola](https://www.getzola.org/) and [DevLab](https://codeberg.org/RiPetitor/devlab-theme).

The editor SDK is in development. These guides describe integration contracts. Installation tutorials and the public playground will follow a qualified release.

[Read the docs](content/docs/_index.md) · [Capability status](content/docs/reference/status.md) · [Core](https://github.com/edit-ac/core) · [Architecture](https://github.com/edit-ac/architecture)

See [branding maintenance](maintenance/branding.md) for the shared logo, favicons and GitHub artwork.

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
- `navigation.json`: inventory of public content, checked in CI.
- `examples/`: qualified SDK examples when released.
- `maintenance/deployment.md`: publishing, domain and upgrade procedures.
- `AGENTS.md`: local agent instructions for maintaining this site.

GitHub Actions checks pull requests and publishes `main` to GitHub Pages. See [deployment maintenance](maintenance/deployment.md) for DNS and HTTPS. This repository owns public learning material; architecture owns design decisions and development tasks.

Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md). Site source and documentation use [Apache-2.0](LICENSE); DevLab and its bundled libraries retain their upstream licenses.
