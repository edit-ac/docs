import type { EngineHandle, Json, Patch, PatchSubscription } from '@edit-ac/core';
/** Kinds filter committed operations. Selection is an independent opt-in channel;
 * kinds: [] requests selection only. Ranges are source-local UTF-16 intervals,
 * including their boundary insertions. Hosts replace scopes when their ranges move. */
export interface ModuleScope {
    kinds?: readonly Patch['operation'][];
    range?: {
        source: string;
        start: number;
        end: number;
    };
    selection?: boolean;
}
export type ModuleEvent = {
    type: 'patch';
    patch: Patch;
} | {
    type: 'selection';
    selection: Patch['selection'];
};
export interface ModuleRuntimeError {
    phase: 'subscription' | 'mount' | 'update' | 'dispose';
    message: string;
}
export interface ModuleViewContent {
    readonly type: string;
    readonly version: number;
    readonly kind: 'mark' | 'inline-atom';
    readonly text: string;
    readonly attributes: Readonly<Record<string, Json>>;
}
export interface ModuleView {
    update(content: ModuleViewContent): void;
    dispose(): void;
}
/** Trusted host behavior, never persisted. The element owns decoration only;
 * canonical content, engine commands and DOM text mappings remain adapter-owned.
 * Allocate resources exception-safely: a throwing mount has no returned disposer. */
export interface ModuleRenderer {
    mount(element: HTMLElement, content: ModuleViewContent): ModuleView;
}
export interface ModuleRuntimeOptions {
    renderers?: Readonly<Record<string, ModuleRenderer>>;
    onError?: (error: ModuleRuntimeError) => void;
}
/** One engine observer, indexed by operation and source. Dispatch examines patch
 * deltas only; it never calls read() or scans projected document content. */
export declare class ModuleRuntime {
    #private;
    constructor(engine: EngineHandle, options?: ModuleRuntimeOptions);
    get active(): boolean;
    takeErrors(): ModuleRuntimeError[];
    subscribe(input: ModuleScope, callback: (event: ModuleEvent) => void): PatchSubscription;
    /** Native caret/navigation is ephemeral adapter state, not an engine commit.
     * Deduplicate repeated captures; notify previously selected scopes on departure. */
    setSelection(selection: Patch['selection']): void;
    /** Adapter-owned stable view. Failed views are disposed once and the adapter
     * removes their decoration, leaving canonical source text as fallback. */
    mountView(element: HTMLElement, content: ModuleViewContent, fallback: () => void): ModuleView | undefined;
    dispose(): void;
}
