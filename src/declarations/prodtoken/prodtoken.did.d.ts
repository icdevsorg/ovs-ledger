import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Account__7 {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface Action {
  'aSync' : [] | [bigint],
  'actionType' : string,
  'params' : Uint8Array | number[],
  'retries' : bigint,
}
export type ActionDetail = [ActionId, Action];
export interface ActionId { 'id' : bigint, 'time' : Time }
export interface AdvancedSettings {
  'existing_balances' : Array<[Account, Balance]>,
  'burned_tokens' : Balance,
  'fee_collector_emitted' : boolean,
  'minted_tokens' : Balance,
  'local_transactions' : Array<Transaction>,
  'fee_collector_block' : bigint,
}
export interface AdvancedSettings__1 {
  'existing_approvals' : Array<[[Account, Account], ApprovalInfo]>,
}
export interface Allowance {
  'allowance' : bigint,
  'expires_at' : [] | [bigint],
}
export interface AllowanceArgs { 'account' : Account, 'spender' : Account }
export interface AllowanceDetail {
  'from_account' : Account,
  'to_spender' : Account,
  'allowance' : bigint,
  'expires_at' : [] | [bigint],
}
export type AllowanceResult = { 'Ok' : Array<AllowanceDetail> } |
  { 'Err' : GetAllowancesError };
export interface ApprovalInfo {
  'from_subaccount' : [] | [Uint8Array | number[]],
  'amount' : bigint,
  'expires_at' : [] | [bigint],
  'spender' : Account,
}
export interface Approve {
  'fee' : [] | [bigint],
  'from' : Account__7,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'expected_allowance' : [] | [bigint],
  'expires_at' : [] | [bigint],
  'spender' : Account__7,
}
export interface ApproveArgs {
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'expected_allowance' : [] | [bigint],
  'expires_at' : [] | [bigint],
  'spender' : Account,
}
export type ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'AllowanceChanged' : { 'current_allowance' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'Expired' : { 'ledger_time' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type ApproveResponse = { 'Ok' : bigint } |
  { 'Err' : ApproveError };
export interface ArchivedTransactionResponse {
  'args' : Array<TransactionRange>,
  'callback' : [Principal, string],
}
export type AuthorizedRequestItem = [ListItem__2, Array<Array<List>>];
export type Balance = bigint;
export interface BalanceQueryArgs { 'accounts' : Array<Account> }
export type BalanceQueryResult = Array<bigint>;
export type BalanceResult = { 'Ok' : bigint } |
  { 'Err' : string };
export interface BlockType { 'url' : string, 'block_type' : string }
export interface Burn {
  'from' : Account,
  'memo' : [] | [Memo],
  'created_at_time' : [] | [Timestamp],
  'amount' : Balance,
}
export interface Burn__1 {
  'from' : Account__7,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'spender' : [] | [Account__7],
}
export type CandyShared = { 'Int' : bigint } |
  { 'Map' : Array<[string, CandyShared]> } |
  { 'Nat' : bigint } |
  { 'Set' : Array<CandyShared> } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Ints' : Array<bigint> } |
  { 'Nat8' : number } |
  { 'Nats' : Array<bigint> } |
  { 'Text' : string } |
  { 'Bytes' : Uint8Array | number[] } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [CandyShared] } |
  { 'Floats' : Array<number> } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  { 'Array' : Array<CandyShared> } |
  { 'ValueMap' : Array<[CandyShared, CandyShared]> } |
  { 'Class' : Array<PropertyShared> };
export interface DataCertificate {
  'certificate' : Uint8Array | number[],
  'hash_tree' : Uint8Array | number[],
}
export type DataItem = { 'Int' : bigint } |
  { 'Map' : Array<[string, CandyShared]> } |
  { 'Nat' : bigint } |
  { 'Set' : Array<CandyShared> } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Ints' : Array<bigint> } |
  { 'Nat8' : number } |
  { 'Nats' : Array<bigint> } |
  { 'Text' : string } |
  { 'Bytes' : Uint8Array | number[] } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [CandyShared] } |
  { 'Floats' : Array<number> } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  { 'Array' : Array<CandyShared> } |
  { 'ValueMap' : Array<[CandyShared, CandyShared]> } |
  { 'Class' : Array<PropertyShared> };
export type DataItemMap = Array<[string, DataItem__1]>;
export type DataItem__1 = { 'Int' : bigint } |
  { 'Map' : DataItemMap } |
  { 'Nat' : bigint } |
  { 'Set' : Array<DataItem__1> } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Ints' : Array<bigint> } |
  { 'Nat8' : number } |
  { 'Nats' : Array<bigint> } |
  { 'Text' : string } |
  { 'Bytes' : Uint8Array | number[] } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [DataItem__1] } |
  { 'Floats' : Array<number> } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  { 'Array' : Array<DataItem__1> } |
  { 'ValueMap' : Array<[DataItem__1, DataItem__1]> } |
  { 'Class' : Array<PropertyShared__1> };
