import type { ServiceScope, ServiceFailure } from '@edit-ac/core';
export { validServiceScope, serviceScopeFailure } from '@edit-ac/core';
export type { ServiceScope, ServiceFailure } from '@edit-ac/core';
export type ServiceResult<T> = {
    status: 'ready';
    value: T;
    scope: Readonly<ServiceScope>;
} | {
    status: ServiceFailure;
};
export interface ServiceLimits {
    concurrency: number;
    queue: number;
    bytes: number;
    items: number;
    deadlineMs: number;
}
export interface ServiceRequest {
    scope: Readonly<ServiceScope>;
    bytes: number;
    items: number;
    deadline: number;
    signal: AbortSignal;
}
/** Injected by deterministic checks; production uses one timer per admitted operation. */
export interface ServiceClock {
    now(): number;
    schedule(callback: () => void, delay: number): () => void;
}
/** Bounded FIFO. Cancellation settles the caller, but an uncooperative provider
 * keeps its occupied slot until it actually finishes. No replacement stampede. */
export declare class ServiceLifecycle {
    private readonly context;
    private readonly time;
    private readonly queue;
    private readonly active;
    private disposed;
    readonly limits: Readonly<ServiceLimits>;
    constructor(context: () => Readonly<ServiceScope>, limits: ServiceLimits, time?: ServiceClock);
    get state(): Readonly<{
        active: number;
        queued: number;
        disposed: boolean;
    }>;
    check(scope: Readonly<ServiceScope>): ServiceFailure | undefined;
    private failure;
    run<T>(request: ServiceRequest, provider: (signal: AbortSignal) => T | Promise<T>): Promise<ServiceResult<T>>;
    private drain;
    /** Host notification invalidates pending work; silent changes are rechecked at completion. */
    revalidate(): void;
    cancel(): void;
    dispose(): void;
}
