import type { ServiceClock, ServiceFailure } from '../services/lifecycle.js';
import type { FragmentBlock } from '@edit-ac/core';
import type { SlashContext } from './slash.js';
/** label is a shared, authored/neutral fallback or an explicitly host-authorized disclosure.
 * Viewer-private titles belong to referenceDisplay, never to this insertion record. */
export interface ReferenceTarget {
    targetId: string;
    label: string;
}
export interface ReferenceQuery {
    query: string;
    requestId: number;
    signal: AbortSignal;
}
/** Only explicit user search calls this host port. Mount/render never resolve IDs. */
export type ReferenceResolver = (request: Readonly<ReferenceQuery>) => readonly ReferenceTarget[] | Promise<readonly ReferenceTarget[]>;
/** Host authorization is transient and independent of stored reference data.
 * revision changes on any policy/catalog/principal replacement. */
export type { ReferencePermissionV1, ReferenceCatalogResultV1 } from '@edit-ac/core';
import type { ReferencePermissionV1, ReferenceCatalogResultV1 } from '@edit-ac/core';
export interface ReferenceHostV1 {
    version: 1;
    permission(): Readonly<ReferencePermissionV1>;
    /** Read-only local catalog port. Parse/allowlist ac/app links with the shared
     * client catalog; this port must not fetch, create or grant authority. */
    catalog(targetId: string): Readonly<ReferenceCatalogResultV1>;
    resolve: ReferenceResolver;
    /** Notify on revocation, principal/catalog replacement or lease expiry. */
    subscribe(listener: () => void): {
        dispose(): void;
    };
}
export interface ReferenceLookupOptions {
    /** Owning document/session/revision, supplied by the presenter or native host. */
    context?: () => Readonly<{
        document: string;
        session: string;
        revision: string;
    }>;
    clock?: ServiceClock;
}
/** Bounded host search admission, reusable by headless/native presenters.
 * Constructing, reading stored atoms and disposal never call resolve/catalog. */
export declare class ReferenceLookupSession {
    private readonly host;
    private readonly options;
    private pending;
    private accepted;
    private targets;
    private disposed;
    private readonly defaultSession;
    private readonly service;
    private acceptedScope;
    lastOutcome: 'ready' | ServiceFailure | undefined;
    private readonly subscription;
    constructor(host: ReferenceHostV1, invalidate?: () => void, options?: ReferenceLookupOptions);
    cancel(): void;
    private permission;
    private target;
    search(request: Readonly<ReferenceQuery>): Promise<readonly Readonly<ReferenceTarget>[]>;
    admit(target: ReferenceTarget): Readonly<ReferenceTarget> | undefined;
    dispose(): void;
}
export type ReferenceFactory = (context: SlashContext) => ReferencePresenter;
export declare function referenceBlock(target: ReferenceTarget): FragmentBlock;
export interface ReferenceSuggestionOptions {
    triggers?: readonly string[];
}
export declare function referenceSuggestions(resolve: ReferenceResolver | ReferenceHostV1, options?: ReferenceSuggestionOptions): ReferenceFactory;
/** A transient host search UI. Only the engine commits the chosen inert atom. */
export declare class ReferencePresenter {
    private readonly context;
    private readonly triggers;
    readonly menu: HTMLElement;
    readonly search: HTMLInputElement;
    readonly control: HTMLButtonElement;
    private readonly items;
    private readonly status;
    private session;
    private sessionGeneration;
    private captured;
    private pending;
    private requestId;
    private lastQuery;
    private composing;
    private results;
    private active;
    private readOnly;
    private disposed;
    private committing;
    private readonly lookup;
    private readonly resolve;
    private readonly listeners;
    constructor(context: SlashContext, resolve: ReferenceResolver | ReferenceHostV1, triggers?: readonly string[]);
    private listen;
    private inside;
    get open(): boolean;
    private clearCapture;
    private capture;
    openExplicit(): void;
    /** Input owner calls only after correlated committed local direct typing. */
    typed(nodeId: string, offset: number, text: string, eligible: boolean): void;
    private invalidate;
    private query;
    activate(index: number): void;
    handle(event: Event): boolean;
    dismiss(restore?: boolean): void;
    setReadOnly(value: boolean): void;
    dispose(): void;
}
export { referenceDisplay, privateReferenceDisplay, PrivateReferenceView } from './references/display.js';
export type { PrivateReferenceDisplayOptions } from './references/display.js';
