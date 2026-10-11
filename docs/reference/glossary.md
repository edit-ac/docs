# Glossary

| Term | Meaning |
|---|---|
| Semantic engine | The single authority for document state, prepared commands and incremental changes |
| Session | Document identity, lifecycle, storage and optional transport coordinated around that engine |
| Prepared edit | A validated candidate with revision and target preconditions checked before commit |
| Local durability | The documented local store has committed the captured operation set |
| Remote receipt | A server acknowledgment at an explicitly named durability level |
| Presenter | A platform view of existing semantic data; it does not own another writable model |
| Capability profile | A versioned statement of supported behavior and its limits |
| Source diff | Changes in a declared source representation, separate from semantic changes |
| Locator | A value used to find a document through a configured authority; not a credential |
| Conversion report | Machine-readable and human-readable fidelity and unsupported-content diagnostics |
