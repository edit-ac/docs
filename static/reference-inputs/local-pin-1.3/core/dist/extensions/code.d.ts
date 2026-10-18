import type { EngineHandle, StableRange, PrepareRequest, CommitResult } from '../engine.js';
export declare const CODE_COMMAND_PROFILE = "editac.code-conveniences.v1";
export declare const CODE_COMMAND_LIMIT = 102400;
export type CodeAction = 'moveUp' | 'moveDown' | 'duplicate' | 'indent' | 'outdent' | 'surround' | 'comment';
export declare const CODE_PAIRS: Readonly<Record<string, string>>;
export declare class CodeCommandError extends Error {
}
export declare function codeContext(engine: EngineHandle, range: StableRange): {
    owner: string;
    text: string;
    language: string;
    anchor: number;
    focus: number;
    revision: number;
};
export type CodeContext = ReturnType<typeof codeContext>;
export interface CodeEdit {
    text: string;
    anchor: number;
    focus: number;
}
/** Pure logical LF profile. A terminal LF represents an empty last logical line. */
export declare function codeEdit(c: CodeContext, action: CodeAction, pair?: string): CodeEdit;
/** Synchronous validation and one existing prepared engine batch; no alternate document. */
export declare function commitCodeEdit(engine: EngineHandle, c: CodeContext, edit: CodeEdit, origin: string, commit: (request: PrepareRequest) => CommitResult): CommitResult | undefined;
export declare function executeCodeCommand(engine: EngineHandle, range: StableRange, action: CodeAction, commit: (request: PrepareRequest) => CommitResult, pair?: string): CommitResult | undefined;
