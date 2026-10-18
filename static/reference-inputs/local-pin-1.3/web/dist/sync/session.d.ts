import type { DocumentIdentity, EngineHandle } from "@edit-ac/core";
import type { UpdateOutbox } from "../storage/outbox.js";
/** send is synchronous: true means a copied frame was accepted, not acknowledged.
 * false means retry later. The host owns socket events, authorization and closure. */
export interface SyncTransport {
    send(frame: Uint8Array): boolean;
}
export interface SyncSessionOptions {
    maxFrameBytes?: number;
    maxQueuedFrames?: number;
    maxQueuedBytes?: number;
    maxWorkPerPump?: number;
    retryBaseMs?: number;
    retryMaxMs?: number;
    maxRetries?: number;
}
export declare class SyncSessionError extends Error {
    readonly code: "queue-limit" | "retry-exhausted" | "unauthorized" | "detached" | "disposed";
    constructor(code: "queue-limit" | "retry-exhausted" | "unauthorized" | "detached" | "disposed", message: string);
}
/** Internal host-driven session. No engine recreation, timers, storage writes or
 * receipt claims. Call localCommitted only after the journal transaction commits.
 * Outbox pages bound replay memory independently of the persisted backlog.
 * Remote/restore/replay journal entries never become outbound update messages. */
export declare class SyncSession {
    #private;
    constructor(engine: EngineHandle, outbox: Pick<UpdateOutbox, "pendingPage">, options?: SyncSessionOptions);
    get state(): {
        phase: "attached" | "detached" | "disposed" | "error" | "unauthorized";
        error: unknown;
        incomingFrames: number;
        incompleteFrames: number;
        outgoingFrames: number;
        incomingBytes: number;
        outgoingBytes: number;
        retryAt: number | null;
        retries: number;
        replayPending: boolean;
    };
    /** Each attachment is a new explicitly authorized connection and replay pass. */
    attach(transport: SyncTransport, peerIdentity: DocumentIdentity, authorized: boolean): void;
    detach(): void;
    dispose(): void;
    localCommitted(origin: string): void;
    /** Admission copies bytes. Overflow ends this connection so its handshake can
     * recover missing remote frames; local bytes remain in the durable outbox. */
    receive(frame: Uint8Array): void;
    /** Drive on socket events, completed local commits and the reported retryAt
     * deadline. Bounded work per invocation; idle sessions schedule nothing.
     * Concurrent pumps share one operation; attachment generations fence awaits. */
    pump(now: number): Promise<void>;
}
