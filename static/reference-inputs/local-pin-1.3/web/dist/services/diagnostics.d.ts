/** Opt-in support export. Never serialize provider results, scope, errors or requests.
 * Recovery actions are host guidance, not automatic retries or semantic mutations. */
import type { ServiceLifecycle, ServiceRequest, ServiceResult } from './lifecycle.js';
export type DiagnosticSource = 'resolver' | 'converter' | 'host';
export type RecoveryAction = 'none' | 'reduce-input' | 'wait-capacity' | 'stop' | 'retry-bounded' | 'refresh-derived' | 'reopen-session' | 'reauthorize';
export interface DiagnosticFailure {
    readonly code: string;
    readonly recovery: RecoveryAction;
}
/** Return owned literal strings even when an untyped host supplies an arbitrary value. */
export declare function serviceDiagnostic(status: unknown): DiagnosticFailure;
export declare const DIAGNOSTIC_LIMITS: Readonly<{
    events: 64;
    elapsedMs: 86400000;
    count: 4096;
}>;
export declare class SupportDiagnostics {
    private readonly events;
    private next;
    private dropped;
    record(source: DiagnosticSource, status: unknown, elapsedMs?: number, state?: Readonly<{
        active: number;
        queued: number;
        disposed: boolean;
    }>): number;
    export(): string;
}
/** Actual lifecycle admission/cancellation/revalidation remains authoritative. The wrapper
 * returns the exact derived result to its caller; only allowlisted metadata enters support. */
export declare function runWithDiagnostics<T>(log: SupportDiagnostics, source: DiagnosticSource, service: ServiceLifecycle, request: ServiceRequest, provider: (signal: AbortSignal) => T | Promise<T>, now?: () => number): Promise<ServiceResult<T>>;
