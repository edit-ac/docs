import type { ViewportGeometry } from './viewport.js';
import { type CapabilityResult } from './capabilities.js';
/** Platform presentation only. Never changes semantic keys, content, selection or history. */
export declare class KeyboardAdapter {
    readonly root: HTMLElement;
    private readonly invalidate;
    private disposed;
    private generation;
    private layout;
    private layoutSource;
    private geometrySource;
    private overlaySource;
    private lockSource;
    private lockPending;
    private lockCanceled;
    private lockRelease;
    private releases;
    private readonly window;
    constructor(root: HTMLElement, invalidate: () => void);
    private api;
    private active;
    label(code: string, defaultLabel: string): string;
    private readonly layoutChanged;
    refreshLayout(): Promise<CapabilityResult>;
    private detachLayout;
    private readonly geometryChanged;
    observeGeometry(): CapabilityResult;
    private detachGeometry;
    geometry(): ViewportGeometry;
    leaseOverlay(): CapabilityResult;
    releaseOverlay(): void;
    requestVisibility(action: 'show' | 'hide'): CapabilityResult;
    /** Kiosk only. A visible, host-owned escape control is mandatory. No default editor lock. */
    requestLock(keys: readonly string[], escapeControl: HTMLElement): Promise<CapabilityResult>;
    private releaseLock;
    cancel(): void;
    dispose(): void;
}
