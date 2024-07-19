import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Broadcaster {
  'broadcast' : ActorMethod<
    [string, Array<[string, bigint]>, bigint],
    ShareResult
  >,
}
export type ShareCycleError = { 'NotEnoughCycles' : [bigint, bigint] } |
  { 'CustomError' : { 'code' : bigint, 'message' : string } };
export type ShareResult = { 'Ok' : bigint } |
  { 'Err' : ShareCycleError };
export interface _SERVICE extends Broadcaster {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
