import type { ProjectedNode } from '@edit-ac/core';
import type { DOMRenderer } from '../../dom/render.js';
import { HighlightScheduler, type HighlightSchedulerOptions } from './scheduler.js';
export interface CodeHighlightOptions extends Omit<HighlightSchedulerOptions, 'apply'> {
    enabled?: boolean;
    theme?: string;
}
export type CodeHighlightFactory = (renderer: DOMRenderer) => CodeHighlightPresenter;
/** Optional factory for EditorOptions/EditorSurfaceOptions.codeHighlight. */
export declare function codeHighlighting(options: CodeHighlightOptions): CodeHighlightFactory;
/** CSS range decorations preserve canonical runs, offset maps, native selection,
 * and input mutation ownership. No text wrappers or collaborative marks. */
export declare class CodeHighlightPresenter {
    private readonly renderer;
    readonly scheduler: HighlightScheduler;
    private readonly blocks;
    private readonly highlights;
    private readonly names;
    private readonly style;
    private readonly registry;
    private disposed;
    private theme;
    private enabled;
    constructor(renderer: DOMRenderer, options: CodeHighlightOptions);
    /** Theme identities invalidate in-flight work even when host colors use CSS vars. */
    configure(options: {
        theme?: string;
        enabled?: boolean;
    }): void;
    update(node: ProjectedNode, revision: number): void;
    private request;
    private clear;
    private apply;
    hold(id: string): void;
    remove(id: string): void;
    dispose(): void;
}
