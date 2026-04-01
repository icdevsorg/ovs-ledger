/// Token.mo - CycleShareLedger using library mixin includes
/// Uses includes for ALL ICRC standards (1, 2, 3, 4, 75)

import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import D "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Timer "mo:base/Timer";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Order "mo:base/Order";

import CertTree "mo:ic-certification/CertTree";
import CoreMap "mo:core/Map";
import CoreVector "mo:vector";
import List "mo:core/List";

import ICRC1 "mo:icrc1-mo/ICRC1";
import ICRC1Mixin "mo:icrc1-mo/ICRC1/mixin";
import ICRC2 "mo:icrc2-mo/ICRC2";
import ICRC2Mixin "mo:icrc2-mo/ICRC2/mixin";
import ICRC2Service "mo:icrc2-mo/ICRC2/service";
import ICRC3 "mo:icrc3-mo/";
import ICRC3Helper "mo:icrc3-mo/helper";
import ICRC3Mixin "mo:icrc3-mo/mixin";
import ICRC4 "mo:icrc4-mo/ICRC4";
import ICRC4Mixin "mo:icrc4-mo/ICRC4/mixin";
import ICRC75 "mo:icrc75-mo";
import ICRC75Mixin "mo:icrc75-mo/mixin";
import Service75 "mo:icrc75-mo/service";
import ClassPlus "mo:class-plus";
import TT "mo:timer-tool";
import TimerToolMixin "mo:timer-tool/TimerToolMixin";
import Sha256 "mo:sha2/Sha256";
import Error "mo:base/Error";
import Star "mo:star/star";

import CyclesLedger "CycleLedger";
import CMC "cmc";

