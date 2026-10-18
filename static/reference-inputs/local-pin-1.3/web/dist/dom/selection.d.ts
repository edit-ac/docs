import { PointerSelection } from '../selection/pointer.js';
import type { AnchorResolution, AnchorToken, Bias, EngineHandle, StableRange } from "@edit-ac/core";
import type { DOMRenderer } from "./render.js";
export interface ModelPoint {
    node: string;
    offset: number;
    bias: Bias;
}
export interface DOMPoint {
    node: Node;
    offset: number;
}
export interface CapturedSelection {
    range: StableRange;
    anchorBias: Bias;
    focusBias: Bias;
}
/** Independently owned async target, released explicitly or on bridge disposal. */
export interface RetainedSelection extends CapturedSelection {
    readonly active: boolean;
    dispose(): void;
}
export type CaptureResult = {
    type: "captured";
    selection: CapturedSelection;
} | {
    type: "outside" | "unsupported";
    reason: string;
};
export type RestoreResult = {
    type: "restored";
} | {
    type: "outside" | "empty";
} | {
    type: "stale";
    anchor: AnchorResolution;
    focus: AnchorResolution;
} | {
    type: "unsupported";
    reason: string;
};
/** Internal bridge. Capture synchronously before preparing a command; native
 * selectionchange also captures user navigation. Tokens belong to this bridge
 * until the next capture/clear/dispose. No absolute target survives a patch.
 */
export declare class DOMSelection {
    #private;
    readonly renderer: DOMRenderer;
    readonly pointer: PointerSelection;
    /** Native composition temporarily owns caret and mutable text positions. */
    suspended: boolean;
    lastResult: RestoreResult;
    constructor(renderer: DOMRenderer, engine: EngineHandle);
    get current(): CapturedSelection | undefined;
    /** Map owned text/BR positions and whole-atom boundaries, never atom interiors. */
    toModel(node: Node, offset: number, bias?: Bias): ModelPoint | undefined;
    /** Resolve an owned stable target without changing the visible selection. */
    resolvePoint(token: AnchorToken, bias: Bias): DOMPoint | undefined;
    toDOM(point: ModelPoint): DOMPoint | undefined;
    /** An exact DOM node range is a node action, never an adjacent text range. */
    selectedNode(): string | undefined;
    /** Select inline atoms; block adjacency stays with semantic keyboard policy. */
    selectAdjacentAtom(backward: boolean): boolean;
    capture(affinity?: {
        anchor: Bias;
        focus: Bias;
    }): CaptureResult;
    /** Capture an independently owned range before crossing an async boundary.
     * Later navigation and patch restoration cannot release or redirect it.
     */
    retain(): RetainedSelection | undefined;
    /** Retain a hit-tested destination without changing native selection/focus. */
    retainPoint(point: ModelPoint): RetainedSelection | undefined;
    /** Scroll only the caret, without rewriting the native selection/preferred x. */
    ensureVisible(): void;
    /** Native range scoped to this surface, including intervening noneditable atoms.
     * Navigation does not prepare an engine command or create history.
     */
    selectAll(): boolean;
    /** Place mapped points without changing token ownership or capture policy. */
    place(anchor: ModelPoint, focus?: ModelPoint): boolean;
    move(token: AnchorToken): void;
    /** Restore semantic endpoints with their resolved affinity; caller owns tokens. */
    restoreRange(range: StableRange): void;
    restoreRetained(target: RetainedSelection): void;
    restore(): RestoreResult;
    clear(notify?: boolean): void;
    dispose(): void;
}
