import type { EngineHandle, StableRange } from '@edit-ac/core';
import type { DOMRenderer } from '../dom/render.js';
import type { DOMSelection } from '../dom/selection.js';
import type { TextIntent } from './text.js';
import { type NativeRecovery } from './reconcile.js';
interface Hooks {
    begin(): TextIntent;
    content(node: string): string | undefined;
    apply(intent: TextIntent, range: StableRange, text: string, moveCaret?: boolean): void;
    recovery(intent: TextIntent, value: NativeRecovery): void;
    preserve(intent: TextIntent, value: NativeRecovery): void;
    drain(): void;
}
/** Local composition lifecycle, called by TextInput's sole event/observer owner.
 * Native DOM and selection remain temporary until one stable-range final commit.
 * Prepared browser mechanics qualify this policy; OS IME support is separate.
 */
export declare class CompositionInput {
    #private;
    constructor(renderer: DOMRenderer, selection: DOMSelection, engine: EngineHandle, hooks: Hooks);
    get active(): boolean;
    get owner(): TextIntent | undefined;
    handle(event: Event, readOnly: boolean): TextIntent | undefined;
    finish(mode: 'final' | 'cancel' | 'blur' | 'readonly' | 'dispose'): void;
    dispose(): void;
}
export {};
