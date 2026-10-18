import { DocumentSearchSession } from '@edit-ac/core/extensions';
import type { DocumentSearchMatch } from '@edit-ac/core/extensions';
import type { CommitResult, EngineHandle, PrepareRequest } from '@edit-ac/core';
import type { DOMSelection } from '../dom/selection.js';
export interface DocumentSearchContext {
    root: HTMLElement;
    engine: EngineHandle;
    selection: DOMSelection;
    commit(request: PrepareRequest): CommitResult;
    blocked?(): boolean;
}
export interface DocumentSearchOptions {
    /** Rechecked synchronously for the entire captured set; false rejects all. */
    authorize?(targets: readonly DocumentSearchMatch[]): boolean;
    /** Optional host virtualization port. Search itself always reads logical content. */
    reveal?(match: DocumentSearchMatch): void;
}
export type DocumentSearchFactory = (context: DocumentSearchContext) => DocumentSearchPresenter;
export declare function documentSearch(options?: DocumentSearchOptions): DocumentSearchFactory;
/** Explicit opt-in UI; deliberately leaves native Ctrl/Cmd+F ownership untouched. */
export declare class DocumentSearchPresenter {
    #private;
    readonly context: DocumentSearchContext;
    readonly options: DocumentSearchOptions;
    readonly element: HTMLElement;
    readonly button: HTMLButtonElement;
    readonly panel: HTMLElement;
    readonly query: HTMLInputElement;
    readonly replacement: HTMLInputElement;
    readonly status: HTMLElement;
    readonly session: DocumentSearchSession;
    constructor(context: DocumentSearchContext, options?: DocumentSearchOptions);
    get open(): boolean;
    show(selectionScope?: boolean): void;
    scan(): Promise<void>;
    navigate(backward?: boolean): void;
    replace(all: boolean): void;
    setReadOnly(value: boolean): void;
    close(restore?: boolean): void;
    dispose(): void;
}
