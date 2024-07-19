import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Account__1 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount__1],
}
export interface Account__2 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount__2],
}
export interface Account__3 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Account__4 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount__3],
}
export interface Account__5 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount__4],
}
export interface AdvancedSettings {
  'existing_balances' : Array<[Account, Balance]>,
  'burned_tokens' : Balance,
  'fee_collector_emitted' : boolean,
  'minted_tokens' : Balance,
  'local_transactions' : Array<Transaction>,
  'fee_collector_block' : bigint,
}
export interface AdvancedSettings__1 {
  'existing_approvals' : Array<[[Account__1, Account__1], ApprovalInfo]>,
}
export interface Allowance {
  'allowance' : bigint,
  'expires_at' : [] | [bigint],
}
export interface AllowanceArgs {
  'account' : Account__1,
  'spender' : Account__1,
}
export interface ApprovalInfo {
  'from_subaccount' : [] | [Uint8Array | number[]],
  'amount' : bigint,
  'expires_at' : [] | [bigint],
  'spender' : Account__1,
}
export interface ApproveArgs {
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'expected_allowance' : [] | [bigint],
  'expires_at' : [] | [bigint],
  'spender' : Account__1,
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
  'callback' : GetTransactionsFn,
}
export type AuthorizedRequestItem = [ListItem__2, Array<Array<List__2>>];
export type Balance = bigint;
export interface BalanceQueryArgs { 'accounts' : Array<Account__5> }
export type BalanceQueryResult = Array<bigint>;
export type BalanceResult = { 'Ok' : bigint } |
  { 'Err' : { 'NotAvailable' : { 'message' : string } } };
export type Balance__1 = bigint;
export interface BlockType { 'url' : string, 'block_type' : string }
export interface BlockType__1 { 'url' : string, 'block_type' : string }
export interface Burn {
  'from' : Account,
  'memo' : [] | [Memo],
  'created_at_time' : [] | [Timestamp],
  'amount' : Balance,
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
export type DataItemMap__1 = Array<[string, DataItem__1]>;
export type DataItem__1 = { 'Int' : bigint } |
  { 'Map' : DataItemMap__1 } |
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
  'subaccount' : [] | [Uint8Array | number[]],
  'amount' : bigint,
}
export type DepositResponse = { 'Ok' : DepositResult } |
  {
    'Err' : { 'TransferError' : { 'message' : string } } |
      { 'AmountBelowMinimum' : null } |
      { 'CallLedgerError' : { 'message' : string } }
  };
export interface DepositResult {
  'credit_inc' : bigint,
  'txid' : bigint,
  'credit' : bigint,
}
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
  'gateAccount' : [] | [Account__3],
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
export type Fee__2 = { 'ICRC1' : null } |
  { 'Environment' : null } |
  { 'Fixed' : bigint };
export interface GetArchivesArgs { 'from' : [] | [Principal] }
export type GetArchivesResult = Array<GetArchivesResultItem>;
export interface GetArchivesResultItem {
  'end' : bigint,
  'canister_id' : Principal,
  'start' : bigint,
}
export type GetBlocksArgs = Array<TransactionRange>;
export interface GetBlocksResult {
  'log_length' : bigint,
  'blocks' : Array<{ 'id' : bigint, 'block' : Value__1 }>,
  'archived_blocks' : Array<ArchivedTransactionResponse>,
}
export type GetTransactionsFn = ActorMethod<
  [Array<TransactionRange>],
  GetTransactionsResult
