import type { CodeAction } from '@edit-ac/core/extensions';
import type { DocumentSearchContext } from '../modules/search.js';
export interface CodeBinding {
    action: CodeAction;
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    alt?: boolean;
    shift?: boolean;
}
export interface CodeCommandsOptions {
    autoPair?: boolean;
    bindings?: readonly CodeBinding[];
}
export type CodeCommandsFactory = (context: DocumentSearchContext) => CodeCommandsPresenter;
export declare function codeCommands(options?: CodeCommandsOptions): CodeCommandsFactory;
/** Browser policy only. All text and history effects go through prepared semantics. */
export declare class CodeCommandsPresenter {
    #private;
    readonly context: DocumentSearchContext;
    readonly options: CodeCommandsOptions;
    readonly element: HTMLElement;
    readonly status: HTMLElement;
    constructor(context: DocumentSearchContext, options: CodeCommandsOptions);
    execute(action: CodeAction): boolean;
    /** Only the input owner calls this after composition admission, before key dispatch. */
    handle(event: Event): boolean;
    setReadOnly(value: boolean): void;
    dispose(): void;
}
