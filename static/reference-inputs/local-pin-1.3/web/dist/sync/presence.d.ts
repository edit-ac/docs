import type { EngineHandle } from '@edit-ac/core';
import type { DOMSelection } from '../dom/selection.js';
import type { SyncTransport } from './session.js';
import { type AwarenessOptions, type PeerPresence } from './awareness.js';
export interface PresenceOptions extends AwarenessOptions {
    clientId: number;
    transport: SyncTransport;
    peerCarets?: boolean;
}
export interface PresenceAttachment {
    receive(frame: Uint8Array, now: number): void;
    pump(now: number): void;
    peers(now: number): readonly PeerPresence[];
}
/** Optional projection over the existing anchor-based awareness owner. The host
 * routes frames and drives monotonic time; this adapter creates no timer/socket. */
export declare class EditorPresence implements PresenceAttachment {
    #private;
    readonly root: HTMLElement;
    readonly selection: DOMSelection;
    readonly options: PresenceOptions;
    constructor(root: HTMLElement, selection: DOMSelection, engine: EngineHandle, options: PresenceOptions);
    receive(frame: Uint8Array, now: number): void;
    pump(now: number): void;
    peers(now: number): readonly PeerPresence[];
    dispose(): void;
}
