import type { PlatformObservationV1, PlatformPreferencesV1 } from '../extensions/contract.js';
/** Per-surface requests, never a claim about effective browser/OS preferences. */
export declare class PlatformPreferenceController {
    #private;
    readonly root: HTMLElement;
    readonly observation: PlatformObservationV1;
    constructor(root: HTMLElement, policy?: PlatformPreferencesV1);
    dispose(): void;
}