export interface DepositArgs {
  'token' : Token84,
  'from' : [] | [
    { 'owner' : Principal, 'subaccount' : [] | [Uint8Array | number[]] }
  ],
  'amount' : bigint,
  'expected_fee' : [] | [bigint],
}
export interface DepositResponse { 'txid' : [] | [bigint], 'credit' : bigint }
export type Domain = Array<string>;
export interface DomainApprovalRequest {
  'domain' : Domain,
  'validationCode' : string,
}
export type DomainApprovalResponse = { 'Ok' : null } |
  {
    'Err' : { 'ValidationSuccededButTransferError' : { 'message' : string } } |
      { 'ValidationRecordNotFound' : null }
  };
export interface DomainClaimRequest {
  'controllers' : [] | [Array<Principal>],
  'domain' : Domain,
  'gateAccount' : [] | [Account],
  'validationCode' : [] | [string],
}
export type DomainClaimResponse = {
    'Ok' : { 'controllers' : Array<Principal>, 'domain' : Domain }
  } |
  {
    'Err' : { 'ValidationRecordNotApproved' : null } |
      { 'ValidationGateFailed' : null } |
      { 'Unauthorized' : null } |
      { 'ValidationRecordNotFound' : null }
  } |
  { 'RecordExists' : { 'controllers' : Array<Principal>, 'domain' : Domain } } |
  {
    'ValidationRequired' : {
      'controllers' : Array<Principal>,
      'domain' : Domain,
      'existingControllers' : [] | [Array<Principal>],
      'validation' : string,
    }
  };
export interface DomainValidationRecord {
  'controllers' : Array<Principal>,
  'domain' : Domain,
  'approved' : boolean,
  'validationTime' : bigint,
  'validation' : string,
}
export type Fee = { 'Environment' : null } |
  { 'Fixed' : bigint };
export type Fee__1 = { 'ICRC1' : null } |
  { 'Environment' : null } |
  { 'Fixed' : bigint };
export interface GetAllowancesArgs {
  'take' : [] | [bigint],
  'prev_spender' : [] | [Account],
  'from_account' : [] | [Account],
}
export type GetAllowancesError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'AccessDenied' : { 'reason' : string } };
export interface GetArchiveTransactionsResponse {
  'transactions' : Array<Transaction__1>,
}
export interface GetArchivesArgs { 'from' : [] | [Principal] }
export type GetArchivesResult = Array<GetArchivesResultItem>;
export interface GetArchivesResultItem {
  'end' : bigint,
  'canister_id' : Principal,
  'start' : bigint,
}
export type GetBlocksArgs = Array<TransactionRange>;
export interface GetBlocksRequest { 'start' : bigint, 'length' : bigint }
export interface GetBlocksResult {
  'log_length' : bigint,
  'blocks' : Array<{ 'id' : bigint, 'block' : Value__1 }>,
  'archived_blocks' : Array<ArchivedTransactionResponse>,
}
export type GetLegacyArchiveTransactionFunction = ActorMethod<
  [GetBlocksRequest],
  GetArchiveTransactionsResponse
