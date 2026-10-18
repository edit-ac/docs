/** Browser hints describe host intent; they never report keyboard visibility or
 * change committed text/Enter semantics. Updates wait for native composition. */
export interface InputHints {
    profile: 'prose' | 'code' | 'search';
    enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    lang?: string;
    dir?: 'ltr' | 'rtl' | 'auto';
}
export declare class InputHintController {
    #private;
    readonly root: HTMLElement;
    constructor(root: HTMLElement);
    set(hints: InputHints): void;
    dispose(): void;
}
