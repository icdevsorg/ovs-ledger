import { Principal } from "@dfinity/principal";
import type { Identity } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';

import { IDL } from "@dfinity/candid";

import {
  PocketIc,
  createIdentity,
} from "@hadronous/pic";

import type {
  Actor,
  CanisterFixture
} from "@hadronous/pic";



import {idlFactory as tokenIDLFactory,
  init as tokenInit } from "../../src/declarations/token/token.did.js";
import type {
  _SERVICE as TokenService,
 } from "../../src/declarations/token/token.did.d";
export const sub_WASM_PATH = ".dfx/local/canisters/token/token.wasm";


import {idlFactory as BroadcasterIDLFactory,
  init as broadcasterInit } from "../../src/declarations/broadcaster/broadcaster.did.js";
import type {
  _SERVICE as BroadcasterService
 } from "../../src/declarations/broadcaster/broadcaster.did.d";
export const broadcaster_WASM_PATH = ".dfx/local/canisters/broadcaster/broadcaster.wasm";

import type {
  _SERVICE as NNSLedgerService,
  Account,
  Icrc1TransferResult

} from "../../src/declarations/nns-ledger/nns-ledger.did.d";
import {
  idlFactory as nnsIdlFactory,
} from "../../src/declarations/nns-ledger/nns-ledger.did.js";

import type {
  _SERVICE as CycleLedgerService,
  LedgerArgs as CycleLedgerArgs
} from "../../src/declarations/cycles_ledger/cycles_ledger.did.d";
import {
  idlFactory as cyclesLedgerIDLFactory,
  init as cyclesLedgerInit
} from "../../src/declarations/cycles_ledger/cycles_ledger.did.js";
import { token } from "../../src/declarations/token/index.js";


let pic: PocketIc;

let token_fixture: CanisterFixture<TokenService>;
let nnsledger: Actor<NNSLedgerService>;
let cyclesLedger: CanisterFixture<CycleLedgerService>;
let broadcaster: CanisterFixture<BroadcasterService>;

const NNS_SUBNET_ID =
  "erfz5-i2fgp-76zf7-idtca-yam6s-reegs-x5a3a-nku2r-uqnwl-5g7cy-tqe";
const nnsLedgerCanisterId = Principal.fromText(
    "ryjl3-tyaaa-aaaaa-aaaba-cai"
  );

const NNS_STATE_PATH = "pic/nns_state/node-100/state";

const admin = createIdentity("admin");
const alice = createIdentity("alice");
const bob = createIdentity("bob");
const serviceProvider = createIdentity("serviceProvider");
const OneDay = BigInt(86400000000000); // 24 hours in NanoSeconds
const OneMinute = BigInt(60000000000); // 1 minute in Nanoseconds

const base64ToUInt8Array = (base64String: string): Uint8Array => {
  return Buffer.from(base64String, 'base64');
};

const minterPublicKey = 'Uu8wv55BKmk9ZErr6OIt5XR1kpEGXcOSOC1OYzrAwuk=';
const minterPrivateKey =
  'N3HB8Hh2PrWqhWH2Qqgr1vbU9T3gb1zgdBD8ZOdlQnVS7zC/nkEqaT1kSuvo4i3ldHWSkQZdw5I4LU5jOsDC6Q==';

const minterIdentity = Ed25519KeyIdentity.fromKeyPair(
  base64ToUInt8Array(minterPublicKey),
  base64ToUInt8Array(minterPrivateKey),
);

async function awardTokens(actor: Actor<NNSLedgerService>, caller: Identity,  fromSub: Uint8Array | null, to: Account, amount: bigint) : Promise<Icrc1TransferResult> {
  actor.setIdentity(caller);
  let result = await actor.icrc1_transfer({
    memo: [],
    amount: amount,
    fee: [],
    from_subaccount: fromSub ? [fromSub] : [],
    to: to,
    created_at_time: [],
  });
  console.log("transfer result", result);
  return result;
};


