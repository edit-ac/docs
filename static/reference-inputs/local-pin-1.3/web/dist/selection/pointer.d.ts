import type { DOMSelection, ModelPoint, RetainedSelection } from '../dom/selection.js';
/** Host geometry can reveal an unmounted endpoint. It must return an existing
 * logical point; the bridge validates it against the real renderer before use. */
export interface PointerSelectionViewport {
    hitTest(x: number, y: number): ModelPoint | undefined;
    reveal(point: ModelPoint): void;
}
/** Native granularity/drag arbitration stays with the browser. The optional host
 * viewport supplies only geometry, never content edits or semantic selections. */
export declare class PointerSelection {
    #private;
    readonly selection: DOMSelection;
    viewport: PointerSelectionViewport | undefined;
    constructor(selection: DOMSelection);
    get state(): {
        frames: number;
        hitTests: number;
        scrollWrites: number;
        active: boolean;
        textDrag: boolean;
        pendingFrame: boolean;
        contextTarget: boolean;
        listeners: number;
    };
    /** Borrowed independently anchored target. Consumers still prepare/revalidate
     * permission, session and anchors through the common command path. */
    get contextTarget(): RetainedSelection | undefined;
    /** Restore only after the originating surface has regained focus itself.
     * Dialog cancellation must never refocus an editor after the user moved away. */
    restoreContext(): boolean;
    dismissContext(): void;
    cancel(): void;
    dispose(): void;
}