>;
export type GetTransactionsFn = ActorMethod<
  [Array<TransactionRange>],
  GetTransactionsResult
>;
export interface GetTransactionsResponse {
  'first_index' : bigint,
  'log_length' : bigint,
  'transactions' : Array<Transaction__1>,
  'archived_transactions' : Array<LegacyArchivedRange>,
}
export interface GetTransactionsResult {
  'log_length' : bigint,
  'blocks' : Array<{ 'id' : bigint, 'block' : Value__1 }>,
  'archived_blocks' : Array<ArchivedTransactionResponse>,
}
export type ICRC16Map = Array<ICRC16MapItem>;
export type ICRC16MapItem = [string, DataItem];
export type Identity = Principal;
export type IndexType = { 'Stable' : null } |
  { 'StableTyped' : null } |
  { 'Managed' : null };
export interface InitArgs {
  'fee' : [] | [Fee],
  'advanced_settings' : [] | [AdvancedSettings],
  'max_memo' : [] | [bigint],
  'decimals' : number,
  'metadata' : [] | [Value],
  'minting_account' : [] | [Account],
  'logo' : [] | [string],
  'permitted_drift' : [] | [Timestamp],
  'name' : [] | [string],
  'settle_to_accounts' : [] | [bigint],
  'fee_collector' : [] | [Account],
  'transaction_window' : [] | [Timestamp],
  'min_burn_amount' : [] | [Balance],
  'max_supply' : [] | [Balance],
  'max_accounts' : [] | [bigint],
  'symbol' : [] | [string],
}
export interface InitArgs__1 {
  'fee' : [] | [Fee__1],
  'advanced_settings' : [] | [AdvancedSettings__1],
  'max_allowance' : [] | [MaxAllowance],
  'max_approvals' : [] | [bigint],
  'icrc103_max_take_value' : [] | [bigint],
  'cleanup_on_zero_balance' : [] | [boolean],
  'icrc103_public_allowances' : [] | [boolean],
  'max_approvals_per_account' : [] | [bigint],
  'settle_to_approvals' : [] | [bigint],
  'cleanup_interval' : [] | [bigint],
}
export interface InitArgs__2 {
  'maxRecordsToArchive' : bigint,
  'archiveIndexType' : IndexType,
  'maxArchivePages' : bigint,
  'settleToRecords' : bigint,
  'archiveCycles' : bigint,
  'maxActiveRecords' : bigint,
  'maxRecordsInArchiveInstance' : bigint,
  'archiveControllers' : [] | [[] | [Array<Principal>]],
  'supportedBlocks' : Array<BlockType>,
}
export interface InitArgs__3 {
  'fee' : [] | [Fee__1],
  'max_balances' : [] | [bigint],
  'max_transfers' : [] | [bigint],
}
export interface InitArgs__4 {
  'existingNamespaces' : [] | [Array<NamespaceRecordShared>],
  'cycleShareTimerID' : [] | [bigint],
  'certificateNonce' : [] | [bigint],
}
export interface LedgerInfoShared {
  'fee' : Fee__1,
  'max_allowance' : [] | [MaxAllowance],
  'max_approvals' : bigint,
  'icrc103_max_take_value' : bigint,
  'cleanup_on_zero_balance' : [] | [boolean],
  'icrc103_public_allowances' : boolean,
  'max_approvals_per_account' : bigint,
  'settle_to_approvals' : bigint,
  'cleanup_interval' : [] | [bigint],
}
export interface LegacyArchivedRange {
  'callback' : [Principal, string],
  'start' : bigint,
  'length' : bigint,
}
export type List = string;
export type ListItem = { 'List' : List } |
  { 'DataItem' : DataItem } |
  { 'Account' : Account } |
  { 'Identity' : Identity };
