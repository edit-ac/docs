import { ModuleRegistry, type ModuleDefinition } from '@edit-ac/core/extensions';
import type { Json, ProjectedNode } from '@edit-ac/core';
/** Fixed, inert inputs. A conformance fixture never invokes a presenter or codec. */
export interface DescriptorFixture {
    id: string;
    category: 'descriptor' | 'run' | 'block';
    definition?: ModuleDefinition;
    run?: {
        text: string;
        attributes: Record<string, Json>;
    };
    blockAttributes?: Json;
    text?: string;
    disabled?: boolean;
    presenter?: boolean;
}
export interface DescriptorResult {
    id: string;
    outcome: string;
    payload?: Json;
    fallback?: string;
}
/** Canonical semantic JSON, independent of map insertion order and CRDT bytes.
 * Reject accessors, callbacks, prototypes and cycles without evaluating them. */
export declare function canonicalSemanticJson(value: unknown): string;
/** Reuse the public registry; errors are observations, never successful admission. */
export declare function runDescriptorFixture(definitions: readonly ModuleDefinition[], fixture: DescriptorFixture): DescriptorResult;
/** Project a real engine snapshot after validating registered attributed data. */
export declare function projectExtensionNodes(registry: ModuleRegistry, nodes: readonly ProjectedNode[]): Json;
/** Exercise the owning codec or literal input boundary without a live document.
 * Literal input never calls host codecs and retains exact source/ranges. */
export declare function prepareExtensionSource(codec: import('@edit-ac/core').MarkdownCodec, source: string, options?: import('@edit-ac/core').MarkdownOptions, literal?: boolean): import('@edit-ac/core').PreparedMarkdown;
/** The host's existing shared command boundary (for example BrowserEditor).
 * revision must identify the current document/epoch and observed content, including
 * deletes. can/commit recheck current permissions; plans confer no authority.
 * The host owns atomic commit, journaling and one-intent history grouping. */
export interface ExtensionCommandHost {
    readonly active: boolean;
    revision(): string;
    can(request: import('@edit-ac/core').PrepareRequest): boolean;
    commit(request: import('@edit-ac/core').PrepareRequest): import('@edit-ac/core').CommitResult;
}
export type ExtensionCommandResult = {
    status: 'committed';
    result: import('@edit-ac/core').CommitResult;
} | {
    status: 'cancelled' | 'stale' | 'unavailable' | 'failed';
};
/** One pending trusted-host preparation; no document mutation or observer bus.
 * Superseding, cancellation and disposal abort the signal and reject late results.
 * Use from host actions/ModuleRuntime callbacks, after engine transactions return.
 * This isolates exceptions, not unbounded or hostile in-process execution. */
export declare class ExtensionCommandSession {
    #private;
    private readonly host;
    constructor(host: ExtensionCommandHost);
    get active(): boolean;
    cancel(): void;
    dispose(): void;
    run(prepare: (signal: AbortSignal) => import('@edit-ac/core').PrepareRequest | undefined | Promise<import('@edit-ac/core').PrepareRequest | undefined>): Promise<ExtensionCommandResult>;
}
