import type { AnchorResolution, EngineHandle, StableRange } from '@edit-ac/core';
/** Pinned y-protocols 1.0.7 awareness payload (no provider/room envelope). */
export declare const awarenessProtocolVersion = "y-protocols/1.0.7";
export interface AwarenessOptions {
    maxPeers?: number;
    maxFrameBytes?: number;
    throttleMs?: number;
    expiryMs?: number;
}
export interface PeerPresence {
    clientId: number;
    selection: {
        anchor: AnchorResolution;
        focus: AnchorResolution;
    } | null;
}
export declare class AwarenessError extends Error {
    readonly code: 'invalid-frame' | 'resource-limit' | 'invalid-cursor' | 'disposed';
    constructor(code: 'invalid-frame' | 'resource-limit' | 'invalid-cursor' | 'disposed', message: string);
}
/** Optional, host-driven ephemeral presence. Never subscribes to document updates,
 * opens storage, creates a Y.Doc, schedules timers or makes durability claims.
 * Host authenticates peers and routes awareness separately from baseline sync.
 * Retained expiry tombstones prevent duplicate frames resurrecting stale peers;
 * maxPeers bounds both live peers and tombstones for the lifetime of this adapter.
 */
export declare class AwarenessAdapter {
    private readonly engine;
    readonly clientId: number;
    private readonly maxPeers;
    private readonly maxFrameBytes;
    private readonly throttleMs;
    private readonly expiryMs;
    private readonly remote;
    private local;
    private clock;
    private dirty;
    private lastAttempt;
    private lastSent;
    private time;
    private disposed;
    constructor(engine: Pick<EngineHandle, 'exportAnchor' | 'importAnchor' | 'resolve' | 'releaseAnchor'>, clientId: number, options?: AwarenessOptions);
    private alive;
    private now;
    private release;
    private advance;
    /** Online with an optional cursor. Export now; later delivery retains relative positions. */
    setLocal(selection: StableRange | null): void;
    clearLocal(): void;
    /** At most one copied frame per throttle interval, even after rejection/error.
     * Call while presence is enabled to renew at expiry/2; no idle timer is created. */
    flush(send: (bytes: Uint8Array) => boolean, now: number): boolean;
    /** Parse/admit the whole bounded payload and all cursors before replacing peers. */
    receive(input: Uint8Array, now: number): void;
    expire(now: number): number;
    peers(now: number): readonly PeerPresence[];
    dispose(): void;
}