shared ({ caller = _owner }) persistent actor class Token(args: ?{
  icrc1 : ?ICRC1.InitArgs;
  icrc2 : ?ICRC2.InitArgs;
  icrc3 : ICRC3.InitArgs;
  icrc4 : ?ICRC4.InitArgs;
  icrc75 : ICRC75.InitArgs;
}) = this {

  // ==========================================================================
  // Debug Configuration
  // ==========================================================================
  transient let _debug_channel = {
    announce = true;
    rate = true;
    share = true;
    namespace = true;
  };

  // ==========================================================================
  // Configuration defaults and argument merging
  // ==========================================================================
  transient let canisterId = Principal.fromActor(this);
  transient let org_icdevs_class_plus_manager = ClassPlus.ClassPlusInitializationManager<system>(_owner, canisterId, true);

  let icrc1_defaults : ICRC1.InitArgs = {
    name = ?"Open Value Sharing Ledger";
    symbol = ?"OVSdv";
    logo = ?"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAEpJREFUeNrtz...";
    decimals = 12;
    fee = ?#Fixed(100_000_000);
    minting_account = ?{ owner = canisterId; subaccount = null }; // Canister is minting account for internal minting
    max_supply = null;
    min_burn_amount = ?100_000_000;
    max_memo = ?32;
    advanced_settings = null;
    metadata = null;
    fee_collector = null;
    transaction_window = null;
    permitted_drift = null;
    max_accounts = ?100000000;
    settle_to_accounts = ?99999000;
  };

  let icrc2_defaults : ICRC2.InitArgs = {
    max_approvals_per_account = ?10000;
    max_allowance = ?#TotalSupply;
    fee = ?#ICRC1;
    advanced_settings = null;
    max_approvals = ?10000000;
    settle_to_approvals = ?9990000;
    cleanup_interval = null;
    cleanup_on_zero_balance = null;
    icrc103_max_take_value = ?1000;
    icrc103_public_allowances = ?true;
  };

  let icrc3_defaults : ICRC3.InitArgs = {
    maxActiveRecords = 3000;
    settleToRecords = 2000;
    maxRecordsInArchiveInstance = 10000000;
    maxArchivePages = 62500;
    archiveIndexType = #Stable;
    maxRecordsToArchive = 8000;
    archiveCycles = 6_000_000_000_000;
    archiveControllers = ??[Principal.fromText("5vdms-kaaaa-aaaap-aa3uq-cai"), Principal.fromText("mctz3-uvscw-rbtha-zdzis-q46vd-vzbza-bxjk5-mleuf-jml6g-s2hq3-vqe")];
    supportedBlocks = [
      { block_type = "1xfer"; url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3" },
      { block_type = "2xfer"; url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3" },
      { block_type = "2approve"; url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3" },
      { block_type = "1mint"; url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3" },
      { block_type = "1burn"; url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3" },
    ];
  };

  let icrc4_defaults : ICRC4.InitArgs = {
    max_balances = ?200;
    max_transfers = ?200;
    fee = ?#ICRC1;
  };

  let icrc75_defaults : ?ICRC75.InitArgs = ?{ 
    existingNamespaces = null;
    certificateNonce = null;
    cycleShareTimerID = null;
  };

  // Merge user args with defaults
  transient let icrc1_args = switch(args) {
    case(?a) switch(a.icrc1) {
      case(?v) { { v with minting_account = switch(v.minting_account) { case(?m) ?m; case(null) icrc1_defaults.minting_account } } };
      case(null) icrc1_defaults;
    };
    case(null) icrc1_defaults;
  };
  transient let icrc2_args = switch(args) { case(?a) switch(a.icrc2) { case(?v) v; case(null) icrc2_defaults }; case(null) icrc2_defaults };
  transient let icrc3_args = switch(args) { case(?a) a.icrc3; case(null) icrc3_defaults };
  transient let icrc4_args = switch(args) { case(?a) switch(a.icrc4) { case(?v) v; case(null) icrc4_defaults }; case(null) icrc4_defaults };
  transient let icrc75_args = switch(args) { case(?a) ?a.icrc75; case(null) icrc75_defaults };

  // ==========================================================================
  // Stable State
  // ==========================================================================
  let cert_store : CertTree.Store = CertTree.newStore();
  var owner = _owner;
  var _init = false;

  //============================================================================
  // Index Push Notification State
  //============================================================================

  // Pending notify action ID (prevents duplicate scheduling)
  var pending_notify_action_id : ?Nat = null;

  // Configuration: delay before sending notify (allows batching multiple blocks)
  let INDEX_NOTIFY_DELAY_NS : Nat = 2_000_000_000; // 2 seconds

  // CycleShareLedger-specific state (some prefixed _ as temporarily unused until full implementation)
  var _namespaceAccounts : CoreMap.Map<Text, ICRC1.Account> = CoreMap.empty();
  var _domainOwners: CoreMap.Map<[Text], [Principal]> = CoreMap.empty();
  var _domainValidation: CoreMap.Map<[Text], DomainValidationRecord> = CoreMap.empty();
  var _failedDeposit : CoreVector.Vector<(Nat, ShareArgs)> = CoreVector.new();
  var pendingTransfers : CoreVector.Vector<WithdrawArgs> = CoreVector.new();
  var pendingClaims : CoreVector.Vector<ClaimArgs> = CoreVector.new();
  var _xdr_permyriad_per_icp : Nat64 = 50000; // Default ~5 XDR per ICP, updated from CMC
  var _lastXDRRate : Int = 0;
  var minCycles : Nat = 20_000_000_000_000;
  var CyclesLedger_CANISTER_ID = CyclesLedger.CANISTER_ID;
  var devAccount : ICRC1.Account = {
    owner = Principal.fromText("p75el-ys2la-2xa6n-unek2-gtnwo-7zklx-25vdp-uepyz-qhdg7-pt2fi-bqe");
    subaccount = ?Blob.fromArray([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  };

  // ==========================================================================
  // Types
  // ==========================================================================
  type Domain = [Text];
  type List = ICRC75.List;
  type ListItem = ICRC75.ListItem;
  type ListRecord = Service75.ListRecord;
  type Permission = ICRC75.Permission;
  type PermissionListItem = Service75.PermissionListItem;
  type PermissionList = Service75.PermissionList;
  type AuthorizedRequestItem = Service75.AuthorizedRequestItem;
  type ManageRequest = Service75.ManageRequest;
  type ManageResponse = Service75.ManageResponse;
  type ManageListMembershipRequest = Service75.ManageListMembershipRequest;
  type ManageListMembershipResponse = Service75.ManageListMembershipResponse;
  type ManageListPropertyRequest = Service75.ManageListPropertyRequest;
  type ManageListPropertyResponse = Service75.ManageListPropertyResponse;
  type ManageListMembershipRequestItem = Service75.ManageListMembershipRequestItem;
  type ManageListPropertyRequestItem = Service75.ManageListPropertyRequestItem;
  type DataItemMap = Service75.DataItemMap;

  type ClaimArgs = { namespace: Text; account: ICRC1.Account };
  type ShareArgs = [(Text, Nat)];
  type ShareResult = { #Ok: Nat; #Err: ShareCycleError };
  type ShareCycleError = { #NotEnoughCycles: (Nat, Nat); #CustomError: Text };
  type WithdrawArgs = { to: ICRC1.Account; amount: Nat; token: Token84 };
  type WithdrawResult = { #Ok: { txId: Nat; amt: Nat }; #Err: WithdrawError };
  type WithdrawError = { #TransferFailed: Text; #NotAllowed; #LimitExceeded };
  type Token84 = { #icrc1: Principal; #cycles };
  type TokenInfo = { deposit_fee: Nat; withdrawal_fee: Nat };
  type BalanceResult = { #Ok: Nat; #Err: Text };
  type DepositArgs = { token: Token84; amount: Nat; from: ?{ owner: Principal; subaccount: ?Blob }; expected_fee: ?Nat };
  type DepositResponse = { credit: Int; txid: ?Nat; };
  type NotifyResult = { credit: Int; credit_inc: Nat; };

  // ICRC-86 Types
  type DomainValidationRecord = {
    controllers: [Principal];
    domain: Domain;
    validation: Text;
    approved: Bool;
    validationTime: Int;
  };

  type DomainClaimRequest = {
    domain: Domain;
    gateAccount: ?ICRC1.Account;
    controllers: ?[Principal];
    validationCode: ?Text;
  };

  type DomainClaimResponse = {
    #ValidationRequired: {
      controllers: [Principal];
      existingControllers: ?[Principal];
      domain: Domain;
      validation: Text;
    };
    #Ok: {
      controllers: [Principal];
      domain: Domain;
    };
    #RecordExists: {
      controllers: [Principal];
      domain: Domain;
    };
    #Err: {
      #ValidationGateFailed;
      #ValidationRecordNotFound;
      #ValidationRecordNotApproved;
      #Unauthorized;
    };
  };

  type DomainApprovalRequest = {
    domain: Domain;
    validationCode: Text;
  };

  type DomainApprovalResponse = {
    #Ok;
    #Err: {
      #ValidationRecordNotFound;
      #ValidationSuccededButTransferError: { message: Text };
    };
  };

  type NamespaceLookupResponse = {
    namespace: [Text];
    account: ICRC1.Account;
    balance: Nat;
  };

  // ==========================================================================
  // TimerTool via mixin
  // ==========================================================================
  func get_timertool_environment() : TT.Environment {{
    advanced = ?{
      icrc85 = ?{
        kill_switch = null;
        handler = null;
        period = null;
        asset = null;
        platform = null;
        tree = null;
        collector = null;
        initialWait = null;
      };
    };
    syncUnsafe = null;
    reportExecution = null;
    reportError = null;
    reportBatch = null;
  }};

  include TimerToolMixin({
    config = {
      org_icdevs_class_plus_manager = org_icdevs_class_plus_manager;
      args = null;
      pullEnvironment = ?get_timertool_environment;
      onInitialize = null;
    };
    caller = canisterId;
    canisterId = canisterId;
  });

  // ==========================================================================
  // Environment providers for mixins
  // ==========================================================================
  func updated_certification(_cert: Blob, _lastIndex: Nat) : Bool { true };
  func updated_certification_75(_store: CertTree.Store) : Bool { true };
  func get_certificate_store() : CertTree.Store { cert_store };

  func get_icrc3_environment() : ICRC3.Environment {{
    advanced = ?{
      updated_certification = ?updated_certification;
      icrc85 = null;
    };
    get_certificate_store = ?get_certificate_store;
    var org_icdevs_timer_tool = ?org_icdevs_timer_tool;
  }};

  func get_icrc1_environment() : ICRC1.Environment {{
    advanced = ?{
      icrc85 = { kill_switch = null; handler = null; tree = null; collector = null; advanced = null };
      get_fee = null;
      fee_validation_mode = ?#Strict;
    };
    add_ledger_transaction = ?icrc3().add_record;
    var org_icdevs_timer_tool = ?org_icdevs_timer_tool;
    var org_icdevs_class_plus_manager = null;
  }};

  func get_icrc2_environment() : ICRC2.Environment {{ icrc1 = icrc1(); get_fee = null }};
  func get_icrc4_environment() : ICRC4.Environment {{ icrc1 = icrc1(); get_fee = null }};

  func get_icrc75_environment() : ICRC75.Environment {{
    advanced = null;
    org_icdevs_timer_tool = org_icdevs_timer_tool;
    updated_certification = ?updated_certification_75;
    get_certificate_store = ?get_certificate_store;
    addRecord = ?icrc3().add_record;
    icrc10_register_supported_standards = icrc1().register_supported_standards;
  }};

  func ensureBlockTypes(c: ICRC3.ICRC3) {
    let types = Buffer.fromIter<ICRC3.BlockType>(c.supported_block_types().vals());
    let has = func(t: Text) : Bool = Buffer.indexOf<ICRC3.BlockType>({block_type=t;url=""}, types, func(a,b) = a.block_type == b.block_type) != null;
    for(bt in ["1xfer","2xfer","2approve","1mint","1burn"].vals()) {
      if(not has(bt)) types.add({block_type=bt; url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3"});
    };
    c.update_supported_blocks(Buffer.toArray(types));
  };

  // ==========================================================================
  // Mixin Includes
  // ==========================================================================

  // ICRC3 - Transaction log (must be first so icrc3() is available)
  include ICRC3Mixin({
    org_icdevs_class_plus_manager = org_icdevs_class_plus_manager;
    args = ?icrc3_args;
    pullEnvironment = ?get_icrc3_environment;
    onInitialize = ?(func(c: ICRC3.ICRC3) : async* () { ensureBlockTypes(c) });
  });

  // ICRC1 - Basic fungible token
  include ICRC1Mixin({
    org_icdevs_class_plus_manager = org_icdevs_class_plus_manager;
    args = ?icrc1_args;
    pullEnvironment = ?get_icrc1_environment;
    canTransfer = null;
    canSetFeeCollector = ?(func(caller : Principal) : Bool { caller == owner });
    canSetIndexPrincipal = ?(func(caller : Principal) : Bool { caller == owner });
    onInitialize = ?(func(c: ICRC1.ICRC1) : async* () {
      ignore c.register_supported_standards({ name = "ICRC-3"; url = "https://github.com/dfinity/ICRC/ICRCs/icrc-3/" });
      ignore c.register_supported_standards({ name = "ICRC-10"; url = "https://github.com/dfinity/ICRC/ICRCs/icrc-10/" });
      ignore c.register_supported_standards({ name = "ICRC-84"; url = "https://github.com/dfinity/ICRC/ICRCs/icrc-84/" });
      ignore c.register_supported_standards({ name = "ICRC-85"; url = "https://github.com/dfinity/ICRC/ICRCs/icrc-85/" });
      c.register_token_transferred_listener("cycleshare:transfer", transfer_listener);
    });
  });

  // ICRC2 - Approve/transfer_from
  include ICRC2Mixin({
    org_icdevs_class_plus_manager = org_icdevs_class_plus_manager;
    args = ?icrc2_args;
    pullEnvironment = ?get_icrc2_environment;
    canApprove = null;
    canTransferFrom = null;
    onInitialize = ?(func(_c: ICRC2.ICRC2) : async* () {
      ignore icrc1().register_supported_standards({ name = "ICRC-103"; url = "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-103" });
    });
  });

  // ICRC4 - Batch transfers
  include ICRC4Mixin({
    org_icdevs_class_plus_manager = org_icdevs_class_plus_manager;
    args = ?icrc4_args;
    pullEnvironment = ?get_icrc4_environment;
    canTransfer = null;
    canBatchTransfer = null;
    onInitialize = ?(func(_c: ICRC4.ICRC4) : async* () {
      ignore icrc1().register_supported_standards({ name = "ICRC-4"; url = "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-4" });
    });
  });

  // NOTE: ICRC75Mixin is included after canChangeProperty function definition (see below domainCompare)

  // ==========================================================================
  // Transfer Listener for Burn -> Withdraw
  // ==========================================================================

  //============================================================================
  // Index Push Notification
  //============================================================================

  /// Index notification listener - schedules notify call when blocks are added
  /// This is registered with ICRC-3's record_added_listener mechanism
  private func index_notify_listener<system>(_transaction: ICRC3.Value, _index: Nat) : () {
    // Skip if no index canister configured (via ICRC-106)
    switch (icrc1().get_icrc106_index_principal()) {
      case (#Err(_)) return;
      case (#Ok(_)) {};
    };

    // Skip if already have a pending notification (batching)
    switch (pending_notify_action_id) {
      case (?_) {
        // Already have a pending notify - it will send the latest index at execution time
        return;
      };
      case (null) {
        // Schedule new notify action
        let now = Int.abs(Time.now());

        let action_id = org_icdevs_timer_tool.setActionASync<system>(
          now + INDEX_NOTIFY_DELAY_NS,
          {
            actionType = "index:notify";
            params = Blob.fromArray([]); // Current block index retrieved at execution time
          },
          15_000_000_000 // 15 second timeout
        );

        pending_notify_action_id := ?action_id.id;
      };
    };
  };

  /// Execute the index notify call - called by TimerTool when the scheduled time arrives
  private func execute_index_notify(actionId: TT.ActionId, _action: TT.Action) : async* Star.Star<TT.ActionId, TT.Error> {
    let idx_principal = switch (icrc1().get_icrc106_index_principal()) {
      case (#Ok(p)) p;
      case (#Err(_)) {
        pending_notify_action_id := null;
        return #trappable(actionId);
      };
    };

    // Get current max block index from ICRC-3
    let stats = icrc3().get_stats();
    let max_block = stats.lastIndex;

    // Create actor reference to index canister
    let index_actor = actor(Principal.toText(idx_principal)) : actor {
      notify : (Nat) -> async ();
    };

    try {
      // Call index canister with the latest block number using best effort messaging
      await (with timeout = 60) index_actor.notify(max_block);
      pending_notify_action_id := null;
      return #awaited(actionId);
    } catch (e) {
      // Log error but clear pending to allow retry on next block
      debug D.print("Index notify failed: " # Error.message(e));
      pending_notify_action_id := null;
      return #err(#awaited({ error_code = 1; message = Error.message(e) }));
    };
  };

  /// Register index notification handlers
  /// Called during initialization and after upgrades
  private func register_index_notify_handlers<system>() {
    // Register execution handler with TimerTool
    org_icdevs_timer_tool.registerExecutionListenerAsync(?"index:notify", execute_index_notify);

    // Register record added listener with ICRC-3
    icrc3().register_record_added_listener("index_notify", index_notify_listener);
  };

  // Re-register transient listeners on every instantiation (handles both fresh deploy and upgrade)
  do {
    if (_init) {
      register_index_notify_handlers<system>();
    };
  };

  //============================================================================

  private func transfer_listener<system>(trx: ICRC1.Transaction, _trxid: Nat) : () {
    switch(trx.burn){
      case(?burn){
        if(burn.amount < 100_000_001){ return };
        CoreVector.add(pendingTransfers, {
          to = burn.from;
          amount = burn.amount - 100_000_000;
          token = #icrc1(Principal.fromText(CyclesLedger_CANISTER_ID));
        });
        ignore Timer.setTimer<system>(#nanoseconds(0), process_withdrawls);
      };
      case(_){};
    };
  };

  private func property_update_listener<system>(trx: ManageListPropertyRequestItem, _trxid: Nat) : () {
    switch(trx.action){
      case(#Create(detail)){
        if(detail.members.size() == 1){
          let (item, _metadata) = detail.members[0];
          let namespace = trx.list;
          switch(item){
            case(#Account(account)) {
              CoreVector.add(pendingClaims, { namespace = namespace; account = account });
              ignore Timer.setTimer<system>(#nanoseconds(0), process_claims);
            };
            case(_){};
          };
        };
      };
      case(_){};
    };
  };

  private func member_update_listener<system>(trx: ManageListMembershipRequestItem, _trxid: Nat) : () {
    switch(trx.action){
      case(#Add(detail)){
        let namespace = trx.list;
        let (item, _metadata) = detail;
        switch(item){
          case(#Account(account)) {
            CoreVector.add(pendingClaims, { namespace = namespace; account = account });
            ignore Timer.setTimer<system>(#nanoseconds(0), process_claims);
          };
          case(_){};
        };
      };
      case(_){};
    };
  };

  private func process_withdrawls() : async () {
    let proc = CoreVector.toArray(pendingTransfers);
    CoreVector.clear(pendingTransfers);
    for(thisWithdrawl in proc.vals()){
      try { ignore await withdraw_cycles(thisWithdrawl) } catch(_e){};
    };
  };

  private func process_claims() : async () {
    let proc = CoreVector.toArray(pendingClaims);
    CoreVector.clear(pendingClaims);
    for(thisClaim in proc.vals()){
      try { await moveNamespaceBalance(thisClaim.namespace, thisClaim.account) } catch(_e){};
    };
  };

  // ==========================================================================
  // Admin Functions
  // ==========================================================================
  public shared({caller}) func admin_update_owner(new_owner: Principal) : async Bool {
    if(caller != owner) D.trap("Unauthorized");
    owner := new_owner;
    true;
  };

  public shared({caller}) func admin_update_icrc1(requests: [ICRC1.UpdateLedgerInfoRequest]) : async [Bool] {
    if(caller != owner) D.trap("Unauthorized");
    icrc1().update_ledger_info(requests);
  };

  public shared({caller}) func admin_update_icrc2(requests: [ICRC2.UpdateLedgerInfoRequest]) : async [Bool] {
    if(caller != owner) D.trap("Unauthorized");
    icrc2().update_ledger_info(requests);
  };

  public shared({caller}) func admin_update_icrc4(requests: [ICRC4.UpdateLedgerInfoRequest]) : async [Bool] {
    if(caller != owner) D.trap("Unauthorized");
    icrc4().update_ledger_info(requests);
  };

  public shared({caller}) func admin_update_cyclesLedger(new_principal: Text) : async Bool {
    if(caller != owner) D.trap("Unauthorized");
    CyclesLedger_CANISTER_ID := new_principal;
    true;
  };

  public shared({caller}) func admin_update_minCycles(new_amount: Nat) : async Bool {
    if(caller != owner) D.trap("Unauthorized");
    minCycles := new_amount;
    true;
  };

  public shared({caller}) func admin_update_devAccount(new_account: ICRC1.Account) : async Bool {
    if(caller != owner) D.trap("Unauthorized");
    devAccount := new_account;
    true;
  };

  public shared({caller}) func admin_init() : async () {
    if(caller != owner) D.trap("Unauthorized");
    if(not _init) {
      // Register index push notification handlers
      register_index_notify_handlers<system>();
    };
    _init := true;
  };

  // ==========================================================================
  // Stats
  // ==========================================================================
  public query func stats() : async {
    icrc1: {
      name: Text;
      symbol: Text;
      decimals: Nat8;
      fee: ICRC1.Balance;
      minting_account: ICRC1.Account;
      total_supply: Nat;
    };
    icrc3: ICRC3.Stats;
  } {{
    icrc1 = {
      name = icrc1().name();
      symbol = icrc1().symbol();
      decimals = icrc1().decimals();
      fee = icrc1().fee();
      minting_account = icrc1().minting_account();
      total_supply = icrc1().total_supply();
    };
    icrc3 = icrc3().get_stats();
  }};

  // ==========================================================================
  // Cycle Management
  // ==========================================================================
  public shared func deposit_cycles() : async () {
    ignore ExperimentalCycles.accept<system>(ExperimentalCycles.available());
  };

  public shared func get_cycles() : async Nat {
    ExperimentalCycles.balance();
  };

  // ==========================================================================
  // ICRC-84/85 Cycle Share Functions
  // ==========================================================================
  public shared(msg) func icrc85_deposit_cycles(request: ShareArgs) : async ShareResult {
    await* process_cycles(msg.caller, request);
  };

  private func process_cycles(_caller: Principal, request: ShareArgs) : async* ShareResult {
    // Accept the deposited cycles
    let available = ExperimentalCycles.available();
    let accepted = ExperimentalCycles.accept<system>(available);
    
    if (accepted < minCycles) {
      return #Err(#NotEnoughCycles(accepted, minCycles));
    };
    
    // Calculate total requested
    var totalRequested : Nat = 0;
    for ((_, amount) in request.vals()) {
      totalRequested += amount;
    };
    
    if (totalRequested == 0) {
      return #Err(#CustomError("No shares requested"));
    };
    
    // Distribute cycles proportionally to each namespace
    var distributed : Nat = 0;
    for ((namespace, amount) in request.vals()) {
      let share = (accepted * amount) / totalRequested;
      let account = namespace_account(namespace);
      D.print("Minting " # debug_show(share) # " tokens to " # debug_show(account) # " for namespace " # namespace);
      // Mint tokens to the namespace account
      let mintResult = await* icrc1().mint_tokens(
        canisterId,
        {
          to = account;
          amount = share;
          memo = ?Text.encodeUtf8(namespace);
          created_at_time = null;
        }
      );
      D.print("Mint result: " # debug_show(mintResult));
      switch(mintResult) {
        case(#trappable(val)) {
          switch(val) {
            case(#Ok(_)) { distributed += share; };
            case(#Err(e)) { D.print("Mint error (trappable): " # debug_show(e)); };
          };
        };
        case(#awaited(val)) {
          switch(val) {
            case(#Ok(_)) { distributed += share; };
            case(#Err(e)) { D.print("Mint error (awaited): " # debug_show(e)); };
          };
        };
        case(#err(#trappable(e))) { D.print("Star error (trappable): " # e); };
        case(#err(#awaited(e))) { D.print("Star error (awaited): " # e); };
      };
    };
    
    #Ok(distributed);
  };

  private func withdraw_cycles(_request: WithdrawArgs) : async WithdrawResult {
    // TODO: Implement cycle withdrawal logic
    #Err(#NotAllowed);
  };

  private func moveNamespaceBalance(namespace: Text, account: ICRC1.Account) : async () {
    // Get the namespace subaccount
    let namespaceAccount = namespace_account(namespace);
    
    // Get balance of the namespace subaccount
    let balance = icrc1().balance_of(namespaceAccount);
    let fee = icrc1().fee();
    D.print(debug_show(("moveNamespaceBalance", namespace, account, balance, fee)));
    
    // Need enough to cover fee
    if(balance <= fee) return;
    
    // Transfer balance minus fee to the member's account
    let transferResult = await* icrc1().transfer_tokens<system>(
      Principal.fromActor(this),
      {
        from_subaccount = namespaceAccount.subaccount;
        to = account;
        amount = balance - fee;
        fee = null;
        memo = null;
        created_at_time = null;
      },
      false,
      null
    );
    
    D.print(debug_show(("moveNamespaceBalance result", transferResult)));
  };

  public query(_msg) func icrc84_supported_tokens(_prev: ?Token84, _take: ?Nat) : async [Token84] {
    [#icrc1(Principal.fromText(CyclesLedger_CANISTER_ID)), #cycles];
  };

  private func namespace_account(namespace: Text) : ICRC1.Account {
    { owner = canisterId; subaccount = ?Sha256.fromBlob(#sha256, Text.encodeUtf8(namespace)) };
  };

  public query(_msg) func icrc85_namespace_account(namespace: Text) : async ICRC1.Account {
    namespace_account(namespace);
  };

  public query(_msg) func icrc84_token_info(_token: Token84) : async TokenInfo {
    { deposit_fee = 100_000_000; withdrawal_fee = 100_000_000 };
  };

  public query(msg) func icrc84_credits(_token: Token84) : async Int {
    Int.abs(icrc1().balance_of({ owner = msg.caller; subaccount = null }));
  };

  public query(_msg) func icrc84_trackedDeposit(_token: Token84) : async BalanceResult {
    #Ok(0);
  };

  public query(_msg) func icrc84_all_credits(_prev: ?Token84, _take: ?Nat) : async [(Token84, Int)] {
    [];
  };

  public shared(_msg) func icrc84_notify(_request: {token: Token84}) : async NotifyResult {
    { credit = 0; credit_inc = 0 };
  };

  public shared(_msg) func icrc84_deposit(_request: DepositArgs) : async DepositResponse {
    { credit = 0; txid = null };
  };

  public shared(_msg) func icrc84_withdraw(_request: WithdrawArgs) : async WithdrawResult {
    #Err(#NotAllowed);
  };

  // ==========================================================================
  // ICRC-86 Domain Management Functions
  // ==========================================================================
  
  // Domain comparison for CoreMap
  private func domainCompare(a: [Text], b: [Text]) : Order.Order {
    let minLen = Nat.min(a.size(), b.size());
    for (i in Iter.range(0, minLen - 1)) {
      switch (Text.compare(a[i], b[i])) {
        case (#less) { return #less };
        case (#greater) { return #greater };
        case (#equal) {};
      };
    };
    if (a.size() < b.size()) { #less }
    else if (a.size() > b.size()) { #greater }
    else { #equal }
  };

  // Domain validation callback for ICRC-75 list property changes
  // Validates that only controllers of a claimed domain can create/modify namespaces under it
  private func canChangeProperty<system>(trx: ICRC3.Value, trxtop: ?ICRC3.Value) : Result.Result<(ICRC3.Value, ?ICRC3.Value), Text> {
    D.print(debug_show(("In canChangeProperty", trx, trxtop)));
    switch(trxtop) {
      case(?val) {
        let ?#Text(bType) = ICRC3Helper.get_item_from_map("btype", val) else { return #err("Invalid Transaction") };
        D.print(debug_show(("bType", bType)));
        if (bType == "75listCreate") {
          // Make sure the caller is a controller on the domain
          let ?#Text(namespace) = ICRC3Helper.get_item_from_map("list", trx) else { return #err("Missing List") };
          let ?#Blob(creatorBlob) = ICRC3Helper.get_item_from_map("creator", trx) else { return #err("Missing Creator") };
          let creator = Principal.fromBlob(creatorBlob);
          
          let splitNamespace = Iter.toArray<Text>(Text.split(namespace, #text(".")));
          D.print(debug_show(("Checking domain for namespace", namespace, "parts", splitNamespace)));
          
          // Look up the top-level domain
          let topLevelDomain = [splitNamespace[0]];
          let ownerRecord = CoreMap.get(_domainOwners, domainCompare, topLevelDomain);
          D.print(debug_show(("Domain owner record", ownerRecord)));
          
          switch(ownerRecord) {
            case(null) {
              D.print("Domain not claimed - rejecting");
              return #err("Invalid Domain");
            };
            case(?controllers) {
              let ?_bFoundController = Array.indexOf<Principal>(creator, controllers, Principal.equal) else {
                D.print("Creator not a controller - rejecting");
                return #err("Unauthorized");
              };
              D.print("Creator is authorized controller - allowing");
              return #ok((trx, trxtop));
            };
          };
        } else if (bType == "75listModify") {
          // For rename operations, validate the new domain
          let newName = ICRC3Helper.get_item_from_map("newName", val);
          switch(newName) {
            case(?#Text(foundName)) {
              let ?#Blob(callerBlob) = ICRC3Helper.get_item_from_map("caller", trx) else { return #err("Missing Caller") };
              let caller = Principal.fromBlob(callerBlob);
              let splitNamespace = Iter.toArray<Text>(Text.split(foundName, #text(".")));
              let topLevelDomain = [splitNamespace[0]];
              let ownerRecord = CoreMap.get(_domainOwners, domainCompare, topLevelDomain);
              
              switch(ownerRecord) {
                case(null) { return #err("Invalid Domain") };
                case(?controllers) {
                  let ?_bFoundController = Array.indexOf<Principal>(caller, controllers, Principal.equal) else return #err("Unauthorized");
                  return #ok((trx, trxtop));
                };
              };
            };
            case(_) {};
          };
        };
        // For other operations, allow by default
        return #ok((trx, trxtop));
      };
      case(_) {
        return #err("Invalid Transaction");
      };
    };
  };

  // ICRC75 - List management with domain validation callback (placed after canChangeProperty definition)
  include ICRC75Mixin({
    org_icdevs_class_plus_manager = org_icdevs_class_plus_manager;
    args = icrc75_args;
    pullEnvironment = ?get_icrc75_environment;
    onInitialize = ?(func(c: ICRC75.ICRC75) : async* () {
      c.registerPropertyChangeListener("cycleshare:property", property_update_listener);
      c.registerMembershipChangeListener("cycleshare:member", member_update_listener);
    });
    canChangeProperty = ?#Sync(canChangeProperty);
    canChangeMembership = null;
  });

  private func generateValidation() : Text {
    Nat32.toText(Text.hash(Nat.toText(Int.abs(Time.now()))));
  };

  private func gateValidation(_controllers: [Principal], _validation: Text, gateAccount: ICRC1.Account) : async* Bool {
    // Update XDR rate if needed
    let ONE_DAY = 86_400_000_000_000;
    if (_lastXDRRate + ONE_DAY < Time.now()) {
      let result = try {
        let cmcService : CMC.Interface = actor("rkp4c-7iaaa-aaaaa-aaaca-cai");
        let ratequery = await cmcService.get_icp_xdr_conversion_rate();
        ratequery.data.xdr_permyriad_per_icp;
      } catch (_e) { _xdr_permyriad_per_icp };
      _xdr_permyriad_per_icp := result;
      _lastXDRRate := Time.now();
    };

    let amount = Nat64.toNat(CMC.icpForXDR(50000 : Nat64, _xdr_permyriad_per_icp));
    let validationArray = Blob.toArray(Text.encodeUtf8(_validation));
    let ICPCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
    let icpService : ICRC2Service.service = actor(ICPCanisterId);

    let result = await icpService.icrc2_transfer_from({
      spender_subaccount = null;
      amount = amount;
      fee = ?10_000;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
      memo = ?Blob.fromArray(Iter.toArray<Nat8>(Array.slice<Nat8>(validationArray, 0, Nat.min(validationArray.size(), 31))));
      from = gateAccount;
      to = devAccount;
    });

    switch (result) {
      case (#Ok(_)) { true };
      case (#Err(_)) { false };
    };
  };

  public shared(msg) func icrc86_claim_domain(request: DomainClaimRequest) : async DomainClaimResponse {
    let domain = request.domain;
    if (domain.size() == 0) {
      return #Err(#Unauthorized);
    };
    for (thisItem in domain.vals()) {
      if (thisItem.size() == 0) {
        return #Err(#Unauthorized);
      };
    };

    let controllers = switch (request.controllers) {
      case (null) { [msg.caller] };
      case (?val) {
        if (val.size() == 0) { [msg.caller] }
        else { val }
      };
    };

    let accountToUse = switch (request.gateAccount) {
      case (null) { { owner = msg.caller; subaccount = null } };
      case (?val) val;
    };

    if (accountToUse.owner != msg.caller) {
      return #Err(#Unauthorized);
    };

    let ownerRecord = CoreMap.get(_domainOwners, domainCompare, domain);

    switch (ownerRecord) {
      case (null) {
        switch (request.validationCode) {
          case (null) {
            let validation = generateValidation();
            if (await* gateValidation(controllers, validation, accountToUse)) {
              CoreMap.add(_domainValidation, domainCompare, domain, {
                validation = validation;
                controllers = controllers;
                approved = false;
                validationTime = Time.now();
                domain = domain;
              });
              return #ValidationRequired({
                controllers = controllers;
                existingControllers = null;
                domain = domain;
                validation = validation;
              });
            } else {
              return #Err(#ValidationGateFailed);
            };
          };
          case (?validation) {
            let currentValidationRecord = CoreMap.get(_domainValidation, domainCompare, domain);
            switch (currentValidationRecord) {
              case (null) { return #Err(#ValidationRecordNotFound); };
              case (?foundValidation) {
                if (foundValidation.validation != validation) {
                  return #Err(#ValidationRecordNotFound);
                };
                if (foundValidation.approved and Array.equal<Principal>(foundValidation.controllers, controllers, Principal.equal)) {
                  CoreMap.add(_domainOwners, domainCompare, domain, controllers);
                  return #Ok({ controllers = controllers; domain = domain });
                };
                return #Err(#ValidationRecordNotApproved);
              };
            };
          };
        };
      };
      case (?val) {
        // Domain already owned - check if caller is controller
        let isController = Array.find<Principal>(val, func(p) { p == msg.caller });
        switch (isController) {
          case (null) {
            // Not a controller - need revalidation with gate check
            switch (request.validationCode) {
              case (null) {
                let revalidation = generateValidation();
                if (await* gateValidation(controllers, revalidation, accountToUse)) {
                  CoreMap.add(_domainValidation, domainCompare, domain, {
                    validation = revalidation;
                    controllers = controllers;
                    approved = false;
                    validationTime = Time.now();
                    domain = domain;
                  });
                  return #ValidationRequired({
                    controllers = controllers;
                    existingControllers = ?val;
                    domain = domain;
                    validation = revalidation;
                  });
                } else {
                  return #Err(#ValidationGateFailed);
                };
              };
              case (?validation) {
                let currentValidationRecord = CoreMap.get(_domainValidation, domainCompare, domain);
                switch (currentValidationRecord) {
                  case (null) { return #Err(#ValidationRecordNotFound); };
                  case (?foundValidation) {
                    if (foundValidation.validation != validation) {
                      return #Err(#ValidationRecordNotFound);
                    };
                    if (foundValidation.approved and Array.equal<Principal>(foundValidation.controllers, controllers, Principal.equal)) {
                      CoreMap.add(_domainOwners, domainCompare, domain, controllers);
                      return #Ok({ controllers = controllers; domain = domain });
                    };
                    return #Err(#ValidationRecordNotApproved);
                  };
                };
              };
            };
          };
          case (?_) {
            // Caller is controller - return existing record
            return #RecordExists({ controllers = val; domain = domain });
          };
        };
      };
    };
  };

  public shared(msg) func icrc86_approve_domain(request: DomainApprovalRequest) : async DomainApprovalResponse {
    // Only canister owner/admin can approve domains
    // In future, this could be automated via DNS HTTP outcalls
    if (msg.caller != owner) {
      return #Err(#ValidationRecordNotFound); // Using existing error type for unauthorized
    };
    
    let validationRecord = CoreMap.get(_domainValidation, domainCompare, request.domain);
    
    switch (validationRecord) {
      case (null) { return #Err(#ValidationRecordNotFound); };
      case (?record) {
        if (record.validation != request.validationCode) {
          return #Err(#ValidationRecordNotFound);
        };
        // Approve the validation
        CoreMap.add(_domainValidation, domainCompare, request.domain, {
          validation = record.validation;
          controllers = record.controllers;
          approved = true;
          validationTime = record.validationTime;
          domain = record.domain;
        });
        return #Ok;
      };
    };
  };

  public query(_msg) func icrc86_domain_look_up(domains: [Domain]) : async [(?[Principal], ?DomainValidationRecord)] {
    let results = Buffer.Buffer<(?[Principal], ?DomainValidationRecord)>(domains.size());
    for (domain in domains.vals()) {
      let owners = CoreMap.get(_domainOwners, domainCompare, domain);
      let validation = CoreMap.get(_domainValidation, domainCompare, domain);
      results.add((owners, validation));
    };
    Buffer.toArray(results);
  };

  public query(_msg) func icrc86_namespace_look_up(namespaces: [[Text]]) : async [?NamespaceLookupResponse] {
    let results = Buffer.Buffer<?NamespaceLookupResponse>(namespaces.size());
    for (namespace in namespaces.vals()) {
      if (namespace.size() > 0) {
        let ns = namespace[0]; // Use first element as namespace
        let account = namespace_account(ns);
        let balance = icrc1().balance_of(account);
        results.add(?{ namespace = namespace; account = account; balance = balance });
      } else {
        results.add(null);
      };
    };
    Buffer.toArray(results);
  };

  // ==========================================================================
  // Migration/Replay Functions (Admin Only, for ledger migration)
  // ==========================================================================
  
  /// ReplayBlock represents a parsed block to replay during migration
  public type ReplayBlock = {
    id: Nat;
    btype: Text;
    ts: Nat;
    tx: ReplayTx;
  };
  
  public type ReplayTx = {
    #mint: { to: ICRC1.Account; amt: Nat; memo: ?Blob };
    #burn: { from: ICRC1.Account; amt: Nat; memo: ?Blob };
    #xfer: { from: ICRC1.Account; to: ICRC1.Account; amt: Nat; fee: ?Nat; memo: ?Blob };
    #approve: { from: ICRC1.Account; spender: ICRC1.Account; amt: Nat; fee: ?Nat; expires_at: ?Nat64; memo: ?Blob };
    #xfer_from: { from: ICRC1.Account; to: ICRC1.Account; spender: ICRC1.Account; amt: Nat; fee: ?Nat; memo: ?Blob };
  };
  
  public type ReplayResult = {
    #Ok: { processed: Nat; lastIndex: Nat };
    #Err: { #NotAuthorized; #AlreadyMigrated; #InvalidBlock: { index: Nat; reason: Text } };
  };
  
  /// Flag to track if replay has been completed
  var _replayCompleted = false;
  
  /// Replay blocks from extracted data - admin only
  /// This function updates balances directly and adds ICRC3 records
  public shared(msg) func replay_blocks(blocks: [ReplayBlock]) : async ReplayResult {
    // Only owner can replay
    if (msg.caller != owner) {
      return #Err(#NotAuthorized);
    };
    
    // Prevent replaying multiple times
    if (_replayCompleted) {
      return #Err(#AlreadyMigrated);
    };
    
    let state = icrc1().get_state();
    var processed : Nat = 0;
    var lastIndex : Nat = 0;
    
    for (block in blocks.vals()) {
      // Process the transaction - update balances
      switch (block.tx) {
        case (#mint({ to; amt; memo })) {
          // Update balance directly
          ICRC1.UtilsHelper.update_balance(
            state.accounts,
            to,
            func(balance: Nat) : Nat { balance + amt }
          );
          // Update minted tokens for total_supply calculation
          state._minted_tokens += amt;
          
          // Build transaction Value for ICRC3
          let txEntries = Buffer.Buffer<(Text, ICRC3.Value)>(5);
          txEntries.add(("op", #Text("mint")));
          txEntries.add(("amt", #Nat(amt)));
          txEntries.add(("to", #Array([#Blob(Principal.toBlob(to.owner)), switch(to.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("ts", #Nat(block.ts)));
          switch (memo) {
            case (?m) txEntries.add(("memo", #Blob(m)));
            case (null) {};
          };
          
          // Add ICRC3 record with top-level metadata
          let topLevel = #Map([("btype", #Text(block.btype)), ("ts", #Nat(block.ts))]);
          lastIndex := icrc3().add_record<system>(#Map(Buffer.toArray(txEntries)), ?topLevel);
        };
        
        case (#burn({ from; amt; memo })) {
          // Update balance directly
          ICRC1.UtilsHelper.update_balance(
            state.accounts,
            from,
            func(balance: Nat) : Nat { if (balance > amt) balance - amt else 0 }
          );
          // Update burned tokens for total_supply calculation
          state._burned_tokens += amt;
          
          // Build transaction Value for ICRC3
          let txEntries = Buffer.Buffer<(Text, ICRC3.Value)>(5);
          txEntries.add(("op", #Text("burn")));
          txEntries.add(("amt", #Nat(amt)));
          txEntries.add(("from", #Array([#Blob(Principal.toBlob(from.owner)), switch(from.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("ts", #Nat(block.ts)));
          switch (memo) {
            case (?m) txEntries.add(("memo", #Blob(m)));
            case (null) {};
          };
          
          let topLevel = #Map([("btype", #Text(block.btype)), ("ts", #Nat(block.ts))]);
          lastIndex := icrc3().add_record<system>(#Map(Buffer.toArray(txEntries)), ?topLevel);
        };
        
        case (#xfer({ from; to; amt; fee; memo })) {
          // Update balances directly
          let feeAmt = switch(fee) { case(?f) f; case(null) 0 };
          ICRC1.UtilsHelper.update_balance(
            state.accounts,
            from,
            func(balance: Nat) : Nat { if (balance > amt + feeAmt) balance - amt - feeAmt else 0 }
          );
          ICRC1.UtilsHelper.update_balance(
            state.accounts,
            to,
            func(balance: Nat) : Nat { balance + amt }
          );
          
          // Build transaction Value for ICRC3
          let txEntries = Buffer.Buffer<(Text, ICRC3.Value)>(7);
          txEntries.add(("op", #Text("xfer")));
          txEntries.add(("amt", #Nat(amt)));
          txEntries.add(("from", #Array([#Blob(Principal.toBlob(from.owner)), switch(from.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("to", #Array([#Blob(Principal.toBlob(to.owner)), switch(to.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("ts", #Nat(block.ts)));
          switch (fee) {
            case (?f) txEntries.add(("fee", #Nat(f)));
            case (null) {};
          };
          switch (memo) {
            case (?m) txEntries.add(("memo", #Blob(m)));
            case (null) {};
          };
          
          let topLevel = #Map([("btype", #Text(block.btype)), ("ts", #Nat(block.ts))]);
          lastIndex := icrc3().add_record<system>(#Map(Buffer.toArray(txEntries)), ?topLevel);
        };
        
        case (#approve({ from; spender; amt; fee; expires_at; memo })) {
          // Set approval directly in ICRC2 state - for now just add the record
          // Note: ICRC2 approvals need special handling
          
          // Build transaction Value for ICRC3
          let txEntries = Buffer.Buffer<(Text, ICRC3.Value)>(7);
          txEntries.add(("op", #Text("approve")));
          txEntries.add(("amt", #Nat(amt)));
          txEntries.add(("from", #Array([#Blob(Principal.toBlob(from.owner)), switch(from.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("spender", #Array([#Blob(Principal.toBlob(spender.owner)), switch(spender.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("ts", #Nat(block.ts)));
          switch (fee) {
            case (?f) txEntries.add(("fee", #Nat(f)));
            case (null) {};
          };
          switch (expires_at) {
            case (?e) txEntries.add(("expires_at", #Nat(Nat64.toNat(e))));
            case (null) {};
          };
          switch (memo) {
            case (?m) txEntries.add(("memo", #Blob(m)));
            case (null) {};
          };
          
          let topLevel = #Map([("btype", #Text(block.btype)), ("ts", #Nat(block.ts))]);
          lastIndex := icrc3().add_record<system>(#Map(Buffer.toArray(txEntries)), ?topLevel);
        };
        
        case (#xfer_from({ from; to; spender; amt; fee; memo })) {
          // Update balances directly
          let feeAmt = switch(fee) { case(?f) f; case(null) 0 };
          ICRC1.UtilsHelper.update_balance(
            state.accounts,
            from,
            func(balance: Nat) : Nat { if (balance > amt + feeAmt) balance - amt - feeAmt else 0 }
          );
          ICRC1.UtilsHelper.update_balance(
            state.accounts,
            to,
            func(balance: Nat) : Nat { balance + amt }
          );
          
          // Build transaction Value for ICRC3
          let txEntries = Buffer.Buffer<(Text, ICRC3.Value)>(8);
          txEntries.add(("op", #Text("xfer")));
          txEntries.add(("amt", #Nat(amt)));
          txEntries.add(("from", #Array([#Blob(Principal.toBlob(from.owner)), switch(from.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("to", #Array([#Blob(Principal.toBlob(to.owner)), switch(to.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("spender", #Array([#Blob(Principal.toBlob(spender.owner)), switch(spender.subaccount) { case(?s) #Blob(s); case(null) #Blob(Blob.fromArray([])) }])));
          txEntries.add(("ts", #Nat(block.ts)));
          switch (fee) {
            case (?f) txEntries.add(("fee", #Nat(f)));
            case (null) {};
          };
          switch (memo) {
            case (?m) txEntries.add(("memo", #Blob(m)));
            case (null) {};
          };
          
          let topLevel = #Map([("btype", #Text(block.btype)), ("ts", #Nat(block.ts))]);
          lastIndex := icrc3().add_record<system>(#Map(Buffer.toArray(txEntries)), ?topLevel);
        };
      };
      
      processed += 1;
    };
    
    #Ok({ processed = processed; lastIndex = lastIndex });
  };
  
  /// Mark replay as complete - disables further replay calls
  public shared(msg) func finalize_replay() : async { #Ok; #Err: { #NotAuthorized } } {
    if (msg.caller != owner) {
      return #Err(#NotAuthorized);
    };
    _replayCompleted := true;
    #Ok;
  };
  
  /// Check if replay is complete
  public query func is_replay_complete() : async Bool {
    _replayCompleted;
  };

  // ==========================================================================
  // Initialization via ClassPlus
  // ==========================================================================
  List.add<() -> async* ()>(org_icdevs_class_plus_manager.calls, func() : async* () {
    // Any additional initialization
  });

  // ==========================================================================
  // Legacy / Candid Parity
  // ==========================================================================

  /// Legacy Rosetta-compatible alias for icrc3_get_tip_certificate.
  public query func get_data_certificate() : async { certificate: ?Blob; hash_tree: Blob } {
    switch(icrc3().get_tip_certificate()) {
      case(?cert) { { certificate = ?cert.certificate; hash_tree = cert.hash_tree } };
      case(null) { { certificate = null; hash_tree = "" } };
    };
  };

  /// SNS parity: returns true once the ledger is initialized and ready.
  public query func is_ledger_ready() : async Bool {
    true;
  };
};