>;
export interface GetTransactionsResult {
  'log_length' : bigint,
  'blocks' : Array<{ 'id' : bigint, 'block' : Value__1 }>,
  'archived_blocks' : Array<ArchivedTransactionResponse>,
}
export type ICRC16Map = Array<[string, DataItem]>;
export type Identity = Principal;
export type Identity__1 = Principal;
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
  'max_approvals_per_account' : [] | [bigint],
  'settle_to_approvals' : [] | [bigint],
}
export type InitArgs__2 = [] | [InitArgs__3];
export interface InitArgs__3 {
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
export interface InitArgs__4 {
  'fee' : [] | [Fee__2],
  'max_balances' : [] | [bigint],
  'max_transfers' : [] | [bigint],
}
export type InitArgs__5 = [] | [
  { 'existingNamespaces' : [] | [Array<NamespaceRecordShared>] }
];
export type List = string;
export type ListItem = { 'List' : List } |
  { 'DataItem' : DataItem } |
  { 'Account' : Account__2 } |
  { 'Identity' : Identity };
export type ListItem__1 = { 'List' : List } |
  { 'DataItem' : DataItem } |
  { 'Account' : Account__2 } |
  { 'Identity' : Identity };
export type ListItem__2 = { 'List' : List__2 } |
  { 'DataItem' : DataItem__1 } |
  { 'Account' : Account__4 } |
  { 'Identity' : Identity__1 };
export interface ListRecord {
  'metadata' : [] | [DataItemMap__1],
  'list' : List__2,
}
export type List__1 = string;
export type List__2 = string;
export type ManageListMembershipAction = { 'Add' : ListItem__2 } |
  { 'Remove' : ListItem__2 };
export type ManageListMembershipError = { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string };
export type ManageListMembershipRequest = Array<
  ManageListMembershipRequestItem
>;
export interface ManageListMembershipRequestItem {
  'action' : ManageListMembershipAction,
  'list' : List__2,
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount__3],
  'created_at_time' : [] | [bigint],
}
export type ManageListMembershipResponse = Array<ManageListMembershipResult>;
export type ManageListMembershipResult = [] | [
  { 'Ok' : TransactionID } |
    { 'Err' : ManageListMembershipError }
];
export type ManageListPropertiesRequest = Array<ManageListPropertyRequestItem>;
export type ManageListPropertyError = { 'IllegalAdmin' : null } |
  { 'IllegalPermission' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string } |
  { 'Exists' : null };
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
      'members' : Array<ListItem__2>,
      'admin' : [] | [ListItem__2],
      'metadata' : DataItemMap__1,
    }
  };
export interface ManageListPropertyRequestItem {
  'action' : ManageListPropertyRequestAction,
  'list' : List__2,
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount__3],
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
export type ManageResultError = { 'Unauthorized' : null } |
  { 'Other' : string };
export type MaxAllowance = { 'TotalSupply' : null } |
  { 'Fixed' : bigint };
export type Memo = Uint8Array | number[];
export type MetaDatum = [string, Value];
export type MetaDatum__1 = [string, Value];
export type MetaDatum__2 = [string, Value];
export interface Mint {
  'to' : Account,
  'memo' : [] | [Memo],
  'created_at_time' : [] | [Timestamp],
  'amount' : Balance,
}
export interface NamespaceLookupResponse {
  'controllers' : Array<Principal>,
  'domain' : Domain,
}
export interface NamespaceRecordShared {
  'permissions' : PermissionList,
  'members' : Array<ListItem>,
  'metadata' : ICRC16Map,
  'namespace' : string,
}
export type NotifyResult = {
    'Ok' : { 'credit_inc' : bigint, 'credit' : bigint, 'deposit_inc' : bigint }
  } |
  {
    'Err' : { 'NotAvailable' : { 'message' : string } } |
      { 'CallLedgerError' : { 'message' : string } }
  };
export type Permission = { 'Read' : null } |
  { 'Write' : null } |
  { 'Admin' : null } |
  { 'Permissions' : null };
export type PermissionList = Array<PermissionListItem>;
export type PermissionListItem = [Permission, ListItem];
export type PermissionListItem__1 = [Permission__2, ListItem__2];
export type PermissionListItem__2 = [Permission__2, ListItem__2];
export type PermissionList__1 = Array<PermissionListItem__2>;
export type Permission__1 = { 'Read' : null } |
  { 'Write' : null } |
  { 'Admin' : null } |
  { 'Permissions' : null };
