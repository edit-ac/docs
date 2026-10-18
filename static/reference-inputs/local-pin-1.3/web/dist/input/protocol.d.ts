import type { EngineHandle, PrepareRequest } from '@edit-ac/core';
import type { DOMRenderer } from '../dom/render.js';
import type { DOMSelection } from '../dom/selection.js';
export type Disposition = 'native-pending' | 'committed' | 'canceled' | 'rejected' | 'disposed' | 'handled';
export interface Intent {
    id: string;
    generation: number;
    origin: string;
    disposition: Disposition;
    reason?: string;
    text?: string;
}
interface ProtocolTrace {
    type: string;
    trusted: boolean;
    generation: number;
    intent?: string;
    count?: number;
    owners?: string[];
    inputType?: string | undefined;
    composing?: boolean | undefined;
    key?: string | undefined;
    data?: string | null | undefined;
    cancelable?: boolean;
    origin?: string;
}
/** Qualification protocol, not the production text/composition router. Correlation
 * is rooted in physical key cycles, event objects, mutation batches and sessions.
 * A payload or elapsed-time window is never an intent identifier. */
export declare class InputProtocol {
    private readonly renderer;
    private readonly selection;
    private readonly engine;
    private readonly commit;
    readonly intents: Intent[];
    readonly trace: ProtocolTrace[];
    private readonly editor;
    private readonly content;
    private readonly documentScope;
    private readonly subscription;
    private sequence;
    private generation;
    private disposed;
    private readOnly;
    private readonly events;
    private pending;
    private key;
    private composition;
    private readonly observer;
    private queued;
    private readonly jobs;
    private commitKey;
    private commitKeyOwner;
    private commitKeyTurn;
    private rendering;
    private readonly listeners;
    constructor(renderer: DOMRenderer, selection: DOMSelection, engine: EngineHandle, commit: (request: PrepareRequest) => unknown);
    private create;
    private text;
    private correlate;
    private handle;
    private mutations;
    private schedule;
    private drain;
    private apply;
    private start;
    private finish;
    setReadOnly(value: boolean): void;
    settle(): Promise<void>;
    dispose(): void;
}
export {};
