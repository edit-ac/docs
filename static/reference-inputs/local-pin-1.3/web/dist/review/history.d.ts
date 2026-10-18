import type { EngineHandle, Snapshot, CommitResult, PlanToken } from '@edit-ac/core';
export interface HistoryScope {
    identity: Snapshot['identity'];
    moduleProfile: string;
}
export interface RevisionProvenance {
    origin: 'human' | 'agent' | 'import' | 'replay' | 'unknown';
    /** Only a trusted host may supply this evidence; capture labels never authenticate an author. */
    authenticatedAuthor?: string;
}
export interface HistoricalRevision {
    handle: string;
    label: string;
    hash: string;
    representation: 'semantic';
    profile: 'editac-web-history-v1';
    scope: HistoryScope;
    snapshot: Snapshot;
    provenance: RevisionProvenance;
    keyProfile: string | null;
}
export type HistoryRead = {
    kind: 'available';
    revision: HistoricalRevision;
} | {
    kind: 'unavailable';
    reason: 'missing' | 'pruned' | 'incompatible' | 'key-unavailable';
};
export interface HistoryAccess {
    scope: HistoryScope;
    keyProfile?: string | null;
}
export interface HistoryLimits {
    maxRevisions: number;
    maxBytes: number;
    maxRevisionBytes: number;
}
/** Host-owned bounded semantic snapshots. Capture is explicit, never a typing subscription.
 * This decrypted memory store is neither archival persistence nor an authorization boundary. */
export declare class WebHistoryStore {
    #private;
    constructor(limits?: Partial<HistoryLimits>);
    capture(engine: EngineHandle, access: HistoryAccess, label: string, provenance?: RevisionProvenance): Promise<string>;
    read(handle: string, access: HistoryAccess): HistoryRead;
    list(access: HistoryAccess): readonly {
        handle: string;
        label: string;
        availability: HistoryRead['kind'];
    }[];
    get usage(): Readonly<{
        revisions: number;
        bytes: number;
    }>;
}
export interface HistoryHost {
    engine: EngineHandle;
    /** Must route synchronously through the host's ordinary authorized semantic/storage lifecycle. */
    commit(plan: PlanToken): CommitResult;
    writable(): boolean;
}
export type RestoreResult = {
    kind: 'applied';
    revision: number;
} | {
    kind: 'unchanged';
} | {
    kind: 'conflict';
    reason: 'stale' | 'readonly' | 'unsupported' | 'unavailable' | 'rejected';
    base: Snapshot | null;
    current: Snapshot;
    proposed: Snapshot | null;
};
export interface RestorePreview {
    handle: string;
    base: Snapshot;
    proposed: Snapshot;
    changes: readonly {
        id: string;
        before: string;
        after: string;
    }[];
}
/** Conservative identity-preserving text restoration. Unsupported structure/marks/opaque
 * mappings return a visible conflict; they are never normalized or reimported. */
export declare class HistoryRestorer {
    #private;
    readonly store: WebHistoryStore;
    readonly host: HistoryHost;
    readonly access: () => HistoryAccess;
    constructor(store: WebHistoryStore, host: HistoryHost, access: () => HistoryAccess);
    preview(handle: string): RestorePreview | RestoreResult;
    apply(preview: RestorePreview): RestoreResult;
    private conflict;
    private changes;
    private sameRetainedStructure;
}
export interface HistoryReviewOptions {
    pageSize?: number;
    maxValueChars?: number;
    restorer?: HistoryRestorer;
}
/** Immutable historical display has no editing controls. Restore preview lives in a
 * separate writable current-state section, never an engine checkout. */
export declare class HistoryReview {
    #private;
    readonly store: WebHistoryStore;
    readonly access: () => HistoryAccess;
    readonly options: HistoryReviewOptions;
    constructor(host: HTMLElement, store: WebHistoryStore, access: () => HistoryAccess, options?: HistoryReviewOptions);
    private element;
    private button;
    refresh(): void;
    inspect(handle: string): void;
    private preview;
    private result;
    destroy(): void;
}
