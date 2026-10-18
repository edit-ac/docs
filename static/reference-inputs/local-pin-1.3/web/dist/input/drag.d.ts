import type { EngineHandle, PrepareRequest, CommitResult } from '@edit-ac/core';
import type { DOMRenderer } from '../dom/render.js';
import type { DOMSelection } from '../dom/selection.js';
export interface TextTransferTarget {
    /** Explicit keyboard/menu alternative: the current collapsed selection is the destination. */
    dropAtSelection(copy?: boolean): boolean;
    dispose(): void;
}
/** View-local drag state; the existing prepared fragment operation owns semantics. */
export declare class TextDrag {
    #private;
    readonly renderer: DOMRenderer;
    readonly selection: DOMSelection;
    readonly engine: EngineHandle;
    readonly commit: (r: PrepareRequest) => CommitResult;
    readonly blocked: () => boolean;
    last: {
        disposition: 'idle' | 'committed' | 'handled' | 'rejected';
        reason?: string;
    };
    constructor(renderer: DOMRenderer, selection: DOMSelection, engine: EngineHandle, commit: (r: PrepareRequest) => CommitResult, blocked: () => boolean);
    get capabilities(): {
        readonly sameSessionMove: true;
        readonly crossDocumentMove: false;
        readonly externalMove: false;
        readonly externalCopy: true;
    };
    get ownsMutations(): boolean;
    get state(): {
        active: boolean;
        guarded: number;
        listeners: number;
        indicator: string | undefined;
    };
    cancel(): void;
    capture(): TextTransferTarget | undefined;
    /** Independent input may arrive without beforeinput. Release correlation
     * before TextInput drains its observer, retaining the newly authored DOM.
     * Echo guards never suspend rendering of subsequent remote patches. */
    beforeEvent(event: Event): void;
    handle(event: Event): boolean;
    dispose(): void;
}
