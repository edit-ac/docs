import type { DocumentIdentity, StableRange } from '../engine.js';
export declare const AI_VERSION: 1;
export declare const AI_PROFILE = "editac-ai-text-v1";
export declare const AI_CAPABILITIES: readonly ["ask", "fill", "continue", "rewrite", "completion"];
export type AiOperation = typeof AI_CAPABILITIES[number];
export type AiScope = 'selection' | 'passage' | 'document';
export interface AiLimits {
    requests: number;
    instructionBytes: number;
    contextBytes: number;
    outputBytes: number;
    timeoutMs: number;
}
export interface AiDescriptor {
    version: 1;
    enabled: boolean;
    capabilities: readonly AiOperation[];
    limits?: AiLimits;
}
/** Local capture only; never sent to a backend. Its owner releases existing anchors. */
export interface AiTarget {
    identity: DocumentIdentity;
    revision: number;
    range: StableRange;
}
export interface AiRequest {
    version: 1;
    requestId: string;
    operation: AiOperation;
    scope: AiScope;
    instruction: string;
    context: string;
    format: 'plain-text';
    outputBytes: number;
}
export type AiErrorCode = 'unavailable' | 'version' | 'limits' | 'capability' | 'forbidden' | 'format' | 'invalid-request' | 'quota' | 'canceled' | 'timeout' | 'transport' | 'invalid-response';
export type AiStatus = 'unavailable' | 'ready' | 'pending' | 'streaming' | 'complete' | 'canceled' | 'failed';
export interface AiUsage {
    inputTokens: number | null;
    outputTokens: number | null;
}
export type AiResponse = {
    version: 1;
    requestId: string;
    sequence: number;
} & ({
    type: 'delta';
    text: string;
} | {
    type: 'finish';
    usage: AiUsage | null;
} | {
    type: 'error';
    code: AiErrorCode;
});
export interface AiPolicy {
    allowRemote: boolean;
    protectedDocument: boolean;
}
/** Host/backend owns credentials, provider selection and propagation of this signal. */
export interface AiTransport {
    send(request: Readonly<AiRequest>, signal: AbortSignal): AsyncIterable<AiResponse>;
}
export declare class AiError extends Error {
    readonly code: AiErrorCode;
    constructor(code: AiErrorCode);
}
/** Optional per-editor admission/transport adapter; has no document or commit port.
 * A host quota reservation is mandatory. Retries/regeneration consume new slots.
 */
export declare class AiHost {
    #private;
    readonly transport?: AiTransport | undefined;
    readonly policy: () => AiPolicy;
    readonly reserve?: ((request: Readonly<AiRequest>) => boolean) | undefined;
    get used(): number;
    constructor(value: AiDescriptor | undefined, transport?: AiTransport | undefined, policy?: () => AiPolicy, reserve?: ((request: Readonly<AiRequest>) => boolean) | undefined);
    get availability(): 'ready' | 'unavailable';
    send(value: AiRequest, signal: AbortSignal): AsyncGenerator<AiResponse>;
}
