import { type ShortcutProfile, type CapturedCommand, type PortableCommand } from '../commands/catalog.js';
import { FormattingInput, type ToolbarTarget } from '../commands/formatting.js';
export type { ToolbarTarget } from '../commands/formatting.js';
export interface HistoryTarget {
    readonly active: boolean;
    execute(action: 'undo' | 'redo'): CommandResult;
    dispose(): void;
}
import type { CommitResult, EngineHandle, PrepareRequest, StableRange } from '@edit-ac/core';
import type { DOMRenderer } from '../dom/render.js';
import type { DOMSelection } from '../dom/selection.js';
export type KeyboardAction = 'enter' | 'break' | 'backward' | 'forward' | 'indent' | 'outdent' | 'undo' | 'redo' | 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link';
export interface CommandResult {
    disposition: 'committed' | 'handled' | 'rejected';
    reason?: string;
}
/** Called only after the sole input owner has resolved composition precedence.
 * All content changes are applicability-checked prepared engine transactions.
 * Native visual navigation and platform word/line ranges stay browser-owned.
 */
export declare class KeyboardInput {
    #private;
    readonly formatting: FormattingInput;
    constructor(renderer: DOMRenderer, selection: DOMSelection, engine: EngineHandle, commit: (request: PrepareRequest) => CommitResult, blocked: () => boolean);
    action(event: Event): KeyboardAction | undefined;
    /** Only scoped Select All needs adapter ownership; visual movement stays native. */
    navigate(key: KeyboardEvent): boolean;
    configureCommands(profile?: ShortcutProfile, allowed?: (command: PortableCommand) => boolean): void;
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
    /** Capture while the editor owns focus. Supplied anchors are copied and owned
     * here; invalid targets never fall back to the current native caret. */
    captureCommand(name: string, supplied?: StableRange, focusOwner?: HTMLElement): CapturedCommand | undefined;
    resetFocusEscape(): void;
    /** Capture before a host menu takes focus; never redirect a delayed intent. */
    captureHistory(): HistoryTarget | undefined;
    /** Undefined means native ownership: do not prevent the event. */
    execute(action: KeyboardAction, origin?: string): CommandResult | undefined;
    /** Link UI and host toolbar both use the same captured formatting target. */
    openLink(): CommandResult;
    captureToolbar(): ToolbarTarget | undefined;
    dispose(): void;
}
