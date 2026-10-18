import type { CommitResult, EngineHandle, PrepareRequest } from '@edit-ac/core';
import type { DOMSelection } from '../dom/selection.js';
export interface ReorderContext {
    root: HTMLElement;
    engine: EngineHandle;
    selection: DOMSelection;
    commit(request: PrepareRequest): CommitResult;
    /** Composition and open command presenters keep priority over reorder UI. */
    blocked?(): boolean;
    /** Copy uses the host clipboard preparation and captured destination, never a move. */
    copyDrop?(event: DragEvent, target: string): boolean;
}
export type ReorderFactory = (context: ReorderContext) => ReorderPresenter;
/** Optional UI only; the engine validates all topology and owns the one move. */
export declare function reorderControls(): ReorderFactory;
export declare class ReorderPresenter {
    private readonly context;
    readonly controls: HTMLElement;
    readonly status: HTMLElement;
    private readonly up;
    private readonly down;
    private readonly grip;
    private pointer;
    private frame;
    private readonly work;
    /** Derived interaction diagnostics; no document state or retained DOM references. */
    get pointerState(): {
        frames: number;
        hitTests: number;
        geometryReads: number;
        scrollWrites: number;
        active: boolean;
        pendingFrame: boolean;
        captured: boolean;
        retainedSelection: boolean;
        listeners: number;
        subscribed: boolean;
    };
    private readonly nodes;
    private readonly subscription;
    private readonly listeners;
    private session;
    private readOnly;
    private composing;
    private escapeFocus;
    private disposed;
    private readonly dragScope;
    private dragSequence;
    private dragToken;
    constructor(context: ReorderContext);
    private blocked;
    /** Capture identity/version and independent relative selection before UI focus. */
    begin(id?: string): boolean;
    private target;
    /** Explicit host UI destination. Never repair or redirect an invalid target. */
    moveTo(parent: string, before?: string | null): boolean;
    private moveCaptured;
    moveBy(direction: -1 | 1): boolean;
    private restore;
    private schedulePointer;
    private pointerFrame;
    /** Existing gesture owner keeps capture on a valid refresh; stale targets are
     * re-hit-tested. Lost coordinate space cancels without a semantic command. */
    refreshGeometry(recoverable: boolean): void;
    cancel(): void;
    private updateDisabled;
    setReadOnly(value: boolean): void;
    private listen;
    dispose(): void;
}
