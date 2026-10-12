# Website deployment and maintenance

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

Replace the default apex URL redirect and `www` parking CNAME. Preserve unrelated email records and TXT verification records. Use the exact organization domain as the `www` target, without `/docs`. GitHub redirects `www.edit.ac` to the configured apex domain.

Follow [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). If verifying ownership under organization Pages settings, add the exact TXT challenge GitHub generates. Keep it after verification. Use no wildcard records.

```sh
dig edit.ac A +short
dig edit.ac AAAA +short
dig www.edit.ac CNAME +short
curl -I https://edit.ac
```

DNS and certificate provisioning can take up to 24 hours. In Pages settings, wait for the DNS check and certificate to succeed, then enable **Enforce HTTPS** if it is not already selected. Preserve certificate validation while investigating errors.

## Theme and tool upgrades

1. Read the upstream release and migration notes. Update the theme submodule to a specific release commit and check the theme's minimum Zola version.
2. For a Zola update, change `.zola-version` and the archive checksum in `scripts/install-zola.sh` using the official release archive. Update action pins only from the official action repositories.
3. Run the checks in `AGENTS.md`, then inspect desktop and mobile pages, search results, code highlighting and internal links.
4. Commit the submodule pointer and configuration together. Keep site overrides in root-level `templates/`, `sass/` or `static/`; retain upstream theme and third-party license notices.
