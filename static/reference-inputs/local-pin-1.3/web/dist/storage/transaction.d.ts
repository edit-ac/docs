/** Internal IndexedDB mechanics shared by the durable adapters. No async work
 * runs inside a transaction; completion alone acknowledges its writes. */
export declare function strictTransaction(database: IDBDatabase, stores: string | string[]): IDBTransaction;
export interface TransactionControl {
    abort(error: unknown): void;
    watch<T>(request: IDBRequest<T>, success?: (value: T) => void): void;
}
export declare function completeTransaction<T>(tx: IDBTransaction, message: string, result: () => T, setup: (control: TransactionControl) => void): Promise<T>;
