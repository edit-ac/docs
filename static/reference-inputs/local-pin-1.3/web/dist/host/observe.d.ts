import type { HostAgentAccess, HostAgentService } from './contract.js';
/** Reads the shared owner's current revision under current host authorization.
 * This is metadata only: it neither exports content nor releases sync bytes. */
export interface HostObserveOwner {
    available(access: Readonly<HostAgentAccess>): boolean;
    revision(access: Readonly<HostAgentAccess>): Promise<string>;
}
export interface HostObservation {
    revision: string;
    cursor: string;
    changed: boolean;
    resyncRequired: boolean;
    dataChannel: 'collaboration';
    durability: 'not-reported';
}
export declare function createHostObserve(owner: HostObserveOwner): HostAgentService;
