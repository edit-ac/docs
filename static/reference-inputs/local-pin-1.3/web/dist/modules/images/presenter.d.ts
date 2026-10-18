import type { ContentContext, ContentView, ImageMetadata } from '../content.js';
import { type ImageLimits } from './policy.js';
/** Mirrors the owning Rust assets records; descriptive metadata never grants access. */
export interface ImageAssetIdentity {
    host: string;
    key: string;
}
export interface ImageAssetDescriptor {
    identity: ImageAssetIdentity;
    kind: 'image';
    metadata: {
        alt: string;
        caption: string;
        filename: string;
        mediaType: string;
        byteLength: number | null;
        sha256: string | null;
        width: number | null;
        height: number | null;
        durationMs: number | null;
    };
    fallback: string;
    source: string;
}
export type ImageAvailability = 'local' | 'queued' | 'available' | 'failed' | 'missing' | 'revoked' | 'locked' | 'offline';
export interface ImageAssetRequest {
    version: 1;
    operationId: string;
    identity: ImageAssetIdentity;
    action: 'resolve-url';
    byteLimit: number;
}
export interface ImageAssetResolution {
    state: ImageAvailability;
    grant?: {
        identity: ImageAssetIdentity;
        actions: readonly string[];
    };
    resolution?: {
        identity: ImageAssetIdentity;
        operationId: string;
        url: string;
    };
}
export interface ImageAssetPort {
    /** Must reauthorize this exact reference. No ambient credentials or automatic retries. */
    resolve(request: Readonly<ImageAssetRequest>, signal: AbortSignal): Promise<ImageAssetResolution>;
    /** Read cancellation only. Host retains recovery bytes and global binary/refcount ownership. */
    cancel?(request: Readonly<ImageAssetRequest>): void;
}
export interface ImageOptions {
    imageUrl?: (metadata: Readonly<ImageMetadata>) => string | null;
    imageAssets?: ImageAssetPort;
    imageLimits?: Partial<ImageLimits>;
}
type Descriptor = ImageMetadata | ImageAssetDescriptor;
export declare function imageDescriptor(node: ContentContext['node']): Descriptor | undefined;
/** One bounded pool per configured content factory. No pending queue or polling. */
export declare function imagePresenters(options: ImageOptions): (context: ContentContext) => ContentView | undefined;
export {};
