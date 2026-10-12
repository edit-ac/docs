# Website deployment and maintenance

## Completed setup

Setup was verified on 2026-10-12:

- The official website is live at [https://edit.ac](https://edit.ac).
- [Repository Pages settings](https://github.com/edit-ac/docs/settings/pages) use **GitHub Actions** with **edit.ac** as the custom domain, and GitHub's DNS check passed.
- **edit.ac** is verified for the **edit-ac** organization under [organization Pages settings](https://github.com/organizations/edit-ac/settings/pages).
- GitHub issued and activated the TLS certificate. **Enforce HTTPS** is enabled and remained selected after reloading the settings page.
- The homepage loaded securely in the in-app browser. Both `http://edit.ac` and `https://www.edit.ac` redirected to `https://edit.ac/`.
- The initial [website deployment](https://github.com/edit-ac/docs/actions/runs/38237165922) and [documentation checks](https://github.com/edit-ac/docs/actions/runs/38237166026) succeeded for commit `a6290a2556cddcd9673a36480a4de237b2edc522`.

## Publishing

The `Publish website` workflow builds `main` with the version in `.zola-version`, verifies the official Linux archive checksum, and deploys `public/` through GitHub's Pages artifact API. Pull requests run the documentation check and Zola build without deployment. Workflows use immutable action revisions; deployment alone receives Pages write and OIDC permissions.

The repository's **Settings → Pages → Source** must be **GitHub Actions**, and its custom domain must be **edit.ac**. `zola.toml` sets the canonical HTTPS address. `static/CNAME` records the intended domain in the artifact; for Actions publishing, the repository Pages setting controls the domain.

After publishing, confirm the workflow succeeded and check `/`, `/docs/`, a nested guide, search, navigation and HTTPS at the live address. A successful local build does not establish deployment success. Preserve the Actions run link when reporting a deployment.

## Namecheap DNS

Keep Namecheap BasicDNS and configure these records under **Advanced DNS → Host Records**:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | Automatic |
| A | @ | 185.199.109.153 | Automatic |
| A | @ | 185.199.110.153 | Automatic |
| A | @ | 185.199.111.153 | Automatic |
| AAAA | @ | 2606:50c0:8000::153 | Automatic |
| AAAA | @ | 2606:50c0:8001::153 | Automatic |
| AAAA | @ | 2606:50c0:8002::153 | Automatic |
| AAAA | @ | 2606:50c0:8003::153 | Automatic |
| CNAME | www | edit-ac.github.io | Automatic |
| TXT | _github-pages-challenge-edit-ac | b89ec4bd4f8118c77239fd6ed9ff29 | Automatic |

Replace the default apex URL redirect and `www` parking CNAME. Preserve unrelated email records and TXT verification records. Use the exact organization domain as the `www` target, without `/docs`. GitHub redirects `www.edit.ac` to the configured apex domain.

The TXT record above completed organization domain verification. Keep it in DNS to retain ownership verification. For a future domain change, follow [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and use the exact TXT challenge GitHub generates for that domain. Use no wildcard records.

```sh
dig edit.ac A +short
dig edit.ac AAAA +short
dig www.edit.ac CNAME +short
dig _github-pages-challenge-edit-ac.edit.ac TXT +short
curl -I http://edit.ac
curl -I https://edit.ac
curl -I https://www.edit.ac
```

For future DNS or domain changes, propagation and certificate provisioning can take up to 24 hours. In Pages settings, wait for the DNS check and certificate to succeed, then confirm **Enforce HTTPS** is selected. During this setup, **Check again** resumed the certificate request after DNS propagated; GitHub then reported **Certificate Active**, and HTTPS enforcement became available after a page reload. Preserve certificate validation while investigating errors.

## Analytics

Analytics configuration and account maintenance are documented in [Cookieless website analytics](analytics.md).

## Theme and tool upgrades

1. Read the upstream release and migration notes. Update the theme submodule to a specific release commit and check the theme's minimum Zola version.
2. For a Zola update, change `.zola-version` and the archive checksum in `scripts/install-zola.sh` using the official release archive. Update action pins only from the official action repositories.
3. Run the checks in `AGENTS.md`, then inspect desktop and mobile pages, search results, code highlighting and internal links.
4. Commit the submodule pointer and configuration together. Keep site overrides in root-level `templates/`, `sass/` or `static/`; retain upstream theme and third-party license notices.
