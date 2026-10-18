import { type EditorFacadeOptionsV1 } from './extensions/configuration.js';
import type { PreparedEditorConfigurationV1, PlatformObservationV1, ExtensionStatusV1 } from './extensions/contract.js';
import { CommandControls } from './ui/commands.js';
import { type InputHints } from './input/hints.js';
import type { AnchorToken, Bias, CommitResult, DocumentIdentity, EditorCommand, Patch, PatchScope, PrepareRequest, Snapshot } from '@edit-ac/core';
import { SyncSession, type SyncSessionOptions, type SyncTransport } from './sync/session.js';
import { recoverLocalDocument } from './entry.js';
import { BrowserLifecycle, type PreviewTag } from './lifecycle.js';
import type { RecoveryExport } from './storage/index.js';
import type { ClipboardData, ClipboardOutcome, ClipboardCodec } from './clipboard/fragment.js';
type RecoveryOptions = Parameters<typeof recoverLocalDocument>[0];
export interface EditorOptions extends RecoveryOptions, Partial<EditorFacadeOptionsV1> {
    commandControls?: boolean;
    inputHints?: InputHints;
    viewport?: import('./platform/viewport.js').ViewportOptions;
    shortcutProfile?: import('./commands/catalog.js').ShortcutProfile;
    commandAllowed?: (command: import('./commands/catalog.js').PortableCommand) => boolean;
    selectionViewport?: import('./selection/pointer.js').PointerSelectionViewport;
    codeCommands?: import('./extensions/code.js').CodeCommandsFactory;
    search?: import('./modules/search.js').DocumentSearchFactory;
    markdown?: import('./input/shortcuts.js').MarkdownAdapter;
    codeHighlight?: import("./modules/code/presenter.js").CodeHighlightFactory;
    content?: import('./modules/content.js').ContentFactory;
    reorder?: import('./modules/reorder.js').ReorderFactory;
    links?: import('./modules/links/enrichment.js').LinkEnrichmentFactory;
    references?: import('./modules/references.js').ReferenceFactory;
    slash?: import('./modules/slash.js').SlashFactory;
    moduleRuntime?: import('./modules/runtime.js').ModuleRuntimeOptions;
    modules?: import('./modules/registry.js').ModuleRegistry;
    clipboardCodecs?: readonly ClipboardCodec[];
    typingShortcuts?: boolean;
    preset?: 'task' | 'minimal' | 'default' | 'document';
    plainTextPolicy?: 'markdown' | 'literal';
    contentCodecs?: import('@edit-ac/core').MarkdownOptions;
    plainPasteControl?: boolean;
    readOnly?: boolean;
    label?: string;
    preview?: PreviewTag;
    /** Host recovery port; defaults to the local WASM/IndexedDB adapter. */
    recover?: typeof recoverLocalDocument;
}
export interface DestroyResult {
    unsaved: boolean;
    recovery: RecoveryExport | null;
    provisional: readonly {
        text?: string;
        reason: string;
    }[];
    clipboard: readonly {
        mime: string;
        raw: string;
        reason: string;
    }[];
}
export interface SyncAttachment {
    readonly presence?: import('./sync/presence.js').PresenceAttachment;
    readonly state: SyncSession['state'];
    receive(frame: Uint8Array): void;
    pump(now: number): Promise<void>;
    detach(): void;
}
export interface AttachSyncOptions extends SyncSessionOptions {
    presence?: import('./sync/presence.js').PresenceOptions;
    transport: SyncTransport;
    peerIdentity: DocumentIdentity;
    authorized: boolean;
}
/** A chain is one Rust prepare/commit, never a loop of partially applied commands. */
export declare class CommandChain {
    #private;
    constructor(editor: BrowserEditor, origin: string);
    command(command: EditorCommand): this;
    can(): boolean;
    /** A returned caret token is caller-owned; release it after applying selection. */
    run(): CommitResult;
}
/** Browser input owner. All editing begins after authoritative local recovery.
 * Hosts call destroy with flush policy before discarding their last replica. */