export type ListItem__2 = { 'List' : List } |
  { 'DataItem' : DataItem__1 } |
  { 'Account' : Account } |
  { 'Identity' : Identity };
export interface ListRecord { 'metadata' : [] | [DataItemMap], 'list' : List }
export type ManageListMembershipAction = {
    'Add' : [ListItem__2, [] | [DataItemMap]]
  } |
  { 'Remove' : ListItem__2 } |
  { 'Update' : [ListItem__2, MapModifier] };
export type ManageListMembershipError = { 'TooManyRequests' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string } |
  { 'Exists' : null };
export type ManageListMembershipRequest = Array<
  ManageListMembershipRequestItem
>;
export interface ManageListMembershipRequestItem {
  'action' : ManageListMembershipAction,
  'list' : List,
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [bigint],
}
export type ManageListMembershipResponse = Array<ManageListMembershipResult>;
export type ManageListMembershipResult = [] | [
  { 'Ok' : TransactionID } |
    { 'Err' : ManageListMembershipError }
];
export type ManageListPropertyError = { 'TooManyRequests' : null } |
  { 'IllegalAdmin' : null } |
  { 'IllegalPermission' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string } |
  { 'Exists' : null };
export type ManageListPropertyRequest = Array<ManageListPropertyRequestItem>;
export type ManageListPropertyRequestAction = {
    'Metadata' : { 'key' : string, 'value' : [] | [DataItem__1] }
  } |
  { 'Rename' : string } |
  {
    'ChangePermissions' : {
        'Read' : { 'Add' : ListItem__2 } |
          { 'Remove' : ListItem__2 }
      } |
      { 'Write' : { 'Add' : ListItem__2 } | { 'Remove' : ListItem__2 } } |
      { 'Admin' : { 'Add' : ListItem__2 } | { 'Remove' : ListItem__2 } } |
      { 'Permissions' : { 'Add' : ListItem__2 } | { 'Remove' : ListItem__2 } }
  } |
  { 'Delete' : null } |
  {
    'Create' : {
      'members' : Array<[ListItem__2, [] | [DataItemMap]]>,
      'admin' : [] | [ListItem__2],
      'metadata' : DataItemMap,
    }
  };
export interface ManageListPropertyRequestItem {
  'action' : ManageListPropertyRequestAction,
  'list' : List,
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [bigint],
}
export type ManageListPropertyResponse = Array<ManageListPropertyResult>;
export type ManageListPropertyResult = [] | [
  { 'Ok' : TransactionID } |
    { 'Err' : ManageListPropertyError }
];
export type ManageRequest = Array<ManageRequestItem>;
export type ManageRequestItem = { 'UpdateDefaultTake' : bigint } |
  { 'UpdatePermittedDrift' : bigint } |
  { 'UpdateTxWindow' : bigint } |
  { 'UpdateMaxTake' : bigint };
export type ManageResponse = Array<ManageResult>;
export type ManageResult = [] | [
  { 'Ok' : null } |
    { 'Err' : ManageResultError }
];
export type ManageResultError = { 'TooManyRequests' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string };
export type Map = Array<[string, Value__2]>;
export type MapModifier = [string, [] | [DataItem__1]];
export type MaxAllowance = { 'TotalSupply' : null } |
  { 'Fixed' : bigint };
export type Memo = Uint8Array | number[];
export type MetaDatum = [string, Value];
export interface Mint {
  'to' : Account,
  'memo' : [] | [Memo],
  'created_at_time' : [] | [Timestamp],
  'amount' : Balance,
}
export interface Mint__1 {
  'to' : Account__7,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}
