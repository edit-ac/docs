/** Optional derived appearance only: no document, persistence or input handles. */
export declare const HIGHLIGHT_BACKEND = "syntect-5.3.0/fancy/two-face-0.5.2+bat-0.26.1/newlines";
export interface HighlightInput {
    readonly block: string;
    readonly revision: number;
    readonly source: string;
    readonly language: string;
    readonly grammar: string;
    readonly query: string;
    readonly theme: string;
    readonly enabled: boolean;
}
export interface HighlightSpan {
    readonly start: number;
    readonly end: number;
    readonly scopes: readonly string[];
}
export interface HighlightTiming {
    startup: number;
    transfer: number;
    work: number;
    application: number;
}
export interface HighlightResult {
    readonly input: HighlightInput;
    readonly status: string;
    readonly spans: readonly HighlightSpan[];
    readonly timing: HighlightTiming;
}
export interface HighlightWorkerPort {
    postMessage(value: unknown): void;
    terminate(): void;
    onmessage: ((event: {
        data: unknown;
    }) => void) | null;
    onerror: ((event: unknown) => void) | null;
}
export interface HighlightClock {
    now(): number;
    setTimeout(fn: () => void, ms: number): unknown;
    clearTimeout(id: unknown): void;
}
export interface HighlightSchedulerOptions {
    createWorker: () => HighlightWorkerPort;
    maxPending?: number;
    timeoutMs?: number;
    clock?: HighlightClock;
    /** Called only for an admitted current projection/fallback. Never for obsolete work. */
    apply?: (result: HighlightResult) => void;
}
export declare function validHighlightInput(input: HighlightInput): boolean;
export declare function sameHighlightInput(a: HighlightInput, b: unknown): boolean;
/** Validate even worker output; a bad/foreign result must never reach presentation. */
export declare function validHighlightProjection(input: HighlightInput, value: unknown): value is {
    status: string;
    spans: HighlightSpan[];
};
/** One active worker job + a bounded, latest-per-block queue. Timeout also kills
 * a worker stuck inside a non-preemptible regex; late messages cannot revive it. */
export declare class HighlightScheduler {
    private readonly options;
    private readonly clock;
    private readonly cap;
    private readonly timeout;
    private worker;
    private timer;
    private bootStarted;
    private bootMs;
    private awaitingReady;
    private active;
    private readonly pending;
    private serial;
    private disposed;
    constructor(options: HighlightSchedulerOptions);
    request(value: HighlightInput): Promise<HighlightResult>;
    cancel(block: string): void;
    get state(): {
        pending: number;
        active: number;
        workers: number;
        disposed: boolean;
    };
    dispose(): void;
    private finish;
    private resetWorker;
    private pump;
    private fail;
    private receive;
}
