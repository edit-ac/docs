import type { EngineHandle } from '@edit-ac/core';
import { type ExtensionTransferRegistry } from '@edit-ac/core/extensions';
import type { ClipboardCodec } from '../clipboard/fragment.js';
import type { ContentFactory, ContentContext } from './content.js';
/** Present already admitted atom fallback runs without interpreting their data.
 * Descriptor metadata and unknown module attributes stay inert. */
export declare function renderContentRuns(element: HTMLElement, node: ContentContext['node']): void;
/** Trusted codecs prepare data only. ClipboardInput retains selection, authority,
 * atomic commit and persistence ownership, including after deferred preparation. */
export declare function extensionClipboardCodec(registry: ExtensionTransferRegistry, engine: EngineHandle): ClipboardCodec;
/** Unknown/disabled extension envelopes are readable without running their codec.
 * The complete recovery envelope stays in the owning engine content tuple. */
export declare const extensionSourcePresenter: ContentFactory;
