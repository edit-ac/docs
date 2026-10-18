import { type BrowserEditor, type EditorOptions } from './editor.js';
export type TaskPresetOptions = Pick<EditorOptions, 'markdown' | 'typingShortcuts' | 'plainTextPolicy' | 'plainPasteControl' | 'contentCodecs'>;
/** Explicit defaults; hosts opt into content/module providers separately. */
export declare function taskPreset(options?: TaskPresetOptions): TaskPresetOptions & {
    preset: 'task';
};
/** Returns a lifecycle handle immediately. Await ready before commands or input.
 * Opening requires an existing checkpoint; creation is an explicit host action. */
export declare function createEditor(root: HTMLElement, options: EditorOptions): BrowserEditor;
