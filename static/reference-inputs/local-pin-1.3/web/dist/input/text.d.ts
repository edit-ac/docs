import { TextDrag } from './drag.js';
import type { CommitResult, EngineHandle, PrepareRequest } from '@edit-ac/core';
import type { DOMRenderer } from '../dom/render.js';
import type { DOMSelection } from '../dom/selection.js';
import { type TypingShortcutAdapter } from './shortcuts.js';
import { KeyboardInput } from './keyboard.js';
import { type NativeRecovery } from './reconcile.js';
import { ClipboardInput, type ClipboardCodec } from '../clipboard/fragment.js';
export interface TextIntent {
    id: string;
    generation: number;
    origin: 'key' | 'beforeinput' | 'native' | 'composition';
    disposition: 'native-pending' | 'committed' | 'handled' | 'rejected' | 'disposed' | 'canceled';
    reason?: string;
    text?: string;
}
interface Trace {
    type: string;
    trusted: boolean;
    generation: number;
    intent?: string;
    count?: number;
    inputType?: string;
    cancelable?: boolean;
}
/** Ordinary input adapter. Rust owns every committed edit; DOM text is read only
 * for a bounded native intent in one mapped text block. Unsupported mutations
 * retain explicit recovery text; composition and structural commands have separate owners.
 * Construct after renderer/selection and commit through attached local storage.
 */
export declare class TextInput {
    #private;
    readonly intents: TextIntent[];
    readonly trace: Trace[];
    readonly recovery: (NativeRecovery & {
        intent: string;
        generation: number;
    })[];
    shortcuts: TypingShortcutAdapter;
    references: import('../modules/references.js').ReferencePresenter | undefined;
    reorder: import('../modules/reorder.js').ReorderPresenter | undefined;
    slash: import('../modules/slash.js').SlashPresenter | undefined;
    readonly keyboard: KeyboardInput;
    readonly clipboard: ClipboardInput;
    readonly textDrag: TextDrag;
    get suspended(): boolean;
    suspend(): void;
    resume(): void;
    constructor(renderer: DOMRenderer, selection: DOMSelection, engine: EngineHandle, commit: (request: PrepareRequest) => CommitResult, clipboardCodecs?: readonly ClipboardCodec[]);
    codeCommands: import('../extensions/code.js').CodeCommandsPresenter | undefined;
    attachCodeCommands(factory: import('../extensions/code.js').CodeCommandsFactory): void;
    search: import('../modules/search.js').DocumentSearchPresenter | undefined;
    attachSearch(factory: import('../modules/search.js').DocumentSearchFactory): void;
    attachReorder(factory: import('../modules/reorder.js').ReorderFactory): void;
    attachReferences(factory: import('../modules/references.js').ReferenceFactory): void;
    attachSlash(factory: import('../modules/slash.js').SlashFactory): void;
    setReadOnly(value: boolean): void;
    settle(): Promise<void>;
    dispose(): void;
}
export {};
