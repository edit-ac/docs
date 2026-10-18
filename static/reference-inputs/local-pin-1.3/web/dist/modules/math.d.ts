import type { Json } from '@edit-ac/core';
import type { ModuleDefinition } from './registry.js';
import type { ModuleRenderer } from './runtime.js';
/** Existing portable inline-atom envelope; invalid LaTeX is retained as source. */
export declare const mathModuleDefinition: ModuleDefinition;
export declare function mathAtom(latex: string, display?: boolean): {
    text: string;
    attributes: Record<string, Json>;
};
/** Optional renderer: mount triggers one local lazy import; disposal/updates
 * invalidate pending results. Source is adapter-owned and always remains visible. */
export declare function mathRenderer(): ModuleRenderer;
