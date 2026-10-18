import type { HostAgentAccess, HostAgentService } from './contract.js';
/** The host retains this opaque target in its shared Session/EditService owner.
 * capture must prove the exact source/owner mapping; prepare must call that
 * owner's prepare_source (never import/replace the live document). Neither mutates.
 */
export interface HostMarkdownOwner<Target, Result = unknown> {
    available(access: Readonly<HostAgentAccess>): boolean;
    capture(access: Readonly<HostAgentAccess>): Promise<{
        target: Target;
        source: string;
        revision: string;
        profile: string;
        diagnostics: readonly unknown[];
    }>;
    prepare(target: Target, candidate: string, access: Readonly<HostAgentAccess>): Promise<Result>;
    /** Release retained owner handles on expiry, eviction, or disposal. */
    release(target: Target): void;
}
export declare class HostMarkdownError extends Error {
    readonly code: 'denied' | 'limit' | 'invalid' | 'expired' | 'mismatch' | 'incomplete' | 'unavailable';
    constructor(code: 'denied' | 'limit' | 'invalid' | 'expired' | 'mismatch' | 'incomplete' | 'unavailable');
}
export interface HostMarkdownLimits {
    maxSourceBytes: number;
    maxCandidateBytes: number;
    maxChunkBytes: number;
    maxChunks: number;
    maxBaselines: number;
    maxUploads: number;
    ttlMs: number;
}
export declare function markdownChecksum(value: string): Promise<string>;
export interface MarkdownBase {
    expectedRevision: string;
    sourceHash: string;
}
export interface MarkdownUpload extends MarkdownBase {
    totalBytes: number;
    checksum: string;
}
/** Optional host-side service. Access objects MUST come from current host auth,
 * including for chunk calls; upload IDs and document prose grant no authority.
 * Fixed global counts and byte bounds also cap aggregate retained memory.
 */
export declare function createHostMarkdown<Target, Result = unknown>(owner: HostMarkdownOwner<Target, Result>, options?: {
    limits?: Partial<HostMarkdownLimits>;
    now?: () => number;
}): Readonly<{
    limits: Readonly<{
        maxSourceBytes: number;
        maxCandidateBytes: number;
        maxChunkBytes: number;
        maxChunks: number;
        maxBaselines: number;
        maxUploads: number;
        ttlMs: number;
    }>;
    read(a: Readonly<HostAgentAccess>, revision?: string): Promise<{
        source: string;
        profile: string;
        revision: string;
        sourceHash: string;
        diagnostics: readonly unknown[];
        expiresAt: number;
    }>;
    prepare(a: Readonly<HostAgentAccess>, base: MarkdownBase, candidate: string): Promise<Result>;
    beginUpload(a: Readonly<HostAgentAccess>, input: MarkdownUpload): Promise<{
        uploadId: `${string}-${string}-${string}-${string}-${string}`;
        expiresAt: number;
    }>;
    appendChunk(a: Readonly<HostAgentAccess>, id: string, index: number, text: string, checksum: string): Promise<{
        receivedBytes: number;
    }>;
    finishUpload(a: Readonly<HostAgentAccess>, id: string): Promise<Result>;
    cancelUpload(a: Readonly<HostAgentAccess>, id: string): Promise<void>;
    dispose(): Promise<void>;
    services: Readonly<{
        read: HostAgentService;
        prepare: HostAgentService;
    }>;
}>;
