import { type DocumentIdentity } from "@edit-ac/core";
import { StorageWriter } from "./storage/writer.js";
import { LocalStorageLifecycle } from "./storage/index.js";
/** Internal recovery prerequisite. Resolution means a real replica has its local
 * update subscription attached. The complete editor's input/DOM ready gate is separate.
 * Existing documents are never initialized from host content on recovery failure.
 */
export declare function recoverLocalDocument(options: {
    assetUrl: string;
    databaseName: string;
    identity: DocumentIdentity;
    indexedDB: IDBFactory;
    locks: LockManager;
}): Promise<{
    writer: StorageWriter;
    storage: LocalStorageLifecycle;
    source: "latest" | "previous";
}>;
