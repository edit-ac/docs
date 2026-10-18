/** CSS pixels in the owning document's client coordinate space. No DPR/scale
 * conversion and no inference of keyboard presence from viewport size. */
export interface ViewportRect {
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface ViewportGeometry {
    visual: ViewportRect;
    scale: number;
    /** Host-observed occlusion, not an assumed bottom keyboard inset. */
    occlusions?: readonly ViewportRect[];
    safeArea?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}
export interface ViewportOptions {
    requestedMode?: 'resizes-content' | 'resizes-visual' | 'overlays-content';
    /** Shared host geometry port; all mounts in a window must use the same port.
     * Does not request permissions, alter meta viewport or lease a keyboard API. */
    geometry?: () => ViewportGeometry;
}
interface Snapshot extends ViewportGeometry {
    fallback: boolean;
}
/** Per-surface lease over one scheduled geometry owner per window. */
export declare class EditorViewport {
    readonly root: HTMLElement;
    readonly options: ViewportOptions;
    private readonly geometryChanged?;
    private readonly owner;
    private readonly consumer;
    private readonly releases;
    private readonly controls;
    private readonly controlStyles;
    private follow;
    private disposed;
    private suspended;
    private previous;
    private snapshot;
    constructor(root: HTMLElement, options?: ViewportOptions, geometryChanged?: ((recoverable: boolean) => void) | undefined);
    get state(): {
        requestedMode: "overlays-content" | "resizes-content" | "resizes-visual";
        observed: Snapshot | undefined;
        readBatches: number;
        writePhases: number;
        pendingFrame: boolean;
        consumers: number;
        disposed: boolean;
        suspended: boolean;
    };
    suspend(): void;
    resume(): void;
    invalidate(): void;
    /** Optional host-leased geometry, merged once per owning-window read batch. */
    addOcclusionSource(source: () => ViewportRect | undefined): () => void;
    /** Only explicit local edit/focus requests can scroll a caret. */
    requestCaret(): void;
    addControls(element: HTMLElement): () => void;
    private measure;
    dispose(): void;
}
export {};
