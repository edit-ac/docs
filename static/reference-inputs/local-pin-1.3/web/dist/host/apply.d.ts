import type { HostAgentAccess, HostAgentReceipt, HostAgentRequest, HostAgentService } from './contract.js';
/** A host implementation must use its serialized shared EditService owner. The
 * owner reauthorizes inside admission, journals request identity with update
 * bytes, and releases bytes only on the ordinary collaboration channel. A tool
 * response/notification is never a patch, history event, or remote storage ack.
 */
export interface HostApplyOwner {
    available(access: Readonly<HostAgentAccess>, operation: 'apply' | 'receipt'): boolean;
    apply(request: Readonly<HostAgentRequest>, access: Readonly<HostAgentAccess>): Promise<HostAgentReceipt>;
    receipt(request: Readonly<HostAgentRequest>, access: Readonly<HostAgentAccess>): Promise<HostAgentReceipt>;
}
/** Optional MCP mapping, with no mutation retry or duplicate semantic engine.
 * Exceptions and revocation after admission remain unknown outcomes; callers
 * recover using the same authorized durable request identity.
 */
export declare function createHostApply(owner: HostApplyOwner): {
    apply: HostAgentService;
    receipt: HostAgentService;
};
