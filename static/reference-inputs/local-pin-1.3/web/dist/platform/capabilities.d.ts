import type { EditorViewport, ViewportGeometry } from './viewport.js';
import { KeyboardAdapter } from './keyboard.js';
export type CapabilityResult = {
    outcome: 'applied' | 'unavailable' | 'denied' | 'canceled';
    fallback: string;
    value?: unknown;
};
export declare const fallback = "Use native editing, Paste, file input or an explicit copy/download control.";
/** Optional, loaded only by BrowserEditor.enableBrowserCapabilities(). No mount-time API requests. */
export declare class BrowserCapabilities {
    readonly root: HTMLElement;
    readonly keyboard: KeyboardAdapter;
    private disposed;
    private fullscreenOwned;
    private releaseOcclusion;
    constructor(root: HTMLElement, viewport?: EditorViewport);
    geometry(): ViewportGeometry;
    /** Host actions must originate in an explicit activation. API presence is not authorization. */
    request(action: 'share' | 'file' | 'fullscreen' | 'orientation', data?: ShareData): Promise<CapabilityResult>;
    private releaseFullscreen;
    dispose(): void;
}
