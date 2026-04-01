import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export type BlockIndex64 = bigint;
export interface BlockRange { 'start' : BlockIndex64, 'length' : bigint }
export interface FeeCollectorRanges {
  'fee_collector' : [] | [Account],
  'ranges' : Array<BlockRange>,
}
export interface GetAccountTransactionsArgs {
  'max_results' : bigint,
  'start' : [] | [BlockIndex64],
  'account' : Account,
}
export interface GetAccountTransactionsError { 'message' : string }
export interface GetAccountTransactionsResponse {
  'balance' : Tokens,
  'transactions' : Array<TransactionWithId>,
  'oldest_tx_id' : [] | [BlockIndex64],
}
export type GetBlocksMethod = { 'ICRC3GetBlocks' : null } |
  { 'GetBlocks' : null };
export interface GetBlocksRequest { 'start' : bigint, 'length' : bigint }
export interface GetBlocksResponse {
  'blocks' : Array<Value>,
  'chain_length' : bigint,
}
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<HeaderField>,
  'status_code' : number,
}
export interface ICRCIndex {
  /**
   * / Get cycles balance
   */
  'cycles' : ActorMethod<[], bigint>,
  /**
   * / Get transactions for an account
   */
  'get_account_transactions' : ActorMethod<
    [GetAccountTransactionsArgs],
    Result
  >,
  /**
   * / Get blocks from the index
   */
  'get_blocks' : ActorMethod<[GetBlocksRequest], GetBlocksResponse>,
  /**
   * / Get fee collector ranges
   */
  'get_fee_collectors_ranges' : ActorMethod<[], FeeCollectorRanges>,
  /**
   * / Get ICRC-85 statistics
   */
  'get_icrc85_stats' : ActorMethod<
    [],
    {
      'activeActions' : bigint,
      'nextCycleActionId' : [] | [bigint],
      'lastActionReported' : [] | [bigint],
    }
  >,
  /**
   * / Get the oldest transaction ID for an account
   */
  'get_oldest_tx_id' : ActorMethod<[Account], [] | [bigint]>,
  /**
   * / Get comprehensive statistics about the index canister
   */
  'get_stats' : ActorMethod<[], Stats>,
  /**
   * / Handle HTTP requests (metrics, logs)
   */
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  /**
   * / Get the balance of an account (mirrors icrc1_balance_of)
   */
  'icrc1_balance_of' : ActorMethod<[Account], bigint>,
  /**
   * / Get the principal of the ledger being indexed
   */
  'ledger_id' : ActorMethod<[], Principal>,
  /**
   * / List subaccounts for a principal
   */
  'list_subaccounts' : ActorMethod<[ListSubaccountsArgs], Array<Subaccount>>,
  /**
   * / Notify the index of new blocks available on the ledger
   * / Only the ledger (token canister) can call this method
   */
  'notify' : ActorMethod<[bigint], undefined>,
  /**
   * / Get the current status of the index
   */
  'status' : ActorMethod<[], Status>,
}
export type IndexArg = { 'Upgrade' : UpgradeArg } |
  { 'Init' : InitArg };
export interface InitArg {
  'ledger_id' : Principal,
  'retrieve_blocks_from_ledger_interval_seconds' : [] | [bigint],
  'icrc85_collector' : [] | [Principal],
}
export interface ListSubaccountsArgs {
  'owner' : Principal,
  'start' : [] | [Subaccount],
}
export type Result = { 'ok' : GetAccountTransactionsResponse } |
  { 'err' : GetAccountTransactionsError };
export interface Stats {
  'get_blocks_method' : [] | [GetBlocksMethod],
  'cycles_balance' : bigint,
  'sync_interval_seconds' : bigint,
  'log_entries' : bigint,
  'ledger_id' : Principal,
  'fee_collector' : [] | [Account],
  'is_syncing' : boolean,
  'heap_memory' : bigint,
  'fee_collector_ranges' : bigint,
  'num_accounts' : bigint,
  'num_blocks_synced' : bigint,
}
export interface Status { 'num_blocks_synced' : BlockIndex64 }
export type Subaccount = Uint8Array | number[];
export type Tokens = bigint;
export interface TransactionWithId {
  'id' : BlockIndex64,
  'transaction' : Value,
}
export interface UpgradeArg {
  'ledger_id' : [] | [Principal],
  'retrieve_blocks_from_ledger_interval_seconds' : [] | [bigint],
  'icrc85_collector' : [] | [Principal],
}
export type Value = { 'Int' : bigint } |
  { 'Map' : Array<[string, Value]> } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<Value> };
export interface _SERVICE extends ICRCIndex {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
