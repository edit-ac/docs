import { type EditorFacadeOptionsV1 } from './extensions/configuration.js';
import type { PreparedEditorConfigurationV1, PlatformObservationV1 } from './extensions/contract.js';
import { EditorViewport, type ViewportOptions } from './platform/viewport.js';
import type { LinkEnrichmentFactory } from './modules/links/enrichment.js';
import type { CommitResult, EngineHandle, PrepareRequest } from '@edit-ac/core';
import { DOMRenderer } from './dom/render.js';
import { DOMSelection } from './dom/selection.js';
import { TextInput } from './input/text.js';
import type { ModuleRuntime, ModuleRuntimeOptions } from './modules/runtime.js';
import type { ClipboardCodec } from './clipboard/fragment.js';
export interface EditorSurfaceOptions extends Partial<EditorFacadeOptionsV1> {
    viewport?: ViewportOptions;
    shortcutProfile?: import('./commands/catalog.js').ShortcutProfile;
    commandAllowed?: (command: import('./commands/catalog.js').PortableCommand) => boolean;
    selectionViewport?: import('./selection/pointer.js').PointerSelectionViewport;
    codeCommands?: import('./extensions/code.js').CodeCommandsFactory;
    search?: import('./modules/search.js').DocumentSearchFactory;
    markdown?: import('./input/shortcuts.js').MarkdownAdapter;
    codeHighlight?: import("./modules/code/presenter.js").CodeHighlightFactory;
    content?: import('./modules/content.js').ContentFactory;
    reorder?: import('./modules/reorder.js').ReorderFactory;
    links?: LinkEnrichmentFactory;
    references?: import('./modules/references.js').ReferenceFactory;
    slash?: import('./modules/slash.js').SlashFactory;
    moduleRuntime?: ModuleRuntimeOptions;
    modules?: import('./modules/registry.js').ModuleRegistry;
    readOnly?: boolean;
    label?: string;
    clipboardCodecs?: readonly ClipboardCodec[];
    typingShortcuts?: boolean;
    preset?: 'task' | 'minimal' | 'default' | 'document';
    plainTextPolicy?: 'markdown' | 'literal';
    contentCodecs?: import('@edit-ac/core').MarkdownOptions;
    /** Host persistence/command port; defaults to committing to the borrowed engine. */
    commit?: (request: PrepareRequest) => CommitResult;
}
export interface EditorSurface {
    readonly ready: Promise<void>;
    readonly extensionStatus: Readonly<Record<string, import('./extensions/contract.js').ExtensionStatusV1>>;
    readonly extensionConfiguration: PreparedEditorConfigurationV1 | undefined;
    readonly platformPreferences: PlatformObservationV1;
    readonly viewport: EditorViewport;
    readonly pointerSelection: import('./selection/pointer.js').PointerSelection;
    readonly codeCommands: import('./extensions/code.js').CodeCommandsPresenter | undefined;
    readonly search: import('./modules/search.js').DocumentSearchPresenter | undefined;
    readonly reorder: import('./modules/reorder.js').ReorderPresenter | undefined;
    readonly references: import('./modules/references.js').ReferencePresenter | undefined;
    readonly slash: import('./modules/slash.js').SlashPresenter | undefined;
    readonly moduleRuntime: ModuleRuntime | undefined;
    readonly recovery: readonly {
        text: string;
        reason: string;
    }[];
    captureTextTransfer(): import('./input/drag.js').TextTransferTarget | undefined;
    captureToolbar(): import('./commands/formatting.js').ToolbarTarget | undefined;
    readonly commands: typeof import('./commands/catalog.js').commandCatalog;
    captureCommand(name: string, supplied?: import('@edit-ac/core').StableRange): import('./commands/catalog.js').CapturedCommand | undefined;
    captureHistory(): import('./input/keyboard.js').HistoryTarget | undefined;
    settle(): Promise<void>;
    setReadOnly(value: boolean): void;
    /** Detach the view and input handlers. The host still owns the engine. */
    dispose(): void;
}
/** Reserve before asynchronous recovery so both mount paths share ownership. */
export declare function reserveEditorSurface(root: HTMLElement): () => void;
/** Shared adapter assembly for recovered documents and host-owned replicas. */
export declare function bindEditorSurface(root: HTMLElement, engine: EngineHandle, options?: EditorSurfaceOptions & {
    onSuspend?: () => void;
}, prepared?: PreparedEditorConfigurationV1): {
    platformPreferences: PlatformObservationV1;
    viewport: EditorViewport;
    renderer: DOMRenderer;
    selection: DOMSelection;
    input: TextInput;
    pointerSelection: import("./selection/pointer.js").PointerSelection;
    dispose(): void;
};
/** Mount a synchronous view over a host-owned engine, without a storage service. */
export declare function mountEditorSurface(root: HTMLElement, engine: EngineHandle, options?: EditorSurfaceOptions): EditorSurface;
