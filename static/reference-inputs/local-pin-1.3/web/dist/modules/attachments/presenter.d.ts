import type { ContentFactory } from '../content.js';
import type { ImageAssetDescriptor, ImageAssetIdentity } from '../images/presenter.js';
/** Same descriptor and action vocabulary as editac_core::modules::assets. */
export type AttachmentDescriptor = Omit<ImageAssetDescriptor, 'kind'> & {
    kind: 'file';
};
export type AttachmentState = 'local' | 'queued' | 'available' | 'failed' | 'missing' | 'revoked' | 'locked' | 'offline' | 'forbidden';
export type AttachmentAction = 'open' | 'download';
export interface AttachmentRequest {
    version: 1;
    operationId: string;
    identity: ImageAssetIdentity;
    action: AttachmentAction;
    byteLimit: number;
}
export interface AttachmentAuthorization {
    identity: ImageAssetIdentity;
    state: AttachmentState;
    actions: readonly AttachmentAction[];
}
export interface AttachmentResult {
    identity: ImageAssetIdentity;
    operationId: string;
    action: AttachmentAction;
    state: 'completed' | 'offline' | 'forbidden' | 'locked' | 'failed';
}
export interface AttachmentPort {
    /** Local cached observation only. Rendering must never initiate host network work. */
    observe?(identity: Readonly<ImageAssetIdentity>): {
        identity: ImageAssetIdentity;
        state: AttachmentState;
    };
    /** Fresh authority for this explicit operation, never inferred from metadata. */
    authorize(request: Readonly<AttachmentRequest>, signal: AbortSignal): Promise<AttachmentAuthorization>;
    /** Host rechecks authority at effect time. Open/download never implies shell execution.
     * Bytes/URLs, safe OS opening, optional PDF preview and refcounts remain host-owned.
     * Honor signal; do not retry automatically or return temporary URLs to the document. */
    execute(request: Readonly<AttachmentRequest>, signal: AbortSignal): Promise<AttachmentResult>;
    cancel?(request: Readonly<AttachmentRequest>): void;
}
export interface AttachmentOptions {
    attachments?: AttachmentPort;
    attachmentLimits?: {
        byteLimit?: number;
        timeoutMs?: number;
        concurrency?: number;
    };
}
export interface AttachmentClipboard {
    version: 1;
    descriptor: AttachmentDescriptor;
    binaryAvailable: false;
}
export declare const ATTACHMENT_CLIPBOARD_MIME = "application/vnd.editac.attachment+json";
/** Portable clipboard record contains stable data only; no grant, URL or binary claim. */
export declare function attachmentClipboard(value: AttachmentDescriptor): AttachmentClipboard;
/** Optional inert file rendering. Only explicit activation contacts the host. */
export declare function attachmentPresenters(options?: AttachmentOptions): ContentFactory;