export interface NamespaceLookupResponse {
  'balance' : bigint,
  'account' : Account,
  'namespace' : Array<string>,
}
export interface NamespaceRecordShared {
  'permissions' : PermissionList,
  'members' : Array<[ListItem, [] | [ICRC16Map]]>,
  'metadata' : ICRC16Map,
  'namespace' : string,
}
export interface NotifyResult { 'credit_inc' : bigint, 'credit' : bigint }
export type Permission = { 'Read' : null } |
  { 'Write' : null } |
  { 'Admin' : null } |
  { 'Permissions' : null };
export type PermissionList = Array<PermissionListItem>;
export type PermissionListItem = [Permission, ListItem];
export type PermissionListItem__1 = [Permission, ListItem__2];
export type PermissionList__1 = Array<PermissionListItem__1>;
export interface PropertyShared {
  'value' : CandyShared,
  'name' : string,
  'immutable' : boolean,
}
export interface PropertyShared__1 {
  'value' : DataItem__1,
  'name' : string,
  'immutable' : boolean,
}
export interface RosettaArchivedRange {
  'callback' : [Principal, string],
  'start' : bigint,
  'length' : bigint,
}
export interface RosettaBlockRange { 'blocks' : Array<Value__2> }
export interface RosettaGetBlocksResponse {
  'certificate' : [] | [Uint8Array | number[]],
  'first_index' : bigint,
  'blocks' : Array<Value__2>,
  'chain_length' : bigint,
  'archived_blocks' : Array<RosettaArchivedRange>,
}
export type ShareArgs = Array<[string, bigint]>;
export type ShareCycleError = { 'NotEnoughCycles' : [bigint, bigint] } |
  { 'CustomError' : string };
export type ShareResult = { 'Ok' : bigint } |
  { 'Err' : ShareCycleError };
