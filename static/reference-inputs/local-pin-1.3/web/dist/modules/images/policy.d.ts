/** Static PNG/JPEG only. Never send SVG or animation to a browser decoder. */
export interface ImageLimits {
    encodedBytes: number;
    dimension: number;
    pixels: number;
    concurrency: number;
    timeoutMs: number;
}
export declare const DEFAULT_IMAGE_LIMITS: Readonly<ImageLimits>;
export declare function imageLimits(value?: Partial<ImageLimits>): Readonly<ImageLimits>;
export declare function inspectImage(bytes: Uint8Array, limits: ImageLimits): {
    type: string;
    width: number;
    height: number;
};
/** Browsers can tolerate corrupt compressed PNGs. Validate their CRC and bounded
 * inflated scanline envelope independently before invoking the image decoder.
 * This first profile admits noninterlaced 8-bit grayscale/RGB/alpha PNGs. */
export declare function validateImagePayload(bytes: Uint8Array, signal: AbortSignal): Promise<void>;
