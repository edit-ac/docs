import type { DocumentIdentity, EngineHandle, ReplayUpdate } from "@edit-ac/core";
/** y-protocols 1.0.7 baseline messages, without a provider/room envelope. */
export declare const syncMessage: Readonly<{
    readonly step1: 0;
    readonly step2: 1;
    readonly update: 2;
}>;
export declare class SyncProtocolError extends Error {
    readonly code: "invalid-frame" | "resource-limit" | "invalid-metadata" | "unsupported-profile" | "wrong-document" | "wrong-epoch";
    constructor(code: "invalid-frame" | "resource-limit" | "invalid-metadata" | "unsupported-profile" | "wrong-document" | "wrong-epoch", message: string);
}
export interface SyncProtocolOptions {
    maxFrameBytes?: number;
}
export type SyncResult = {
    type: "step1";
    reply: Uint8Array;
} | {
    type: "step2" | "update";
    reply: null;
    revision: number;
};
/** Internal direct adapter over the existing Rust replica. The host supplies the
 * peer's complete metadata before constructing it; authentication is host-owned.
 * No Y.Doc mirror, document initialization, history reset or durability claim.
 * Callers own transport queues, local-origin filtering and reconnect policy.
 */
export declare class DirectSyncAdapter {
    #private;
    readonly identity: Readonly<DocumentIdentity>;
    constructor(engine: Pick<EngineHandle, "read" | "stateVector" | "encodeUpdate" | "applyUpdate">, peerIdentity: DocumentIdentity, options?: SyncProtocolOptions);
    step1(): Uint8Array;
    /** Encode an engine-emitted local update; never re-send remote/replay patches. */
    update(update: ReplayUpdate): Uint8Array;
    receive(frame: Uint8Array): SyncResult;
}
