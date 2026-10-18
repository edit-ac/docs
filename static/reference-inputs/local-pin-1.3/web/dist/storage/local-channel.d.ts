import type { EngineRuntime } from "@edit-ac/core";
import { LocalStorageLifecycle } from "./index.js";
import { StorageWriter } from "./writer.js";
export interface LocalNotificationPort {
    postMessage(message: unknown): void;
    addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
    removeEventListener(type: "message", listener: (event: MessageEvent) => void): void;
    close(): void;
}
/** Bounded hints wake verified journal replay. Shared storage alone never updates a live replica. */
export declare class LocalChannel {
    private readonly runtime;
    private readonly writer;
    private readonly lifecycle;
    private readonly port;
    private closed;
    private dirty;
    private running;
    private failure;
    private readonly unsubscribe;
    private readonly scope;
    private readonly receive;
    constructor(runtime: EngineRuntime, writer: StorageWriter, lifecycle: LocalStorageLifecycle, port: LocalNotificationPort);
    get error(): unknown;
    /** Explicit startup/reconnect catch-up; coalesces concurrent hints into one serialized owner. */
    catchUp(): Promise<number>;
    /** Retry publication after a queue error; this never removes pending journal work. */
    notify(): void;
    dispose(): void;
}
