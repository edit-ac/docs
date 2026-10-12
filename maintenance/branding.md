# Maintain the edit.ac identity

The [architecture brand guide](https://github.com/edit-ac/architecture/blob/main/design/brand-guide.md) defines the shared editor, GitHub and website identity. `static/brand/` owns the canonical artwork. Keep the core and architecture copies in sync when changing it.

- `editac-source.svg` is the original user-supplied CC0 artwork; preserve its geometry and [provenance](../static/brand/LICENSE.md).
- `editac-mark.svg` is the transparent Oil black mark. The header renders it as a CSS mask in the current foreground color, so manual website theme changes apply immediately.
- `static/favicon.svg` follows the browser's light/dark preference with Oil black/white paths on transparency. Website theme controls do not determine the browser favicon.
- `editac-github-avatar.png` is the 1024 pixel padded white variant for the GitHub organization. The same canvas produces the 180 pixel Apple touch icon and 192/512 pixel install artwork. The website does not advertise a PWA manifest.

Regenerate the assets offline with `node scripts/generate-brand.mjs`. It requires `rsvg-convert` and ImageMagick's `magick`; the initial assets used librsvg 2.61.3. Commit the generated files. Copy `editac-mark.svg` and `editac-github-avatar.png` to core's `brand/` and architecture's `design/assets/`, and verify byte equality.

Site overrides live in `templates/base.html`, `templates/partials/header-brand.html` and `static/brand.css`; Zola's configured brand path selects the SVG mask. The upstream DevLab submodule stays intact. Run the normal documentation and Zola checks, then inspect the header, favicon, docs, search and mobile navigation in light and dark modes.
