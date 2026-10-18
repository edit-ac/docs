/** Optional host-app boundary. Authentication, MCP and durable editing remain host-owned. */
export declare const HOST_AGENT_VERSION: 1;
export declare const HOST_AGENT_OPERATIONS: readonly ["read", "prepare", "apply", "receipt", "observe"];
export type HostAgentOperation = typeof HOST_AGENT_OPERATIONS[number];
export interface HostAgentAccess {
    actorId: string;
    documentId: string;
    epoch: string;
    permissions: readonly HostAgentOperation[];
    readOnly: boolean;
}
export interface HostAgentRequest {
    version: 1;
    documentId: string;
    [key: string]: unknown;
}
export interface HostAgentReceipt {
    requestId: string;
    outcome: 'committed' | 'pending' | 'unknown' | 'not-found' | 'expired' | 'rejected';
    revision: string | null;
    localDurability: 'durable' | 'pending' | 'unknown' | 'none';
    remoteDurability: 'confirmed' | 'pending' | 'unknown' | 'not-applicable';
}
export type HostAgentResult = {
    version: 1;
    status: 'ok';
    data: unknown;
} | {
    version: 1;
    status: 'error';
    code: 'invalid-request' | 'denied' | 'unavailable' | 'unknown-outcome';
};
export interface HostAgentService {
    /** Descriptive capability must be checked again by the serialized mutation owner. */
    available(access: HostAgentAccess): boolean;
    execute(request: Readonly<HostAgentRequest>, access: Readonly<HostAgentAccess>): Promise<unknown>;
}
export interface HostAgentOptions<Context> {
    /** Context comes from the embedding app's authenticated transport, never tool arguments. */
    authorize(context: Context, documentId: string): Promise<HostAgentAccess | null>;
    services: Partial<Record<HostAgentOperation, HostAgentService>>;
}
/** JSON Schema accepted by the sample app MCP; no authority-bearing input fields. */
export declare const HOST_AGENT_INPUT_SCHEMAS: {
    readonly read: {
        type: string;
        additionalProperties: boolean;
        properties: {
            version: {
                const: number;
            };
            documentId: {
                readonly type: 'string';
                readonly minLength: 1;
                readonly maxLength: 512;
            };
        };
        required: string[];
    };
    readonly prepare: {
        type: string;
        additionalProperties: boolean;
        properties: {
            version: {
                const: number;
            };
            documentId: {
                readonly type: 'string';
                readonly minLength: 1;
                readonly maxLength: 512;
            };
        };
        required: string[];
    };
    readonly apply: {
        type: string;
        additionalProperties: boolean;
        properties: {
            version: {
                const: number;
            };
            documentId: {
                readonly type: 'string';
                readonly minLength: 1;
                readonly maxLength: 512;
            };
        };
        required: string[];
    };
    readonly receipt: {
        type: string;
        additionalProperties: boolean;
        properties: {
            version: {
                const: number;
            };
            documentId: {
                readonly type: 'string';
                readonly minLength: 1;
                readonly maxLength: 512;
            };
        };
        required: string[];
    };
    readonly observe: {
        type: string;
        additionalProperties: boolean;
        properties: {
            version: {
                const: number;
            };
            documentId: {
                readonly type: 'string';
                readonly minLength: 1;
                readonly maxLength: 512;
            };
        };
        required: string[];
    };
};
export declare const HOST_AGENT_RECEIPT_SCHEMA: {
    readonly type: 'object';
    readonly additionalProperties: false;
    readonly required: readonly ["requestId", "outcome", "revision", "localDurability", "remoteDurability"];
    readonly properties: {
        readonly requestId: {
            readonly type: 'string';
            readonly minLength: 1;
            readonly maxLength: 512;
        };
        readonly outcome: {
            readonly enum: readonly ["committed", "pending", "unknown", "not-found", "expired", "rejected"];
        };
        readonly revision: {
            readonly anyOf: readonly [{
                type: 'string';
                minLength: 1;
                maxLength: 512;
                description: string;
            }, {
                readonly type: 'null';
            }];
        };
        readonly localDurability: {
            readonly enum: readonly ["durable", "pending", "unknown", "none"];
        };
        readonly remoteDurability: {
            readonly enum: readonly ["confirmed", "pending", "unknown", "not-applicable"];
        };
    };
};
/** Operation data is the shared owner's result; the adapter does not invent a second semantic model. */
export declare const HOST_AGENT_RESULT_SCHEMA: {
    readonly type: 'object';
    readonly oneOf: readonly [{
        readonly type: 'object';
        readonly additionalProperties: false;
        readonly required: readonly ["version", "status", "data"];
        readonly properties: {
            readonly version: {
                readonly const: 1;
            };
            readonly status: {
                readonly const: 'ok';
            };
            readonly data: {};
        };
    }, {
        readonly type: 'object';
        readonly additionalProperties: false;
        readonly required: readonly ["version", "status", "code"];
        readonly properties: {
            readonly version: {
                readonly const: 1;
            };
            readonly status: {
                readonly const: 'error';
            };
            readonly code: {
                readonly enum: readonly ["invalid-request", "denied", "unavailable", "unknown-outcome"];
            };
        };
    }];
};
export declare function createHostAgent<Context>(options: HostAgentOptions<Context>): Readonly<{
    capabilities(context: Context, documentId: string): Promise<readonly HostAgentOperation[]>;
    call(operation: string, input: unknown, context: Context): Promise<HostAgentResult>;
}>;
