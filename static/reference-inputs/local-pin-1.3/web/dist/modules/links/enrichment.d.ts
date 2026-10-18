import type { CommitResult, EngineHandle, PrepareRequest } from '@edit-ac/core';
import type { EnrichmentPolicy, LinkHostContext, LinkHostPorts } from './contract.js';
export interface LinkEnrichmentOptions {
    policy(): EnrichmentPolicy;
    context(): Readonly<LinkHostContext>;
    ports: Pick<LinkHostPorts, 'publicMetadata'>;
    /** Host changes (logout, session/permission/policy switch) invalidate display immediately. */
    subscribe(invalidate: () => void): () => void;
    /** Synchronous host asset-cache port: already vetted/decoded bounded raster
     * bytes under the host media/egress policy. No URL is loaded from metadata. */
    iconAsset?: (handle: string) => Blob | null;
    now?: () => number;
    /** Optional controller for explicit refresh/sharing; called once per surface. */
    attached?: (presenter: LinkEnrichment) => void;
}
export type LinkEnrichmentFactory = (root: HTMLElement, engine: EngineHandle, commit: (r: PrepareRequest) => CommitResult) => LinkEnrichment;
/** Hosts opt in explicitly; the default surface has no runtime presenter import. */
export declare function linkEnrichment(options: LinkEnrichmentOptions): LinkEnrichmentFactory;
/** Optional surface-owned presenter. Network/auth/cache remain host responsibilities.
 * Preview never mutates the document; there is no document-open or edit scan. */
export declare class LinkEnrichment {
    #private;
    readonly element: HTMLElement;
    constructor(root: HTMLElement, engine: EngineHandle, options: LinkEnrichmentOptions, commit: (r: PrepareRequest) => CommitResult);
    /** Decorate the existing local command port; only a successful clipboard
     * fragment origin may schedule automatic enrichment. History/remote bypass it. */
    readonly commit: (request: PrepareRequest) => CommitResult;
    invalidate(): void;
    setReadOnly(value: boolean): void;
    /** Called only after the existing local clipboard command succeeds. */
    pasted(request: Extract<PrepareRequest, {
        kind: 'fragment';
    }>, result: CommitResult): void;
    /** Explicit host/user action, never called by rendering, replay or history. */
    refresh(nodeId: string): void;
    /** Deliberate disclosure into shared text; one explicit undo group. Host must
     * route commit through its normal authorization/persistence command port. */
    commitMetadata(requestId: string): boolean;
    dispose(): void;
}
