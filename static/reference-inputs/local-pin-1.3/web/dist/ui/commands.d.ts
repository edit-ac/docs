import type { BrowserEditor } from '../editor.js';
/** Optional host-mounted controls. No editing model, global listeners, keyboard
 * show requests or clipboard reads during construction/search. */
export declare class CommandControls {
    #private;
    readonly editor: BrowserEditor;
    readonly element: HTMLElement;
    readonly search: HTMLInputElement;
    readonly status: HTMLElement;
    constructor(editor: BrowserEditor);
    /** Explicit activation can be supplied a host clipboard reader; completion
     * revalidates the captured intent and never restores focus asynchronously. */
    activate(id: string, read?: () => Promise<string>): Promise<void>;
    dispose(): void;
}
