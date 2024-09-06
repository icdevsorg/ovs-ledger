import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import D "mo:base/Debug";
import Error "mo:base/Error";
import ExperimentalCycles "mo:base/ExperimentalCycles";

import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Timer "mo:base/Timer";
import Text "mo:base/Text";
import AccountLib "mo:account";

import Nat "mo:base/Nat";
import CertTree "mo:cert/CertTree";

import ICRC1 "mo:icrc1-mo/ICRC1";
import ICRC2Service "mo:icrc2-mo/ICRC2/service";
import ICRC2 "mo:icrc2-mo/ICRC2";
import ICRC3 "mo:icrc3-mo/";
import ICRC3Helper "mo:icrc3-mo/helper";
import ICRC4 "mo:icrc4-mo/ICRC4";
import Sha256 "mo:sha2/Sha256";
import PExt "mo:principal-ext";


import CyclesLedger "CycleLedger";
import CMC "cmc";
import ICRC75 "mo:icrc75-mo";
import Service75 "mo:icrc75-mo/service";
import TTTypes "mo:timer-tool/migrations/types";

shared ({ caller = _owner }) actor class Token  (args: ?{
    icrc1 : ?ICRC1.InitArgs;
    icrc2 : ?ICRC2.InitArgs;
    icrc3 : ICRC3.InitArgs; //already typed nullable
    icrc4 : ?ICRC4.InitArgs;
    icrc75 : ICRC75.InitArgs;
  }
) = this{

    let debug_channel = {
      announce = true;
      rate = true;
      share = true;
      namespace = true;
    };

    let default_icrc1_args : ICRC1.InitArgs = {
      name = ?"Open Value Sharing Ledger";
      symbol = ?"OVSdv";
      logo = ?"data:image/png;base64,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";
      decimals = 12;
      fee = ?#Fixed(100_000_000);
      minting_account = ?{
        owner = _owner;
        subaccount = null;
      };
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

    let default_icrc2_args : ICRC2.InitArgs = {
      max_approvals_per_account = ?10000;
      max_allowance = ?#TotalSupply;
      fee = ?#ICRC1;
      advanced_settings = null;
      max_approvals = ?10000000;
      settle_to_approvals = ?9990000;
    };

    let default_icrc3_args : ICRC3.InitArgs = ?{
      maxActiveRecords = 3000;
      settleToRecords = 2000;
      maxRecordsInArchiveInstance = 10000000;
      maxArchivePages = 62500;
      archiveIndexType = #Stable;
      maxRecordsToArchive = 8000;
      archiveCycles = 6_000_000_000_000;
      archiveControllers = ??[Principal.fromText("5vdms-kaaaa-aaaap-aa3uq-cai"), Principal.fromText("mctz3-uvscw-rbtha-zdzis-q46vd-vzbza-bxjk5-mleuf-jml6g-s2hq3-vqe")]; //??[put cycle ops prinicpal here];
      supportedBlocks = [
        {
          block_type = "1xfer"; 
          url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
        },
        {
          block_type = "2xfer"; 
          url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
        },
        {
          block_type = "2approve"; 
          url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
        },
        {
          block_type = "1mint"; 
          url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
        },
        {
          block_type = "1burn"; 
          url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
        }
      ];
    };

    let default_icrc4_args : ICRC4.InitArgs = {
      max_balances = ?200;
      max_transfers = ?200;
      fee = ?#ICRC1;
    };

    let icrc1_args : ICRC1.InitArgs = switch(args){
      case(null) default_icrc1_args;
      case(?args){
        switch(args.icrc1){
          case(null) default_icrc1_args;
          case(?val){
            {
              val with minting_account = switch(
                val.minting_account){
                  case(?val) ?val;
                  case(null) {?{
                    owner = _owner;
                    subaccount = null;
                  }};
                };
            };
          };
        };
      };
    };

    let icrc2_args : ICRC2.InitArgs = switch(args){
      case(null) default_icrc2_args;
      case(?args){
        switch(args.icrc2){
          case(null) default_icrc2_args;
          case(?val) val;
        };
      };
    };


    let icrc3_args : ICRC3.InitArgs = switch(args){
      case(null) default_icrc3_args;
      case(?args){
        switch(args.icrc3){
          case(null) default_icrc3_args;
          case(?val) ?val;
        };
      };
    };

    let icrc4_args : ICRC4.InitArgs = switch(args){
      case(null) default_icrc4_args;
      case(?args){
        switch(args.icrc4){
          case(null) default_icrc4_args;
          case(?val) val;
        };
      };
    };

    let default_icrc75_args = ?{
      existingNamespaces = null;
    };

    let icrc75_args : ICRC75.InitArgs = switch(args){
      case(null) default_icrc75_args;
      case(?args){
        switch(args.icrc75){
          case(null) default_icrc75_args;
          case(?val) ?val;
        };
      };
    };



    ///MARK: Stable Variables
    stable var owner = _owner;
     
    stable let icrc1_migration_state = ICRC1.init(ICRC1.initialState(), #v0_1_0(#id),?icrc1_args, _owner);
    stable let icrc2_migration_state = ICRC2.init(ICRC2.initialState(), #v0_1_0(#id),?icrc2_args, _owner);
    stable let icrc4_migration_state = ICRC4.init(ICRC4.initialState(), #v0_1_0(#id),?icrc4_args, _owner);
    stable let icrc3_migration_state = ICRC3.init(ICRC3.initialState(), #v0_1_0(#id), icrc3_args, _owner);
    stable let icrc75_migration_state = ICRC75.init(ICRC75.initialState(), #v0_1_0(#id), icrc75_args, _owner);



    stable let cert_store : CertTree.Store = CertTree.newStore();

    stable var namespaceAccounts : ICRC1.Map.Map<Text,ICRC1.Account> = ICRC1.Map.new();
    stable var domainOwners: ICRC1.Map.Map<[Text],[Principal]> = ICRC1.Map.new();
    stable var failedDeposit : ICRC1.Vector.Vector<(Nat,ShareArgs)> = ICRC1.Vector.new();
    stable var pendingTransfers : ICRC1.Vector.Vector<WithdrawArgs> = ICRC1.Vector.new();
    stable var pendingClaims : ICRC1.Vector.Vector<ClaimArgs> = ICRC1.Vector.new();
    stable var xdr_permyriad_per_icp : Nat64 = 0;
    stable var lastXDRRate : Int = 0;
    stable var minCycles : Nat = 20_000_000_000_000;
    stable let domainValidation : ICRC1.Map.Map<[Text], DomainValidationRecord> = ICRC1.Map.new();

    stable var CyclesLedger_CANISTER_ID = CyclesLedger.CANISTER_ID;
    stable var devAccount : ICRC1.Account = {
      owner = Principal.fromText("ezd6m-rreiq-n5cnl-irsj5-na7qq-6pdod-sv4hs-4ofdu-dl5ao-57gle-iae");
      subaccount = null;
    };

    public type DomainValidationRecord = {
      controllers: [Principal];
      domain: Domain;
      validation: Text;
      approved: Bool;
      validationTime: Int;
    };
    
    let ct = CertTree.Ops(cert_store);

    let ONE_DAY = 86_400_000_000_000;
    let ICPCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

    let #v0_1_0(#data(icrc1_state_current)) = icrc1_migration_state;

    private var _icrc1 : ?ICRC1.ICRC1 = null;

    private func get_icrc1_state() : ICRC1.CurrentState {
      return icrc1_state_current;
    };

    private func get_icrc1_environment() : ICRC1.Environment {
    {
      get_time = null;
      get_fee = null;
      add_ledger_transaction = ?icrc3().add_record;
      can_transfer = null; //set to a function to intercept and add validation logic for transfers
    };
  };

    func icrc1() : ICRC1.ICRC1 {
    switch(_icrc1){
      case(null){
        let initclass : ICRC1.ICRC1 = ICRC1.ICRC1(?icrc1_migration_state, Principal.fromActor(this), get_icrc1_environment());
        ignore initclass.register_supported_standards({
          name = "ICRC-3";
          url = "https://github.com/dfinity/ICRC/ICRCs/icrc-3/"
        });
        ignore initclass.register_supported_standards({
          name = "ICRC-10";
          url = "https://github.com/dfinity/ICRC/ICRCs/icrc-10/"
        });
        ignore initclass.register_supported_standards({
          name = "ICRC-84";
          url = "https://github.com/dfinity/ICRC/ICRCs/icrc-74/"
        });
        ignore initclass.register_supported_standards({
          name = "ICRC-85";
          url = "https://github.com/dfinity/ICRC/ICRCs/icrc-85/"
        });
        _icrc1 := ?initclass;
        initclass;
      };
      case(?val) val;
    };
  };

  let #v0_1_0(#data(icrc2_state_current)) = icrc2_migration_state;

  private var _icrc2 : ?ICRC2.ICRC2 = null;

  private func get_icrc2_state() : ICRC2.CurrentState {
    return icrc2_state_current;
  };

  private func get_icrc2_environment() : ICRC2.Environment {
    {
      icrc1 = icrc1();
      get_fee = null;
      can_approve = null; //set to a function to intercept and add validation logic for approvals
      can_transfer_from = null; //set to a function to intercept and add validation logic for transfer froms
    };
  };

  func icrc2() : ICRC2.ICRC2 {
    switch(_icrc2){
      case(null){
        let initclass : ICRC2.ICRC2 = ICRC2.ICRC2(?icrc2_migration_state, Principal.fromActor(this), get_icrc2_environment());
        _icrc2 := ?initclass;
        initclass;
      };
      case(?val) val;
    };
  };

  let #v0_1_0(#data(icrc4_state_current)) = icrc4_migration_state;

  private var _icrc4 : ?ICRC4.ICRC4 = null;

  private func get_icrc4_state() : ICRC4.CurrentState {
    return icrc4_state_current;
  };

  private func get_icrc4_environment() : ICRC4.Environment {
    {
      icrc1 = icrc1();
      get_fee = null;
      can_approve = null; //set to a function to intercept and add validation logic for approvals
      can_transfer_from = null; //set to a function to intercept and add validation logic for transfer froms
    };
  };

  func icrc4() : ICRC4.ICRC4 {
    switch(_icrc4){
      case(null){
        let initclass : ICRC4.ICRC4 = ICRC4.ICRC4(?icrc4_migration_state, Principal.fromActor(this), get_icrc4_environment());
        _icrc4 := ?initclass;
        initclass;
      };
      case(?val) val;
    };
  };

  let #v0_1_0(#data(icrc3_state_current)) = icrc3_migration_state;

  private var _icrc3 : ?ICRC3.ICRC3 = null;

  private func get_icrc3_state() : ICRC3.CurrentState {
    return icrc3_state_current;
  };

  func get_state() : ICRC3.CurrentState{
    return icrc3_state_current;
  };

  private func get_icrc3_environment() : ICRC3.Environment {
    ?{
      updated_certification = ?updated_certification;
      get_certificate_store = ?get_certificate_store;
    };
  };

  func ensure_block_types(icrc3Class: ICRC3.ICRC3) : () {
    let supportedBlocks = Buffer.fromIter<ICRC3.BlockType>(icrc3Class.supported_block_types().vals());

    let blockequal = func(a : {block_type: Text}, b : {block_type: Text}) : Bool {
      a.block_type == b.block_type;
    };

    if(Buffer.indexOf<ICRC3.BlockType>({block_type = "1xfer"; url="";}, supportedBlocks, blockequal) == null){
      supportedBlocks.add({
            block_type = "1xfer"; 
            url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
          });
    };

    if(Buffer.indexOf<ICRC3.BlockType>({block_type = "2xfer"; url="";}, supportedBlocks, blockequal) == null){
      supportedBlocks.add({
            block_type = "2xfer"; 
            url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
          });
    };

    if(Buffer.indexOf<ICRC3.BlockType>({block_type = "2approve";url="";}, supportedBlocks, blockequal) == null){
      supportedBlocks.add({
            block_type = "2approve"; 
            url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
          });
    };

    if(Buffer.indexOf<ICRC3.BlockType>({block_type = "1mint";url="";}, supportedBlocks, blockequal) == null){
      supportedBlocks.add({
            block_type = "1mint"; 
            url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
          });
    };

    if(Buffer.indexOf<ICRC3.BlockType>({block_type = "1burn";url="";}, supportedBlocks, blockequal) == null){
      supportedBlocks.add({
            block_type = "1burn"; 
            url="https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-3";
          });
    };

    icrc3Class.update_supported_blocks(Buffer.toArray(supportedBlocks));
  };

  func icrc3() : ICRC3.ICRC3 {
    switch(_icrc3){
      case(null){
        let initclass : ICRC3.ICRC3 = ICRC3.ICRC3(?icrc3_migration_state, Principal.fromActor(this), get_icrc3_environment());
        _icrc3 := ?initclass;
        ensure_block_types(initclass);

        initclass;
      };
      case(?val) val;
    };
  };


    

    let #v0_1_0(#data(icrc75_state_current)) = icrc75_migration_state;

    private var _icrc75 : ?ICRC75.ICRC75 = null;


    private func get_icrc75_state() : ICRC75.CurrentState {
      return icrc75_state_current;
    };

    

    private func get_icrc75_environment() : ICRC75.Environment {
    {
      advanced = null;
      tt = null; // for recovery and safety you likely want to provide a timer tool instance here
      addRecord = ?icrc3().add_record;
      icrc10_register_supported_standards = icrc1().register_supported_standards;
    };
  };

    func icrc75() : ICRC75.ICRC75 {
    switch(_icrc75){
      case(null){
        let initclass : ICRC75.ICRC75 = ICRC75.ICRC75(?icrc75_migration_state, Principal.fromActor(this), get_icrc75_environment());
        _icrc75 := ?initclass;
        initclass;
      };
      case(?val) val;
    };
  };


  private func updated_certification(cert: Blob, lastIndex: Nat) : Bool{

    //debug if(debug_channel.announce) D.print("updating the certification " # debug_show(CertifiedData.getCertificate(), ct.treeHash()));
    ct.setCertifiedData();
    // D.print("did the certification " # debug_show(CertifiedData.getCertificate()));
    return true;
  };

  private func get_certificate_store() : CertTree.Store {
    // D.print("returning cert store " # debug_show(cert_store));
    return cert_store;
  };

  /// Functions for the ICRC1 token standard
  public shared query func icrc1_name() : async Text {
      icrc1().name();
  };

  public shared query func icrc1_symbol() : async Text {
      icrc1().symbol();
  };

  public shared query func icrc1_decimals() : async Nat8 {
      icrc1().decimals();
  };

  public shared query func icrc1_fee() : async ICRC1.Balance {
      icrc1().fee();
  };

  public shared query func icrc1_metadata() : async [ICRC1.MetaDatum] {
      icrc1().metadata()
  };

  public shared query func icrc1_total_supply() : async ICRC1.Balance {
      icrc1().total_supply();
  };

  public shared query func icrc1_minting_account() : async ?ICRC1.Account {
      ?icrc1().minting_account();
  };

  public shared query func icrc1_balance_of(args : ICRC1.Account) : async ICRC1.Balance {
      icrc1().balance_of(args);
  };

  public shared query func icrc1_supported_standards() : async [ICRC1.SupportedStandard] {
      icrc1().supported_standards();
  };

  public shared query func icrc10_supported_standards() : async [ICRC1.SupportedStandard] {
      icrc1().supported_standards();
  };

  public shared ({ caller }) func icrc1_transfer(args : ICRC1.TransferArgs) : async ICRC1.TransferResult {
      assert(
        (switch(args.memo){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      assert(
        (switch(args.to.subaccount){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      switch(await* icrc1().transfer_tokens(caller, args, false, null)){
        case(#trappable(val)) val;
        case(#awaited(val)) val;
        case(#err(#trappable(err))) D.trap(err);
        case(#err(#awaited(err))) D.trap(err);
      };
  };


   public query ({ caller }) func icrc2_allowance(args: ICRC2.AllowanceArgs) : async ICRC2.Allowance {
      assert(
        (switch(args.account.subaccount){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      assert(
        (switch(args.spender.subaccount){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      return icrc2().allowance(args.spender, args.account, false);
    };

  public shared ({ caller }) func icrc2_approve(args : ICRC2.ApproveArgs) : async ICRC2.ApproveResponse {
      assert(
        (switch(args.from_subaccount){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      assert(
        (switch(args.spender.subaccount){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      assert(
        (switch(args.memo){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      switch(await*  icrc2().approve_transfers(caller, args, false, null)){
        case(#trappable(val)) val;
        case(#awaited(val)) val;
        case(#err(#trappable(err))) D.trap(err);
        case(#err(#awaited(err))) D.trap(err);
      };
  };

  public shared ({ caller }) func icrc2_transfer_from(args : ICRC2.TransferFromArgs) : async ICRC2.TransferFromResponse {
      assert(
        (switch(args.spender_subaccount){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
        assert(
        (switch(args.memo){
          case(null) 0;
          case(?val) val.size()
        }) <= 32);
      switch(await* icrc2().transfer_tokens_from(caller, args, null)){
        case(#trappable(val)) val;
        case(#awaited(val)) val;
        case(#err(#trappable(err))) D.trap(err);
        case(#err(#awaited(err))) D.trap(err);
      };
  };

  public query func icrc3_get_blocks(args: ICRC3.GetBlocksArgs) : async ICRC3.GetBlocksResult{
    assert(args.size() <= 10000);
    return icrc3().get_blocks(args);
  };

  public query func icrc3_get_archives(args: ICRC3.GetArchivesArgs) : async ICRC3.GetArchivesResult{
    return icrc3().get_archives(args);
  };

  public query func icrc3_get_tip_certificate() : async ?ICRC3.DataCertificate {
    return icrc3().get_tip_certificate();
  };

  public query func get_data_certificate() : async {certificate :?Blob; hash_tree : Blob} {
    let ?val = icrc3().get_tip_certificate() else D.trap("no cert");
    return {
      certificate = ?val.certificate;
      hash_tree = val.hash_tree;
    };
  };

  public query func icrc3_supported_block_types() : async [ICRC3.BlockType] {
    return icrc3().supported_block_types();
  };

  public query func get_tip() : async ICRC3.Tip {
    return icrc3().get_tip();
  };


  public shared ({ caller }) func icrc4_transfer_batch(args: ICRC4.TransferBatchArgs) : async ICRC4.TransferBatchResults {
       assert(args.size() <= icrc4().get_state().ledger_info.max_transfers);
      for(arg in args.vals()){
        assert(
          (switch(arg.memo){
            case(null) 0;
            case(?val) val.size()
          }) <= 32);
        assert(
          (switch(arg.to.subaccount){
            case(null) 0;
            case(?val) val.size()
          }) <= 32);
      };
      switch(await* icrc4().transfer_batch_tokens(caller, args, null, null)){
        case(#trappable(val)) val;
        case(#awaited(val)) val;
        case(#err(#trappable(err))) err;
        case(#err(#awaited(err))) err;
      };
  };

  public shared query func icrc4_balance_of_batch(request : ICRC4.BalanceQueryArgs) : async ICRC4.BalanceQueryResult {
      assert(request.accounts.size() <= icrc4().get_state().ledger_info.max_balances);
      for(arg in request.accounts.vals()){
        assert(
          (switch(arg.subaccount){
            case(null) 0;
            case(?val) val.size()
          }) <= 32);
      };
      icrc4().balance_of_batch(request);
  };

  public shared query func icrc4_maximum_update_batch_size() : async ?Nat {
      ?icrc4().get_state().ledger_info.max_transfers;
  };

  public shared query func icrc4_maximum_query_batch_size() : async ?Nat {
      ?icrc4().get_state().ledger_info.max_balances;
  };

  public shared ({ caller }) func admin_update_owner(new_owner : Principal) : async Bool {
    if(caller != owner){ D.trap("Unauthorized")};
    owner := new_owner;
    return true;
  };

  public shared ({ caller }) func admin_update_icrc1(requests : [ICRC1.UpdateLedgerInfoRequest]) : async [Bool] {
    if(caller != owner){ D.trap("Unauthorized")};
    return icrc1().update_ledger_info(requests);
  };

  public shared ({ caller }) func admin_update_icrc2(requests : [ICRC2.UpdateLedgerInfoRequest]) : async [Bool] {
    if(caller != owner){ D.trap("Unauthorized")};
    return icrc2().update_ledger_info(requests);
  };

  public shared ({ caller }) func admin_update_icrc4(requests : [ICRC4.UpdateLedgerInfoRequest]) : async [Bool] {
    if(caller != owner){ D.trap("Unauthorized")};
    return icrc4().update_ledger_info(requests);
  };

  public shared ({ caller }) func admin_update_cyclesLedger(new_principal : Text) : async Bool {
    if(caller != owner){ D.trap("Unauthorized")};
    CyclesLedger_CANISTER_ID := new_principal;
    return true;
  };

  public shared ({ caller }) func admin_update_minCycles(new_amount : Nat) : async Bool {
    if(caller != owner){ D.trap("Unauthorized")};
    minCycles := new_amount;
    return true;
  };

  public shared ({ caller }) func admin_update_devAccount(new_account : ICRC1.Account) : async Bool {
    if(caller != owner){ D.trap("Unauthorized")};
    devAccount := new_account;
    return true;
  };

  private func process_withdrawls() : async (){
    let proc = ICRC1.Vector.toArray(pendingTransfers);
    ICRC1.Vector.clear(pendingTransfers);
    for(thisWithdrawl in proc.vals()){
      try{
        ignore await withdraw_cycles(thisWithdrawl);
      } catch(e){};
    };
  };

   private func process_claims() : async (){
    let proc = ICRC1.Vector.toArray(pendingClaims);
    ICRC1.Vector.clear(pendingClaims);
    for(thisClaim in proc.vals()){
      try{
        ignore await moveNamespaceBalance(thisClaim.namespace, thisClaim.account);
      } catch(e){};
    };
  };

  /// Uncomment this code to establish have icrc1 notify you when a transaction has occured.
  private func transfer_listener<system>(trx: ICRC1.Transaction, trxid: Nat) : () {
    switch(trx.burn){
      case(?burn){
        // D.print("have a burn" # debug_show(burn));
        // The burn has alredy occured.  this will send out the cycles or will remint if an error occurs
        if(burn.amount < 100_000_001){
          return;
        };
        ICRC1.Vector.add(pendingTransfers, {
          to = burn.from;
          amount = burn.amount - 100_000_000; //burn has no fee so we have to take the fee from the bunred amount
          token = #icrc1( Principal.fromText(CyclesLedger_CANISTER_ID));
        });

        ignore Timer.setTimer<system>(#nanoseconds(0), process_withdrawls);
        
      };
      case(_){};
    };
  };

  private func property_update_listener<system>(trx: ManageListPropertyRequestItem, trxid: Nat) : () {
    D.print(debug_show("property_update_listener", trx));
    switch(trx.action){
      case(#Create(detail)){
        D.print(debug_show("Create", detail));
        if(detail.members.size() == 1){
          let val = detail.members[0];
          let namespace = trx.list;
          let account = switch(val){
            case(#Account(val)) {
               ICRC1.Vector.add(pendingClaims, {
                namespace = namespace;
                account = val;
              });
              ignore Timer.setTimer<system>(#nanoseconds(0), process_claims);
            };
            case(_){};
          };
        };
      };
      case(_){};
    };
  };

  private func member_update_listener<system>(trx: ManageListMembershipRequestItem, trxid: Nat) : () {
    switch(trx.action){
      case(#Add(detail)){
        
        let val = detail;
        let namespace = trx.list;
        let account = switch(val){
          case(#Account(val)) {
            ICRC1.Vector.add(pendingClaims, {
                namespace = namespace;
                account = val;
              });
              ignore Timer.setTimer<system>(#nanoseconds(0), process_claims);
          };
          case(_){};
        };
      };
      case(_){};
    };
  };


  

  /* 

  /// Uncomment this code to establish have icrc1 notify you when a transaction has occured.
  private func approval_listener(trx: ICRC2.TokenApprovalNotification, trxid: Nat) : () {

  };

  /// Uncomment this code to establish have icrc1 notify you when a transaction has occured.
  private func transfer_from_listener(trx: ICRC2.TransferFromNotification, trxid: Nat) : () {

  }; */

  private stable var _init = false;

  private func _admin_init() : async () {
    //can only be called once
    D.print(debug_show("admin_init called",_init));

    if(_init == false){
      let thisActor : actor {
        admin_init : () -> async ();
      } = actor(Principal.toText(Principal.fromActor(this)));
      await thisActor.admin_init();
    };
  };

  public query func stats() : async {
      icrc1 : [ICRC1.MetaDatum];
      icrc2 : [ICRC2.MetaDatum];
      icrc3 : ICRC3.Stats;
      icrc4 : [ICRC4.MetaDatum];
      icrc75 : ICRC75.Stats;
      namespaceAccounts : Nat;
      domainOwners: Nat;
      failedDeposit : [(Nat,ShareArgs)];
      pendingTransfers : [WithdrawArgs];
      xdr_permyriad_per_icp : Nat64;
      lastXDRRate : Int;
      domainValidation : Nat;
      CyclesLedger_CANISTER_ID : Text;
      owner : Principal;
      tt : ?TTTypes.Current.Stats;
    } {
    {
      icrc1 =  icrc1().metadata();
      icrc2 =  icrc2().metadata();
      icrc3 =  icrc3().stats();
      icrc4 =  icrc4().metadata();
      icrc75 =  icrc75().get_stats();
      namespaceAccounts = ICRC1.Map.size(namespaceAccounts);
      domainOwners = ICRC1.Map.size(domainOwners);
      failedDeposit  = ICRC1.Vector.toArray(failedDeposit);
      pendingTransfers = ICRC1.Vector.toArray(pendingTransfers);
      pendingClaims = ICRC1.Vector.toArray(pendingClaims);
      xdr_permyriad_per_icp = xdr_permyriad_per_icp;
      lastXDRRate = lastXDRRate;
      domainValidation = ICRC1.Map.size(domainValidation);
      CyclesLedger_CANISTER_ID = CyclesLedger_CANISTER_ID;
      owner = owner;
      //todo: fix this as it is very ugly
      tt = switch(icrc75().get_state().tt){
        case(null) null;
        case(?val) {
          let #v0_1_0(#data(currentState)) = val else D.trap("bad state"); 
          ?{
            timers = TTTypes.Current.BTree.size(currentState.timeTree);
            nextTimer = currentState.nextTimer;
            lastExecutionTime = currentState.lastExecutionTime;
            expectedExecutionTime = currentState.expectedExecutionTime;
            nextActionId = currentState.nextActionId;
            minAction = TTTypes.Current.BTree.min(currentState.timeTree);
            cycles = 0;
            maxExecutions = currentState.maxExecutions;
          };
        }
      };
    };
  };
  
  public shared(msg) func admin_init() : async () {
    //can only be called once
    D.print(debug_show("admin_init called",_init));

    if(_init == false){
      D.print(debug_show("admin_init called2",_init));
      _init := true;
      //ensure metadata has been registered
      ignore icrc1().metadata();
      D.print(debug_show("admin_init called3",_init));
      ignore icrc2().metadata();
      D.print(debug_show("admin_init called4",_init));
      ignore icrc4().metadata();
      D.print(debug_show("admin_init called5",_init));
      ignore icrc3().stats();
      D.print(debug_show("admin_init called6",_init));

      //uncomment the following line to register the transfer_listener
      icrc1().register_token_transferred_listener("com.cycleshareledger", transfer_listener);

      D.print("registering property listener )");
      icrc75().registerPropertyChangeListener("com.cycleshareledger", property_update_listener);

      icrc75().registerMembershipChangeListener("com.cycleshareledger", member_update_listener);

      D.print("registered property listener end )");

      //uncomment the following line to register the transfer_listener
      //icrc2().register_token_approved_listener("my_namespace", approval_listener);

      //uncomment the following line to register the transfer_listener
      //icrc1().register_transfer_from_listener("my_namespace", transfer_from_listener);
    };
    
  };


  ///MARK: Custom Code

  ignore Timer.setTimer(#nanoseconds(0), _admin_init);


  // Deposit cycles into this canister.
  public shared func deposit_cycles() : async () {
      let amount = ExperimentalCycles.available();
      let accepted = ExperimentalCycles.accept<system>(amount);
      assert (accepted == amount);
  };

  public shared func get_cycles() : async Nat {
      ExperimentalCycles.balance();
  };

  public type ShareArgs = Shares;

  public type ShareResult = {
    #Ok: Nat;
    #Err: ShareCycleError;
  };

  public type ShareCycleError = {
    #NotEnoughCycles: (Nat, Nat);
    #CustomError:  Text;
  };

  public type DomainClaimRequest = {
    domain: Domain;
    gateAccount: ?ICRC1.Account;
    controllers: ?[Principal];
    validationCode: ?Text;
  };

  public type DomainApprovalResponse = {
    #Ok;
    #Err: {
      #ValidationRecordNotFound;
      #ValidationSuccededButTransferError: {
        message: Text;
      };
    };
  };

  public type DomainApprovalRequest = {
    domain: Domain;
    validationCode: Text;
  };

  public type DomainClaimResponse = {
    #ValidationRequired: {
      controllers: [Principal];
      existingControllers: ?[Principal];
      domain: Domain;
      validation: Text;
    };
    #Ok:{
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

  public type WithdrawArgs = {
    to : ICRC1.Account;
    amount : Nat;
    token : Token84;
  };

  public type Token84 = {
    #icrc1: Principal;
  };

  public type ClaimArgs = {
    account : ICRC1.Account;
    namespace : Text;
  };

  public type TokenInfo = {
    deposit_fee : Nat;
    withdrawal_fee : Nat;
    min_deposit : Nat;
    min_withdrawal : Nat;
  };

  public type BalanceResult = {
    #Ok : Nat;
    #Err : {
      #NotAvailable : { message : Text };
    };
  };

  public type NotifyResult = {
    #Ok :  {
      deposit_inc : Nat;
      credit_inc : Nat;
      credit : Int;
    }; 
    #Err :  {
      #CallLedgerError :  { message : Text };
      #NotAvailable :  { message : Text };
    };
  };
  public type DepositArgs = {
    token : Token84;
    amount : Nat;
    subaccount : ?Blob; // subaccount of the caller which has the allowance
  };

  public type DepositResponse = {
    #Ok : DepositResult;
    #Err : {
      #AmountBelowMinimum;
      #CallLedgerError : { message : Text };
      #TransferError : { message : Text }; // insufficient allowance or insufficient funds
    };
  };

  public type DepositResult = {
    txid : Nat;
    credit_inc : Nat;
    credit : Int;
  };

  public type Shares = [(Text, Nat)];

  //todo: only deposit and mint of the balance is above 20_000_000_000

  private func gateValidation(controllers: [Principal], validation: Text, gateAccount : ICRC1.Account) : async* Bool{

    //warning: validate gate Account before this function

    debug if(debug_channel.announce) D.print(debug_show(("in gate", controllers, validation, gateAccount, Principal.fromActor(this))));


    let cmcService : CMC.Interface = actor(CMC.CANISTER_ID);

    //We need to get the rate of ICP to XDR
    if(lastXDRRate + ONE_DAY < Time.now() ){ //update once a day
      let result = try{
        debug if(debug_channel.rate) D.print("getting rate");
        let ratequery = await cmcService.get_icp_xdr_conversion_rate();
        debug if(debug_channel.rate) D.print("got rate" # debug_show(ratequery));
        ratequery.data.xdr_permyriad_per_icp;
      } catch(e){xdr_permyriad_per_icp}; //not a big deal if this fails sometimes
      xdr_permyriad_per_icp := result;
      lastXDRRate := Time.now();
    };

    let amount = Nat64.toNat(CMC.icpForXDR(50000: Nat64, xdr_permyriad_per_icp));
    debug if(debug_channel.rate) D.print("amount" # debug_show(amount));

    let validationArray = Blob.toArray(Text.encodeUtf8(validation));

    debug if(debug_channel.rate) D.print("validation array" # debug_show((validationArray, Iter.toArray<Nat8>(Array.slice<Nat8>(validationArray, 0, Nat.min(validationArray.size(), 31))))));

    let icpService : ICRC2Service.service = actor(ICPCanisterId);

    // try to transfer the 5 XDR
    let result = await icpService.icrc2_transfer_from({
      spender_subaccount = null;
      amount = amount;
      fee = ?10_000;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
      memo = ?Blob.fromArray(Iter.toArray<Nat8>(Array.slice<Nat8>(validationArray, 0, Nat.min(validationArray.size(), 31))));
      from = gateAccount;
      to = devAccount;
    });

    debug if(debug_channel.rate) D.print("transfer from result" # debug_show(result));

    switch(result){
      case(#Ok(block)){
        return true;
      };
      case(#Err(err)){
        return false;
      };  
    };
  };

  private func generateValidation() : Text {
    let validation = Nat32.toText(Text.hash(Nat.toText(Int.abs(Time.now()))));
    validation;
  };

  public type Domain = [Text];

  private let domainEq = func(a: Domain, b:Domain) : Bool {
    Array.equal<Text>(a,b, Text.equal);
  };

  private func domainHash32(a : Domain) : Nat32{
    var accumulator = 0 : Nat32;
    var idx = 0;
    for(val in a.vals()){
      accumulator +%= ICRC1.Map.nhash.0(idx);
      accumulator +%= ICRC1.Map.thash.0(val);
      idx += 1;
    };
    return accumulator;
  };

  private let domainHash = (domainHash32, domainEq);

  ///MARK: ICRC86

  public shared(msg) func icrc86_claim_domain(request: DomainClaimRequest) : async DomainClaimResponse {
    let domain = request.domain;
    if(domain.size() == 0){
      return #Err(#Unauthorized);
    };
    for(thisItem in domain.vals()){
      if(thisItem.size() == 0){
        return #Err(#Unauthorized);
      };
    };
    let controllers = switch(request.controllers){
      case(null){ [msg.caller]};
      case(?val) val;
    };

    let accountToUse = switch(request.gateAccount){
      case(null){
        {
          owner = msg.caller;
          subaccount = null;
        };
      };
      case(?val) val;
    };

    debug if(debug_channel.announce) D.print("account to use" # debug_show(accountToUse));

    if(accountToUse.owner != msg.caller){
      return #Err(#Unauthorized);
    };

    debug if(debug_channel.announce) D.print("claiming domain" # debug_show(domain) # debug_show(controllers) # debug_show(request.validationCode));

    let ownerRecord = ICRC1.Map.get(domainOwners, domainHash, domain);

    switch(ownerRecord){
      case(null){
        //owner record doesn't exist
        debug if(debug_channel.namespace) D.print("owner record doesn't exist");
        switch(request.validationCode){
          case(null){
            let validation = generateValidation();
            
            if(await* gateValidation(controllers, validation, accountToUse)){
              debug if(debug_channel.namespace) D.print("validation passed");
              ignore ICRC1.Map.put(domainValidation, domainHash, domain, {
                validation = validation;
                controllers = controllers;
                approved = false;
                validationTime = Time.now();
                domain = domain;
                });
              return #ValidationRequired{controllers = controllers; existingControllers=null; domain = domain; validation = validation};
            } else {
              debug if(debug_channel.namespace) D.print("validation did not pass");
              return #Err(#ValidationGateFailed);
            };
            
            ignore ICRC1.Map.put(domainValidation, domainHash, domain,  {
                validation = validation;
                controllers = controllers;
                approved = false;
                validationTime = Time.now();
                domain = domain;
                });
            return #ValidationRequired({controllers = controllers; existingControllers = null; domain = domain; validation = validation});
          };
          case(?validation){

            let currentValidtionRecord = ICRC1.Map.get(domainValidation, domainHash, domain);

            switch(currentValidtionRecord){
              case(null){
                //return error that validation record isn't fond
                return #Err(#ValidationRecordNotFound);
              };
              case(?foundValidation){
                if(foundValidation.validation != validation){
                  return #Err(#ValidationRecordNotFound);
                };
                if(foundValidation.approved == true and Array.equal<Principal>(foundValidation.controllers, controllers, Principal.equal)){
                  //update the account
                  ignore ICRC1.Map.put(domainOwners, domainHash, domain, controllers);
                  //todo: move to namespace managment ignore await moveNamespaceBalance(namespace, account);
                  return #Ok({
                    controllers = controllers;
                    domain = domain;
                  });
                };
                return #Err(#ValidationRecordNotApproved);
              };
            };
          }
        };
      };
      case(?val){
        debug if(debug_channel.namespace) D.print("owner record exist");
        switch(request.validationCode){
          case(null){
            //todo: gate validation
            
            let revalidation = generateValidation();
            if(await* gateValidation(controllers, revalidation, accountToUse)){
              ignore ICRC1.Map.put(domainValidation, domainHash, domain, ({
                validation = revalidation;
                controllers = controllers;
                approved = false;
                validationTime = Time.now();
                domain = domain;
              }));
              return #ValidationRequired{domain = domain; existingControllers=null;  validation = revalidation; controllers=controllers};
            } else {
              return #Err(#ValidationGateFailed);
            };
          };
          case(?validation){

            let currentValidtionRecord = ICRC1.Map.get(domainValidation, domainHash, domain);

            switch(currentValidtionRecord){
              case(null){
                //return error that validation record isn't fond
                return #Err(#ValidationRecordNotFound);
              };
              case(?foundValidation){
                if(foundValidation.validation != validation){
                  return #Err(#ValidationRecordNotFound);
                };
                if(foundValidation.approved == true){
                  //update the account
                  ignore ICRC1.Map.put(domainOwners, domainHash, domain, controllers);
                  //todo: move this to the list creation ignore await moveNamespaceBalance(namespace, account);
                  return #Ok({
                    controllers = controllers;
                    domain = request.domain;
                  });
                };
                return #Err(#ValidationRecordNotApproved);
              };
            };
          };
        };
      };
    };
  };

  private func moveNamespaceBalance(namespace: Text, account: ICRC1.Account) : async Nat {
    let source_account = namespace_account(namespace);
    let balance = icrc1().balance_of(source_account);
    let fee : Nat = icrc1().fee();
    if(balance > fee){
      let amount = balance - fee;
      let result =  await* icrc1().transfer(source_account.owner, {
        from_subaccount = source_account.subaccount;
        to = account;
        amount = amount;
        fee = ?fee;
        memo = ?Text.encodeUtf8("claim");
        created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
      });
      debug if(debug_channel.namespace) D.print("transfer result" # debug_show(result));
      amount;
    } else {
      0;
    };
  };

  //todo: depricate after auto approval
  public shared(msg) func icrc86_approve_domain(request: DomainApprovalRequest) : async DomainApprovalResponse {
    assert(msg.caller == owner);
    let domain = request.domain;
    let validationRecord = ICRC1.Map.get(domainValidation, domainHash, domain);

    switch(validationRecord){
      case(null){
        return #Err(#ValidationRecordNotFound);
      };
      case(?val){
        if(val.validation != request.validationCode){
          return #Err(#ValidationRecordNotFound);
        };
        ignore ICRC1.Map.put(domainValidation, domainHash, domain, {
          val with
          validationTime = Time.now();
          approved = true
        });
        ignore ICRC1.Map.put(domainOwners, domainHash, domain, val.controllers);
        
        return #Ok;
      };
    };
  };

  public query(msg) func icrc86_domain_look_up(domains: [Domain]) : async [(?[Principal], ?DomainValidationRecord)] {
    let results = Buffer.Buffer<(?[Principal], ?DomainValidationRecord)>(1);
    for(domain in domains.vals()){
      let validation = ICRC1.Map.get(domainValidation,domainHash, domain);
      let controllers =  ICRC1.Map.get(domainOwners, domainHash, domain);
      results.add((controllers, validation));
    };

    return Buffer.toArray(results);
  };

  public type NamespaceLookupResponse = {
    domain: Domain;
    controllers: [Principal];
  };

  private func namespace_lookup(namespaces: [[Text]]) : [?NamespaceLookupResponse] {
    var result = Buffer.Buffer<?NamespaceLookupResponse>(1);
    for(namespace in namespaces.vals()){
      //loop that checks if it exists and then removes one item from the end of the namespace
      var domainLevels : [Text] = namespace;
      label search while(domainLevels.size() > 0){
        switch(ICRC1.Map.get(domainOwners, domainHash, domainLevels)){
          case(null){
            if(domainLevels.size() == 1){
              result.add(null);
              break search;
            };
            D.print(debug_show(domainLevels));
            domainLevels := Array.slice<Text>(domainLevels, 0, domainLevels.size() - 1) |>
                            Iter.toArray<Text>(_) ;
            D.print(debug_show(domainLevels));
          };
          case(?val){
            result.add(?{
              domain = domainLevels;
              controllers = val;
            });
            break search;
          };
        };
      };
    };

    return Buffer.toArray(result);
  };

  
  public query(msg) func icrc86_namespace_look_up(namespaces: [[Text]]) : async [?NamespaceLookupResponse] {
    namespace_lookup(namespaces);
  };

  private func valueToAccount(val : ICRC3.Value) : ?ICRC1.Account {
    switch(val){
      case(#Array(val)){
        if(val.size() == 0){
          return null;
        } else if (val.size() == 1){
          switch(val[0]){
            case(#Blob(blob)){
              return ?{
                owner = Principal.fromBlob(blob);
                subaccount = null;
              };
            };
            case(_){
              return null;
            };
          } 
        } else if (val.size() == 2){
            switch(val[0],val[1]){
              case(#Blob(blob), #Blob(blobSA)){
                return ?{
                  owner = Principal.fromBlob(blob);
                  subaccount = ?blobSA;
                };
              };
              case(_,_){
                return null;
              };
            };
        };
      };
      case(_){
        return null;
      };
    };
    return null;
  };


  public shared(msg) func icrc85_deposit_cycles_notify(request: ShareArgs) : () {
    let result = await* process_cycles(msg.caller, request);
    return;
  };

  public shared(msg) func icrc85_deposit_cycles(request: ShareArgs) : async ShareResult {
    return await* process_cycles(msg.caller, request);
  };

  private func process_cycles(caller: Principal, request: ShareArgs) : async* ShareResult {

  
    debug if(debug_channel.announce) D.print("recived cycles");
    
    let amount = ExperimentalCycles.available();
    if(amount <= 100_000_000) return #Err(#NotEnoughCycles(amount, 100_000_000));
    var accepted = amount;
    ignore ExperimentalCycles.accept(accepted);
    debug if(debug_channel.share) D.print("recived cycles" # debug_show(accepted));

    let balance = ExperimentalCycles.balance();

    if(balance < minCycles){
      if(minCycles > accepted + balance){
        //no distribution...take all for canister cycles
        return #Ok(0);
      } else {
        let take = minCycles - balance;
        accepted -= take;
        if(accepted<=100_000_000){
          //no distribution...take all for canister cycles
          return #Ok(0);
        };
      };
    };


    let total = accepted - 100_000_000;
    
    debug if(debug_channel.share) D.print("total " # debug_show(total));

    var shareTotal = 0;
    for (share in request.vals()) {
      let (namespace, shareAmount) = share;
      shareTotal += shareAmount;
    };

    debug if(debug_channel.share) D.print("shareTotal " # debug_show(shareTotal));

    var remaining = shareTotal;
    //Deposit the Cycles
    let cycleLedger : CyclesLedger.Service = actor(CyclesLedger_CANISTER_ID);
    ExperimentalCycles.add(amount);


    debug if(debug_channel.share) D.print("depositing " # debug_show(amount));
    let result = try{
     await cycleLedger.deposit({
        to = {
          owner = Principal.fromActor(this);
          subaccount = null;
        }; 
        memo = null
      });
    } catch(e){
      ICRC1.Vector.add(failedDeposit, (total, request));
      return #Err(#CustomError("Failed to deposit cycles"));
    };
    debug if(debug_channel.share) D.print("depositing result" # debug_show(result));
    
    var amountMinted = 0;
    for (share in request.vals()) {
      let (namespace, shareAmount) = share;
      let namespaceItems = switch(ICRC75.BTree.get(icrc75().get_state().namespaceStore,Text.compare,namespace)){
        case(null) [];
        case(?val) ICRC75.Set.toArray(val.members);
      };

      let (bAccount, possibleAccount : ICRC1.Account) = switch(AccountLib.fromText(namespace)){
        case(#ok(val)) (true, val);
        case(_) (false, {owner = Principal.fromActor(this); subaccount = null});
      };

      let namespaceAccount = if(namespace == ""){
        //abandoned cycles; mint to ICDV
        {owner = Principal.fromText("k3gvh-4fgvt-etjfk-dfpfc-we5bp-cguw5-6rrao-65iwb-ttim7-tt3bc-6qe"); subaccount = null};
      } else if(PExt.fromText(namespace) != null){
        //a principal was provided
        {owner = Principal.fromText(namespace); subaccount = null};
      } else if(bAccount){
        //a account was provided
        possibleAccount;
      } else if(namespaceItems.size() != 1){
        namespace_account(namespace);
      } else {
        switch(namespaceItems[0]){
          case(#Account(val)) val;
          case(_) namespace_account(namespace);
        };
      };

      let thisAmount = (total * shareAmount) / shareTotal; 
      debug if(debug_channel.share) D.print("mint " # debug_show((namespace, namespaceAccount, thisAmount)));
      let mintResult =  await* icrc1().mint(icrc1().minting_account().owner,  {
        to = namespaceAccount;               // The account receiving the newly minted tokens.
        amount =  thisAmount;          // The number of tokens to mint.
        memo = ?Principal.toBlob(caller);               // An optional memo accompanying the minting operation.
        created_at_time = ?Nat64.fromNat(Int.abs(Time.now())); // The time the mint operation was created.
      });

      debug if(debug_channel.share) D.print("mint result" # debug_show(mintResult));
      amountMinted += thisAmount;
    };

    debug if(debug_channel.share) D.print("done minting " # debug_show(amountMinted));

    if(amountMinted < total){
      ignore await* icrc1().mint(icrc1().minting_account().owner,  {
        to = devAccount;               // The account receiving the newly minted tokens.
        amount =  total - amountMinted;          // The number of tokens to mint.
        memo = ?Principal.toBlob(caller);               // An optional memo accompanying the minting operation.
        created_at_time = ?Nat64.fromNat(Int.abs(Time.now())); // The time the mint operation was created.
      })
    };
    debug if(debug_channel.share) D.print("done with a thing " # debug_show(amountMinted));
    #Ok(total);
  };

  

  public type WithdrawResult =  {
    #Ok : {
      txid : Nat;
      amount : Nat;
    };
    #Err :  {
      #InsufficientCredit;
      #AmountBelowMinimum ;
      #CallLedgerError : { message : Text };
    };
  };

  private func withdraw_cycles(request: WithdrawArgs) : async WithdrawResult {
    let result = try{
      let cycleLedger : CyclesLedger.Service = actor(CyclesLedger_CANISTER_ID);
      await cycleLedger.icrc1_transfer({
        from_subaccount = null;
        memo = null;
        created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
        amount = request.amount;
        fee = ?100_000_000;
        to = request.to;
      });

    } catch(e){
      //mint it back
      ignore await* icrc1().mint(icrc1().minting_account().owner,  {
        to = request.to;               // The account receiving the newly minted tokens.
        amount =  request.amount;          // The number of tokens to mint.
        memo = ?Blob.fromArray([1,1,1,2,2,2,2]);               // An optional memo accompanying the minting operation.
        created_at_time = ?Nat64.fromNat(Int.abs(Time.now())); // The time the mint operation was created.
      });
      return #Err(#CallLedgerError( { message = Error.message(e) }));
    };

    let block = switch(result){
      case(#Ok(val)) val;
      case(#Err(err)){
        ignore await* icrc1().mint(icrc1().minting_account().owner,  {
          to = request.to;               // The account receiving the newly minted tokens.
          amount =  request.amount;          // The number of tokens to mint.
          memo = ?Blob.fromArray([1,1,1,2,2,2,2]);               // An optional memo accompanying the minting operation.
          created_at_time = ?Nat64.fromNat(Int.abs(Time.now())); // The time the mint operation was created.
        });
         return #Err(#CallLedgerError{message = debug_show(err)});
      };
    };

    #Ok({
      txid = block;
      amount = request.amount;
    });
  };

  public query(msg) func icrc84_supported_tokens(prev: ?Token84, take: ?Nat) : async [Token84] {
    [#icrc1(Principal.fromText(CyclesLedger_CANISTER_ID))];
  };

  private func namespace_account(namespace: Text) : ICRC1.Account {
    {
          owner = Principal.fromActor(this);
          subaccount = ?Sha256.fromBlob(#sha256, Text.encodeUtf8(namespace));
    };
  };

  public query(msg) func icrc85_namespace_account(namespace: Text) : async ICRC1.Account{
    namespace_account(namespace);
  };

  ///MARK: ICRC84

  public query(msg) func icrc84_token_info(token: Token84) : async TokenInfo {
    if(token != #icrc1(Principal.fromText(CyclesLedger_CANISTER_ID))){ D.trap("UnknownToken")};
    {
      deposit_fee = 0; //deposit only supported through cmc
      withdrawal_fee = 100_000_000;
      min_deposit = 0;
      min_withdrawal = 100_000_000;
    };
  };

  public query(msg) func icrc84_credits(token: Token84) : async Int {
    if(token != #icrc1(Principal.fromText(CyclesLedger_CANISTER_ID))){ D.trap("UnknownToken")};
    icrc1().balance_of({owner = msg.caller; subaccount = null});
  };

  

  public query(msg) func icrc84_trackedDeposit(token: Token84) : async BalanceResult {
    if(token != #icrc1(Principal.fromText(CyclesLedger_CANISTER_ID))){ D.trap("UnknownToken")};
    #Ok(icrc1().balance_of({owner = msg.caller; subaccount = null}));
  };

  

  public query(msg) func icrc84_all_credits(prev: ?Token84, take: ?Nat) : async [(Token84, Int)] {
    [(#icrc1(Principal.fromText(CyclesLedger_CANISTER_ID)), icrc1().balance_of({owner = msg.caller; subaccount = null}))];
  };

  public shared(msg) func icrc84_notify(request: {token: Token84}) : async NotifyResult {
    #Err(#NotAvailable{message = "Deposits are only available through the icrc85_deposit_cycles function"});
  };

  public shared(msg) func icrc84_deposit(request: DepositArgs) : async DepositResponse {
    #Err(#TransferError{message = "Deposits are only available through the icrc85_deposit_cycles function"});
  };

  public shared(msg) func icrc84_withdraw(request: WithdrawArgs) : async WithdrawResult {
    debug if(debug_channel.announce) D.print("withdrawing cycles");

    assert(msg.caller == request.to.owner);

    assert(request.token == #icrc1(Principal.fromText(CyclesLedger_CANISTER_ID)));

    if(request.amount < 100_000_000){
      return #Err(#AmountBelowMinimum);
    };

    if(icrc1().balance_of(request.to) < (request.amount + 100_000_000)){
      return #Err(#InsufficientCredit);
    };

    //lockedAccounts
    //ignore ICRC1.Map.add(lockedAccounts, ICRC1.ahash, request.to, Int.abs(Time.now()));
    //todo: schedule timer to timeout

    //burn first
    let burnResult = icrc1().burn(icrc1().minting_account().owner, {
       from_subaccount = request.to.subaccount; // The subaccount from which tokens are burned.
       amount =  request.amount + 100_000_000;              // The number of tokens to burn.
       memo = null;                  // An optional memo accompanying the burn operation.
       created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    });

    await withdraw_cycles(request);
  };

  ///MARK: ICRC75



  public type DataItemMap = Service75.DataItemMap;
  public type ManageRequest = Service75.ManageRequest;
  public type ManageResult = Service75.ManageResult;
  public type ManageListMembershipRequest = Service75.ManageListMembershipRequest;
  public type ManageListMembershipRequestItem = Service75.ManageListMembershipRequestItem;
  public type ManageListMembershipAction = Service75.ManageListMembershipAction;
  public type ManageListPropertyRequest = Service75.ManageListPropertyRequest;
  public type ManageListMembershipResponse = Service75.ManageListMembershipResponse;
  public type ManageListPropertyRequestItem = Service75.ManageListPropertyRequestItem;
  public type ManageListPropertyResponse = Service75.ManageListPropertyResponse;
  public type AuthorizedRequestItem = Service75.AuthorizedRequestItem;
  public type PermissionList = Service75.PermissionList;
  public type PermissionListItem = Service75.PermissionListItem;
  public type ListRecord = Service75.ListRecord;
  public type List = ICRC75.List;
  public type ListItem = ICRC75.ListItem;
  public type Permission = ICRC75.Permission;
  public type Identity = ICRC75.Identity;
  public type ManageResponse = Service75.ManageResponse;

  private func canChangeProperty<system>(trx: ICRC3.Value, trxtop: ?ICRC3.Value) : Result.Result<(ICRC3.Value, ?ICRC3.Value), Text> {

    debug if(debug_channel.announce) {
      D.print(debug_show(("In can update", trx, trxtop)));
    };
    switch(trxtop){
      case(?(val)){
        let ?#Text(bType) = ICRC3Helper.get_item_from_map("btype",val) else { return #err("Invalid Transaction")};
        if(bType == "75listCreate"){
          //make sure the caller is a controller on the domain
          let ?#Text(namespace) = ICRC3Helper.get_item_from_map("list", trx) else { return #err("Missing List")};
          let ?#Blob(creatorBlob) = ICRC3Helper.get_item_from_map("creator", trx) else { return #err("Missing Creator")};
          let creator = Principal.fromBlob(creatorBlob);
          let splitNamespace = Iter.toArray<Text>(Text.split(namespace, #text(".")));
          let domains = namespace_lookup([splitNamespace]);
          if(domains.size() == 0){
            return #err("Invalid Domain");
          };
          let ?foundDomain = domains[0] else return #err("Invalid Domain");
          let ?bFoundController = Array.indexOf<Principal>(creator, foundDomain.controllers, Principal.equal) else return #err("Unauthorized");

          //authorized, so we can continue
          return #ok((trx, trxtop));
        } else if(bType == "75listModify" ){
          let newName = ICRC3Helper.get_item_from_map("newName",val);
          switch(newName){
            case(?#Text(foundName)){
              let ?#Blob(callerBlob) = ICRC3Helper.get_item_from_map("caller",trx) else { return #err("Missing Caller")};
              let caller = Principal.fromBlob(callerBlob);
              let splitNamespace = Iter.toArray<Text>(Text.split(foundName, #text(".")));
              let domains = namespace_lookup([splitNamespace]);
              if(domains.size() == 0){
                return #err("Invalid Domain");
              };
              let ?foundDomain = domains[0] else return #err("Invalid Domain");
              let ?bFoundController = Array.indexOf<Principal>(caller, foundDomain.controllers, Principal.equal) else return #err("Unauthorized");
              return #ok((trx, trxtop));
            };
            case(_){};
          };

        } else if(bType == "75listDelete" ){

        } else if(bType == "75permChange" ){

        };
        return #ok((trx, trxtop));
      };
      case(_){
        return #err("Invalid Transaction");
      };
    };
    return #err("Invalid Transaction"); 
  };

  private func canChangeMembers<system>(trx: ICRC3.Value, trxtop: ?ICRC3.Value) : Result.Result<(ICRC3.Value, ?ICRC3.Value), Text> {
    switch(trxtop){
      case(?(val)){
        let ?#Text(bType) = ICRC3Helper.get_item_from_map("btype",val) else { return #err("Invalid Transaction")};
        if(bType == "75memChange"){
          //make sure the caller is a controller on the domain
          let ?#Text(namespace) = ICRC3Helper.get_item_from_map("list", trx) else { return #err("Missing List")};
          let ?#Text(action) = ICRC3Helper.get_item_from_map("change", trx) else { return #err("Missing Action")};

          let ?record = ICRC75.BTree.get(icrc75().get_state().namespaceStore, Text.compare, namespace) else return #err("Missing Namespace");

          if(action == "added" and ICRC75.Set.size(record.members) !=0){
            ICRC75.Set.clear(record.members); //only one entry allowed
            //replace if a valid entry
            let dataItem = switch(ICRC3Helper.get_item_from_map("accountItem", trx)){
              case(?#Array(val)){
                if(val.size() == 2){
                  switch(val[0], val[1]){
                    case(#Blob(blob), #Blob(subaccountBlob)){};
                    case(_){
                      return #err("Invalid Account Item")
                    };
                  };
                } else if (val.size() == 1){
                  switch(val[0]){
                    case(#Blob(blob)){};
                    case(_){
                      return #err("Invalid Account Item")
                    };
                  };
                } else return #err("Invalid Account Item");
              };
              case(_){
                return #err("Missing Account Item");
              };
            };
          } else return #err("Missing account");
            

          //authorized, so we can continue
          return #ok((trx, trxtop));
        } else return #err("Invalid Transaction");
      };
      case(_){
        return #err("Invalid Transaction" );
      };
    };
  };


  public query(msg) func icrc_75_metadata() : async DataItemMap {
    return icrc75().metadata();
  };

  public shared(msg) func icrc_75_manage(request: ManageRequest) : async ManageResponse {
      return icrc75().updateProperties(msg.caller, request);
    };

  public shared(msg) func icrc_75_manage_list_membership(request: ManageListMembershipRequest) : async ManageListMembershipResponse {
    return await* icrc75().manage_list_membership(msg.caller, request, ?#Sync(canChangeMembers));
  };

  public shared(msg) func icrc75_manage_list_properties(request: ManageListPropertyRequest) : async ManageListPropertyResponse {
    return await* icrc75().manage_list_properties(msg.caller, request, ?#Sync(canChangeProperty));
  };

  public query(msg) func icrc_75_get_lists(name: ?Text, includeArchived: Bool, cursor: ?List, limit: ?Nat) : async [ListRecord] {
    return icrc75().get_lists(msg.caller, name, includeArchived, cursor, limit);
  };

  public query(msg) func icrc_75_get_list_members_admin(list: List, cursor: ?ListItem, limit: ?Nat) : async [ListItem] {
    return icrc75().get_list_members_admin(msg.caller, list, cursor, limit);
  };

  public query(msg) func icrc_75_get_list_permissions_admin(list: List, filter: ?Permission, prev: ?PermissionListItem, take: ?Nat) : async PermissionList {
    return icrc75().get_list_permission_admin(msg.caller, list, filter, prev, take);
  };

  public query(msg) func icrc_75_get_list_lists(list: List, cursor: ?List, limit: ?Nat) : async [List] {
    return icrc75().get_list_lists(msg.caller, list, cursor, limit);
  };

  public query(msg) func icrc_75_member_of(listItem: ListItem, list: ?List, limit: ?Nat) : async [List] {
    return icrc75().member_of(msg.caller, listItem, list, limit);
  };

  public query(msg) func icrc_75_is_member(requestItems: [AuthorizedRequestItem]) : async [Bool] {
    return icrc75().is_member(msg.caller, requestItems);
  };

  system func postupgrade() {
    //re wire up the listener after upgrade
    //uncomment the following line to register the transfer_listener
      icrc1().register_token_transferred_listener("com.cycleshareledger", transfer_listener);

      icrc75().registerPropertyChangeListener("com.cycleshareledger", property_update_listener);

      icrc75().registerMembershipChangeListener("com.cycleshareledger", member_update_listener);

      //uncomment the following line to register the transfer_listener
      //icrc2().register_token_approved_listener("my_namespace", approval_listener);

      //uncomment the following line to register the transfer_listener
      //icrc1().register_transfer_from_listener("my_namespace", transfer_from_listener);
  };

};
