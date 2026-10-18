import { type EmbedOptions } from './embeds/presenter.js';
import { type AttachmentOptions } from './attachments/presenter.js';
import { type ImageOptions } from './images/presenter.js';
import type { CommitResult, EngineHandle, PrepareRequest, ProjectedNode } from '@edit-ac/core';
export interface ImageMetadata {
    url: string;
    alt: string;
    title: string;
    source: string;
}
export interface ContentOptions extends ImageOptions, AttachmentOptions, EmbedOptions {
    /** Synchronous host asset policy. No URL is loaded when this port is absent. */
    imageUrl?: (metadata: Readonly<ImageMetadata>) => string | null;
    /** Host policy captured for each table action; coordinates are relative to the exact descriptor. */
    tableProtectedCells?: (node: ProjectedNode) => readonly (readonly [number, number])[];
}
export interface ContentContext {
    element: HTMLElement;
    node: ProjectedNode;
    engine: EngineHandle;
    commit: (request: PrepareRequest) => CommitResult;
    readOnly: boolean;
}
export interface ContentView {
    element: HTMLElement;
    update(node: ProjectedNode): boolean;
    setReadOnly(value: boolean): void;
    dispose(): void;
}
export type ContentFactory = (context: ContentContext) => ContentView | undefined;
/** Optional source-preserving presenters. The host supplies assets; Rust owns edits. */
export declare function contentModules(options?: ContentOptions): ContentFactory;