export type Permission__2 = { 'Read' : null } |
  { 'Write' : null } |
  { 'Admin' : null } |
  { 'Permissions' : null };
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
export type Subaccount = Uint8Array | number[];
export type Subaccount__1 = Uint8Array | number[];
export type Subaccount__2 = Uint8Array | number[];
export type Subaccount__3 = Uint8Array | number[];
export type Subaccount__4 = Uint8Array | number[];
export interface SupportedStandard { 'url' : string, 'name' : string }
export type Timestamp = bigint;
export interface Tip {
  'last_block_index' : Uint8Array | number[],
  'hash_tree' : Uint8Array | number[],
  'last_block_hash' : Uint8Array | number[],
}
export interface Token {
  'admin_init' : ActorMethod<[], undefined>,
  'admin_update_cyclesLedger' : ActorMethod<[string], boolean>,
  'admin_update_devAccount' : ActorMethod<[Account__3], boolean>,
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
  'deposit_cycles' : ActorMethod<[], undefined>,
  'get_cycles' : ActorMethod<[], bigint>,
  'get_data_certificate' : ActorMethod<
    [],
    {
      'certificate' : [] | [Uint8Array | number[]],
      'hash_tree' : Uint8Array | number[],
    }
  >,
  'get_tip' : ActorMethod<[], Tip>,
  'icrc10_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc1_balance_of' : ActorMethod<[Account__3], Balance__1>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], Balance__1>,
  'icrc1_metadata' : ActorMethod<[], Array<MetaDatum>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account__3]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Balance__1>,
  'icrc1_transfer' : ActorMethod<[TransferArgs__1], TransferResult>,
  'icrc2_allowance' : ActorMethod<[AllowanceArgs], Allowance>,
  'icrc2_approve' : ActorMethod<[ApproveArgs], ApproveResponse>,
  'icrc2_transfer_from' : ActorMethod<[TransferFromArgs], TransferFromResponse>,
  'icrc3_get_archives' : ActorMethod<[GetArchivesArgs], GetArchivesResult>,
  'icrc3_get_blocks' : ActorMethod<[GetBlocksArgs], GetBlocksResult>,
  'icrc3_get_tip_certificate' : ActorMethod<[], [] | [DataCertificate]>,
  'icrc3_supported_block_types' : ActorMethod<[], Array<BlockType__1>>,
  'icrc4_balance_of_batch' : ActorMethod<
    [BalanceQueryArgs],
    BalanceQueryResult
  >,
  'icrc4_maximum_query_batch_size' : ActorMethod<[], [] | [bigint]>,
  'icrc4_maximum_update_batch_size' : ActorMethod<[], [] | [bigint]>,
  'icrc4_transfer_batch' : ActorMethod<
    [TransferBatchArgs],
    TransferBatchResults
  >,
  'icrc75_manage_list_properties' : ActorMethod<
    [ManageListPropertiesRequest],
    ManageListPropertyResponse
  >,
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
  'icrc85_namespace_account' : ActorMethod<[string], Account__3>,
  'icrc85_deposit_cycles' : ActorMethod<[ShareArgs], ShareResult>,
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
  'icrc_75_get_list_lists' : ActorMethod<
    [List__1, [] | [List__1], [] | [bigint]],
    Array<List__1>
  >,
  'icrc_75_get_list_members_admin' : ActorMethod<
    [List__1, [] | [ListItem__1], [] | [bigint]],
    Array<ListItem__1>
  >,
  'icrc_75_get_list_permissions_admin' : ActorMethod<
    [
      List__1,
      [] | [Permission__1],
      [] | [PermissionListItem__1],
      [] | [bigint],
    ],
    PermissionList__1
  >,
  'icrc_75_get_lists' : ActorMethod<
    [[] | [string], boolean, [] | [List__1], [] | [bigint]],
    Array<ListRecord>
  >,
  'icrc_75_is_member' : ActorMethod<
    [Array<AuthorizedRequestItem>],
    Array<boolean>
  >,
  'icrc_75_manage' : ActorMethod<[ManageRequest], ManageResponse>,
  'icrc_75_manage_list_membership' : ActorMethod<
    [ManageListMembershipRequest],
    ManageListMembershipResponse
  >,
  'icrc_75_member_of' : ActorMethod<
    [ListItem__1, [] | [List__1], [] | [bigint]],
    Array<List__1>
  >,
  'icrc_75_metadata' : ActorMethod<[], DataItemMap>,
  'stats' : ActorMethod<
    [],
    {
      'domainOwners' : bigint,
      'owner' : Principal,
      'pendingTransfers' : Array<WithdrawArgs>,
      'failedDeposit' : Array<[bigint, ShareArgs]>,
      'xdr_permyriad_per_icp' : bigint,
      'icrc1' : Array<MetaDatum>,
      'icrc2' : Array<MetaDatum__1>,
      'icrc3' : Stats,
      'icrc4' : Array<MetaDatum__2>,
      'lastXDRRate' : bigint,
      'namespaceAccounts' : bigint,
      'domainValidation' : bigint,
      'CyclesLedger_CANISTER_ID' : string,
    }
  >,
}
export type Token84 = { 'icrc1' : Principal };
export interface TokenInfo {
  'min_deposit' : bigint,
  'min_withdrawal' : bigint,
  'withdrawal_fee' : bigint,
  'deposit_fee' : bigint,
}
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
export interface TransferArgs__1 {
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
  'to' : Account__1,
  'fee' : [] | [bigint],
  'spender_subaccount' : [] | [Uint8Array | number[]],
  'from' : Account__1,
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
export type TxIndex = bigint;
export type UpdateLedgerInfoRequest = { 'Fee' : Fee__2 } |
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
export interface WithdrawArgs {
  'to' : Account__3,
  'token' : Token84,
  'amount' : bigint,
}
export type WithdrawResult = { 'Ok' : { 'txid' : bigint, 'amount' : bigint } } |
  {
    'Err' : { 'AmountBelowMinimum' : null } |
      { 'InsufficientCredit' : null } |
      { 'CallLedgerError' : { 'message' : string } }
  };
export interface _SERVICE extends Token {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
