import { type PreparedExtensionTransfer } from '@edit-ac/core/extensions';
import type { PrepareRequest, Patch } from '@edit-ac/core';
import type { ModuleEvent, ModuleRuntime, ModuleScope, ModuleViewContent } from './runtime.js';
import type { ExtensionCommandHost, ExtensionCommandResult } from './conformance.js';
export declare const PRESENTER_API_VERSION: 1;
export declare const PRESENTER_HOSTS: readonly ["browser", "terminal", "swift-ios", "kotlin-android", "desktop"];
export type PresenterHost = typeof PRESENTER_HOSTS[number];
/** Capability records describe host obligations, not renderer/device qualification. */
export interface PresenterCapabilitiesV1 {
    readonly version: 1;
    readonly host: PresenterHost;
    readonly focus: 'dom' | 'terminal' | 'native' | 'desktop';
    readonly composition: 'host-temporary';
    readonly selection: 'engine-stable-utf16';
    readonly accessibility: 'semantic-label-actions';
    readonly clipboard: 'host-granted';
    readonly source: 'inert-markdown-fallback';
    readonly patches: 'module-runtime';
    readonly cancellation: 'abort-stale';
    readonly disposal: 'idempotent';
    readonly theme: 'host-owned';
}
export declare const PRESENTER_CAPABILITIES: Readonly<Record<PresenterHost, PresenterCapabilitiesV1>>;
export interface PresenterInputV1 {
    readonly version: 1;
    readonly nodeId: string;
    readonly sourceId: string;
    readonly content: ModuleViewContent;
    readonly selection: Patch['selection'];
    readonly readOnly: boolean;
    readonly theme: string;
    readonly capabilities: PresenterCapabilitiesV1;
}
export type PresenterUpdateV1 = {
    readonly input: PresenterInputV1;
    readonly event: ModuleEvent | null;
};
export interface PresenterFocusV1 {
    readonly owner: 'editor' | 'presenter' | 'nested-control';
    readonly restore: boolean;
}
/** Preedit text stays in the host control. Only an explicit subsequent command can commit it. */
export type PresenterInputEventV1 = {
    readonly type: 'composition-start' | 'composition-update' | 'composition-end' | 'composition-cancel' | 'text';
    readonly text: string;
};
export interface PresenterAccessibilityV1 {
    readonly label: string;
    readonly actions: readonly string[];
    readonly readOnly: boolean;
}
export interface PresenterRepresentationV1 {
    readonly mime: 'text/plain' | 'text/markdown';
    readonly text: string;
    readonly fallback: boolean;
}
export interface PresenterAdapterV1 {
    readonly host: PresenterHost;
    update(update: PresenterUpdateV1): void;
    focus(focus: PresenterFocusV1): void;
    input(event: PresenterInputEventV1): void;
    accessibility(): PresenterAccessibilityV1;
    representation(mime: PresenterRepresentationV1['mime']): PresenterRepresentationV1;
    cancel(): void;
    dispose(): void;
}
/** Complete host coverage is an explicit conformance precondition. */
export declare function validatePresenterAdapters(adapters: readonly PresenterAdapterV1[]): void;
/** Per-view host resource, over existing filtered runtime and prepared commands.
 * Snapshot callbacks and adapters run after engine transactions. No semantic store,
 * direct engine mutation, OS clipboard, resolver or asset transport is owned here. */
export declare class ExtensionPresenterSession {
    #private;
    private readonly adapter;
    private readonly snapshot;
    private readonly host;
    constructor(runtime: ModuleRuntime, adapter: PresenterAdapterV1, snapshot: () => PresenterInputV1, host: ExtensionCommandHost, scope: ModuleScope);
    get active(): boolean;
    update(): void;
    focus(focus: PresenterFocusV1): void;
    input(event: PresenterInputEventV1): void;
    accessibility(): PresenterAccessibilityV1;
    representation(mime: PresenterRepresentationV1['mime']): PresenterRepresentationV1;
    run(prepare: (signal: AbortSignal) => PrepareRequest | undefined | Promise<PrepareRequest | undefined>): Promise<ExtensionCommandResult>;
    /** All hosts use identical formatted/literal policy and atomic prepared edits.
     * A prepared offer owns inert data, not source-view resources or clipboard authority. */
    transfer(prepared: PreparedExtensionTransfer, engine: import('@edit-ac/core').EngineHandle, range: import('@edit-ac/core').StableRange, origin?: string): Promise<ExtensionCommandResult>;
    cut(prepared: PreparedExtensionTransfer, engine: import('@edit-ac/core').EngineHandle, range: import('@edit-ac/core').StableRange, write: (offer: PreparedExtensionTransfer['recovery'], signal: AbortSignal) => Promise<boolean>): Promise<ExtensionCommandResult>;
    cancel(): void;
    dispose(): void;
}
