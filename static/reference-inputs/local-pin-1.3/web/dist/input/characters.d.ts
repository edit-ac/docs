/** Browser strings must be checked before crossing JSON/WASM/UTF-8 boundaries.
 * TAB and line endings are supported literal data; other C0/C1 controls are
 * unsupported. Bidi, joiners, variation selectors and authored spaces are data.
 */
export declare function inputTextDiagnostic(text: string): string | undefined;
/** Literal import only: never normalize Unicode, trim, collapse or expand tabs. */
export declare function literalLineEndings(text: string): string;
/** Display-only UTF-16 diagnostics, bounded independently of authored content. */
export declare function invisibleCharacterSummary(text: string): string;
