export const idlFactory = ({ IDL }) => {
  const Value = IDL.Rec();
  const UpgradeArg = IDL.Record({
    'ledger_id' : IDL.Opt(IDL.Principal),
    'retrieve_blocks_from_ledger_interval_seconds' : IDL.Opt(IDL.Nat64),
    'icrc85_collector' : IDL.Opt(IDL.Principal),
  });
  const InitArg = IDL.Record({
    'ledger_id' : IDL.Principal,
    'retrieve_blocks_from_ledger_interval_seconds' : IDL.Opt(IDL.Nat64),
    'icrc85_collector' : IDL.Opt(IDL.Principal),
  });
  const IndexArg = IDL.Variant({ 'Upgrade' : UpgradeArg, 'Init' : InitArg });
  const BlockIndex64 = IDL.Nat64;
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const GetAccountTransactionsArgs = IDL.Record({
    'max_results' : IDL.Nat,
    'start' : IDL.Opt(BlockIndex64),
    'account' : Account,
  });
  const Tokens = IDL.Nat;
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
  const TransactionWithId = IDL.Record({
    'id' : BlockIndex64,
    'transaction' : Value,
  });
  const GetAccountTransactionsResponse = IDL.Record({
    'balance' : Tokens,
    'transactions' : IDL.Vec(TransactionWithId),
    'oldest_tx_id' : IDL.Opt(BlockIndex64),
  });
  const GetAccountTransactionsError = IDL.Record({ 'message' : IDL.Text });
  const Result = IDL.Variant({
    'ok' : GetAccountTransactionsResponse,
    'err' : GetAccountTransactionsError,
  });
  const GetBlocksRequest = IDL.Record({
    'start' : IDL.Nat,
    'length' : IDL.Nat,
  });
  const GetBlocksResponse = IDL.Record({
    'blocks' : IDL.Vec(Value),
    'chain_length' : IDL.Nat64,
  });
  const BlockRange = IDL.Record({
    'start' : BlockIndex64,
    'length' : IDL.Nat64,
  });
  const FeeCollectorRanges = IDL.Record({
    'fee_collector' : IDL.Opt(Account),
    'ranges' : IDL.Vec(BlockRange),
  });
  const GetBlocksMethod = IDL.Variant({
    'ICRC3GetBlocks' : IDL.Null,
    'GetBlocks' : IDL.Null,
  });
  const Stats = IDL.Record({
    'get_blocks_method' : IDL.Opt(GetBlocksMethod),
    'cycles_balance' : IDL.Nat,
    'sync_interval_seconds' : IDL.Nat64,
    'log_entries' : IDL.Nat,
    'ledger_id' : IDL.Principal,
    'fee_collector' : IDL.Opt(Account),
    'is_syncing' : IDL.Bool,
    'heap_memory' : IDL.Nat,
    'fee_collector_ranges' : IDL.Nat,
    'num_accounts' : IDL.Nat,
    'num_blocks_synced' : IDL.Nat64,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'status_code' : IDL.Nat16,
  });
  const ListSubaccountsArgs = IDL.Record({
    'owner' : IDL.Principal,
    'start' : IDL.Opt(Subaccount),
  });
  const Status = IDL.Record({ 'num_blocks_synced' : BlockIndex64 });
  const ICRCIndex = IDL.Service({
    'cycles' : IDL.Func([], [IDL.Nat], ['query']),
    'get_account_transactions' : IDL.Func(
        [GetAccountTransactionsArgs],
        [Result],
        ['query'],
      ),
    'get_blocks' : IDL.Func([GetBlocksRequest], [GetBlocksResponse], ['query']),
    'get_fee_collectors_ranges' : IDL.Func([], [FeeCollectorRanges], ['query']),
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
    'get_oldest_tx_id' : IDL.Func([Account], [IDL.Opt(IDL.Nat64)], ['query']),
    'get_stats' : IDL.Func([], [Stats], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'icrc1_balance_of' : IDL.Func([Account], [IDL.Nat], ['query']),
    'ledger_id' : IDL.Func([], [IDL.Principal], ['query']),
    'list_subaccounts' : IDL.Func(
        [ListSubaccountsArgs],
        [IDL.Vec(Subaccount)],
        ['query'],
      ),
    'notify' : IDL.Func([IDL.Nat], [], []),
    'status' : IDL.Func([], [Status], ['query']),
  });
  return ICRCIndex;
};
export const init = ({ IDL }) => {
  const UpgradeArg = IDL.Record({
    'ledger_id' : IDL.Opt(IDL.Principal),
    'retrieve_blocks_from_ledger_interval_seconds' : IDL.Opt(IDL.Nat64),
    'icrc85_collector' : IDL.Opt(IDL.Principal),
  });
  const InitArg = IDL.Record({
    'ledger_id' : IDL.Principal,
    'retrieve_blocks_from_ledger_interval_seconds' : IDL.Opt(IDL.Nat64),
    'icrc85_collector' : IDL.Opt(IDL.Principal),
  });
  const IndexArg = IDL.Variant({ 'Upgrade' : UpgradeArg, 'Init' : InitArg });
  return [IDL.Opt(IndexArg)];
};
