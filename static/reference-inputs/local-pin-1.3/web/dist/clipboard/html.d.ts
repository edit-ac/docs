import type { EngineHandle, FragmentBlock } from '@edit-ac/core';
/** Inert HTML5 tokenization only. Rust owns the whitelist and semantic mapping. */
export declare function importHTML(document: Document, raw: string, engine: EngineHandle, diagnose: (code: string) => void): readonly FragmentBlock[];
export declare function exportHTML(blocks: readonly FragmentBlock[]): string;