export interface Stats {
  'lastIndex' : bigint,
  'localLedgerSize' : bigint,
  'constants' : {
    'archiveProperties' : {
      'maxRecordsToArchive' : bigint,
      'settleToRecords' : bigint,
      'archiveCycles' : bigint,
      'maxActiveRecords' : bigint,
      'maxRecordsInArchiveInstance' : bigint,
      'archiveControllers' : [] | [[] | [Array<Principal>]],
    },
  },
  'ledgerCanister' : Principal,
  'bCleaning' : boolean,
  'archives' : Array<[Principal, TransactionRange]>,
  'supportedBlocks' : Array<BlockType>,
  'firstIndex' : bigint,
}
export interface Stats__1 {
  'tt' : Stats__2,
  'permittedDrift' : bigint,
  'defaultTake' : bigint,
  'owner' : Principal,
  'memberIndexCount' : bigint,
  'permissionsIndexCount' : bigint,
  'cycleShareTimerID' : [] | [bigint],
  'namespaceStoreCount' : bigint,
  'maxTake' : bigint,
  'txWindow' : bigint,
}
export interface Stats__2 {
  'timers' : bigint,
  'maxExecutions' : bigint,
  'minAction' : [] | [ActionDetail],
  'cycles' : bigint,
  'nextActionId' : bigint,
  'nextTimer' : [] | [TimerId],
  'expectedExecutionTime' : [] | [Time],
  'lastExecutionTime' : Time,
}
export interface Stats__3 {
  'fee' : Fee__1,
  'max_balances' : bigint,
  'max_transfers' : bigint,
}
export interface Stats__4 {
  'token_approvals_count' : bigint,
  'ledger_info' : LedgerInfoShared,
  'indexes' : {
    'spender_to_approval_account_count' : bigint,
    'owner_to_approval_account_count' : bigint,
  },
}
export type Subaccount = Uint8Array | number[];
export interface SupportedStandard { 'url' : string, 'name' : string }
export type Time = bigint;
export type TimerId = bigint;
export type Timestamp = bigint;
export interface Tip {
  'last_block_index' : Uint8Array | number[],
  'hash_tree' : Uint8Array | number[],
  'last_block_hash' : Uint8Array | number[],
}
export interface Token {
  'admin_init' : ActorMethod<[], undefined>,
  'admin_update_cyclesLedger' : ActorMethod<[string], boolean>,
  'admin_update_devAccount' : ActorMethod<[Account], boolean>,
  'admin_update_icrc1' : ActorMethod<
    [Array<UpdateLedgerInfoRequest__2>],
    Array<boolean>
  >,
  'admin_update_icrc2' : ActorMethod<
    [Array<UpdateLedgerInfoRequest__1>],
    Array<boolean>
  >,
  'admin_update_icrc4' : ActorMethod<
    [Array<UpdateLedgerInfoRequest>],
    Array<boolean>
  >,
  'admin_update_minCycles' : ActorMethod<[bigint], boolean>,
  'admin_update_owner' : ActorMethod<[Principal], boolean>,
  'archives' : ActorMethod<
    [],
    Array<
      {
        'block_range_end' : bigint,
        'canister_id' : Principal,
        'block_range_start' : bigint,
      }
    >
  >,
  'deposit_cycles' : ActorMethod<[], undefined>,
  'get_blocks' : ActorMethod<
    [{ 'start' : bigint, 'length' : bigint }],
    RosettaGetBlocksResponse
  >,
  'get_cycles' : ActorMethod<[], bigint>,
  'get_icrc85_stats' : ActorMethod<
    [],
    {
      'activeActions' : bigint,
      'nextCycleActionId' : [] | [bigint],
      'lastActionReported' : [] | [bigint],
    }
  >,
  'get_tip' : ActorMethod<[], Tip>,
  'get_transactions' : ActorMethod<
    [{ 'start' : bigint, 'length' : bigint }],
    GetTransactionsResponse
  >,
  'icrc103_get_allowances' : ActorMethod<[GetAllowancesArgs], AllowanceResult>,
  'icrc10_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc130_get_allowances' : ActorMethod<[GetAllowancesArgs], AllowanceResult>,
  'icrc1_balance_of' : ActorMethod<[Account], Balance>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], Balance>,
  'icrc1_metadata' : ActorMethod<[], Array<MetaDatum>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Balance>,
  'icrc1_transfer' : ActorMethod<[TransferArgs], TransferResult>,
  'icrc2_allowance' : ActorMethod<[AllowanceArgs], Allowance>,
  'icrc2_approve' : ActorMethod<[ApproveArgs], ApproveResponse>,
  'icrc2_get_stats' : ActorMethod<[], Stats__4>,
  'icrc2_transfer_from' : ActorMethod<[TransferFromArgs], TransferFromResponse>,
  'icrc3_get_archives' : ActorMethod<[GetArchivesArgs], GetArchivesResult>,
  'icrc3_get_blocks' : ActorMethod<[GetBlocksArgs], GetBlocksResult>,
  'icrc3_get_stats' : ActorMethod<[], Stats>,
  'icrc3_get_tip_certificate' : ActorMethod<[], [] | [DataCertificate]>,
  'icrc3_supported_block_types' : ActorMethod<[], Array<BlockType>>,
  'icrc4_balance_of_batch' : ActorMethod<
    [BalanceQueryArgs],
    BalanceQueryResult
  >,
  'icrc4_get_stats' : ActorMethod<[], Stats__3>,
  'icrc4_maximum_query_batch_size' : ActorMethod<[], [] | [bigint]>,
  'icrc4_maximum_update_batch_size' : ActorMethod<[], [] | [bigint]>,
  'icrc4_transfer_batch' : ActorMethod<
    [TransferBatchArgs],
    TransferBatchResults
  >,
  'icrc75_get_icrc85_stats' : ActorMethod<
    [],
    [] | [
      {
        'activeActions' : bigint,
        'nextCycleActionId' : [] | [bigint],
        'lastActionReported' : [] | [bigint],
      }
    ]
  >,
  'icrc75_get_list_lists' : ActorMethod<
    [List, [] | [List], [] | [bigint]],
    Array<List>
  >,
  'icrc75_get_list_members_admin' : ActorMethod<
    [List, [] | [ListItem], [] | [bigint]],
    Array<[ListItem, [] | [DataItemMap]]>
  >,
  'icrc75_get_list_permissions_admin' : ActorMethod<
    [List, [] | [Permission], [] | [PermissionListItem__1], [] | [bigint]],
    PermissionList__1
  >,
  'icrc75_get_lists' : ActorMethod<
    [[] | [string], boolean, [] | [List], [] | [bigint]],
    Array<ListRecord>
  >,
  'icrc75_get_stats' : ActorMethod<[], Stats__1>,
  'icrc75_is_member' : ActorMethod<
    [Array<AuthorizedRequestItem>],
    Array<boolean>
  >,
  'icrc75_manage' : ActorMethod<[ManageRequest], ManageResponse>,
  'icrc75_manage_list_membership' : ActorMethod<
    [ManageListMembershipRequest],
    ManageListMembershipResponse
  >,
  'icrc75_manage_list_properties' : ActorMethod<
    [ManageListPropertyRequest],
    ManageListPropertyResponse
  >,
  'icrc75_member_of' : ActorMethod<
    [ListItem, [] | [List], [] | [bigint]],
    Array<List>
  >,
  'icrc75_metadata' : ActorMethod<[], DataItemMap>,
  'icrc84_all_credits' : ActorMethod<
    [[] | [Token84], [] | [bigint]],
    Array<[Token84, bigint]>
  >,
  'icrc84_credits' : ActorMethod<[Token84], bigint>,
  'icrc84_deposit' : ActorMethod<[DepositArgs], DepositResponse>,
  'icrc84_notify' : ActorMethod<[{ 'token' : Token84 }], NotifyResult>,
  'icrc84_supported_tokens' : ActorMethod<
    [[] | [Token84], [] | [bigint]],
    Array<Token84>
  >,
  'icrc84_token_info' : ActorMethod<[Token84], TokenInfo>,
  'icrc84_trackedDeposit' : ActorMethod<[Token84], BalanceResult>,
  'icrc84_withdraw' : ActorMethod<[WithdrawArgs], WithdrawResult>,
  'icrc85_deposit_cycles' : ActorMethod<[ShareArgs], ShareResult>,
  'icrc85_namespace_account' : ActorMethod<[string], Account>,
  'icrc86_approve_domain' : ActorMethod<
    [DomainApprovalRequest],
    DomainApprovalResponse
  >,
  'icrc86_claim_domain' : ActorMethod<
    [DomainClaimRequest],
    DomainClaimResponse
  >,
  'icrc86_domain_look_up' : ActorMethod<
    [Array<Domain>],
    Array<[[] | [Array<Principal>], [] | [DomainValidationRecord]]>
  >,
  'icrc86_namespace_look_up' : ActorMethod<
    [Array<Array<string>>],
    Array<[] | [NamespaceLookupResponse]>
  >,
  'stats' : ActorMethod<
    [],
    {
      'icrc1' : {
        'fee' : Balance,
        'decimals' : number,
        'minting_account' : Account,
        'name' : string,
        'total_supply' : bigint,
        'symbol' : string,
      },
      'icrc3' : Stats,
    }
  >,
}
export type Token84 = { 'cycles' : null } |
  { 'icrc1' : Principal };
