import type { CommitResult, EngineHandle, PrepareRequest, StableRange } from '../engine.js';
/** Literal UTF-16 text profile. Module payloads/atoms and structural queries are absent. */
export declare const DOCUMENT_SEARCH_PROFILE: Readonly<{
    readonly id: 'editac.document-search.literal.v1';
    readonly version: 1;
    readonly caseSensitive: true;
    readonly normalization: 'none';
    readonly regex: false;
    readonly structural: false;
    readonly modulePayloads: false;
    readonly crossBlock: false;
    readonly crossAtom: false;
    readonly crossCell: false;
    readonly destinationMarks: 'engine-inherited';
    readonly protectedRanges: 'reject-all';
}>;
export declare const DOCUMENT_SEARCH_LIMITS: Readonly<{
    queryUnits: 256;
    documentUnits: 1048576;
    blocks: 10000;
    matches: 256;
    replacementBytes: 1048576;
    sliceBlocks: 32;
}>;
export interface DocumentSearchMatch {
    readonly owner: string;
    readonly from: number;
    readonly to: number;
}
export interface DocumentSearchResult {
    readonly profile: typeof DOCUMENT_SEARCH_PROFILE.id;
    readonly revision: number;
    readonly status: 'empty' | 'ready' | 'canceled' | 'stale' | 'limit' | 'unsupported';
    readonly matches: readonly DocumentSearchMatch[];
    readonly blocks: number;
    readonly units: number;
}
export declare class DocumentSearchError extends Error {
}
/** Optional, viewer-local provider over the existing engine. Owns every captured anchor.
 * Search never selects or mutates. The commit callback must be synchronous and enforce
 * current host permission; no prepared request is retained across an async boundary.
 */
export declare class DocumentSearchSession {
    #private;
    readonly engine: EngineHandle;
    readonly changed: () => void;
    constructor(engine: EngineHandle, changed?: () => void);
    get result(): DocumentSearchResult;
    get current(): DocumentSearchMatch | undefined;
    get index(): number;
    /** Capture before focusing the query field. Later query/native selections cannot retarget it. */
    capture(range?: StableRange, selectionScope?: boolean): void;
    seed(): string;
    invalidate(): void;
    cancel(): void;
    search(query: string, options?: {
        signal?: AbortSignal;
        mode?: 'literal';
        yield?: () => Promise<void>;
    }): Promise<DocumentSearchResult>;
    navigate(backward?: boolean): {
        match?: DocumentSearchMatch;
        index: number;
        wrapped: boolean;
    };
    /** One captured revision, descending coordinates, one existing prepared engine batch. */
    replace(text: string, all: boolean, commit: (request: PrepareRequest) => CommitResult, authorize?: (targets: readonly DocumentSearchMatch[]) => boolean): CommitResult;
    close(): void;
    dispose(): void;
}
