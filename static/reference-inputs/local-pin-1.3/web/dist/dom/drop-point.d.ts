import type { DOMRenderer } from './render.js';
import type { DOMSelection, ModelPoint } from './selection.js';
/** Native hit testing must resolve inside this editor, never a later caret. */
export declare function dropPoint(renderer: DOMRenderer, selection: DOMSelection, e: Pick<DragEvent, 'clientX' | 'clientY'>): ModelPoint | undefined;
