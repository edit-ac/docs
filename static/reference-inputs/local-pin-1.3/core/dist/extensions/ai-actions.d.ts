import type { ProjectedNode, Json } from '../engine.js';
export declare const AI_ACTION_PROFILE = "editac-ai-selected-text-v1";
/** Requested behavior only; prepared results do not measure model accuracy. */
export declare const AI_ACTIONS: readonly Readonly<{
    id: 'spelling-grammar';
    label: 'Spelling and grammar';
    prompt: 'Correct spelling and grammar while retaining the meaning.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'rephrase';
    label: 'Rephrase';
    prompt: 'Rephrase the selected text while retaining the meaning.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'simplify';
    label: 'Simplify';
    prompt: 'Use simpler language while retaining the meaning.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'shorten';
    label: 'Shorten';
    prompt: 'Make the selected text more concise while retaining the essential meaning.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'extend';
    label: 'Extend';
    prompt: 'Expand the selected text without inventing facts.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'tone';
    label: 'Adjust tone';
    prompt: 'Adjust the tone while retaining the meaning.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'summarize';
    label: 'Summarize';
    prompt: 'Summarize the selected text.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'key-points';
    label: 'Key points';
    prompt: 'Extract the key points as plain-text lines.';
    scope: 'selection';
    format: 'plain-text';
} | {
    id: 'translate';
    label: 'Translate';
    prompt: 'Translate the selected text into the explicitly requested language.';
    scope: 'selection';
    format: 'plain-text';
}>[];
export type AiActionId = typeof AI_ACTIONS[number]['id'];
export declare const AI_TONES: readonly ["neutral", "formal", "friendly", "professional"];
export type AiTone = typeof AI_TONES[number];
export interface AiActionOptions {
    language?: string;
    tone?: AiTone;
}
export interface PreparedAiAction {
    instruction: string;
    context: string;
    scope: 'selection';
    format: 'plain-text';
    /** Exact uniform source marks, reapplied by existing semantic commands. */
    attributes: Readonly<Record<string, Json>>;
}
/** Explicit supported subset: one nonempty paragraph selection with uniform built-in marks.
 * There is no reliable alignment from rewritten plain text to mixed source runs. Reject it
 * before dispatch instead of guessing, stripping marks, or modifying protected module data.
 */
export declare function prepareAiAction(id: AiActionId, node: ProjectedNode, from: number, to: number, options?: AiActionOptions): PreparedAiAction;
