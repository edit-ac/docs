import type { ProfileEnvironment } from '@edit-ac/core/extensions';
import type { ConfiguredExtensionV1, EditorExtensionConfigurationV1, PreparedEditorConfigurationV1 } from './contract.js';
import type { EditorSurfaceOptions } from '../surface.js';
export interface EditorFacadeOptionsV1 extends Pick<EditorExtensionConfigurationV1, 'extensions' | 'formatting' | 'collaboration' | 'platform' | 'assets'> {
    /** Actual host capabilities/permissions; fixture admission is never enabled implicitly. */
    extensionEnvironment?: ProfileEnvironment;
}
/** Small descriptors adapt existing qualified presenters; no document or dispatcher. */
export declare const DocumentSearch: import("./contract.js").ExtensionFactoryV1<Record<string, never>>;
export declare const BlockReorder: import("./contract.js").ExtensionFactoryV1<Record<string, never>>;
export interface ExtensionPresetOverridesV1 {
    extensions?: readonly ConfiguredExtensionV1[];
    remove?: readonly string[];
    overrides?: readonly ConfiguredExtensionV1[];
}
/** Inspectable Task editing defaults; network/presence are never inferred. */
export declare function defaultPreset(options?: ExtensionPresetOverridesV1): Readonly<{
    preset: "default" | "document";
    extensions: readonly ConfiguredExtensionV1<Record<string, import("@edit-ac/core").Json>>[];
}>;
/** Qualified local document tools; host services remain explicit selections. */
export declare function documentPreset(options?: ExtensionPresetOverridesV1): Readonly<{
    preset: "default" | "document";
    extensions: readonly ConfiguredExtensionV1<Record<string, import("@edit-ac/core").Json>>[];
}>;
export declare function configuredEngineAsset(assetUrl: string, prepared?: PreparedEditorConfigurationV1): string;
export declare function prepareSurfaceConfiguration(options: EditorSurfaceOptions, schema: string): PreparedEditorConfigurationV1 | undefined;
/** Called once per attachment, outside input dispatch. */
export declare function configuredSurfaceOptions(options: EditorSurfaceOptions, prepared?: PreparedEditorConfigurationV1): EditorSurfaceOptions;