export interface TokenInfo { 'withdrawal_fee' : bigint, 'deposit_fee' : bigint }
export interface Transaction {
  'burn' : [] | [Burn],
  'kind' : string,
  'mint' : [] | [Mint],
  'timestamp' : Timestamp,
  'index' : TxIndex,
  'transfer' : [] | [Transfer],
}
export type TransactionID = bigint;
export interface TransactionRange { 'start' : bigint, 'length' : bigint }
export interface Transaction__1 {
  'burn' : [] | [Burn__1],
  'kind' : string,
  'mint' : [] | [Mint__1],
  'approve' : [] | [Approve],
  'timestamp' : bigint,
  'transfer' : [] | [Transfer__1],
}
export interface Transfer {
  'to' : Account,
  'fee' : [] | [Balance],
  'from' : Account,
  'memo' : [] | [Memo],
  'created_at_time' : [] | [Timestamp],
  'amount' : Balance,
}
export interface TransferArgs {
  'to' : Account,
  'fee' : [] | [Balance],
  'memo' : [] | [Memo],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [Timestamp],
  'amount' : Balance,
}
export type TransferBatchArgs = Array<TransferArgs>;
export type TransferBatchError = { 'TooManyRequests' : { 'limit' : bigint } } |
  { 'GenericError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'GenericBatchError' : { 'message' : string, 'error_code' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type TransferBatchResult = { 'Ok' : bigint } |
  { 'Err' : TransferBatchError };
export type TransferBatchResults = Array<[] | [TransferBatchResult]>;
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : Balance } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Balance } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Balance } };
export interface TransferFromArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'spender_subaccount' : [] | [Uint8Array | number[]],
  'from' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type TransferFromResponse = { 'Ok' : bigint } |
  { 'Err' : TransferFromError };
