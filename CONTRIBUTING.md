# Contribute to the docs

Write for someone embedding an editor for the first time. Explain the task, the relevant contract, and how to verify the result. Keep architecture decisions in the architecture repository and link to them when needed.

Every example must name the exact tested SDK version. A proposed API belongs in an explicitly marked design example until the matching published artifact passes a clean consumer test. Do not present source fallbacks, simulated network peers or synthetic input as platform qualification.

Add each guide to `navigation.json`, use relative links within this repository, and run `npm run check`. Prefer runnable examples imported from the qualified example suite over copied snippets. Explain failures, cancellation, cleanup and accessibility alongside the successful path.

Keep screenshots, sample documents and demo assets licensed for redistribution. Use prepared public fixtures. Never add credentials, private documents or live AI calls to examples and CI. Mark platform and format limitations precisely.
