# Project kickoff commands, local packed consumer

This is a complete local BrowserEditor command/selection consumer using the
immutable PIN-1.3 production packages, version0.0.0, **unpublished**. It is not a
registry installation tutorial. The manifest pins both production tarballs and
the authenticated runtime JS/WASM members used by the original PIN consumer.
Never substitute current workspace `dist` output or a source alias.

Use Node24.19.0/npm11.17.0 and the already installed Playwright1.64.0 Chromium
runtime. Keep the sibling architecture evidence directory. From the docs checkout:

```sh
export PATH="$HOME/.nvm/versions/node/v24.19.0/bin:$PATH"
DOCS_PLAYWRIGHT_MODULE="$PWD/../core/node_modules/playwright/index.mjs" \
  DOCS_COMMANDS_OUTPUT="$PWD/../evidence/dwf-1.32-20261018/browser" \
  node --test tests/docs-commands.test.mjs
```

`harness.mjs` authenticates the tarballs, installs offline with scripts disabled,
authenticates the two original runtime members and serves installed package bytes
on one loopback ephemeral port. No package/browser download, credentials, model,
provider, cloud, subscription or remote endpoint is needed. Set
`DOCS_COMMANDS_ARCHITECTURE` to an alternate directory containing those exact
retained inputs. `DOCS_PLAYWRIGHT_MODULE` must name the existing pinned installation.

The consumer creates the public project-kickoff/1 semantic corpus through real
public engine commands, persists a checkpoint and opens that identity through
CheckpointStorage and createEditor. Seeding creates no BrowserEditor undo groups.
All subsequent edits use the public captured command/toolbar, prepared request
or chain contract. No helper writes expected results or edits DOM document state.
DOM selection is host setup, not another document model. Checklists use the
baseline engine representation without optional rich-content presenters.

The independent tests check initial semantic attributes, backward selection,
Friday bold off/on, heading level and list style, Enter/Backspace caret positions,
ordinary undo/redo, read-only, revision-stale, disposed and configuration-protected
commands, atomic two-operation undo and failed-transaction preservation. The
protected case disables italic commands in this view; it does not establish table
cell or application authorization. Source fixture link navigation is never fetched.

`command`, `history`, `heading`, `list`, `select`, `snapshot` and `releaseResult`
are functions of this example, not additional SDK methods. Only the named
BrowserEditor and returned-target methods are public API. Selection offsets are
UTF16. Returned stable anchors/caret tokens are caller-owned and released.

Each test remounts a new isolated local document/database. BrowserEditor destroy
flushes before disposal. The harness closes contexts/browser/server and removes
its temporary installed packages in success and failure teardown; the browser
context owns disposable IndexedDB databases. Returned recovery data must be
preserved in a real app. Logs and browser observations are retained separately.

This covers a headless Chromium local browser, not OS/mobile/IME/AT/native,
SSR/framework integrations, remote durability, performance or registry release.
The separate PIN-1.3 consumer owns collaboration-aware undo, prepared peers and
host-agent editing; this consumer proves ordinary local history only. There is
no Tiptap runtime or helper compatibility claim.
