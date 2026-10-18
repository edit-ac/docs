import type { Checkpoint } from "@edit-ac/core";
import { type JournalIdentity, type JournalEntry } from "./journal.js";
export interface StoredCheckpoint {
    version: 1;
    checkpoint: Checkpoint;
    /** Exact immutable journal identities included in the engine state. */
    coverage: string[];
    checksum: string;
    manifestHash: string;
}
export declare class CheckpointConflictError extends Error {
    constructor();
}
export interface RecoveryState {
    checkpoint: Checkpoint;
    tail: JournalEntry[];
    source: "latest" | "previous";
    rejected: string[];
}
/** Internal browser adapter. Retains all journal/outbox bytes; compaction requires later receipt policy. */
export declare class CheckpointStorage {
    #private;
    private constructor();
    static open(factory: IDBFactory, name?: string): Promise<CheckpointStorage>;
    close(): void;
    /** The host captures coverage from the same engine state as bytes. Publication acknowledges only completion. */
    publish(input: Checkpoint, coveredUpdateIds: readonly string[]): Promise<{
        state: "checkpointCommitted";
        durability: IDBTransactionDurability | "unknown";
    }>;
    /** Rust callback validates semantic checkpoint bytes and replays the retained tail before exposing a document. */
    restore<T>(expectedInput: JournalIdentity, restore: (state: RecoveryState) => T): Promise<{
        value: T;
        recovery: RecoveryState;
    }>;
}
