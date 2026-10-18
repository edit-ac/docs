# Local optional format capabilities

This unpublished local scenario uses the exact core/web/formats 0.0.0 archives from CNV-1.18-C2-EI canonical2, authenticated by `build-playground-formats.mjs`. Its `profile.json` records archive, installed member, fixture and scenario source hashes. It reuses the Project kickoff fixture, production editor and existing save/undo/recovery owners.

Enable format capabilities to load the public optional client and the installed capability manifest. Disabled pages fetch neither the optional entry nor converter/worker/font payloads. Disabling disposes the client; closing the editor and page teardown also dispose it. Enabling alone never starts a conversion worker. Direction and fidelity labels come from the installed browser manifest; PDF input remains export-only. Import/export actions and loss/recovery flows remain unfinished in subsequent DPG gates. No native, registry, hosted or release claim follows.

Build with `node scripts/build-playground-formats.mjs`, serve `dist/playground` on loopback, and open `/scenarios/extensions-formats/`. Stop the server afterwards. The basic and collaborative editor sources retain their owning profiles.

Run `npm run check:playground -- --suite extensions-formats` with Node 24.19.0 for the named capability subset. The receipt explicitly leaves the full DWF-1.10 contract open. Prepared fixtures only; external requests are blocked. Browser processes, server and temporary extraction directories are closed in teardown. A fresh `DOCS_PLAYGROUND_OUTPUT` preserves failures.
