+++
title = "Browser and WebAssembly compatibility"
description = "Browser prerequisites, optional API limits and deployment requirements for the Wasm editor."
weight = 11
+++

Reviewed **2026-10-29**. Current browser engines implement the WebAssembly features enabled by edit.ac's build. The editor also needs modern JavaScript and browser APIs; a browser supporting the original WebAssembly release is insufficient.

**This is a compatibility investigation, not a released SDK support matrix.** Packages remain unpublished local `0.0.0` artifacts. See [release status](@/docs/reference/status.md) for the separately qualified journeys and outstanding platform gates.

## Browser prerequisites

These are **inferred feature-availability floors**, derived from the inspected code and the linked browser data. They have not been tested as minimum supported editor versions. Newer versions can still fail because of permissions, storage restrictions, asset delivery or host policy.

| Requirement | Chrome / Chromium Edge | Firefox | Safari / iOS Safari |
|---|---|---|---|
| Wasm features enabled by the build | 96+ | 79+ | 15.1+ |
| Identified editor JavaScript/API prerequisites | 98+ | 95+ | 15.4+ |
| Optional built-in syntax-highlighting worker, including editor prerequisites | 98+ | 114+ | 15.4+ |
| Optional PNG validation, including editor prerequisites | 98+ | 113+ | 16.4+ |
| Editor prerequisites plus recognition of CSP `'wasm-unsafe-eval'` | 98+ | 102+ | 16+ |

