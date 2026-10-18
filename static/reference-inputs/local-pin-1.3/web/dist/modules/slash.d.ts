import type { CommitResult, EditorCommand, EngineHandle, FragmentBlock, PrepareRequest } from '@edit-ac/core';
import type { DOMSelection } from '../dom/selection.js';
export type SlashAction = {
    type: 'fragment';
    blocks: readonly FragmentBlock[];
} | {
    type: 'editor';
    commands: readonly EditorCommand[];
};
export interface SlashCommand {
    id: string;
    label: string;
    keywords?: readonly string[];
    disabled?: string;
    /** Prepare only. The presenter owns validation, mutation and history. */
    prepare(context: Readonly<{
        query: string;
        node: string;
        signal: AbortSignal;
    }>): SlashAction | undefined | Promise<SlashAction | undefined>;
}
export interface SlashContext {
    root: HTMLElement;
    engine: EngineHandle;
    selection: DOMSelection;
    commit(request: PrepareRequest): CommitResult;
    route(event: Event): void;
    focusEscape(event: KeyboardEvent): void;
    blocked?(): boolean;
}
export type SlashFactory = (context: SlashContext) => SlashPresenter;
/** Host registrations are frozen before mount; callbacks never enter documents.
 * Import this factory only in configurations that enable the slash presenter. */
export declare function slashCommands(commands: readonly SlashCommand[], options?: {
    literal?: boolean;
}): SlashFactory;
/** Bounded local query plus a relative range, never a second writable model. */
export declare class SlashPresenter {
    private readonly context;
    private readonly literal;
    readonly menu: HTMLElement;
    private readonly status;
    readonly control: HTMLButtonElement;
    private session;
    private results;
    private active;
    private generation;
    private disposed;
    private readOnly;
    private pending;
    private explicitTarget;
    private readonly subscription;
    private readonly listeners;
    private readonly nodes;
    private readonly previous;
    private readonly commands;
    constructor(context: SlashContext, commands: readonly SlashCommand[], literal: boolean);
    private focusPointer;
    private listen;
    private inside;
    get open(): boolean;
    get query(): string | undefined;
    private eligible;
    eligibleAt(nodeId: string, offset: number): boolean;
    /** Called only after the input owner's successful, correlated direct typing. */
    typed(nodeId: string, offset: number, text: string, eligible: boolean): void;
    private openRange;
    private clearTarget;
    private captureTarget;
    /** Visible access uses the current stable caret without requiring typed slash text. */
    openExplicit(): void;
    private current;
    private refresh;
    private render;
    private announce;
    private updateActive;
    private focusActive;
    handle(event: Event): boolean;
    activate(id: string): Promise<void>;
    private placeCaret;
    private restoreFocus;
    dismiss(restore?: boolean): void;
    setReadOnly(value: boolean): void;
    dispose(): void;
}
