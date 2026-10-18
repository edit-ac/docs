import type { CommitResult, EngineHandle, FragmentBlock, PrepareRequest, ProjectedNode } from '@edit-ac/core';
import { PendingPaste } from './pending.js';
import type { DOMRenderer } from '../dom/render.js';
import type { DOMSelection, RetainedSelection } from '../dom/selection.js';
export declare const FRAGMENT_MIME = "application/x-edit-ac-fragment+json";
export interface Fragment {
    version: 1;
    schema: string;
    blocks: readonly FragmentBlock[];
}
export interface ClipboardData {
    getData(type: string): string;
    setData(type: string, value: string): void;
}
export interface ClipboardOutcome {
    disposition: 'committed' | 'handled' | 'rejected';
    reason?: string;
}
export interface ClipboardCodec {
    mime: string;
    prepare(raw: string): readonly FragmentBlock[];
}
export declare function validateClipboardCodecs(codecs: readonly ClipboardCodec[]): void;
export declare function decodeFragment(raw: string, engine: EngineHandle): Fragment;
/** Content controls copy the admitted whole atom, including opaque run data.
 * Use the same projection encoding and owning validation as editor copy. */
export declare function encodeContentFragment(engine: EngineHandle, node: ProjectedNode): string;
/** Read the existing clipboard representation without changing DOM selection.
 * Drag source validation compares this bounded, lossless value at final admission. */
export declare function selectionFragment(engine: EngineHandle, range: import('@edit-ac/core').StableRange): {
    plain: string;
    inert: boolean;
    encode(): {
        fragment: Fragment;
        raw: string;
    };
} | undefined;
/** Owns clipboard intents independently of keyboard events. Native menu paste,
 * beforeinput-only paste and noncancelable replacement share one mutation gate. */
export declare class ClipboardInput {
    #private;
    readonly diagnostics: string[];
    readonly recovery: {
        mime: string;
        raw: string;
        reason: string;
    }[];
    last: ClipboardOutcome;
    pendingPaste: PendingPaste | undefined;
    plainTextPolicy: 'literal' | 'markdown';
    contentCodecs: import('@edit-ac/core').MarkdownOptions;
    constructor(renderer: DOMRenderer, selection: DOMSelection, engine: EngineHandle, commit: (request: PrepareRequest) => CommitResult, blocked: () => boolean, codecs?: readonly ClipboardCodec[]);
    get ownsMutations(): boolean;
    paste(data: Pick<ClipboardData, 'getData'>, options?: {
        literal?: boolean;
    }): ClipboardOutcome;
    /** Host data-provider fallback. Capture the hit-tested target before async
     * work; the existing plain-paste lifecycle owns permission and session checks. */
    dropPlainText(read: () => Promise<string>, position: Pick<DragEvent, 'clientX' | 'clientY'>): Promise<ClipboardOutcome>;
    /** Explicit deferred preparation; target and clipboard values are captured once.
     * schedule is an optional host scheduler, never a provider/network transport. */
    pasteDeferred(data: Pick<ClipboardData, 'getData'>, options?: {
        literal?: boolean;
        schedule?: () => Promise<void>;
    }): PendingPaste;
    /** Explicit activated plain-paste command. Stable target is captured before
     * permission/OS work; late results cannot follow navigation or a new session. */
    pastePlainText(read: () => Promise<string>, captured?: RetainedSelection): Promise<ClipboardOutcome>;
    cancel(): void;
    copy(data: ClipboardData, cut?: boolean): ClipboardOutcome;
    handle(event: Event): boolean;
    finish(): void;
    dispose(): void;
}
