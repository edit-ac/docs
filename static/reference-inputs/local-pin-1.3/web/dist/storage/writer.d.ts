import type { Checkpoint, DocumentIdentity, EngineHandle, EngineRuntime, ReplayUpdate } from "@edit-ac/core";
/** An engine replica plus an origin-wide lease. Persisted writer IDs are never reused. */
export declare class StorageWriter {
    #private;
    readonly engine: EngineHandle;
    readonly writerId: number;
    private constructor();
    /** Web Locks protects against rare random-ID collisions across separate WASM/tab realms. */
    static restore(runtime: EngineRuntime, locks: LockManager, expected: DocumentIdentity, checkpoint: Checkpoint, tail?: readonly ReplayUpdate[]): Promise<StorageWriter>;
    dispose(): void;
}