export type TransferResult = { 'Ok' : TxIndex } |
  { 'Err' : TransferError };
export interface Transfer__1 {
  'to' : Account__7,
  'fee' : [] | [bigint],
  'from' : Account__7,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'spender' : [] | [Account__7],
}
export type TxIndex = bigint;
export type UpdateLedgerInfoRequest = { 'Fee' : Fee__1 } |
  { 'MaxBalances' : bigint } |
  { 'MaxTransfers' : bigint };
export type UpdateLedgerInfoRequest__1 = { 'Fee' : Fee__1 } |
  { 'MaxAllowance' : [] | [MaxAllowance] } |
  { 'MaxApprovalsPerAccount' : bigint } |
  { 'MaxApprovals' : bigint } |
  { 'SettleToApprovals' : bigint };
export type UpdateLedgerInfoRequest__2 = { 'Fee' : Fee } |
  { 'Metadata' : [string, [] | [Value]] } |
  { 'Symbol' : string } |
  { 'Logo' : string } |
  { 'Name' : string } |
  { 'MaxSupply' : [] | [bigint] } |
  { 'MaxMemo' : bigint } |
  { 'MinBurnAmount' : [] | [bigint] } |
  { 'TransactionWindow' : bigint } |
  { 'PermittedDrift' : bigint } |
  { 'SettleToAccounts' : bigint } |
  { 'MintingAccount' : Account } |
  { 'FeeCollector' : [] | [Account] } |
  { 'MaxAccounts' : bigint } |
  { 'Decimals' : number };
export type Value = { 'Int' : bigint } |
  { 'Map' : Array<[string, Value]> } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<Value> };
export type Value__1 = { 'Int' : bigint } |
  { 'Map' : Array<[string, Value__1]> } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<Value__1> };
export type Value__2 = { 'Int' : bigint } |
  { 'Map' : Map } |
  { 'Nat' : bigint } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'Array' : Array<Value__2> };
export interface WithdrawArgs {
  'to' : Account,
  'token' : Token84,
  'amount' : bigint,
}
export type WithdrawError = { 'NotAllowed' : null } |
  { 'TransferFailed' : string } |
  { 'LimitExceeded' : null };
export type WithdrawResult = { 'Ok' : { 'amt' : bigint, 'txId' : bigint } } |
  { 'Err' : WithdrawError };
/**
 * / Token.mo - CycleShareLedger using library mixin includes
 * / Uses includes for ALL ICRC standards (1, 2, 3, 4, 75)
 */
export interface _SERVICE extends Token {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
