import { AiHost, AiSession } from '@edit-ac/core/extensions';
import { type SlashContext, type SlashFactory } from '../../modules/slash.js';
export interface AiCompletionOptions {
    /** Explicit per-editor opt-in. Host admission is also mandatory. */
    enabled?: boolean;
    debounceMs: number;
    contextBytes: number;
    outputBytes: number;
    acceptKey?: 'Tab' | 'Enter' | false;
    attached?(completion: AiCompletion): void;
}
/** Transient presentation only: the editable tree and semantic state never contain ghost text. */
export declare class AiCompletion {
    readonly context: SlashContext;
    readonly host: AiHost;
    readonly options: AiCompletionOptions;
    readonly element: HTMLElement;
    readonly ghost: HTMLElement;
    readonly status: HTMLElement;
    readonly session: AiSession;
    private range;
    private guard;
    private signature;
    private timer;
    private listeners;
    private subscription;
    private disposed;
    private readOnly;
    private composing;
    private dictating;
    private selecting;
    private enabled;
    private accepting;
    private acceptButton;
    constructor(context: SlashContext, host: AiHost, options: AiCompletionOptions);
    private listen;
    private writable;
    private currentSignature;
    private release;
    dismiss(): void;
    /** Host document/permission transitions invalidate the captured request. */
    invalidate(): void;
    private schedule;
    /** Host dictation/marked-text lifecycle, when not exposed as DOM composition. */
    setDictating(value: boolean): void;
    setEnabled(value: boolean): void;
    setReadOnly(value: boolean): void;
    complete(): Promise<void>;
    private applicable;
    accept(): void;
    private render;
    dispose(): void;
}
/** Optional lifecycle composition through the existing indexed presenter port. */
export declare function aiCompletion(host: AiHost, options: AiCompletionOptions): SlashFactory;
