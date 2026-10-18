import { AiHost, AiSession, type AiOperation } from '@edit-ac/core/extensions';
import { type SlashContext, type SlashFactory } from '../../modules/slash.js';
export interface AiActionsOptions {
    /** Local source/output byte limits must fit the host's declared limits. */
    contextBytes: number;
    outputBytes: number;
    attached?(actions: AiActions): void;
}
type Operation = Extract<AiOperation, 'ask' | 'fill' | 'continue' | 'rewrite'>;
/** Optional explicit-action UI. All authoritative edits use the supplied host commit port. */
export declare class AiActions {
    #private;
    readonly context: SlashContext;
    readonly host: AiHost;
    readonly options: AiActionsOptions;
    readonly element: HTMLElement;
    readonly panel: HTMLElement;
    readonly instruction: HTMLTextAreaElement;
    readonly scope: HTMLSelectElement;
    readonly target: HTMLSelectElement;
    readonly action: HTMLSelectElement;
    readonly language: HTMLInputElement;
    readonly tone: HTMLSelectElement;
    readonly output: HTMLElement;
    readonly status: HTMLElement;
    readonly session: AiSession;
    constructor(context: SlashContext, host: AiHost, options: AiActionsOptions);
    private release;
    open(operation: Operation, selectionOnly?: boolean): void;
    private watch;
    private writable;
    private buildRequest;
    generate(): Promise<void>;
    regenerate(): Promise<void>;
    private run;
    private restoreTarget;
    reject(): void;
    accept(): void;
    private render;
    setReadOnly(value: boolean): void;
    dispose(): void;
}
/** Compose with existing indexed slash dispatch and its host lifecycle. No shared input hook. */
export declare function aiActions(host: AiHost, options: AiActionsOptions): SlashFactory;
export {};
