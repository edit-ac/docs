import type { DOMRenderer } from '../dom/render.js';
export interface NativeRecovery {
    reason: string;
    node?: string;
    text: string;
    truncated: boolean;
}
export type NativeMutation = {
    type: 'unchanged';
    node: string;
} | {
    type: 'edit';
    node: string;
    before: string;
    start: number;
    end: number;
    text: string;
    captured: string;
    caret?: {
        anchor: number;
        focus: number;
    };
} | {
    type: 'unsupported';
    recovery: NativeRecovery;
    nodes: string[];
};
/** Bounded semantic text capture shared by native fallback and composition. */
export declare function captureComposingBlock(renderer: DOMRenderer, node: string): NativeRecovery;
/** Mutation ownership is established by the caller before comparing text. */
export declare function reconcileMutation(renderer: DOMRenderer, content: ReadonlyMap<string, string>, records: readonly MutationRecord[]): NativeMutation;