export declare class BrowserEditor {
    #private;
    readonly root: HTMLElement;
    readonly ready: Promise<void>;
    readonly extensionConfiguration: PreparedEditorConfigurationV1 | undefined;
    get extensionStatus(): Readonly<Record<string, ExtensionStatusV1>>;
    get collaborationStatus(): ExtensionStatusV1;
    get syncAttachment(): SyncAttachment | undefined;
    get platformPreferences(): PlatformObservationV1;
    readonly lifecycle: BrowserLifecycle;
    constructor(root: HTMLElement, options: EditorOptions);
    get state(): import("./lifecycle.js").EditorState;
    get clipboardRecovery(): {
        mime: string;
        raw: string;
        reason: string;
    }[];
    /** Bounded rejected/interrupted input text for host recovery, never document state. */
    get inputRecovery(): {
        text: string;
        reason: string;
    }[];
    subscribe(listener: Parameters<BrowserLifecycle['subscribe']>[0]): () => void;
    subscribe(scope: PatchScope, listener: (patch: Patch) => void): () => void;
    /** Explicit opt-in; optional platform code is absent from the ordinary editor import graph. */
    enableBrowserCapabilities(): Promise<import('./platform/capabilities.js').BrowserCapabilities>;
    get commandControls(): CommandControls | undefined;
    setInputHints(hints: InputHints): void;
    get codeCommands(): import('./extensions/code.js').CodeCommandsPresenter | undefined;
    get search(): import('./modules/search.js').DocumentSearchPresenter | undefined;
    get viewport(): import('./platform/viewport.js').EditorViewport | undefined;
    get reorder(): import('./modules/reorder.js').ReorderPresenter | undefined;
    get references(): import('./modules/references.js').ReferencePresenter | undefined;
    get slash(): import('./modules/slash.js').SlashPresenter | undefined;
    get moduleRuntime(): import('./modules/runtime.js').ModuleRuntime | undefined;
    read(): Snapshot;
    anchor(node: string, offset: number, bias?: Bias): AnchorToken;
    releaseAnchor(anchor: AnchorToken): void;
    can(request: PrepareRequest): boolean;
    chain(origin?: string): CommandChain;
    /** External and cross-document moves have no qualified receipt contract. */
    get textTransferCapabilities(): {
        readonly sameSessionMove: true;
        readonly crossDocumentMove: false;
        readonly externalMove: false;
        readonly externalCopy: true;
    };
    /** Capture before moving focus into a host control. Release on dismissal. */
    captureTextTransfer(): import('./input/drag.js').TextTransferTarget | undefined;
    get commands(): readonly Readonly<{
        id: 'enter';
        label: 'Insert paragraph';
        key: 'Enter';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'break';
        label: 'Insert line break';
        key: 'Shift+Enter';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'backward';
        label: 'Delete backward';
        key: 'Backspace';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'forward';
        label: 'Delete forward';
        key: 'Delete';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'indent';
        label: 'Indent';
        key: 'Tab';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'outdent';
        label: 'Outdent';
        key: 'Shift+Tab';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'bold';
        label: 'Bold';
        key: 'Primary+b';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'italic';
        label: 'Italic';
        key: 'Primary+i';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'underline';
        label: 'Underline';
        key: 'Primary+u';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'strike';
        label: 'Strikethrough';
        key: 'Primary+Shift+x';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'code';
        label: 'Inline code';
        key: null;
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'link';
        label: 'Edit link';
        key: 'Primary+k';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'undo';
        label: 'Undo';
        key: 'Primary+z';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'redo';
        label: 'Redo';
        key: 'Primary+Shift+z';
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    } | {
        id: 'replace';
        label: 'Replace supplied target';
        key: null;
        aliases: Readonly<readonly [] | readonly ["deleteContentBackward"] | readonly ["deleteContentForward"] | readonly ["editLink"] | readonly ["historyRedo"] | readonly ["historyUndo"] | readonly ["insertLineBreak"] | readonly ["insertParagraph"] | readonly ["insertReplacementText"] | readonly ["toggleBold"] | readonly ["toggleCode"] | readonly ["toggleItalic"] | readonly ["toggleStrike"] | readonly ["toggleUnderline"]>;
    }>[];
    captureCommand(name: string, supplied?: import('@edit-ac/core').StableRange, focusOwner?: HTMLElement): import('./commands/catalog.js').CapturedCommand | undefined;
    settle(): Promise<void>;
    captureHistory(): import('./input/keyboard.js').HistoryTarget | undefined;
    captureToolbar(): import('./commands/formatting.js').ToolbarTarget | undefined;
    /** Host drives receive/pump on transport events and retry deadlines. Sending
     * frames establishes no durable remote-save claim. Attachment never restores a replica. */
    attachSync(options: AttachSyncOptions): Promise<SyncAttachment>;
    /** Cancel pending facade work and detach without replacing the local replica/history. */
    disconnectCollaboration(): void;
    connectCollaboration(): Promise<void>;
    commit(request: PrepareRequest): CommitResult;
    setReadOnly(value: boolean): void;
    paste(data: Pick<ClipboardData, 'getData'>, options?: {
        literal?: boolean;
    }): ClipboardOutcome;
    /** Copy-only external provider fallback at a hit-tested client position. */
    dropPlainText(read: () => Promise<string>, position: {
        clientX: number;
        clientY: number;
    }): Promise<ClipboardOutcome>;
    pasteDeferred(data: Pick<ClipboardData, 'getData'>, options?: {
        literal?: boolean;
        schedule?: () => Promise<void>;
    }): import('./clipboard/pending.js').PendingPaste;
    /** Capture an explicit literal-paste intent before its owning control focuses.
     * The existing clipboard owner supplies limits, diagnostics and cancellation. */
    capturePlainPaste(focusOwner?: HTMLElement): {
        readonly active: boolean;
        dispose: () => void;
        paste: (read?: () => Promise<string>) => Promise<ClipboardOutcome>;
    } | undefined;
    pastePlainText(read?: () => Promise<string>): Promise<ClipboardOutcome>;
    flush(options: {
        target: 'local';
    }): Promise<void>;
    recoveryExport(): RecoveryExport;
    destroy(options?: {
        policy: 'flush' | 'report';
    }): Promise<DestroyResult>;
}
export declare function mountEditor(root: HTMLElement, options: EditorOptions): BrowserEditor;
export {};
