# Contribute to the docs

Write for someone embedding an editor for the first time. Explain the task, the relevant contract, and how to verify the result. Keep architecture decisions in the architecture repository and link to them when needed.

Every example must name the exact tested SDK version. A proposed API belongs in an explicitly marked design example until the matching published artifact passes a clean consumer test. Do not present source fallbacks, simulated network peers or synthetic input as platform qualification.

Write pages in `content/docs/` with TOML front matter and an explicit `weight`. Add each page or section to `navigation.json`. Use Zola `@/` links between public content files and relative file links in repository documentation. Run `npm run check`, `zola check --skip-external-links` and `zola build`. Prefer runnable examples imported from the qualified example suite over copied snippets. Explain failures, cancellation, cleanup and accessibility alongside the successful path.

Keep screenshots, sample documents and demo assets licensed for redistribution. Use prepared public fixtures. Never add credentials, private documents or live AI calls to examples and CI. Mark platform and format limitations precisely.

Completed SDK tutorials, task guides, command references and extension guides must link a concrete example from the examples gallery. Show the rendered outcome and complete checked source together, with a specific task, expected result, failure/recovery behavior and cleanup. Reuse the owning example consumer instead of maintaining a second snippet implementation. Update the gallery's status only when that consumer and its exact released artifacts qualify; source previews remain explicitly labeled.
