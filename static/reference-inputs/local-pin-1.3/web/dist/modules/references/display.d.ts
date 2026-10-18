import type { ProjectedNode } from '@edit-ac/core';
import type { ContentContext, ContentFactory, ContentView } from '../content.js';
import type { LinkActivationOptions } from '../links/activation.js';
import type { LinkHostContext, LinkHostPorts, LinkRequest, LinkResult, LinkTarget } from '../links/contract.js';
export interface PrivateReferenceDisplayOptions {
    context(): Readonly<LinkHostContext>;
    /** Configured catalog parses identity/authority; never derive authority from metadata. */
    target(targetId: string): {
        targetId: string;
        authority: string | null;
    } | Readonly<LinkTarget> | undefined;
    /** Local-only host cache port, keyed by the complete viewer/target/policy envelope.
     * No IO, credential loading, or automatic resolution is permitted here. */
    cached(request: Readonly<LinkRequest>): Readonly<LinkResult> | undefined;
    ports: Pick<LinkHostPorts, 'privateCatalog'> & Partial<Pick<LinkHostPorts, 'publicMetadata'>>;
    /** Explicit host navigation through the existing portable authority boundary. */
    activation?: Pick<LinkActivationOptions, 'catalog' | 'privateLocator' | 'dispatch'>;
    /** Includes logout, account/tenant/authority/policy changes, lock/revoke and lease expiry. */
    subscribe(invalidate: () => void): () => void;
    /** Already vetted, bounded raster bytes from the host cache; never a remote URL. */
    iconAsset?: (handle: string) => Blob | null;
    now?: () => number;
}
/** Compose with existing contentModules via referenceFactory(ctx) ?? otherFactory(ctx).
 * Render reads only the host's scoped cache; the refresh button is the sole IO origin. */
export declare function privateReferenceDisplay(options: PrivateReferenceDisplayOptions): ContentFactory;
export declare class PrivateReferenceView implements ContentView {
    private readonly context;
    private readonly options;
    readonly element: HTMLElement;
    private node;
    private readonly label;
    private readonly title;
    private readonly preview;
    private readonly status;
    private readonly refresh;
    private readonly activate;
    private readonly activation;
    private image;
    private assetUrl;
    private timer;
    private pending;
    private unsubscribe;
    private disposed;
    private generation;
    private nodeRevision;
    private readOnly;
    constructor(context: ContentContext, options: PrivateReferenceDisplayOptions);
    private now;
    private request;
    private check;
    private clear;
    cancel(): void;
    private fallback;
    private display;
    invalidate(): void;
    private activateClicked;
    private refreshClicked;
    private resolve;
    update(node: ProjectedNode): boolean;
    setReadOnly(value: boolean): void;
    dispose(): void;
}
/** Public and private references share the same inert identity and host ports. */
export declare const referenceDisplay: typeof privateReferenceDisplay;
export type ReferenceDisplayOptions = PrivateReferenceDisplayOptions;
