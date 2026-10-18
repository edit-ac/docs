import type { ProfileFeature, ProfileEnvironment, PreparedProfile, ModuleDefinition } from '@edit-ac/core/extensions';
import type { Json, PatchSubscription, PrepareRequest, CommitResult, StableRange } from '@edit-ac/core';
import type { ModuleScope, ModuleEvent } from '../modules/runtime.js';
import type { AttachSyncOptions } from '../editor.js';
/** Admission-only API. Mount/configuration execution is delivered separately. */
export declare const EXTENSION_DX_VERSION: 1;
export type ExtensionReadonlyV1<T> = T extends (...args: never[]) => unknown ? T : T extends readonly (infer Item)[] ? readonly ExtensionReadonlyV1<Item>[] : T extends object ? {
    readonly [Key in keyof T]: ExtensionReadonlyV1<T[Key]>;
} : T;
export type ExtensionLoadPolicyV1 = 'required-input' | 'command-lazy' | 'presentation-lazy';
export type ExtensionStatusV1 = {
    readonly state: 'unavailable' | 'idle' | 'loading' | 'ready' | 'cancelled';
    readonly generation: number;
} | {
    readonly state: 'failed';
    readonly generation: number;
    readonly code: string;
    readonly retryable: boolean;
};
export type ExtensionSemanticsV1 = {
    readonly kind: 'behavior';
} | {
    readonly kind: 'data';
    readonly definition: ModuleDefinition;
};
/** Sources and UTF-16 ranges retain ModuleRuntime semantics; no new dispatcher. */
export type ExtensionInterestV1 = ModuleScope;
export interface ExtensionCallbackContextV1 {
    readonly signal: AbortSignal;
    readonly generation: number;
    /** Trusted host callbacks receive current prepared ports, never a writable replica. */
    readonly can: (request: PrepareRequest) => boolean;
    readonly commit: (request: PrepareRequest) => CommitResult;
    readonly captureCommand: (name: string, target?: StableRange) => import('../commands/catalog.js').CapturedCommand | undefined;
    readonly subscribe: (scope: ExtensionInterestV1, callback: (event: ModuleEvent) => void) => PatchSubscription;
}
export interface ExtensionAuthoringV1<Options> {
    readonly onAttach?: (options: ExtensionReadonlyV1<Options>, context: ExtensionCallbackContextV1) => void | (() => void);
    readonly onPatch?: (event: ModuleEvent, context: ExtensionCallbackContextV1) => void;
}
export interface ExtensionDefinitionV1<Options extends Record<string, Json>> {
    readonly apiVersion: 1;
    readonly feature: ProfileFeature;
    readonly semantics: ExtensionSemanticsV1;
    readonly defaults: Options;
    /** Pure host option validator; false becomes an extension/option diagnostic. */
    readonly validateOptions: (options: ExtensionReadonlyV1<Options>) => boolean;
    readonly loading: ExtensionLoadPolicyV1;
    /** Empty means no input/selection callbacks; omitted operations never mean all. */
    readonly interests: readonly ExtensionInterestV1[];
}
export interface ConfiguredExtensionV1<Options extends Record<string, Json> = Record<string, Json>> {
    readonly apiVersion: 1;
    readonly feature: ExtensionReadonlyV1<ProfileFeature>;
    readonly options: ExtensionReadonlyV1<Options>;
    readonly semantics: ExtensionReadonlyV1<ExtensionSemanticsV1>;
    readonly loading: ExtensionLoadPolicyV1;
    readonly interests: readonly ExtensionInterestV1[];
}
export interface ExtensionFactoryV1<Options extends Record<string, Json>> {
    readonly name: string;
    readonly version: number;
    configure(options?: Partial<Options>): ConfiguredExtensionV1<Options>;
}
export type CoreFormattingMarkV1 = 'bold' | 'italic' | 'strike' | 'underline' | 'code' | 'link';
export interface CoreFormattingV1 {
    /** Omitted fields retain legacy offered controls; commands false requires both UI switches false. */
    readonly marks?: Partial<Record<CoreFormattingMarkV1, {
        readonly commands?: boolean;
        readonly shortcuts?: boolean;
        readonly controls?: boolean;
    }>>;
}
export interface PresenceConfigurationV1 {
    readonly awareness: boolean;
    readonly peerCarets: boolean;
}
export interface CollaborationConfigurationV1 {
    /** Only an explicit remote gate may delay ready; local is always the default. */
    readonly readiness?: 'local' | 'remote';
    readonly connect: (context: {
        readonly signal: AbortSignal;
        readonly generation: number;
    }) => AttachSyncOptions | Promise<AttachSyncOptions>;
    readonly presence?: PresenceConfigurationV1;
}
export interface PlatformPreferencesV1 {
    readonly spellcheck?: 'platform' | 'off' | 'custom';
    readonly autocorrection?: 'inherit' | 'on' | 'off';
    readonly locale?: string;
}
export interface PlatformObservationV1 {
    readonly requested: PlatformPreferencesV1;
    readonly observed: 'unknown' | 'supported' | 'unsupported' | 'coupled';
}
export type ExtensionAssetsV1 = {
    readonly baseURL: string;
    readonly manifest?: never;
} | {
    readonly baseURL?: never;
    readonly manifest: Readonly<Record<string, string>>;
};
export interface EditorExtensionConfigurationV1 {
    readonly apiVersion: 1;
    readonly extensions: readonly ConfiguredExtensionV1[];
    readonly formatting?: CoreFormattingV1;
    readonly collaboration?: false | CollaborationConfigurationV1;
    readonly platform?: PlatformPreferencesV1;
    readonly assets?: ExtensionAssetsV1;
    /** Convenience only: callers expand inspectable lists; task/minimal remain legacy SDK names. */
    readonly preset?: 'default' | 'document';
    /** Mixing facade configuration and old assembly fails; no silent precedence. */
    readonly legacy?: Readonly<Partial<Record<'modules' | 'moduleRuntime' | 'markdown' | 'content' | 'codeHighlight' | 'references' | 'links' | 'slash' | 'reorder' | 'typingShortcuts' | 'preset', unknown>>>;
}
export interface PreparedEditorConfigurationV1 {
    readonly apiVersion: 1;
    readonly profile: PreparedProfile;
    readonly configuration: ExtensionReadonlyV1<Omit<EditorExtensionConfigurationV1, 'legacy'>>;
    readonly extensions: readonly ConfiguredExtensionV1[];
    readonly requiredReady: readonly string[];
    readonly localReadyWithoutProvider: boolean;
}
export declare class ExtensionConfigurationError extends Error {
    readonly code: string;
    readonly extension: string;
    readonly option: string;
    readonly remedy: string;
    constructor(code: string, extension: string, option: string, remedy: string);
}
/** Freeze small metadata/options only. This function neither loads nor attaches anything. */
export declare function defineExtensionContract<Options extends Record<string, Json>>(definition: ExtensionDefinitionV1<Options>): ExtensionFactoryV1<Options>;
/** Admission happens once, before reserve/recovery/attachment. Execution stays in existing owners. */
export declare function prepareEditorExtensionConfiguration(input: EditorExtensionConfigurationV1, environment: ProfileEnvironment): PreparedEditorConfigurationV1;
