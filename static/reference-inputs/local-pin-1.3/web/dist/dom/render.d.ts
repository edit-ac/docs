import type { EngineHandle } from "@edit-ac/core";
import { ModuleRegistry } from '../modules/registry.js';
import { ModuleRuntime, type ModuleRuntimeOptions } from '../modules/runtime.js';
import type { ContentFactory } from '../modules/content.js';
export interface DOMPosition {
    node: Node;
    start: number;
    length: number;
}
/** Internal projection adapter. It renders engine state, never imports DOM state.
 * Input/selection readiness is a separate lifecycle gate. No DOM access at import.
 */
export declare class DOMRenderer {
    #private;
    readonly root: HTMLElement;
    patchBoundary: {
        before(): void;
        after(): void;
    } | undefined;
    readonly moduleRuntime: ModuleRuntime | undefined;
    constructor(root: HTMLElement, engine: EngineHandle, options?: {
        codeHighlight?: import("../modules/code/presenter.js").CodeHighlightFactory;
        readOnly?: boolean;
        modules?: ModuleRegistry;
        moduleRuntime?: ModuleRuntimeOptions;
        content?: ContentFactory;
        commit?: (request: import('@edit-ac/core').PrepareRequest) => import('@edit-ac/core').CommitResult;
    });
    setInvisibleCharacters(enabled: boolean): void;
    isHeld(id: string): boolean;
    getBlock(id: string): HTMLElement | undefined;
    /** Only renderer-mounted presenter DOM owns temporary input/display mutations.
     * Authored data attributes cannot confer ownership of canonical source. */
    ownsModuleDecoration(node: Node): boolean;
    getNodeId(node: Node): string | undefined;
    /** UTF-16 text and hard-break map; empty-block placeholder has length zero. */
    positions(id: string): readonly DOMPosition[];
    /** Document-ordered editable blocks, excluding containers and noneditable atoms. */
    textBlockIds(): string[];
    setReadOnly(value: boolean): void;
    dispose(): void;
    /** Temporary native ownership; resume projects the latest admitted patch only. */
    hold(id: string): void;
    resume(id: string, rebuild?: boolean): void;
}
