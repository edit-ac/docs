import type { Checkpoint, CommitResult, EngineRuntime, PrepareRequest, PlanToken } from "@edit-ac/core";
import type { JournalUpdate, LocalCommit } from "./journal.js";
import { UpdateJournal } from "./journal.js";
import { StorageWriter } from "./writer.js";
export interface StorageState {
    phase: "pending" | "localCommitted" | "error";
    pending: number;
    localCommitted: LocalCommit | null;
    error: unknown;
    saved: boolean;
    /** Conservative, observed transaction capability; unknown before the first commit. */
    strictDurability: "unknown" | "supported" | "unavailable";
}
export interface RecoveryExport {
    checkpoint: Checkpoint;
    unsavedUpdates: JournalUpdate[];
}
/** Internal host adapter. Takes ownership of writer/journal; hosts edit through commit().
 * Rust remains the only semantic replica. There are no unload handlers or timers.
 */
export declare class LocalStorageLifecycle {
    #private;
    readonly observerErrors: unknown[];
    constructor(writer: StorageWriter, journal: UpdateJournal, policy?: {
        afterStorageFailure: "continue" | "reject";
    });
    /** Committed-only hook: local notifications cannot precede transaction completion. */
    subscribeCommitted(listener: (update: JournalUpdate, commit: LocalCommit) => void): () => void;
    /** Explicit shared-journal catch-up; replay creates neither local journal records nor echoes. */
    catchUpLocal(runtime: EngineRuntime, active?: () => boolean): Promise<number>;
    get state(): StorageState;
    subscribe(listener: (state: StorageState) => void): () => void;
    /** Policy is checked before preparing or mutating the Rust document. */
    commit(request: PrepareRequest): CommitResult;
    /** Admit an opaque engine-scoped, revision-bound plan through the same storage
     * policy and update subscription. The caller owns plan release on every path. */
    commitPrepared(plan: PlanToken): CommitResult;
    /** Captures synchronously. Later updates cannot extend this barrier. Failed updates remain included. */
    flush(options: {
        target: "local";
    }): Promise<void>;
    recoveryExport(): RecoveryExport;
    /** Flush failure keeps the live replica available. Report mode exports before releasing it. */
    destroy(options: {
        policy: "flush" | "report";
    }): Promise<{
        unsaved: boolean;
        recovery: RecoveryExport;
    }>;
}
