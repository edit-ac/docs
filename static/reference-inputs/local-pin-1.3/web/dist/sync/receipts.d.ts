import type { DocumentIdentity, EngineHandle } from "@edit-ac/core";
import { type JournalEntry } from "../storage/journal.js";
import { durableReceiptProtocol, type DurableReceipt, type ReceiptResult, type UpdateOutbox } from "../storage/outbox.js";
import { SyncSession, type SyncTransport } from "./session.js";
export type Authorization = "detached" | "authorized" | "denied" | "revoked";
export interface ReceiptNegotiation {
    identity: DocumentIdentity;
    receiptProtocol: typeof durableReceiptProtocol | null;
}
export type DurableDelivery = {
    receipt: DurableReceipt | null;
} | {
    authorization: "denied" | "revoked";
};
/** Separate application transport; baseline Yjs messages never enter this port.
 * The host authenticates the negotiation and response on the same connection.
 * Resolving upload without a receipt says nothing about remote durability. */
export interface DurableTransport {
    upload(entry: JournalEntry): Promise<DurableDelivery>;
}
/** Internal, event-driven client boundary. No timers, engine replacement or
 * journal deletion. The receipt-capable outbox is only used after negotiation.
 * A receipt already admitted to its local transaction may finish on revocation;
 * late network responses from an old attachment are never admitted. */
export declare class ReceiptSession {
    private readonly engine;
    readonly sync: SyncSession;
    private readonly outbox;
    private generation;
    private authorization;
    private capability;
    private transport;
    private cursor;
    private done;
    private replayRevision;
    private running;
    private committed;
    private readonly identity;
    constructor(engine: EngineHandle, sync: SyncSession, outbox: Pick<UpdateOutbox, "pendingPage" | "accept" | "receiptProtocol">);
    get state(): {
        authorization: Authorization;
        receiptProtocol: "editac-durable-receipt-v1" | null;
        remoteDurability: "durable" | "unknown";
        remoteCommitted: string | null;
        replayPending: boolean;
    };
    attach(baseline: SyncTransport, negotiation: ReceiptNegotiation, durable: DurableTransport | null, authorized: boolean): void;
    detach(): void;
    deny(reason: "denied" | "revoked"): void;
    private clear;
    /** Call only after local journal commit, alongside the normal session signal. */
    localCommitted(origin: string): void;
    /** CRDT recovery export remains available offline and after authorization loss. */
    recoveryExport(): ReturnType<EngineHandle["checkpoint"]>;
    receiveReceipt(receipt: DurableReceipt): Promise<ReceiptResult>;
    /** One bounded outbox page per host event. Retry failed uploads on the next
     * event; never infer an acknowledgment from baseline sync or socket delivery. */
    pump(now: number): Promise<ReceiptResult[]>;
    private run;
}
