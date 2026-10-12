# Cookieless website analytics

The official website uses Umami Cloud for cookieless traffic analytics. The **edit.ac docs** website was created on 2026-10-12 in the account's **EU** analytics region, using its existing GitHub sign-in.

- Dashboard: [edit.ac docs in Umami Cloud](https://cloud.umami.is/analytics/eu/websites/a27b0771-c196-4899-bce3-37bfa2359c1b).
- Domain: `edit.ac`.
- Public website ID: `a27b0771-c196-4899-bce3-37bfa2359c1b`.
- Tracker: `https://cloud.umami.is/script.js`, as supplied by the Cloud tracking-code dialog.

`zola.toml` owns the enable flag, tracker URL and website ID. The site's `templates/base.html` adds one deferred tracker in the document head, shared by the homepage and documentation pages. It renders only for the production base URL, and `data-domains="edit.ac"` also prevents events from other hostnames. Local previews and builds with a different base URL omit it.

The [Umami tracker configuration](https://docs.umami.is/docs/tracker-configuration) enables these privacy settings:

- Respect browser **Do Not Track** through `data-do-not-track="true"`.
- Exclude page URL query strings through `data-exclude-search="true"`.
- Exclude page URL fragments through `data-exclude-hash="true"`.

This integration uses the standard cookieless tracker without adding user identification, session properties, custom click events or performance tracking. Keep analytics scoped to the public website; editor document content and input must never become analytics payloads. The website ID is intentionally public; keep account credentials, API keys and dashboard authorization outside the repository.

To disable tracking, set `extra.umami.enabled = false` and deploy. When changing providers or account ownership, update the public configuration and verify the site's generated HTML before publishing.

Run the normal documentation and Zola checks. Inspect a production build for exactly one tracker per page and a localhost build for none. After deployment, load the homepage and a docs page, then confirm their pageviews appear in the private Umami dashboard. Browsers with Do Not Track, content blockers, or failed network requests may correctly produce no pageview; do not disable their protections for validation.
