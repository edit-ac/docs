import type { KeyboardAction } from '../input/keyboard.js';
/** One portable name/key catalog. Every route delegates to KeyboardInput and the
 * same prepared engine commands; these descriptors contain no edit semantics. */
export declare const commandCatalog: readonly Readonly<{
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
export type PortableCommand = KeyboardAction | 'replace';
export interface ShortcutProfile {
    /** Canonical chords owned by the host/OS/assistive technology. */
    reserved?: readonly string[];
    /** Chord -> registered command or null to leave it with its native owner. */
    remap?: Readonly<Record<string, string | null>>;
}
export interface CapturedCommand {
    readonly active: boolean;
    execute(text?: string): import('../input/keyboard.js').CommandResult;
    dispose(): void;
}
export declare function resolveCommand(name: string): PortableCommand | undefined;
export declare function shortcutCommand(chord: string, profile: ShortcutProfile, windowsRedo?: boolean): KeyboardAction | undefined;
