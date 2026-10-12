# Maintain the edit.ac website

This repository publishes the official website and developer documentation at https://edit.ac.

## Content changes

1. Read the relevant page and `CONTRIBUTING.md`. For new capability claims or SDK examples, verify the exact released version and qualification evidence in the core or architecture repository.
2. Edit the canonical Markdown in `content/`. Use Zola `@/` links between content files, TOML front matter and explicit `weight` values. Add every public page or section to `navigation.json`; the DevLab sidebar follows the content sections and weights.
3. Keep planned contracts clearly labeled. Publish installation commands, demos and support claims only with release evidence. Use deterministic fixtures and mocked providers for automated checks; paid inference is forbidden.
4. Run `npm run check`, `zola check --skip-external-links` and `zola build`. For theme, navigation or layout changes, inspect the homepage, a docs page, search and mobile navigation in a local preview. Stop previews and close temporary test tabs afterwards.

## Site maintenance

- Read `maintenance/deployment.md` before changing workflows, the domain, DNS or theme/tool versions. Keep upstream changes outside the theme submodule; use site-level templates or styles for overrides.
- Update the pinned theme commit and Zola version deliberately. Verify the official release checksum when updating the CI installer.
- Keep credentials and private documents outside the repository. Record only public DNS values and deployment evidence.
- Write plain-English imperative commit subjects without type or scope prefixes. Report completed checks and any deployment or certificate state still pending.
