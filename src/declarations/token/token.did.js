export const idlFactory = ({ IDL }) => {
  const ArchivedTransactionResponse = IDL.Rec();
  const CandyShared = IDL.Rec();
  const DataItemMap = IDL.Rec();
  const DataItem__1 = IDL.Rec();
  const Value = IDL.Rec();
  const Value__1 = IDL.Rec();
  const Value__2 = IDL.Rec();
  const Permission = IDL.Variant({
    'Read' : IDL.Null,
    'Write' : IDL.Null,
    'Admin' : IDL.Null,
    'Permissions' : IDL.Null,
  });
  const List = IDL.Text;
  const PropertyShared = IDL.Record({
    'value' : CandyShared,
    'name' : IDL.Text,
    'immutable' : IDL.Bool,
  });
  CandyShared.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, CandyShared)),
      'Nat' : IDL.Nat,
      'Set' : IDL.Vec(CandyShared),
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Ints' : IDL.Vec(IDL.Int),
      'Nat8' : IDL.Nat8,
      'Nats' : IDL.Vec(IDL.Nat),
      'Text' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(CandyShared),
      'Floats' : IDL.Vec(IDL.Float64),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Vec(CandyShared),
      'ValueMap' : IDL.Vec(IDL.Tuple(CandyShared, CandyShared)),
      'Class' : IDL.Vec(PropertyShared),
    })
  );
  const DataItem = IDL.Variant({
    'Int' : IDL.Int,
    'Map' : IDL.Vec(IDL.Tuple(IDL.Text, CandyShared)),
    'Nat' : IDL.Nat,
    'Set' : IDL.Vec(CandyShared),
    'Nat16' : IDL.Nat16,
    'Nat32' : IDL.Nat32,
    'Nat64' : IDL.Nat64,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Bool' : IDL.Bool,
    'Int8' : IDL.Int8,
    'Ints' : IDL.Vec(IDL.Int),
    'Nat8' : IDL.Nat8,
    'Nats' : IDL.Vec(IDL.Nat),
    'Text' : IDL.Text,
    'Bytes' : IDL.Vec(IDL.Nat8),
    'Int16' : IDL.Int16,
    'Int32' : IDL.Int32,
    'Int64' : IDL.Int64,
    'Option' : IDL.Opt(CandyShared),
    'Floats' : IDL.Vec(IDL.Float64),
    'Float' : IDL.Float64,
    'Principal' : IDL.Principal,
    'Array' : IDL.Vec(CandyShared),
    'ValueMap' : IDL.Vec(IDL.Tuple(CandyShared, CandyShared)),
    'Class' : IDL.Vec(PropertyShared),
  });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Identity = IDL.Principal;
  const ListItem = IDL.Variant({
    'List' : List,
    'DataItem' : DataItem,
    'Account' : Account,
    'Identity' : Identity,
  });
  const PermissionListItem = IDL.Tuple(Permission, ListItem);
  const PermissionList = IDL.Vec(PermissionListItem);
  const ICRC16MapItem = IDL.Tuple(IDL.Text, DataItem);
  const ICRC16Map = IDL.Vec(ICRC16MapItem);
  const NamespaceRecordShared = IDL.Record({
    'permissions' : PermissionList,
    'members' : IDL.Vec(IDL.Tuple(ListItem, IDL.Opt(ICRC16Map))),
    'metadata' : ICRC16Map,
    'namespace' : IDL.Text,
  });
  const InitArgs__4 = IDL.Record({
    'existingNamespaces' : IDL.Opt(IDL.Vec(NamespaceRecordShared)),
    'cycleShareTimerID' : IDL.Opt(IDL.Nat),
    'certificateNonce' : IDL.Opt(IDL.Nat),
  });
  const Fee = IDL.Variant({ 'Environment' : IDL.Null, 'Fixed' : IDL.Nat });
  const Balance = IDL.Nat;
  const Memo = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat64;
  const Burn = IDL.Record({
    'from' : Account,
    'memo' : IDL.Opt(Memo),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Balance,
  });
  const Mint = IDL.Record({
    'to' : Account,
    'memo' : IDL.Opt(Memo),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Balance,
  });
  const TxIndex = IDL.Nat;
  const Transfer = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(Balance),
    'from' : Account,
    'memo' : IDL.Opt(Memo),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Balance,
  });
  const Transaction = IDL.Record({
    'burn' : IDL.Opt(Burn),
    'kind' : IDL.Text,
    'mint' : IDL.Opt(Mint),
    'timestamp' : Timestamp,
    'index' : TxIndex,
    'transfer' : IDL.Opt(Transfer),
  });
  const AdvancedSettings = IDL.Record({
    'existing_balances' : IDL.Vec(IDL.Tuple(Account, Balance)),
    'burned_tokens' : Balance,
    'fee_collector_emitted' : IDL.Bool,
    'minted_tokens' : Balance,
    'local_transactions' : IDL.Vec(Transaction),
    'fee_collector_block' : IDL.Nat,
  });
  Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, Value)),
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(Value),
    })
  );
  const InitArgs = IDL.Record({
    'fee' : IDL.Opt(Fee),
    'advanced_settings' : IDL.Opt(AdvancedSettings),
    'max_memo' : IDL.Opt(IDL.Nat),
    'decimals' : IDL.Nat8,
    'metadata' : IDL.Opt(Value),
    'minting_account' : IDL.Opt(Account),
    'logo' : IDL.Opt(IDL.Text),
    'permitted_drift' : IDL.Opt(Timestamp),
    'name' : IDL.Opt(IDL.Text),
    'settle_to_accounts' : IDL.Opt(IDL.Nat),
    'fee_collector' : IDL.Opt(Account),
    'transaction_window' : IDL.Opt(Timestamp),
    'min_burn_amount' : IDL.Opt(Balance),
    'max_supply' : IDL.Opt(Balance),
    'max_accounts' : IDL.Opt(IDL.Nat),
    'symbol' : IDL.Opt(IDL.Text),
  });
  const Fee__1 = IDL.Variant({
    'ICRC1' : IDL.Null,
    'Environment' : IDL.Null,
    'Fixed' : IDL.Nat,
  });
  const ApprovalInfo = IDL.Record({
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'amount' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : Account,
  });
  const AdvancedSettings__1 = IDL.Record({
    'existing_approvals' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(Account, Account), ApprovalInfo)
    ),
  });
  const MaxAllowance = IDL.Variant({
    'TotalSupply' : IDL.Null,
    'Fixed' : IDL.Nat,
  });
  const InitArgs__1 = IDL.Record({
    'fee' : IDL.Opt(Fee__1),
    'advanced_settings' : IDL.Opt(AdvancedSettings__1),
    'max_allowance' : IDL.Opt(MaxAllowance),
    'max_approvals' : IDL.Opt(IDL.Nat),
    'icrc103_max_take_value' : IDL.Opt(IDL.Nat),
    'cleanup_on_zero_balance' : IDL.Opt(IDL.Bool),
    'icrc103_public_allowances' : IDL.Opt(IDL.Bool),
    'max_approvals_per_account' : IDL.Opt(IDL.Nat),
    'settle_to_approvals' : IDL.Opt(IDL.Nat),
    'cleanup_interval' : IDL.Opt(IDL.Nat),
  });
  const IndexType = IDL.Variant({
    'Stable' : IDL.Null,
    'StableTyped' : IDL.Null,
    'Managed' : IDL.Null,
  });
  const BlockType = IDL.Record({ 'url' : IDL.Text, 'block_type' : IDL.Text });
  const InitArgs__2 = IDL.Record({
    'maxRecordsToArchive' : IDL.Nat,
    'archiveIndexType' : IndexType,
    'maxArchivePages' : IDL.Nat,
    'settleToRecords' : IDL.Nat,
    'archiveCycles' : IDL.Nat,
    'maxActiveRecords' : IDL.Nat,
    'maxRecordsInArchiveInstance' : IDL.Nat,
    'archiveControllers' : IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
    'supportedBlocks' : IDL.Vec(BlockType),
  });
  const InitArgs__3 = IDL.Record({
    'fee' : IDL.Opt(Fee__1),
    'max_balances' : IDL.Opt(IDL.Nat),
    'max_transfers' : IDL.Opt(IDL.Nat),
  });
  const UpdateLedgerInfoRequest__2 = IDL.Variant({
    'Fee' : Fee,
    'Metadata' : IDL.Tuple(IDL.Text, IDL.Opt(Value)),
    'Symbol' : IDL.Text,
    'Logo' : IDL.Text,
    'Name' : IDL.Text,
    'MaxSupply' : IDL.Opt(IDL.Nat),
    'MaxMemo' : IDL.Nat,
    'MinBurnAmount' : IDL.Opt(IDL.Nat),
    'TransactionWindow' : IDL.Nat64,
    'PermittedDrift' : IDL.Nat64,
    'SettleToAccounts' : IDL.Nat,
    'MintingAccount' : Account,
    'FeeCollector' : IDL.Opt(Account),
    'MaxAccounts' : IDL.Nat,
    'Decimals' : IDL.Nat8,
  });
  const UpdateLedgerInfoRequest__1 = IDL.Variant({
    'Fee' : Fee__1,
    'MaxAllowance' : IDL.Opt(MaxAllowance),
    'MaxApprovalsPerAccount' : IDL.Nat,
    'MaxApprovals' : IDL.Nat,
    'SettleToApprovals' : IDL.Nat,
  });
  const UpdateLedgerInfoRequest = IDL.Variant({
    'Fee' : Fee__1,
    'MaxBalances' : IDL.Nat,
    'MaxTransfers' : IDL.Nat,
  });
  const Map = IDL.Vec(IDL.Tuple(IDL.Text, Value__2));
  Value__2.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : Map,
      'Nat' : IDL.Nat,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(Value__2),
    })
  );
  const GetBlocksRequest = IDL.Record({
    'start' : IDL.Nat,
    'length' : IDL.Nat,
  });
  const RosettaBlockRange = IDL.Record({ 'blocks' : IDL.Vec(Value__2) });
  const RosettaArchivedRange = IDL.Record({
    'callback' : IDL.Func([GetBlocksRequest], [RosettaBlockRange], ['query']),
    'start' : IDL.Nat,
    'length' : IDL.Nat,
  });
  const RosettaGetBlocksResponse = IDL.Record({
    'certificate' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'first_index' : IDL.Nat,
    'blocks' : IDL.Vec(Value__2),
    'chain_length' : IDL.Nat64,
    'archived_blocks' : IDL.Vec(RosettaArchivedRange),
  });
  const Tip = IDL.Record({
    'last_block_index' : IDL.Vec(IDL.Nat8),
    'hash_tree' : IDL.Vec(IDL.Nat8),
    'last_block_hash' : IDL.Vec(IDL.Nat8),
  });
  const Account__7 = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Burn__1 = IDL.Record({
    'from' : Account__7,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'spender' : IDL.Opt(Account__7),
  });
  const Mint__1 = IDL.Record({
    'to' : Account__7,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
  });
  const Approve = IDL.Record({
    'fee' : IDL.Opt(IDL.Nat),
    'from' : Account__7,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'expected_allowance' : IDL.Opt(IDL.Nat),
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : Account__7,
  });
  const Transfer__1 = IDL.Record({
    'to' : Account__7,
    'fee' : IDL.Opt(IDL.Nat),
    'from' : Account__7,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'spender' : IDL.Opt(Account__7),
  });
  const Transaction__1 = IDL.Record({
    'burn' : IDL.Opt(Burn__1),
    'kind' : IDL.Text,
    'mint' : IDL.Opt(Mint__1),
    'approve' : IDL.Opt(Approve),
    'timestamp' : IDL.Nat64,
    'transfer' : IDL.Opt(Transfer__1),
  });
  const GetArchiveTransactionsResponse = IDL.Record({
    'transactions' : IDL.Vec(Transaction__1),
  });
  const GetLegacyArchiveTransactionFunction = IDL.Func(
      [GetBlocksRequest],
      [GetArchiveTransactionsResponse],
      ['query'],
    );
  const LegacyArchivedRange = IDL.Record({
    'callback' : GetLegacyArchiveTransactionFunction,
    'start' : IDL.Nat,
    'length' : IDL.Nat,
  });
  const GetTransactionsResponse = IDL.Record({
    'first_index' : IDL.Nat,
    'log_length' : IDL.Nat,
    'transactions' : IDL.Vec(Transaction__1),
    'archived_transactions' : IDL.Vec(LegacyArchivedRange),
  });
  const GetAllowancesArgs = IDL.Record({
    'take' : IDL.Opt(IDL.Nat),
    'prev_spender' : IDL.Opt(Account),
    'from_account' : IDL.Opt(Account),
  });
  const AllowanceDetail = IDL.Record({
    'from_account' : Account,
    'to_spender' : Account,
    'allowance' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const GetAllowancesError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'AccessDenied' : IDL.Record({ 'reason' : IDL.Text }),
  });
  const AllowanceResult = IDL.Variant({
    'Ok' : IDL.Vec(AllowanceDetail),
    'Err' : GetAllowancesError,
  });
  const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const MetaDatum = IDL.Tuple(IDL.Text, Value);
  const TransferArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(Balance),
    'memo' : IDL.Opt(Memo),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Balance,
  });
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Balance }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Balance }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Balance }),
  });
  const TransferResult = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferError });
  const AllowanceArgs = IDL.Record({
    'account' : Account,
    'spender' : Account,
  });
  const Allowance = IDL.Record({
    'allowance' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const ApproveArgs = IDL.Record({
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'expected_allowance' : IDL.Opt(IDL.Nat),
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : Account,
  });
  const ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'AllowanceChanged' : IDL.Record({ 'current_allowance' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'Expired' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const ApproveResponse = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ApproveError });
  const LedgerInfoShared = IDL.Record({
    'fee' : Fee__1,
    'max_allowance' : IDL.Opt(MaxAllowance),
    'max_approvals' : IDL.Nat,
    'icrc103_max_take_value' : IDL.Nat,
    'cleanup_on_zero_balance' : IDL.Opt(IDL.Bool),
    'icrc103_public_allowances' : IDL.Bool,
    'max_approvals_per_account' : IDL.Nat,
    'settle_to_approvals' : IDL.Nat,
    'cleanup_interval' : IDL.Opt(IDL.Nat),
  });
  const Stats__4 = IDL.Record({
    'token_approvals_count' : IDL.Nat,
    'ledger_info' : LedgerInfoShared,
    'indexes' : IDL.Record({
      'spender_to_approval_account_count' : IDL.Nat,
      'owner_to_approval_account_count' : IDL.Nat,
    }),
  });
  const TransferFromArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'spender_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from' : Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
  });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const TransferFromResponse = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : TransferFromError,
  });
  const GetArchivesArgs = IDL.Record({ 'from' : IDL.Opt(IDL.Principal) });
  const GetArchivesResultItem = IDL.Record({
    'end' : IDL.Nat,
    'canister_id' : IDL.Principal,
    'start' : IDL.Nat,
  });
  const GetArchivesResult = IDL.Vec(GetArchivesResultItem);
  const TransactionRange = IDL.Record({
    'start' : IDL.Nat,
    'length' : IDL.Nat,
  });
  const GetBlocksArgs = IDL.Vec(TransactionRange);
  Value__1.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, Value__1)),
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(Value__1),
    })
  );
  const GetTransactionsResult = IDL.Record({
    'log_length' : IDL.Nat,
    'blocks' : IDL.Vec(IDL.Record({ 'id' : IDL.Nat, 'block' : Value__1 })),
    'archived_blocks' : IDL.Vec(ArchivedTransactionResponse),
  });
  const GetTransactionsFn = IDL.Func(
      [IDL.Vec(TransactionRange)],
      [GetTransactionsResult],
      ['query'],
    );
  ArchivedTransactionResponse.fill(
    IDL.Record({
      'args' : IDL.Vec(TransactionRange),
      'callback' : GetTransactionsFn,
    })
  );
  const GetBlocksResult = IDL.Record({
    'log_length' : IDL.Nat,
    'blocks' : IDL.Vec(IDL.Record({ 'id' : IDL.Nat, 'block' : Value__1 })),
    'archived_blocks' : IDL.Vec(ArchivedTransactionResponse),
  });
  const Stats = IDL.Record({
    'lastIndex' : IDL.Nat,
    'localLedgerSize' : IDL.Nat,
    'constants' : IDL.Record({
      'archiveProperties' : IDL.Record({
        'maxRecordsToArchive' : IDL.Nat,
        'settleToRecords' : IDL.Nat,
        'archiveCycles' : IDL.Nat,
        'maxActiveRecords' : IDL.Nat,
        'maxRecordsInArchiveInstance' : IDL.Nat,
        'archiveControllers' : IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
      }),
    }),
    'ledgerCanister' : IDL.Principal,
    'bCleaning' : IDL.Bool,
    'archives' : IDL.Vec(IDL.Tuple(IDL.Principal, TransactionRange)),
    'supportedBlocks' : IDL.Vec(BlockType),
    'firstIndex' : IDL.Nat,
  });
  const DataCertificate = IDL.Record({
    'certificate' : IDL.Vec(IDL.Nat8),
    'hash_tree' : IDL.Vec(IDL.Nat8),
  });
  const BalanceQueryArgs = IDL.Record({ 'accounts' : IDL.Vec(Account) });
  const BalanceQueryResult = IDL.Vec(IDL.Nat);
  const Stats__3 = IDL.Record({
    'fee' : Fee__1,
    'max_balances' : IDL.Nat,
    'max_transfers' : IDL.Nat,
  });
  const TransferBatchArgs = IDL.Vec(TransferArgs);
  const TransferBatchError = IDL.Variant({
    'TooManyRequests' : IDL.Record({ 'limit' : IDL.Nat }),
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const TransferBatchResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : TransferBatchError,
  });
  const TransferBatchResults = IDL.Vec(IDL.Opt(TransferBatchResult));
  const PropertyShared__1 = IDL.Record({
    'value' : DataItem__1,
    'name' : IDL.Text,
    'immutable' : IDL.Bool,
  });
  DataItem__1.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : DataItemMap,
      'Nat' : IDL.Nat,
      'Set' : IDL.Vec(DataItem__1),
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Ints' : IDL.Vec(IDL.Int),
      'Nat8' : IDL.Nat8,
      'Nats' : IDL.Vec(IDL.Nat),
      'Text' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(DataItem__1),
      'Floats' : IDL.Vec(IDL.Float64),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Vec(DataItem__1),
      'ValueMap' : IDL.Vec(IDL.Tuple(DataItem__1, DataItem__1)),
      'Class' : IDL.Vec(PropertyShared__1),
    })
  );
  DataItemMap.fill(IDL.Vec(IDL.Tuple(IDL.Text, DataItem__1)));
  const ListItem__2 = IDL.Variant({
    'List' : List,
    'DataItem' : DataItem__1,
    'Account' : Account,
    'Identity' : Identity,
  });
  const PermissionListItem__1 = IDL.Tuple(Permission, ListItem__2);
  const PermissionList__1 = IDL.Vec(PermissionListItem__1);
  const ListRecord = IDL.Record({
    'metadata' : IDL.Opt(DataItemMap),
    'list' : List,
  });
  const Time = IDL.Nat;
  const ActionId = IDL.Record({ 'id' : IDL.Nat, 'time' : Time });
  const Action = IDL.Record({
    'aSync' : IDL.Opt(IDL.Nat),
    'actionType' : IDL.Text,
    'params' : IDL.Vec(IDL.Nat8),
    'retries' : IDL.Nat,
  });
  const ActionDetail = IDL.Tuple(ActionId, Action);
  const TimerId = IDL.Nat;
  const Stats__2 = IDL.Record({
    'timers' : IDL.Nat,
    'maxExecutions' : IDL.Nat,
    'minAction' : IDL.Opt(ActionDetail),
    'cycles' : IDL.Nat,
    'nextActionId' : IDL.Nat,
    'nextTimer' : IDL.Opt(TimerId),
    'expectedExecutionTime' : IDL.Opt(Time),
    'lastExecutionTime' : Time,
  });
  const Stats__1 = IDL.Record({
    'tt' : Stats__2,
    'permittedDrift' : IDL.Nat,
    'defaultTake' : IDL.Nat,
    'owner' : IDL.Principal,
    'memberIndexCount' : IDL.Nat,
    'permissionsIndexCount' : IDL.Nat,
    'cycleShareTimerID' : IDL.Opt(IDL.Nat),
    'namespaceStoreCount' : IDL.Nat,
    'maxTake' : IDL.Nat,
    'txWindow' : IDL.Nat,
  });
  const AuthorizedRequestItem = IDL.Tuple(ListItem__2, IDL.Vec(IDL.Vec(List)));
  const ManageRequestItem = IDL.Variant({
    'UpdateDefaultTake' : IDL.Nat,
    'UpdatePermittedDrift' : IDL.Nat,
    'UpdateTxWindow' : IDL.Nat,
    'UpdateMaxTake' : IDL.Nat,
  });
  const ManageRequest = IDL.Vec(ManageRequestItem);
  const ManageResultError = IDL.Variant({
    'TooManyRequests' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
  });
  const ManageResult = IDL.Opt(
    IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ManageResultError })
  );
  const ManageResponse = IDL.Vec(ManageResult);
  const MapModifier = IDL.Tuple(IDL.Text, IDL.Opt(DataItem__1));
  const ManageListMembershipAction = IDL.Variant({
    'Add' : IDL.Tuple(ListItem__2, IDL.Opt(DataItemMap)),
    'Remove' : ListItem__2,
    'Update' : IDL.Tuple(ListItem__2, MapModifier),
  });
  const ManageListMembershipRequestItem = IDL.Record({
    'action' : ManageListMembershipAction,
    'list' : List,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(IDL.Nat),
  });
  const ManageListMembershipRequest = IDL.Vec(ManageListMembershipRequestItem);
  const TransactionID = IDL.Nat;
  const ManageListMembershipError = IDL.Variant({
    'TooManyRequests' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
    'Exists' : IDL.Null,
  });
  const ManageListMembershipResult = IDL.Opt(
    IDL.Variant({ 'Ok' : TransactionID, 'Err' : ManageListMembershipError })
  );
  const ManageListMembershipResponse = IDL.Vec(ManageListMembershipResult);
  const ManageListPropertyRequestAction = IDL.Variant({
    'Metadata' : IDL.Record({
      'key' : IDL.Text,
      'value' : IDL.Opt(DataItem__1),
    }),
    'Rename' : IDL.Text,
    'ChangePermissions' : IDL.Variant({
      'Read' : IDL.Variant({ 'Add' : ListItem__2, 'Remove' : ListItem__2 }),
      'Write' : IDL.Variant({ 'Add' : ListItem__2, 'Remove' : ListItem__2 }),
      'Admin' : IDL.Variant({ 'Add' : ListItem__2, 'Remove' : ListItem__2 }),
      'Permissions' : IDL.Variant({
        'Add' : ListItem__2,
        'Remove' : ListItem__2,
      }),
    }),
    'Delete' : IDL.Null,
    'Create' : IDL.Record({
      'members' : IDL.Vec(IDL.Tuple(ListItem__2, IDL.Opt(DataItemMap))),
      'admin' : IDL.Opt(ListItem__2),
      'metadata' : DataItemMap,
    }),
  });
  const ManageListPropertyRequestItem = IDL.Record({
    'action' : ManageListPropertyRequestAction,
    'list' : List,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(IDL.Nat),
  });
  const ManageListPropertyRequest = IDL.Vec(ManageListPropertyRequestItem);
  const ManageListPropertyError = IDL.Variant({
    'TooManyRequests' : IDL.Null,
    'IllegalAdmin' : IDL.Null,
    'IllegalPermission' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
    'Exists' : IDL.Null,
  });
  const ManageListPropertyResult = IDL.Opt(
    IDL.Variant({ 'Ok' : TransactionID, 'Err' : ManageListPropertyError })
  );
  const ManageListPropertyResponse = IDL.Vec(ManageListPropertyResult);
  const Token84 = IDL.Variant({ 'cycles' : IDL.Null, 'icrc1' : IDL.Principal });
  const DepositArgs = IDL.Record({
    'token' : Token84,
    'from' : IDL.Opt(
      IDL.Record({
        'owner' : IDL.Principal,
        'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      })
    ),
    'amount' : IDL.Nat,
    'expected_fee' : IDL.Opt(IDL.Nat),
  });
  const DepositResponse = IDL.Record({
    'txid' : IDL.Opt(IDL.Nat),
    'credit' : IDL.Int,
  });
  const NotifyResult = IDL.Record({
    'credit_inc' : IDL.Nat,
    'credit' : IDL.Int,
  });
  const TokenInfo = IDL.Record({
    'withdrawal_fee' : IDL.Nat,
    'deposit_fee' : IDL.Nat,
  });
  const BalanceResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const WithdrawArgs = IDL.Record({
    'to' : Account,
    'token' : Token84,
    'amount' : IDL.Nat,
  });
  const WithdrawError = IDL.Variant({
    'NotAllowed' : IDL.Null,
    'TransferFailed' : IDL.Text,
    'LimitExceeded' : IDL.Null,
  });
  const WithdrawResult = IDL.Variant({
    'Ok' : IDL.Record({ 'amt' : IDL.Nat, 'txId' : IDL.Nat }),
    'Err' : WithdrawError,
  });
  const ShareArgs = IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat));
  const ShareCycleError = IDL.Variant({
    'NotEnoughCycles' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'CustomError' : IDL.Text,
  });
  const ShareResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ShareCycleError });
  const Domain = IDL.Vec(IDL.Text);
  const DomainApprovalRequest = IDL.Record({
    'domain' : Domain,
    'validationCode' : IDL.Text,
  });
  const DomainApprovalResponse = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : IDL.Variant({
      'ValidationSuccededButTransferError' : IDL.Record({
        'message' : IDL.Text,
      }),
      'ValidationRecordNotFound' : IDL.Null,
    }),
  });
  const DomainClaimRequest = IDL.Record({
    'controllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'domain' : Domain,
    'gateAccount' : IDL.Opt(Account),
    'validationCode' : IDL.Opt(IDL.Text),
  });
  const DomainClaimResponse = IDL.Variant({
    'Ok' : IDL.Record({
      'controllers' : IDL.Vec(IDL.Principal),
      'domain' : Domain,
    }),
    'Err' : IDL.Variant({
      'ValidationRecordNotApproved' : IDL.Null,
      'ValidationGateFailed' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'ValidationRecordNotFound' : IDL.Null,
    }),
    'RecordExists' : IDL.Record({
      'controllers' : IDL.Vec(IDL.Principal),
      'domain' : Domain,
    }),
    'ValidationRequired' : IDL.Record({
      'controllers' : IDL.Vec(IDL.Principal),
      'domain' : Domain,
      'existingControllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
      'validation' : IDL.Text,
    }),
  });
  const DomainValidationRecord = IDL.Record({
    'controllers' : IDL.Vec(IDL.Principal),
    'domain' : Domain,
    'approved' : IDL.Bool,
    'validationTime' : IDL.Int,
    'validation' : IDL.Text,
  });
  const NamespaceLookupResponse = IDL.Record({
    'balance' : IDL.Nat,
    'account' : Account,
    'namespace' : IDL.Vec(IDL.Text),
  });
  const ReplayTx = IDL.Variant({
    'burn' : IDL.Record({
      'amt' : IDL.Nat,
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
    'mint' : IDL.Record({
      'to' : Account,
      'amt' : IDL.Nat,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
    'xfer' : IDL.Record({
      'to' : Account,
      'amt' : IDL.Nat,
      'fee' : IDL.Opt(IDL.Nat),
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
    'approve' : IDL.Record({
      'amt' : IDL.Nat,
      'fee' : IDL.Opt(IDL.Nat),
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'expires_at' : IDL.Opt(IDL.Nat64),
      'spender' : Account,
    }),
    'xfer_from' : IDL.Record({
      'to' : Account,
      'amt' : IDL.Nat,
      'fee' : IDL.Opt(IDL.Nat),
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'spender' : Account,
    }),
  });
  const ReplayBlock = IDL.Record({
    'id' : IDL.Nat,
    'ts' : IDL.Nat,
    'tx' : ReplayTx,
    'btype' : IDL.Text,
  });
  const ReplayResult = IDL.Variant({
    'Ok' : IDL.Record({ 'lastIndex' : IDL.Nat, 'processed' : IDL.Nat }),
    'Err' : IDL.Variant({
      'InvalidBlock' : IDL.Record({ 'index' : IDL.Nat, 'reason' : IDL.Text }),
      'NotAuthorized' : IDL.Null,
      'AlreadyMigrated' : IDL.Null,
    }),
  });
  const Token = IDL.Service({
    'admin_init' : IDL.Func([], [], []),
    'admin_update_cyclesLedger' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'admin_update_devAccount' : IDL.Func([Account], [IDL.Bool], []),
    'admin_update_icrc1' : IDL.Func(
        [IDL.Vec(UpdateLedgerInfoRequest__2)],
        [IDL.Vec(IDL.Bool)],
        [],
      ),
    'admin_update_icrc2' : IDL.Func(
        [IDL.Vec(UpdateLedgerInfoRequest__1)],
        [IDL.Vec(IDL.Bool)],
        [],
      ),
    'admin_update_icrc4' : IDL.Func(
        [IDL.Vec(UpdateLedgerInfoRequest)],
        [IDL.Vec(IDL.Bool)],
        [],
      ),
    'admin_update_minCycles' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'admin_update_owner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'archives' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'block_range_end' : IDL.Nat,
              'canister_id' : IDL.Principal,
              'block_range_start' : IDL.Nat,
            })
          ),
        ],
        [],
      ),
    'deposit_cycles' : IDL.Func([], [], []),
    'finalize_replay' : IDL.Func(
        [],
        [
          IDL.Variant({
            'Ok' : IDL.Null,
            'Err' : IDL.Variant({ 'NotAuthorized' : IDL.Null }),
          }),
        ],
        [],
      ),
    'get_blocks' : IDL.Func(
        [IDL.Record({ 'start' : IDL.Nat, 'length' : IDL.Nat })],
        [RosettaGetBlocksResponse],
        ['query'],
      ),
    'get_cycles' : IDL.Func([], [IDL.Nat], []),
    'get_icrc85_stats' : IDL.Func(
        [],
        [
          IDL.Record({
            'activeActions' : IDL.Nat,
            'nextCycleActionId' : IDL.Opt(IDL.Nat),
            'lastActionReported' : IDL.Opt(IDL.Nat),
          }),
        ],
        ['query'],
      ),
    'get_tip' : IDL.Func([], [Tip], ['query']),
    'get_transactions' : IDL.Func(
        [IDL.Record({ 'start' : IDL.Nat, 'length' : IDL.Nat })],
        [GetTransactionsResponse],
        ['query'],
      ),
    'icrc103_get_allowances' : IDL.Func(
        [GetAllowancesArgs],
        [AllowanceResult],
        ['query'],
      ),
    'icrc10_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc130_get_allowances' : IDL.Func(
        [GetAllowancesArgs],
        [AllowanceResult],
        ['query'],
      ),
    'icrc1_balance_of' : IDL.Func([Account], [Balance], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [Balance], ['query']),
    'icrc1_metadata' : IDL.Func([], [IDL.Vec(MetaDatum)], ['query']),
    'icrc1_minting_account' : IDL.Func([], [IDL.Opt(Account)], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [Balance], ['query']),
    'icrc1_transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'icrc2_allowance' : IDL.Func([AllowanceArgs], [Allowance], ['query']),
    'icrc2_approve' : IDL.Func([ApproveArgs], [ApproveResponse], []),
    'icrc2_get_stats' : IDL.Func([], [Stats__4], ['query']),
    'icrc2_transfer_from' : IDL.Func(
        [TransferFromArgs],
        [TransferFromResponse],
        [],
      ),
    'icrc3_get_archives' : IDL.Func(
        [GetArchivesArgs],
        [GetArchivesResult],
        ['query'],
      ),
    'icrc3_get_blocks' : IDL.Func(
        [GetBlocksArgs],
        [GetBlocksResult],
        ['query'],
      ),
    'icrc3_get_stats' : IDL.Func([], [Stats], ['query']),
    'icrc3_get_tip_certificate' : IDL.Func(
        [],
        [IDL.Opt(DataCertificate)],
        ['query'],
      ),
    'icrc3_supported_block_types' : IDL.Func(
        [],
        [IDL.Vec(BlockType)],
        ['query'],
      ),
    'icrc4_balance_of_batch' : IDL.Func(
        [BalanceQueryArgs],
        [BalanceQueryResult],
        ['query'],
      ),
    'icrc4_get_stats' : IDL.Func([], [Stats__3], ['query']),
    'icrc4_maximum_query_batch_size' : IDL.Func(
        [],
        [IDL.Opt(IDL.Nat)],
        ['query'],
      ),
    'icrc4_maximum_update_batch_size' : IDL.Func(
        [],
        [IDL.Opt(IDL.Nat)],
        ['query'],
      ),
    'icrc4_transfer_batch' : IDL.Func(
        [TransferBatchArgs],
        [TransferBatchResults],
        [],
      ),
    'icrc75_get_icrc85_stats' : IDL.Func(
        [],
        [
          IDL.Opt(
            IDL.Record({
              'activeActions' : IDL.Nat,
              'nextCycleActionId' : IDL.Opt(IDL.Nat),
              'lastActionReported' : IDL.Opt(IDL.Nat),
            })
          ),
        ],
        ['query'],
      ),
    'icrc75_get_list_lists' : IDL.Func(
        [List, IDL.Opt(List), IDL.Opt(IDL.Nat)],
        [IDL.Vec(List)],
        ['query'],
      ),
    'icrc75_get_list_members_admin' : IDL.Func(
        [List, IDL.Opt(ListItem), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Tuple(ListItem, IDL.Opt(DataItemMap)))],
        ['query'],
      ),
    'icrc75_get_list_permissions_admin' : IDL.Func(
        [
          List,
          IDL.Opt(Permission),
          IDL.Opt(PermissionListItem__1),
          IDL.Opt(IDL.Nat),
        ],
        [PermissionList__1],
        ['query'],
      ),
    'icrc75_get_lists' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Bool, IDL.Opt(List), IDL.Opt(IDL.Nat)],
        [IDL.Vec(ListRecord)],
        ['query'],
      ),
    'icrc75_get_stats' : IDL.Func([], [Stats__1], ['query']),
    'icrc75_is_member' : IDL.Func(
        [IDL.Vec(AuthorizedRequestItem)],
        [IDL.Vec(IDL.Bool)],
        ['query'],
      ),
    'icrc75_manage' : IDL.Func([ManageRequest], [ManageResponse], []),
    'icrc75_manage_list_membership' : IDL.Func(
        [ManageListMembershipRequest],
        [ManageListMembershipResponse],
        [],
      ),
    'icrc75_manage_list_properties' : IDL.Func(
        [ManageListPropertyRequest],
        [ManageListPropertyResponse],
        [],
      ),
    'icrc75_member_of' : IDL.Func(
        [ListItem, IDL.Opt(List), IDL.Opt(IDL.Nat)],
        [IDL.Vec(List)],
        ['query'],
      ),
    'icrc75_metadata' : IDL.Func([], [DataItemMap], ['query']),
    'icrc84_all_credits' : IDL.Func(
        [IDL.Opt(Token84), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Tuple(Token84, IDL.Int))],
        ['query'],
      ),
    'icrc84_credits' : IDL.Func([Token84], [IDL.Int], ['query']),
    'icrc84_deposit' : IDL.Func([DepositArgs], [DepositResponse], []),
    'icrc84_notify' : IDL.Func(
        [IDL.Record({ 'token' : Token84 })],
        [NotifyResult],
        [],
      ),
    'icrc84_supported_tokens' : IDL.Func(
        [IDL.Opt(Token84), IDL.Opt(IDL.Nat)],
        [IDL.Vec(Token84)],
        ['query'],
      ),
    'icrc84_token_info' : IDL.Func([Token84], [TokenInfo], ['query']),
    'icrc84_trackedDeposit' : IDL.Func([Token84], [BalanceResult], ['query']),
    'icrc84_withdraw' : IDL.Func([WithdrawArgs], [WithdrawResult], []),
    'icrc85_deposit_cycles' : IDL.Func([ShareArgs], [ShareResult], []),
    'icrc85_namespace_account' : IDL.Func([IDL.Text], [Account], ['query']),
    'icrc86_approve_domain' : IDL.Func(
        [DomainApprovalRequest],
        [DomainApprovalResponse],
        [],
      ),
    'icrc86_claim_domain' : IDL.Func(
        [DomainClaimRequest],
        [DomainClaimResponse],
        [],
      ),
    'icrc86_domain_look_up' : IDL.Func(
        [IDL.Vec(Domain)],
        [
          IDL.Vec(
            IDL.Tuple(
              IDL.Opt(IDL.Vec(IDL.Principal)),
              IDL.Opt(DomainValidationRecord),
            )
          ),
        ],
        ['query'],
      ),
    'icrc86_namespace_look_up' : IDL.Func(
        [IDL.Vec(IDL.Vec(IDL.Text))],
        [IDL.Vec(IDL.Opt(NamespaceLookupResponse))],
        ['query'],
      ),
    'is_replay_complete' : IDL.Func([], [IDL.Bool], ['query']),
    'replay_blocks' : IDL.Func([IDL.Vec(ReplayBlock)], [ReplayResult], []),
    'stats' : IDL.Func(
        [],
        [
          IDL.Record({
            'icrc1' : IDL.Record({
              'fee' : Balance,
              'decimals' : IDL.Nat8,
              'minting_account' : Account,
              'name' : IDL.Text,
              'total_supply' : IDL.Nat,
              'symbol' : IDL.Text,
            }),
            'icrc3' : Stats,
          }),
        ],
        ['query'],
      ),
  });
  return Token;
};
export const init = ({ IDL }) => {
  const CandyShared = IDL.Rec();
  const Value = IDL.Rec();
  const Permission = IDL.Variant({
    'Read' : IDL.Null,
    'Write' : IDL.Null,
    'Admin' : IDL.Null,
    'Permissions' : IDL.Null,
  });
  const List = IDL.Text;
  const PropertyShared = IDL.Record({
    'value' : CandyShared,
    'name' : IDL.Text,
    'immutable' : IDL.Bool,
  });
  CandyShared.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, CandyShared)),
      'Nat' : IDL.Nat,
      'Set' : IDL.Vec(CandyShared),
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Ints' : IDL.Vec(IDL.Int),
      'Nat8' : IDL.Nat8,
      'Nats' : IDL.Vec(IDL.Nat),
      'Text' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(CandyShared),
      'Floats' : IDL.Vec(IDL.Float64),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Vec(CandyShared),
      'ValueMap' : IDL.Vec(IDL.Tuple(CandyShared, CandyShared)),
      'Class' : IDL.Vec(PropertyShared),
    })
  );
  const DataItem = IDL.Variant({
    'Int' : IDL.Int,
    'Map' : IDL.Vec(IDL.Tuple(IDL.Text, CandyShared)),
    'Nat' : IDL.Nat,
    'Set' : IDL.Vec(CandyShared),
    'Nat16' : IDL.Nat16,
    'Nat32' : IDL.Nat32,
    'Nat64' : IDL.Nat64,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Bool' : IDL.Bool,
    'Int8' : IDL.Int8,
    'Ints' : IDL.Vec(IDL.Int),
    'Nat8' : IDL.Nat8,
    'Nats' : IDL.Vec(IDL.Nat),
    'Text' : IDL.Text,
    'Bytes' : IDL.Vec(IDL.Nat8),
    'Int16' : IDL.Int16,
    'Int32' : IDL.Int32,
    'Int64' : IDL.Int64,
    'Option' : IDL.Opt(CandyShared),
    'Floats' : IDL.Vec(IDL.Float64),
    'Float' : IDL.Float64,
    'Principal' : IDL.Principal,
    'Array' : IDL.Vec(CandyShared),
    'ValueMap' : IDL.Vec(IDL.Tuple(CandyShared, CandyShared)),
    'Class' : IDL.Vec(PropertyShared),
  });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Identity = IDL.Principal;
  const ListItem = IDL.Variant({
    'List' : List,
    'DataItem' : DataItem,
    'Account' : Account,
    'Identity' : Identity,
  });
  const PermissionListItem = IDL.Tuple(Permission, ListItem);
  const PermissionList = IDL.Vec(PermissionListItem);
  const ICRC16MapItem = IDL.Tuple(IDL.Text, DataItem);
  const ICRC16Map = IDL.Vec(ICRC16MapItem);
  const NamespaceRecordShared = IDL.Record({
    'permissions' : PermissionList,
    'members' : IDL.Vec(IDL.Tuple(ListItem, IDL.Opt(ICRC16Map))),
    'metadata' : ICRC16Map,
    'namespace' : IDL.Text,
  });
  const InitArgs__4 = IDL.Record({
    'existingNamespaces' : IDL.Opt(IDL.Vec(NamespaceRecordShared)),
    'cycleShareTimerID' : IDL.Opt(IDL.Nat),
    'certificateNonce' : IDL.Opt(IDL.Nat),
  });
  const Fee = IDL.Variant({ 'Environment' : IDL.Null, 'Fixed' : IDL.Nat });
  const Balance = IDL.Nat;
  const Memo = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat64;
  const Burn = IDL.Record({
    'from' : Account,
    'memo' : IDL.Opt(Memo),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Balance,
  });
  const Mint = IDL.Record({
    'to' : Account,
    'memo' : IDL.Opt(Memo),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Balance,
  });
  const TxIndex = IDL.Nat;
  const Transfer = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(Balance),
    'from' : Account,
    'memo' : IDL.Opt(Memo),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Balance,
  });
  const Transaction = IDL.Record({
    'burn' : IDL.Opt(Burn),
    'kind' : IDL.Text,
    'mint' : IDL.Opt(Mint),
    'timestamp' : Timestamp,
    'index' : TxIndex,
    'transfer' : IDL.Opt(Transfer),
  });
  const AdvancedSettings = IDL.Record({
    'existing_balances' : IDL.Vec(IDL.Tuple(Account, Balance)),
    'burned_tokens' : Balance,
    'fee_collector_emitted' : IDL.Bool,
    'minted_tokens' : Balance,
    'local_transactions' : IDL.Vec(Transaction),
    'fee_collector_block' : IDL.Nat,
  });
  Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, Value)),
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(Value),
    })
  );
  const InitArgs = IDL.Record({
    'fee' : IDL.Opt(Fee),
    'advanced_settings' : IDL.Opt(AdvancedSettings),
    'max_memo' : IDL.Opt(IDL.Nat),
    'decimals' : IDL.Nat8,
    'metadata' : IDL.Opt(Value),
    'minting_account' : IDL.Opt(Account),
    'logo' : IDL.Opt(IDL.Text),
    'permitted_drift' : IDL.Opt(Timestamp),
    'name' : IDL.Opt(IDL.Text),
    'settle_to_accounts' : IDL.Opt(IDL.Nat),
    'fee_collector' : IDL.Opt(Account),
    'transaction_window' : IDL.Opt(Timestamp),
    'min_burn_amount' : IDL.Opt(Balance),
    'max_supply' : IDL.Opt(Balance),
    'max_accounts' : IDL.Opt(IDL.Nat),
    'symbol' : IDL.Opt(IDL.Text),
  });
  const Fee__1 = IDL.Variant({
    'ICRC1' : IDL.Null,
    'Environment' : IDL.Null,
    'Fixed' : IDL.Nat,
  });
  const ApprovalInfo = IDL.Record({
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'amount' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : Account,
  });
  const AdvancedSettings__1 = IDL.Record({
    'existing_approvals' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(Account, Account), ApprovalInfo)
    ),
  });
  const MaxAllowance = IDL.Variant({
    'TotalSupply' : IDL.Null,
    'Fixed' : IDL.Nat,
  });
  const InitArgs__1 = IDL.Record({
    'fee' : IDL.Opt(Fee__1),
    'advanced_settings' : IDL.Opt(AdvancedSettings__1),
    'max_allowance' : IDL.Opt(MaxAllowance),
    'max_approvals' : IDL.Opt(IDL.Nat),
    'icrc103_max_take_value' : IDL.Opt(IDL.Nat),
    'cleanup_on_zero_balance' : IDL.Opt(IDL.Bool),
    'icrc103_public_allowances' : IDL.Opt(IDL.Bool),
    'max_approvals_per_account' : IDL.Opt(IDL.Nat),
    'settle_to_approvals' : IDL.Opt(IDL.Nat),
    'cleanup_interval' : IDL.Opt(IDL.Nat),
  });
  const IndexType = IDL.Variant({
    'Stable' : IDL.Null,
    'StableTyped' : IDL.Null,
    'Managed' : IDL.Null,
  });
  const BlockType = IDL.Record({ 'url' : IDL.Text, 'block_type' : IDL.Text });
  const InitArgs__2 = IDL.Record({
    'maxRecordsToArchive' : IDL.Nat,
    'archiveIndexType' : IndexType,
    'maxArchivePages' : IDL.Nat,
    'settleToRecords' : IDL.Nat,
    'archiveCycles' : IDL.Nat,
    'maxActiveRecords' : IDL.Nat,
    'maxRecordsInArchiveInstance' : IDL.Nat,
    'archiveControllers' : IDL.Opt(IDL.Opt(IDL.Vec(IDL.Principal))),
    'supportedBlocks' : IDL.Vec(BlockType),
  });
  const InitArgs__3 = IDL.Record({
    'fee' : IDL.Opt(Fee__1),
    'max_balances' : IDL.Opt(IDL.Nat),
    'max_transfers' : IDL.Opt(IDL.Nat),
  });
  return [
    IDL.Opt(
      IDL.Record({
        'icrc75' : InitArgs__4,
        'icrc1' : IDL.Opt(InitArgs),
        'icrc2' : IDL.Opt(InitArgs__1),
        'icrc3' : InitArgs__2,
        'icrc4' : IDL.Opt(InitArgs__3),
      })
    ),
  ];
};
