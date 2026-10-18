import type { EngineHandle, StableRange, CommitResult } from '../engine.js';
import { AiHost, type AiRequest } from './ai.js';
export type AiSessionStatus = 'idle' | 'pending' | 'streaming' | 'review' | 'accepted' | 'rejected' | 'canceled' | 'failed' | 'stale' | 'disposed';
/** Owned capture. Host review ports must prepare before mutation and commit synchronously once. */
export interface AiReviewTarget {
    valid(): boolean;
    accept(text: string): CommitResult;
    dispose(): void;
}
/** Optional orchestration only. AiHost owns protocol validation, caps and abort propagation. */
export declare class AiSession {
    #private;
    readonly host: AiHost;
    get state(): Readonly<{
        status: AiSessionStatus;
        text: string;
        error: string | undefined;
        generation: number;
    }>;
    constructor(host: AiHost);
    start(request: AiRequest, target?: AiReviewTarget): Promise<void>;
    accept(): CommitResult | undefined;
    cancel(): void;
    reject(): void;
    invalidate(): void;
    /** Recovery is explicit and bounded by the admitted response cap; no automatic clipboard write. */
    recoveryCopy(): string;
    dispose(): void;
}
/** Existing WASM anchors/prepared semantics, restricted to qualified plain-text blocks.
 * Context owners are checked in full (including marks/structure). Unrelated owners may rebase.
 * Call invalidate() on host permission/document switches; valid also rechecks permission at accept.
 */
export declare function captureAiTarget(engine: EngineHandle, range: StableRange, contextOwners: readonly string[], writable: () => boolean): AiReviewTarget;
