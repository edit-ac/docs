/** Browser storage only: engine semantics and replay remain owned by Rust. */
export interface JournalIdentity {
    profile: string;
    schema: string;
    documentId: string;
    epoch: string;
    protocolVersion: number;
    updateEncoding: number;
    offsets: "utf16";
}
export interface JournalUpdate {
    identity: JournalIdentity;
    writerId: number;
    sequence: number;
    origin: string;
    bytes: Uint8Array;
}
export interface JournalEntry extends JournalUpdate {
    checksum: string;
    /** Stable pending-receipt identity; checkpoints must not erase it. */
    updateId: string;
}
export interface LocalCommit {
    state: "localCommitted";
    updateId: string;
    durability: IDBTransactionDurability | "unknown";
}
export declare class JournalIntegrityError extends Error {
    constructor(message: string);
}
export declare function identityKey(identity: JournalIdentity): string;
export declare function ownIdentity(identity: JournalIdentity): JournalIdentity;
export declare function checksum(bytes: Uint8Array): Promise<string>;
/** Internal adapter, not yet a published editor API. No unload handler or enqueue acknowledgment. */
export declare class UpdateJournal {
    #private;
    private constructor();
    static open(factory: IDBFactory, name?: string): Promise<UpdateJournal>;
    close(): void;
    /** Captures owned input before the first await. Repeated identity is a no-op; collisions abort. */
    append(input: JournalUpdate): Promise<LocalCommit>;
    /** Returns detached, verified entries for one trusted document/epoch/schema. */
    read(identity: JournalIdentity): Promise<JournalEntry[]>;
}
/** Shared schema upgrade for journal, checkpoint and receipt adapters. */
export declare function openStorageDatabase(factory: IDBFactory, name: string): Promise<IDBDatabase>;
export declare function verifyEntries(entries: JournalEntry[], expected: JournalIdentity): Promise<JournalEntry[]>;
