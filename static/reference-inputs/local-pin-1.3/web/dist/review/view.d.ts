import type { ReviewInput, ReviewLayout, ReviewMode, ReviewLimits } from './model.js';
export interface ReviewSelection {
    beforeHash: string;
    afterHash: string;
    representation: 'exact-source' | 'projected-markdown';
    hunkIndexes: number[];
}
export interface ChangeReviewOptions {
    mode?: ReviewMode;
    layout?: ReviewLayout;
    limits?: Partial<ReviewLimits>;
    /** Requests review admission; the host must use revision-checked session application. */
    onAccept?: (selection: ReviewSelection) => void;
}
/** Optional DOM presenter. No engine, typing observer, history checkout or transport mutation. */
export declare class ChangeReview {
    private readonly host;
    private readonly root;
    private readonly limits;
    private readonly onAccept;
    private model;
    private mode;
    private layout;
    private whitespace;
    private page;
    private selected;
    private rows;
    private destroyed;
    constructor(host: HTMLElement, input: ReviewInput, options?: ChangeReviewOptions);
    private validateMode;
    update(input: ReviewInput): void;
    setMode(mode: ReviewMode): void;
    destroy(): void;
    private rebuild;
    private el;
    private button;
    private value;
    private render;
}
