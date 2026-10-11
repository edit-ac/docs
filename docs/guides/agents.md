# Connect agent editing through your app

**Status: planned integration contract.** See [release status](../reference/status.md) before assuming an API or service is available.

The embedding application's existing MCP supplies authentication, tool registration and transport. The planned edit.ac integration supplies a shared editing service. The CLI does not need to become an MCP server, and the editor core does not select or call a model provider.

The editing sequence is read/export, prepare, inspect the proposed diff, then apply with a stable request ID. Markdown uploads are candidates against a retained baseline. They must preserve unchanged semantic identities and unsupported content rather than replace the live document wholesale.

Check readonly mode, permission, revision and target anchors at the commit boundary. Look up an authorized durable receipt before treating a retry as a new request: its original proposal may already have expired and its base revision may now be stale.

Agent edits use ordinary persistence, live view updates and collaboration. For encrypted documents, plaintext tools run at an authorized decrypting endpoint. A ciphertext-only relay cannot provide plaintext Markdown editing.

See the [host-agent contract](https://github.com/edit-ac/architecture/blob/main/specs/agent-editing.md). Automated examples use prepared requests and mocked model transports; no model calls are needed to verify editing behavior.
