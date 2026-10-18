import type { HostAgentAccess } from './contract.js';
import type { HostMarkdownLimits, HostMarkdownOwner } from './markdown.js';
/** Presentation from editac-diff; neither model is an executable edit. */
export interface HostChangeModel {
    version: 'editac-change-model-v1';
    input: Readonly<Record<string, unknown>>;
}
export type HostPrepareResult = {
    status: 'prepared';
    proposalId: string;
    expectedRevision: string;
    sourceHash: string;
    candidateHash: string;
    profile: string;
    preview: unknown;
    sourceDiff: HostChangeModel;
    semanticDiff: HostChangeModel;
    affectedIds: readonly string[];
} | {
    status: 'conflict';
    code: string;
    target: string | null;
    recovery: {
        base: string;
        proposed: string;
        current: unknown;
        currentRevision: string;
    };
} | {
    status: 'rejected';
    code: string;
};
/** The embedding host owns current authorization, serialized Session access and
 * opaque proposals. prepare MUST recheck actor/document/epoch, permission,
 * readonly, capability, revision and anchors at execution, retain the actual
 * immutable PreparedEdit, and derive both previews using editac-diff. A preview
 * or proposal ID grants no authority to apply. No apply service is installed.
 */
export interface HostPrepareOwner<Target> extends HostMarkdownOwner<Target, HostPrepareResult> {
    prepare(target: Target, candidate: string, access: Readonly<HostAgentAccess>): Promise<HostPrepareResult>;
}
/** Complete-candidate preparation shares the upload/baseline admission path.
 * Results are detached from owner state and bounded before returning to MCP.
 * The owner retains/releases plans under its own bounded expiry policy.
 */
export declare function createHostPrepare<Target>(owner: HostPrepareOwner<Target>, options?: {
    limits?: Partial<HostMarkdownLimits>;
    now?: () => number;
    maxResultBytes?: number;
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
    prepare(a: Readonly<HostAgentAccess>, base: import("./markdown.js").MarkdownBase, candidate: string): Promise<HostPrepareResult>;
    beginUpload(a: Readonly<HostAgentAccess>, input: import("./markdown.js").MarkdownUpload): Promise<{
        uploadId: `${string}-${string}-${string}-${string}-${string}`;
        expiresAt: number;
    }>;
    appendChunk(a: Readonly<HostAgentAccess>, id: string, index: number, text: string, checksum: string): Promise<{
        receivedBytes: number;
    }>;
    finishUpload(a: Readonly<HostAgentAccess>, id: string): Promise<HostPrepareResult>;
    cancelUpload(a: Readonly<HostAgentAccess>, id: string): Promise<void>;
    dispose(): Promise<void>;
    services: Readonly<{
        read: import("./contract.js").HostAgentService;
        prepare: import("./contract.js").HostAgentService;
    }>;
}>;