The Wasm row combines bulk memory, reference types, multi-value, sign extension, mutable globals and non-trapping float-to-integer conversions. The build targets `wasm32-unknown-unknown` using Rust `1.97.1` and `wasm-bindgen 0.2.129`. Its optimizer explicitly permits this feature set. The [Rust target documentation](https://doc.rust-lang.org/stable/rustc/platform-support/wasm32-unknown-unknown.html#enabled-webassembly-features) explains why the default feature set can advance with the compiler; a compiler upgrade needs another artifact audit.

The JavaScript row combines unguarded `structuredClone`, `crypto.randomUUID`, `Object.hasOwn` and `Array.prototype.at` calls. For example, cloning requires Chrome 98, while UUID generation raises Firefox's prerequisite to 95. The distributed TypeScript target is ES2022; the SDK supplies no compatibility replacements for these calls. `InputEvent.getTargetRanges()` is also called directly during editing. Browser versions below these prerequisites, Internet Explorer and legacy Edge cannot be treated as supported by the current distribution.

Version numbers come from Mozilla's [browser compatibility data, pinned to revision `09b6855`](https://github.com/mdn/browser-compat-data/tree/09b6855aa1362f1550c6ca34f8b074c3d4390d4d): [Wasm features](https://github.com/mdn/browser-compat-data/tree/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/webassembly), [structured cloning](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/api/_globals/structuredClone.json), [Crypto](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/api/Crypto.json), [Object](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/javascript/builtins/Object.json) and [Array](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/javascript/builtins/Array.json). The floors are an inference from those individual requirements, not Mozilla's assessment of edit.ac.

Android browsers, embedded WebViews and in-app browsers need their actual engine and host settings checked. Desktop automation does not establish real Android/iOS device, keyboard, IME or assistive-technology support.

## Limits found in the implementation

| Code path | Requirement or unsupported behavior | Existing behavior |
|---|---|---|
| Core initialization: `packages/core/src/index.ts` | Wasm compilation and the matching generated JS/Wasm pair | Initialization rejects on failure. There is no JavaScript-only engine fallback. |
| Editor commands, configuration and storage | Modern built-ins above; Web Crypto for UUIDs and journal hashing | Missing APIs can fail when their paths run. A successful Wasm load alone does not verify editor compatibility. |
| Highlighting: `packages/web/src/modules/code/worker.ts` | `Worker` with `{ type: 'module' }`; Firefox before 114 lacks module workers | The scheduler handles worker failure with its plain-source presentation. Ordinary code text does not require highlighting. |
| Images: `packages/web/src/modules/images/policy.ts` | `DecompressionStream('deflate')` for PNG payload validation | Missing support yields `decoder-unavailable`. JPEG bypasses this PNG step. The image profile separately rejects animation, SVG, palette/interlaced/16-bit PNG and other unsupported profiles, even if a browser can display them. |
| Platform actions: `packages/web/src/platform/capabilities.ts` | File picker, sharing and fullscreen depend on browser support, activation and policy | The adapter checks availability and reports `unavailable`, `denied` or cancellation with a fallback. `showOpenFilePicker` remains unavailable in Firefox and Safari; use ordinary file input. Orientation locking is deliberately unavailable in this adapter. |
| Selection repair: `packages/web/src/dom/selection.ts` | `Intl.Segmenter`, `segments.containing` and `Selection.modify` | Missing or failing APIs leave native navigation available. This optional repair does not raise the basic editor prerequisite to Firefox 125. |
| Persistence: `packages/web/src/storage/transaction.ts` | IndexedDB; optional strict-durability transaction hint | Unsupported hints fall back to an ordinary transaction. Denied storage, quota failures and platform durability still need their own recovery/qualification checks. |

Sources for the optional API limits: [module workers](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/api/Worker.json), [decompression streams](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/api/DecompressionStream.json), [file pickers](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/api/Window.json) and [segmentation](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/javascript/builtins/Intl/Segmenter.json).

## Serve and initialize the runtime

Use HTTPS in deployment. Wasm itself does not require a secure context, but the editor's Web Crypto operations do; browsers also treat suitable localhost origins as trustworthy. See [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts) and [UUID generation](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID).

Serve `.wasm` as `Content-Type: application/wasm`, with matching versioned JavaScript and Wasm assets. The engine loader uses streaming instantiation when available and buffered instantiation when streaming is absent or fails for a readable response with an incorrect MIME type. This fallback cannot repair an unsupported instruction, incompatible exports, blocked request or CSP failure. See [streaming instantiation](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiateStreaming_static) and [recovering mismatched assets](@/docs/troubleshooting/assets.md).

If a CSP restricts scripts, allow Wasm compilation with `'wasm-unsafe-eval'` in `script-src`, alongside the application's required script sources. This permission is narrower than `'unsafe-eval'`; do not add general JavaScript evaluation merely to load Wasm. Older browsers may not recognize the narrower keyword, which explains the separate CSP row. Allow the actual asset origins in the relevant script/fetch policies and, for highlighting, the worker policy. Cross-origin fetches also require CORS. See [CSP's Wasm execution rule](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src#unsafe_webassembly_execution) and [keyword compatibility](https://github.com/mdn/browser-compat-data/blob/09b6855aa1362f1550c6ca34f8b074c3d4390d4d/http/headers/Content-Security-Policy.json).

The inspected modules do not require shared memory, Wasm threads, SIMD, Wasm GC, exception handling, memory64, WebGPU or WASI. Cross-origin isolation headers are therefore not a prerequisite of these modules. A JavaScript highlighting worker is separate from Wasm threads. Optional host integrations can impose additional requirements.

Initialize and mount in the browser after hydration. Server-side imports and browser initialization have different responsibilities; see [the SSR boundary](@/docs/troubleshooting/ssr.md).

## What was checked

Source inspection covered the engine loader, Wasm build/optimizer settings, ES2022 configuration, storage, browser capability adapters, input/selection handling, highlighting and image validation. The checkout's core HEAD was `5dfb328e33b23807ee4cade5c286d329d144bb8f`, with existing uncommitted development changes; this is a working-tree investigation rather than an immutable release audit.

Five existing local build outputs—engine, Markdown, semantic comparison, formats and highlighting—passed the repository's read-only Wasm feature audit with no proposals outside the permitted baseline. Their generated JS loaders then instantiated those five binaries in each installed Playwright 1.64.0 engine: **Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2**. Result: **15 passed, 0 failed, 0 skipped**. The harness used a loopback HTTP server and closed its browsers and listener afterwards. No provider calls were made.

These checks used prebuilt local artifacts, without rebuilding the dirty source tree. They establish binary validation and loader initialization for those artifacts and engines only. They do not establish editor journeys, optional-feature execution, historical browser floors, branded stable-browser releases, mobile devices, performance limits or release qualification. Keep those gates separate from this research and from [document-format compatibility](@/docs/reference/compatibility.md).
