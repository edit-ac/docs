import { type JournalIdentity, type JournalEntry } from "./journal.js";
/** Host-negotiated application protocol, not a Yjs sync event or state vector. */
export declare const durableReceiptProtocol = "editac-durable-receipt-v1";
export interface DurableReceipt {
    protocol: typeof durableReceiptProtocol;
    state: "durable";
    identity: JournalIdentity;
    writerId: number;
    sequence: number;
    checksum: string;
    updateId: string;
}
export interface ReceiptResult {
    state: "remoteCommitted" | "ignored";
    updateId: string;
    reason?: "capability-unavailable" | "unknown-update" | "identity-mismatch";
}
export interface OutboxCursor {
    writerId: number;
    sequence: number;
}
export interface OutboxPage {
    entries: JournalEntry[];
    after: OutboxCursor | null;
    done: boolean;
}
/** Internal adapter. Receipts prune pending membership, never the journal's recovery tail.
 * The host passes only receipts from its negotiated durable application transport.
 * Existing v1/v2 journals are pending by default; upgrading does not infer acknowledgments.
 */
export declare class UpdateOutbox {
    #private;
    readonly receiptProtocol: typeof durableReceiptProtocol | null;
    private constructor();
    static open(factory: IDBFactory, name?: string, receiptProtocol?: typeof durableReceiptProtocol | null): Promise<UpdateOutbox>;
    close(): void;
    /** Bounded cursor page for reconnect. The index's equal keys are ordered by
     * primary key (document/epoch/schema/writer/sequence). Receipted entries count
     * toward work limits too, so a long acknowledged prefix cannot monopolize a
     * single transaction. A caller restarts its cursor after new local commits. */
    pendingPage(identity: JournalIdentity, after: OutboxCursor | null, maxEntries: number, maxBytes: number): Promise<OutboxPage>;
    /** One snapshot of committed bytes and durable receipt markers, independent of checkpoints. */
    pending(identity: JournalIdentity): Promise<JournalEntry[]>;
    /** Remote acknowledgment becomes visible only after the local receipt transaction completes. */
    accept(input: DurableReceipt): Promise<ReceiptResult>;
}
