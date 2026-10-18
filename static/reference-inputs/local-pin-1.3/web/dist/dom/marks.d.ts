import type { MarkCommand } from '@edit-ac/core';
/** Shared semantic mark names and safe presentation tags; no document state. */
export declare const inlineTags: {
    readonly bold: 'strong';
    readonly italic: 'em';
    readonly strike: 's';
    readonly underline: 'u';
    readonly code: 'code';
};
export declare const inlineMarks: (keyof typeof inlineTags)[];
export declare const htmlMarks: Readonly<Record<string, MarkCommand['mark']>>;
