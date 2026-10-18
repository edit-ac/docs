import type { DocumentIdentity } from '@edit-ac/core';
import type { LocalCommit } from './storage/journal.js';
export interface EditorState {
    phase: 'visible' | 'ready' | 'failed' | 'closing' | 'destroyed';
    visible: boolean;
    ready: boolean;
    readOnly: boolean;
    preview: 'none' | 'matched' | 'replaced';
    localCommitted: LocalCommit | null;
    error: unknown;
}
export interface PreviewTag {
    identity: DocumentIdentity;
    revision: number;
}
/** Preview visibility never confers input authority. All observer notifications
 * are scoped to this editor and occur after their corresponding state transition. */
export declare class BrowserLifecycle {
    #private;
    readonly observerErrors: unknown[];
    constructor(visible: boolean, readOnly: boolean);
    get state(): EditorState;
    subscribe(listener: (state: EditorState) => void): () => void;
    update(change: Partial<EditorState>): void;
    dispose(): void;
}
export declare function previewMatches(preview: PreviewTag | undefined, identity: DocumentIdentity, revision: number): boolean;
/** A page lease only suspends disposable adapters. The existing Session/storage
 * remains the durability owner; no unload flush or BFCache guarantee is made. */
export declare class PageLifecycle {
    #private;
    private readonly change;
    constructor(root: HTMLElement, change: (suspended: boolean) => void);
    dispose(): void;
}
