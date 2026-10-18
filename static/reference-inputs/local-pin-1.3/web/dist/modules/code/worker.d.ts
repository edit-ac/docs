import type { HighlightWorkerPort } from './scheduler.js';
export interface HighlightBackend {
    project(input: string): string;
    dispose(): void;
    free(): void;
}
export interface HighlightWorkerScope {
    onmessage: ((event: {
        data: unknown;
    }) => void) | null;
    postMessage(value: unknown): void;
}
/** Host-owned optional URLs. No worker, grammar load or request occurs at import. */
export declare function createHighlightWorker(workerUrl: URL, backendModuleUrl: URL): HighlightWorkerPort;
/** Same adapter runs in the browser integration and deterministic fault harness. */
export declare function installHighlightWorker(scope: HighlightWorkerScope, load?: (url: string) => Promise<HighlightBackend>, now?: () => number): () => void;
