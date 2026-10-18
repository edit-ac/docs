import type { LinkHostContext, LinkHostPorts } from '@edit-ac/core';
import type { ContentFactory } from '../content.js';
/** Opaque source-preserving module tuple, not executable provider markup. */
export interface EmbedDescriptor {
    url: string;
    provider: string;
    fallback: string;
    source: string;
}
export interface EmbedTemplate {
    provider: string;
    /** Host-configured HTTPS endpoint, with no query/fragment/credentials. The original
     * locator is encoded as the sole `url` query parameter. Never supplied by metadata. */
    endpoint: string;
}
export interface EmbedOptions {
    embeds?: {
        resolver: Pick<LinkHostPorts, 'publicMetadata'>;
        /** Current authenticated host scope, not document-supplied identity. */
        context(): Readonly<LinkHostContext>;
        templates: readonly EmbedTemplate[];
        timeoutMs?: number;
        concurrency?: number;
    };
}
/** Inert metadata by default; all optional work is explicit, ephemeral and bounded. */
export declare function embedPresenters(options?: EmbedOptions): ContentFactory;
