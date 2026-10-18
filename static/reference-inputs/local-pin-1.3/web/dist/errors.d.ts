/** Preserve the existing public diagnostic conversion for adapter failures. */
export declare const errorMessage: (error: unknown) => string;
/** Shared command/clipboard rejection shape; preserves public diagnostic reasons. */
export declare const rejected: (reason: string) => {
    disposition: 'rejected';
    reason: string;
};
