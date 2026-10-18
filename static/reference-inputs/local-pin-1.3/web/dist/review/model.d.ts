/** Presentation only: exact patch admission/application belongs to the session service. */
export type ReviewLayout = 'unified' | 'inline' | 'side-by-side';
export type ReviewMode = 'writable' | 'readonly' | 'history';
export interface ReviewLimits {
    maxInputBytes: number;
    pageSize: number;
    maxValueChars: number;
}
export declare const DEFAULT_REVIEW_LIMITS: Readonly<ReviewLimits>;
export type ReviewInput = {
    representation: 'exact-source';
    wire: string;
} | {
    representation: 'projected-markdown';
    wire: string;
    serializer: string;
    dialect: string;
} | {
    representation: 'semantic';
    model: unknown;
};
export interface ReviewLine {
    kind: 'Context' | 'Delete' | 'Insert';
    text: string;
}
export interface ReviewHunk {
    oldStart: number;
    oldCount: number;
    newStart: number;
    newCount: number;
    lines: ReviewLine[];
}
export interface ReviewChange {
    id: string;
    facets: string[];
    before: unknown;
    after: unknown;
}
export interface ReviewModel {
    representation: ReviewInput['representation'];
    label: string;
    explanation: string;
    beforeHash: string;
    afterHash: string;
    key: string;
    hunks: ReviewHunk[];
    changes: ReviewChange[];
    retainedStructure: unknown;
    attribution: string;
}
export declare function reviewLimits(limits?: Partial<ReviewLimits>): ReviewLimits;
export declare function prepareReview(input: ReviewInput, suppliedLimits?: Partial<ReviewLimits>): ReviewModel;
/** Portable terminal/native/web companion input; contains no apply authority. */
export interface PortableChangeModel {
    version: 'editac-change-model-v1';
    input: ReviewInput;
}
export declare function exportChangeModel(input: ReviewInput, limits?: Partial<ReviewLimits>): string;
export declare function importChangeModel(wire: string, limits?: Partial<ReviewLimits>): ReviewInput;