describe("test cycles share token", () => {
  beforeEach(async () => {

    pic = await PocketIc.create(process.env.PIC_URL, {
      nns: {
          fromPath: NNS_STATE_PATH,
          subnetId: Principal.fromText(NNS_SUBNET_ID),
      },
      system: 2,
    });

    await pic.setTime(new Date(2024, 1, 30).getTime());
    await pic.tick();
    await pic.tick();
    await pic.tick();
    await pic.tick();
    await pic.tick();
    await pic.advanceTime(1000 * 5);


    console.log("pic system", pic.getSystemSubnets());

    await pic.resetTime();
    await pic.tick();

    token_fixture = await pic.setupCanister<TokenService>({
      idlFactory: tokenIDLFactory,
      wasm: sub_WASM_PATH,
      arg: IDL.encode(tokenInit({IDL}), [[]]),
      sender: admin.getPrincipal(),
    });
    

    console.log("nns");
    nnsledger = await pic.createActor<NNSLedgerService>(
      nnsIdlFactory,
      nnsLedgerCanisterId
    );

    

    const cycleLedgerArgs: CycleLedgerArgs = {
      Init: {
        index_id: [],
        max_blocks_per_request: 100n,
      },
    };

    console.log("creating cycles ledger", cycleLedgerArgs);

    cyclesLedger = await pic.setupCanister<CycleLedgerService>({
      wasm: ".dfx/local/canisters/cycles_ledger/cycles_ledger.wasm.gz",
      idlFactory: cyclesLedgerIDLFactory,
      // targetCanisterId: Principal.fromText("um5iw-rqaaa-aaaaq-qaaba-cai"),
      // targetSubnetId: pic.getInternetIdentitySubnet()?.id,
      arg: IDL.encode(cyclesLedgerInit({ IDL }), [cycleLedgerArgs]),
      sender: admin.getPrincipal(),
    });

    console.log("created cycles ledger", cyclesLedger);

    token_fixture.actor.setIdentity(admin);

    await token_fixture.actor.admin_update_cyclesLedger(cyclesLedger.canisterId.toString());

    console.log("creating broadcaster", cycleLedgerArgs);

    broadcaster = await pic.setupCanister<BroadcasterService>({
      wasm: broadcaster_WASM_PATH,
      idlFactory: BroadcasterIDLFactory,
      // targetCanisterId: Principal.fromText("um5iw-rqaaa-aaaaq-qaaba-cai"),
      // targetSubnetId: pic.getInternetIdentitySubnet()?.id,
      arg: IDL.encode(broadcasterInit({ IDL }), []),
      sender: admin.getPrincipal(),
    });

    console.log("created cycles ledger", cyclesLedger);
  });


  afterEach(async () => {
    await pic.tearDown();
  });

  it('should correctly share cycles according to the provided request', async () => {
    // Arrange
    const shareRequest : [string, bigint][] = [
      ["namespace1", 100n],
      ["namespace2", 200n],
    ];
    const cyclesToShare = 300_000_000n; // Total cycles to be shared
  
    const tokenCanisterId = token_fixture.canisterId.toString();
    const initialBalance = await cyclesLedger.actor.icrc1_balance_of({
      owner : token_fixture.canisterId,
      subaccount : [],
    });
  
    // Act
    const shareResult = await broadcaster.actor.broadcast(tokenCanisterId, shareRequest, cyclesToShare);

    console.log(shareResult, "shareResult");
  
    // Advance time to ensure cycles are processed
    await pic.advanceTime(1000 * 10);
    await pic.tick();
    await pic.tick();

    console.log( "getting balances");
  
    const finalBalance = await cyclesLedger.actor.icrc1_balance_of({
      owner : token_fixture.canisterId,
      subaccount : [],
    });

    let namespace1Account = await token_fixture.actor.icrc85_namespace_account("namespace1");
    const namespace1Balance = await token_fixture.actor.icrc1_balance_of(namespace1Account);

    console.log("namespace1Account", namespace1Account, namespace1Balance);
    

    let namespace2Account = await token_fixture.actor.icrc85_namespace_account("namespace2");
    const namespace2Balance = await token_fixture.actor.icrc1_balance_of(namespace2Account);

    console.log("namespace2Account", namespace2Account, namespace2Balance);

    if (!("Ok" in shareResult)) {
      throw "wrong response";
    }
  
    // Assert
    expect(shareResult.Ok).toEqual(200_000_000n);
    expect(namespace1Balance).toEqual(66_666_666n);
    expect(namespace2Balance).toEqual(133_333_333n);
    expect(finalBalance).toEqual(200_000_000n);
  });

  it('should not share if not enough cycles', async () => {
    // Arrange
    const shareRequest : [string, bigint][] = [
      ["namespace1", 100n],
      ["namespace2", 200n],
    ];
    const cyclesToShare = 100_000_000n; // Total cycles to be shared
  
    const tokenCanisterId = token_fixture.canisterId.toString();
    const initialBalance = await cyclesLedger.actor.icrc1_balance_of({
      owner : token_fixture.canisterId,
      subaccount : [],
    });
  
    // Act
    const shareResult = await broadcaster.actor.broadcast(tokenCanisterId, shareRequest, cyclesToShare);

    console.log(shareResult, "shareResult");

    if (!("Err" in shareResult)) {
      throw "wrong response";
    }
  
    // Assert
    expect(shareResult.Err).toHaveProperty("NotEnoughCycles");
    
  });

  it('should allow for retrieval of a validation code approval for 5XDR exists', async () => {

    console.log("cshould allow for retrieval");

    let aliceaccount : Account = {owner: alice.getPrincipal(), subaccount: []};
    let bobaccount : Account = {owner: bob.getPrincipal(), subaccount: []};

    console.log("aliceaccount", aliceaccount, aliceaccount.owner.toString(), aliceaccount.subaccount.toString());
    console.log("bobaccount", bobaccount, bobaccount.owner.toString(), bobaccount.subaccount.toString());

    await awardTokens(nnsledger, minterIdentity, null, aliceaccount, 100_0000_0000n);
    await awardTokens(nnsledger, minterIdentity, null, bobaccount, 100_0000_0000n);

    console.log("tokens awarded");
    
    const tokenCanisterId = token_fixture.canisterId.toString();

    //validate when alice does not have 5 XDR approved

    let validationRetrieval = await token_fixture.actor.icrc86_claim_domain({
      domain : ["namespace1"],
      gateAccount : [],
      controllers: [],
      validationCode: []
    });

    console.log( "validationRetrieval", validationRetrieval);

    await pic.advanceTime(1000 * 10);
    await pic.tick();


    if (!("Err" in validationRetrieval)) {
      throw "wrong response";
    };

    if (!("ValidationGateFailed" in validationRetrieval.Err)) {
      throw "wrong response";
    };

    await nnsledger.setIdentity(alice);
    await token_fixture.actor.setIdentity(alice);

    let approve = await nnsledger.icrc2_approve({
      spender: {owner: token_fixture.canisterId, subaccount: []},
      amount: 5_0000_0000n,
      memo : [],
      created_at_time: [],
      expected_allowance: [],
      fee: [10_000n],
      from_subaccount: [],
      expires_at: [],
    });

    console.log( "approve", approve);

    await pic.advanceTime(1000 * 10);
    await pic.tick();
    await pic.tick();

    //check approval

    let allowance = await nnsledger.icrc2_allowance({
      spender: {owner: token_fixture.canisterId, subaccount: []}, 
      account: aliceaccount
  });

    console.log( "allowance", allowance, aliceaccount.owner.toString(), {owner: token_fixture.canisterId, subaccount: []}.owner.toString());


    let validationRetrieval2 = await token_fixture.actor.icrc86_claim_domain({
      domain : ["namespace1"],
      gateAccount : [],
      validationCode: [],
      controllers: []
    });

    await pic.advanceTime(1000 * 10);
    await pic.tick();
    await pic.tick();


    console.log( "validationRetrieval2", validationRetrieval2);

    if (!("ValidationRequired" in validationRetrieval2)) {
      throw "wrong response";
    };

    expect(validationRetrieval2.ValidationRequired.validation.length).toBeGreaterThan(1);


    //try validation with invalid code:

    let validationRetrieval3 = await token_fixture.actor.icrc86_claim_domain({
      domain : ["namespace1"],
      gateAccount : [],
      validationCode: ["1111111"],
      controllers: []
    });

    console.log( "validationRetrieval3", validationRetrieval3);

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    if (!("Err" in validationRetrieval3)) {
      throw "wrong response";
    };

    if (!("ValidationRecordNotFound" in validationRetrieval3.Err)) {
      throw "wrong response";
    };

    //approve non existant validation code

    await token_fixture.actor.setIdentity(admin);

    let approvalRetrieval = await token_fixture.actor.icrc86_approve_domain({
      domain : ["namespace1"],
      validationCode: "1111111"
    });

    console.log( "approvalRetrieval", approvalRetrieval);

    if (!("Err" in approvalRetrieval)) {
      throw "wrong response";
    };

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    //validate an existing response

    console.log( "validationRetrieval2 validation code", validationRetrieval2.ValidationRequired.validation);

    let approvalRetrieval2 = await token_fixture.actor.icrc86_approve_domain({
      domain : ["namespace1"],
      validationCode: validationRetrieval2.ValidationRequired.validation
    });

    console.log( "approvalRetrieval2", approvalRetrieval2);

    if (!("Ok" in approvalRetrieval2)) {
      throw "wrong response";
    };

    //now that the domain is claimed we need to add an account to the namespace


    //can't claim a non registered domain
    token_fixture.actor.setIdentity(alice);

    let namespaceAddNonExistent = await token_fixture.actor.icrc75_manage_list_properties([{
      list : "namespace3",
      memo : [],
      created_at_time: [],
      from_subaccount: [],
      action : {
        Create : {
          admin: [],
          metadata: [],
          members: [{
            Account : aliceaccount
          }]
        }
      }
    }]);

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    console.log( "namespaceAddNonExistent", namespaceAddNonExistent);

    if (namespaceAddNonExistent.length == 0) {
      throw "wrong response";
    };

    if (namespaceAddNonExistent[0].length == 0) {
      throw "wrong response";
    };

    if (!("Err" in namespaceAddNonExistent[0][0])) {
      throw "wrong response";
    };

    console.log( "namespaceAddNonExistent", namespaceAddNonExistent[0][0]);


    //can claim a long namespace

    let namespaceAddLong = await token_fixture.actor.icrc75_manage_list_properties([{
      list : "namespace1.test.test.test",
      memo : [],
      created_at_time: [],
      from_subaccount: [],
      action : {
        Create : {
          admin: [],
          metadata: [],
          members: [{
            Account : aliceaccount
          }]
        }
      }
    }]);

    console.log( "namespaceAddLong", namespaceAddLong[0][0]);

    if (!(namespaceAddLong.length == 1)) {
      throw "wrong response";
    };

    if (!(namespaceAddLong[0].length == 1)) {
      throw "wrong response";
    };

    if (!("Ok" in namespaceAddLong[0][0])) {
      throw "wrong response";
    };

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    //can claim a short namespace

    let namespaceAddShort = await token_fixture.actor.icrc75_manage_list_properties([{
      list : "namespace1",
      memo : [],
      created_at_time: [],
      from_subaccount: [],
      action : {
        Create : {
          admin: [],
          metadata: [],
          members: [{
            Account : aliceaccount
          }]
        }
      }
    }]);

    console.log( "namespaceAddShort", namespaceAddShort);

    if (!(namespaceAddShort.length == 1)) {
      throw "wrong response";
    };

    if (!(namespaceAddShort[0].length == 1)) {
      throw "wrong response";
    };

    if (!("Ok" in namespaceAddShort[0][0])) {
      throw "wrong response";
    };

    let initialBalanceBob = await token_fixture.actor.icrc1_balance_of(bobaccount);
    let initialBalanceAlice = await token_fixture.actor.icrc1_balance_of(aliceaccount);

    await pic.advanceTime(1000 * 10);
    await pic.tick();


    //validate a claim that has a balance

    const shareRequest : [string, bigint][] = [
      ["namespace1", 100n],
      ["namespace2", 200n],
    ];
    const cyclesToShare = 300_000_000n; // Total cycles to be shared
  
    const initialBalance = await cyclesLedger.actor.icrc1_balance_of({
      owner : token_fixture.canisterId,
      subaccount : [],
    });

    // Act
    const shareResult = await broadcaster.actor.broadcast(tokenCanisterId, shareRequest, cyclesToShare);

    console.log(shareResult, "shareResult");

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    let finalBalanceAlice = await token_fixture.actor.icrc1_balance_of(aliceaccount);

    await token_fixture.actor.setIdentity(bob);
    await nnsledger.setIdentity(bob);

    let approve2 = await nnsledger.icrc2_approve({
      spender: {owner: token_fixture.canisterId, subaccount: []},
      amount: 5_0000_0000n,
      memo : [],
      created_at_time: [],
      expected_allowance: [],
      fee: [10_000n],
      from_subaccount: [],
      expires_at: [],
    });

    console.log( "approve", approve2);

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    let validationRetrievalBob = await token_fixture.actor.icrc86_claim_domain({
      domain : ["namespace2"],
      gateAccount : [],
      validationCode: [],
      controllers: []
    });

    await pic.advanceTime(1000 * 10);
    await pic.tick();


    console.log( "validationRetrievalBob", validationRetrievalBob);

    if (!("ValidationRequired" in validationRetrievalBob)) {
      throw "wrong response";
    };

    expect(validationRetrievalBob.ValidationRequired.validation.length).toBeGreaterThan(1);

    //validate an existing response


    await token_fixture.actor.setIdentity(admin);

    let approvalDomainBob = await token_fixture.actor.icrc86_approve_domain({
      domain : ["namespace2"],
      validationCode: validationRetrievalBob.ValidationRequired.validation
    });

    console.log( "approvalDomainBob", approvalDomainBob);

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    if (!("Ok" in approvalDomainBob)) {
      throw "wrong response";
    };

    console.log( "approvalDomainBob", approvalDomainBob);

    if (!("ValidationRequired" in validationRetrievalBob)) {
      throw "wrong response";
    };
    token_fixture.actor.setIdentity(bob);

    let namespaceClaimBob = await token_fixture.actor.icrc75_manage_list_properties([{
      memo: [],
      created_at_time: [],
      from_subaccount: [],
      list : "namespace2",
      action : {
        Create: {
          admin: [],
          metadata: [],
          members: [{
            Account : bobaccount
          }]
        }
      }
    }]);


    console.log( "namespaceClaimBob", namespaceClaimBob);

    await pic.advanceTime(1000 * 10);
    await pic.tick();
    await pic.tick();
    await pic.tick();

    if (namespaceClaimBob.length == 0) {
      throw "bad response";
    };

    if (namespaceClaimBob[0].length == 0) {
      throw "bad response";
    };

    //fee of 100_000_000 is removed
    if (!("Ok" in namespaceClaimBob[0][0])) {
      throw "wrong response";
    };



    let finalBalanceBob = await token_fixture.actor.icrc1_balance_of(bobaccount);


    expect(finalBalanceAlice).toEqual(66_666_666n);
    expect(finalBalanceBob).toEqual(33_333_333n);

    //should allow reregiser


    token_fixture.actor.setIdentity(alice);

    let validationRetrievalBob2 = await token_fixture.actor.icrc75_manage_list_properties([{
      memo: [],
      created_at_time: [],
      from_subaccount: [],
      list : "namespace2",
      action : {
        Create: {
          admin: [],
          metadata: [],
          members: [{
            Account : bobaccount
          }]
        }
      }
    }]);

    console.log( "validationRetrievalBob2", validationRetrievalBob2);



    await pic.advanceTime(1000 * 10);
    await pic.tick();


    let lookup = await token_fixture.actor.icrc86_domain_look_up([["namespace2"]]);

    if(lookup.length == 0) {
      throw "bad lookup";
    };


    if(lookup[0][0].length == 0) {
      throw "bad lookup";
    };

    if(lookup[0][0][0].length == 0) {
      throw "bad lookup";
    };


    expect(lookup[0][0][0][0]).toEqual(bobaccount.owner);

    //can withdraw

    const shareResult2 = await broadcaster.actor.broadcast(tokenCanisterId, [
      ["namespace1", 100n]], cyclesToShare * 100n);

    await token_fixture.actor.setIdentity(alice);

    let withdraw = await token_fixture.actor.icrc84_withdraw({
      to : aliceaccount,
      amount : 1_000_000_000n,
      token : {
        icrc1 : cyclesLedger.canisterId,
      }
    });

    console.log( "withdraw", withdraw);

    await pic.advanceTime(1000 * 10);
    await pic.tick();

    let finalBalanceAlice2 = await cyclesLedger.actor.icrc1_balance_of(aliceaccount);

    expect(finalBalanceAlice2).toEqual(1_000_000_000n);

    // withdraw via burn

    let mintingAccount = await token_fixture.actor.icrc1_minting_account();

    console.log( "mintingAccount", mintingAccount);

    if (mintingAccount.length == 0) {
      throw "bad minting account";
    };


    let burn = await token_fixture.actor.icrc1_transfer({
      from_subaccount: [],
      amount: 1_000_000_001n,
      to: mintingAccount[0],
      fee: [100_000_000n],
      memo: [],
      created_at_time: [],
    });

    await pic.advanceTime(1000 * 10);
    await pic.tick();


    let finalBalanceAlice3 = await cyclesLedger.actor.icrc1_balance_of(aliceaccount);

    expect(finalBalanceAlice3).toEqual(1_900_000_001n);


    let tokenInfo = await token_fixture.actor.icrc84_token_info({
      icrc1 : cyclesLedger.canisterId,
    });

    console.log( "mintingAccount", mintingAccount);

    let credits = await token_fixture.actor.icrc84_credits({
      icrc1 : cyclesLedger.canisterId,
    });

    console.log( "credits", credits);

    try{
      let creditsWrong = await token_fixture.actor.icrc84_credits({
        icrc1 : token_fixture.canisterId,
      });

      console.log( "creditsWrong", creditsWrong);
    } catch (e) {
      console.log( "creditsWrong", e);
    };

    try{
      let icrc84_trackedDeposit_wrong = await token_fixture.actor.icrc84_trackedDeposit({
        icrc1 : token_fixture.canisterId,
      });

      console.log( "icrc84_trackedDeposit_wrong", icrc84_trackedDeposit_wrong);
    } catch (e) {
      console.log( "icrc84_trackedDeposit_wrong", e);
    };

    let icrc84_trackedDeposit = await token_fixture.actor.icrc84_trackedDeposit({
      icrc1 : cyclesLedger.canisterId,
    });

    console.log( "icrc84_trackedDeposit", icrc84_trackedDeposit);

    let icrc84_all_credits = await token_fixture.actor.icrc84_all_credits([],[]);

    console.log( "icrc84_trackedDeposit", icrc84_all_credits);

    let icrc84_notify = await token_fixture.actor.icrc84_notify({token :{
      icrc1 : token_fixture.canisterId,
    }});

    console.log( "icrc84_notify", icrc84_notify);


    let icrc84_deposit = await token_fixture.actor.icrc84_deposit({token :{
      icrc1 : token_fixture.canisterId,
      },
      amount : 100_000_000n,
      subaccount : [],});

    console.log( "icrc84_deposit", icrc84_deposit);


  });
  
});
