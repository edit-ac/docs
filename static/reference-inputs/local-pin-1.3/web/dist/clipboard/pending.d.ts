import type { ClipboardOutcome } from './fragment.js';
/** An owned preparation job. Source is kept after cancellation/rejection so a
 * host can offer recovery. Scheduling never owns or mutates document content. */
export declare class PendingPaste {
    #private;
    readonly source: Readonly<Record<string, string>>;
    readonly result: Promise<ClipboardOutcome>;
    state: 'pending' | 'applying' | 'committed' | 'rejected' | 'canceled';
    readonly timings: {
        capturedBytes: number;
        preparationMs: number;
        applyMs: number;
        elapsedMs: number;
    };
    constructor(document: Document, source: Record<string, string>, run: (job: PendingPaste) => Promise<ClipboardOutcome>, release: () => void);
    get active(): boolean;
    beginApply(): boolean;
    cancel(): void;
}
