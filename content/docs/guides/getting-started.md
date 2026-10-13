+++
title = "Choose an integration path"
description = "Choose a web, native, terminal or agent integration and the services your application owns."
weight = 2
+++

**Status: integration contract; package installation tutorial pending a qualified SDK release.**

| Your application | Planned integration | Your application owns |
|---|---|---|
| Browser app | `@edit-ac/core` and `@edit-ac/web` | Authentication, assets, transport and lifecycle |
| React app | `@edit-ac/react` over the web SDK | The same services plus component lifecycle |
| iOS, Android, macOS, Windows or Linux app | Native SDK for that OS | Native view lifecycle, key storage and host services |
| Terminal workflow | edit.ac CLI/TUI | Local file targets or configured hosted authority |
| Agent-enabled app | Shared editing service through the app's existing MCP | Tool registration, authorization and request identity |

Start with one document, one editor view and a local store. Add collaboration after local save, recovery and disposal work. An editor view and a transport share the same document session; attaching transport does not create or import a second writable document.

Check the exact [capability profile](@/docs/reference/compatibility.md) before choosing extensions. A missing native presenter can preserve content without offering full editing support. Concrete setup commands will be published only when they pass against registry artifacts.

For something to inspect now, the [examples gallery](@/docs/examples/_index.md) links a local rendered web editor with a project brief, bug report and meeting notes. It uses the development source, version 0.0.0, and needs no backend. Release-backed web and React setup examples will follow their qualified packages.
