import type { CommitResult, EngineHandle, MarkCommand, PrepareRequest, StableRange } from '@edit-ac/core';
import type { DOMRenderer } from '../dom/render.js';
import type { DOMSelection } from '../dom/selection.js';
import type { CommandResult } from '../input/keyboard.js';
type Mark = MarkCommand['mark'];
export type MarkState = 'on' | 'off' | 'mixed' | 'disabled';
/** Only supplied fields change. null removes a field; link values are URLs. */
export type FormattingChanges = Partial<Record<Mark, boolean | string | null>>;
export interface ToolbarTarget {
    readonly active: boolean;
    state(mark: Mark): MarkState;
    applicable(mark: Mark): boolean;
    format(mark: Mark): CommandResult;
    apply(changes: FormattingChanges): CommandResult;
    clear(): CommandResult;
    dispose(): void;
}
type Values = Partial<Record<Mark, boolean | string>>;
/** Local typing state, shared by the toolbar, keyboard and ordinary input.
 * Committed formatting still belongs exclusively to the prepared Rust engine.
 */
export declare class FormattingInput {
    #private;
    readonly renderer: DOMRenderer;
    readonly selection: DOMSelection;
    readonly engine: EngineHandle;
    readonly commit: (request: PrepareRequest) => CommitResult;
    readonly blocked: () => boolean;
    readonly allowed: (mark: Mark) => boolean;
    readonly ownsFocus: (node: Element) => boolean;
    constructor(renderer: DOMRenderer, selection: DOMSelection, engine: EngineHandle, commit: (request: PrepareRequest) => CommitResult, blocked: () => boolean, allowed?: (mark: Mark) => boolean, ownsFocus?: (node: Element) => boolean);
    typing(range: StableRange): Values;
    remember(values: Values): void;
    reset(): void;
    /** Replace and set exact supported typing properties in one prepared batch.
     * Unknown attributes remain engine-owned and are never normalized here. */
    replacement(range: StableRange, text: string, origin: string): PrepareRequest;
    capture(): ToolbarTarget | undefined;
    dispose(): void;
}
export {};
