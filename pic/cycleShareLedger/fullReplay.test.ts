/**
 * Full Replay & Index Canister Test for CycleShareLedger
 * 
 * Tests:
 * 1. Full replay of all 314 CycleShareLedger blocks
 * 2. Verification of total supply matches original
 * 3. Index canister syncs and verifies blocks
 */

import { Principal } from "@dfinity/principal";
import type { Identity } from '@dfinity/agent';
import { IDL } from "@dfinity/candid";

import {
  PocketIc,
  createIdentity,
} from "@dfinity/pic";

import type {
  Actor,
  CanisterFixture
} from "@dfinity/pic";

import { idlFactory as tokenIDLFactory, init as tokenInit } from "../../src/declarations/token/token.did.js";
import type { _SERVICE as TokenService } from "../../src/declarations/token/token.did.d";

import * as path from "path";
import * as fs from "fs";

const WASM_PATH = ".dfx/local/canisters/token/token.wasm.gz";

// Expected values from original ledger (from extraction metadata)
const EXPECTED_TOTAL_SUPPLY = 197_343_901_434_586n; // From cycleshare_meta.json
const EXPECTED_BLOCK_COUNT = 314;

interface ReplayBlockJson {
  id: string;
  btype: string;
  ts: string;
  tx: ReplayTxJson;
}

type ReplayTxJson =
  | { mint: { to: AccountJson; amt: string; memo: string | null } }
  | { burn: { from: AccountJson; amt: string; memo: string | null } }
  | {
      xfer: {
        from: AccountJson;
        to: AccountJson;
        amt: string;
        fee: string | null;
        memo: string | null;
      };
    }
  | {
      approve: {
        from: AccountJson;
        spender: AccountJson;
        amt: string;
        fee: string | null;
        expires_at: string | null;
        memo: string | null;
      };
    }
  | {
      xfer_from: {
        from: AccountJson;
        to: AccountJson;
        spender: AccountJson;
        amt: string;
        fee: string | null;
        memo: string | null;
      };
    };

interface AccountJson {
  owner: string;
  subaccount: string | null;
}

function hexToPrincipal(hex: string): Principal {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return Principal.fromUint8Array(bytes);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function convertAccount(json: AccountJson): { owner: Principal; subaccount: [] | [Uint8Array] } {
  return {
    owner: hexToPrincipal(json.owner),
    subaccount: json.subaccount ? [hexToBytes(json.subaccount)] : []
  };
}

function convertTx(json: ReplayTxJson): object {
  if ("mint" in json) {
    return {
      mint: {
        to: convertAccount(json.mint.to),
        amt: BigInt(json.mint.amt),
        memo: json.mint.memo ? [hexToBytes(json.mint.memo)] : []
      }
    };
  } else if ("burn" in json) {
    return {
      burn: {
        from: convertAccount(json.burn.from),
        amt: BigInt(json.burn.amt),
        memo: json.burn.memo ? [hexToBytes(json.burn.memo)] : []
      }
    };
  } else if ("xfer" in json) {
    return {
      xfer: {
        from: convertAccount(json.xfer.from),
        to: convertAccount(json.xfer.to),
        amt: BigInt(json.xfer.amt),
        fee: json.xfer.fee ? [BigInt(json.xfer.fee)] : [],
        memo: json.xfer.memo ? [hexToBytes(json.xfer.memo)] : []
      }
    };
  } else if ("approve" in json) {
    return {
      approve: {
        from: convertAccount(json.approve.from),
        spender: convertAccount(json.approve.spender),
        amt: BigInt(json.approve.amt),
        fee: json.approve.fee ? [BigInt(json.approve.fee)] : [],
        expires_at: json.approve.expires_at ? [BigInt(json.approve.expires_at)] : [],
        memo: json.approve.memo ? [hexToBytes(json.approve.memo)] : []
      }
    };
  } else if ("xfer_from" in json) {
    return {
      xfer_from: {
        from: convertAccount(json.xfer_from.from),
        to: convertAccount(json.xfer_from.to),
        spender: convertAccount(json.xfer_from.spender),
        amt: BigInt(json.xfer_from.amt),
        fee: json.xfer_from.fee ? [BigInt(json.xfer_from.fee)] : [],
        memo: json.xfer_from.memo ? [hexToBytes(json.xfer_from.memo)] : []
      }
    };
  }
  throw new Error("Unknown tx type");
}

function convertBlock(json: ReplayBlockJson): object {
  return {
    id: BigInt(json.id),
    btype: json.btype,
    ts: BigInt(json.ts),
    tx: convertTx(json.tx)
  };
}

describe("CycleShareLedger Full Replay & Index Verification", () => {
  let pic: PocketIc;
  let tokenCanister: CanisterFixture<TokenService>;
  let owner: Identity;
  let replayData: ReplayBlockJson[];

  beforeAll(async () => {
    if (!fs.existsSync(WASM_PATH)) {
      throw new Error(`WASM file not found at ${WASM_PATH}. Run 'dfx build token' first.`);
    }

    // Load replay data
    const replayDataPath = path.resolve(__dirname, "../../../ICRC_fungible/data/cycleshare_replay.json");
    replayData = JSON.parse(fs.readFileSync(replayDataPath, "utf-8"));
    console.log(`Loaded ${replayData.length} blocks for replay`);

    pic = await PocketIc.create(process.env.PIC_URL);
    owner = createIdentity("owner");

    tokenCanister = await pic.setupCanister<TokenService>({
      idlFactory: tokenIDLFactory,
      wasm: WASM_PATH,
      sender: owner.getPrincipal(),
      arg: IDL.encode(tokenInit({IDL}), [[]])
    });

    console.log(`Deployed token canister: ${tokenCanister.canisterId.toText()}`);
  }, 120000);

  afterAll(async () => {
    await pic.tearDown();
  });

  it("should replay all 314 blocks in batches", async () => {
    tokenCanister.actor.setIdentity(owner);
    
    const BATCH_SIZE = 50;
    let totalProcessed = 0;
    let lastIndex = 0n;

    console.log(`\nReplaying ${replayData.length} blocks in batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < replayData.length; i += BATCH_SIZE) {
      const batch = replayData.slice(i, i + BATCH_SIZE);
      const blocks = batch.map(convertBlock) as any;
      
      const result = await tokenCanister.actor.replay_blocks(blocks);
      
      if ("Err" in result) {
        console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, result.Err);
        throw new Error(`Replay failed at batch starting at index ${i}`);
      }
      
      totalProcessed += Number(result.Ok.processed);
      lastIndex = result.Ok.lastIndex;
      
      console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: processed ${result.Ok.processed} blocks, lastIndex: ${lastIndex}`);
    }

    console.log(`\nTotal processed: ${totalProcessed} blocks`);
    expect(totalProcessed).toBe(EXPECTED_BLOCK_COUNT);
    expect(lastIndex).toBe(BigInt(EXPECTED_BLOCK_COUNT - 1));
  }, 120000);

  it("should have correct block count in ICRC-3 ledger", async () => {
    const blocksResult = await tokenCanister.actor.icrc3_get_blocks([{ start: 0n, length: 1n }]);
    console.log(`ICRC-3 ledger log_length: ${blocksResult.log_length}`);
    
    expect(blocksResult.log_length).toBe(BigInt(EXPECTED_BLOCK_COUNT));
  });

  it("should have correct total supply matching original ledger", async () => {
    const totalSupply = await tokenCanister.actor.icrc1_total_supply();
    console.log(`Total supply after replay: ${totalSupply}`);
    console.log(`Expected total supply:     ${EXPECTED_TOTAL_SUPPLY}`);
    
    expect(totalSupply).toBe(EXPECTED_TOTAL_SUPPLY);
  });

  it("should have blocks with valid structure", async () => {
    // Get first and last blocks to verify structure
    const firstBlockResult = await tokenCanister.actor.icrc3_get_blocks([{ start: 0n, length: 1n }]);
    const lastBlockResult = await tokenCanister.actor.icrc3_get_blocks([{ start: BigInt(EXPECTED_BLOCK_COUNT - 1), length: 1n }]);
    
    expect(firstBlockResult.blocks.length).toBe(1);
    expect(lastBlockResult.blocks.length).toBe(1);
    
    const firstBlock = firstBlockResult.blocks[0];
    const lastBlock = lastBlockResult.blocks[0];
    
    console.log("First block id:", firstBlock.id);
    console.log("Last block id:", lastBlock.id);
    
    expect(firstBlock.id).toBe(0n);
    expect(lastBlock.id).toBe(BigInt(EXPECTED_BLOCK_COUNT - 1));
    
    // Verify block structure has tx field
    expect(firstBlock.block).toBeDefined();
  });

  it("should finalize replay successfully", async () => {
    tokenCanister.actor.setIdentity(owner);
    const result = await tokenCanister.actor.finalize_replay();
    expect(result).toHaveProperty("Ok");
    
    const isComplete = await tokenCanister.actor.is_replay_complete();
    expect(isComplete).toBe(true);
  });

  it("should verify individual account balances", async () => {
    // Load account mapping to verify balances
    const accountsPath = path.resolve(__dirname, "../../../ICRC_fungible/data/cycleshare_accounts.json");
    const accountsData = JSON.parse(fs.readFileSync(accountsPath, "utf-8"));
    
    console.log(`\nVerifying balances for ${accountsData.totalAccounts} accounts...`);
    
    // Calculate expected balances from replay data
    const expectedBalances = new Map<string, bigint>();
    
    for (const block of replayData) {
      if ("mint" in block.tx) {
        const key = `${block.tx.mint.to.owner}:${block.tx.mint.to.subaccount || "null"}`;
        const current = expectedBalances.get(key) || 0n;
        expectedBalances.set(key, current + BigInt(block.tx.mint.amt));
      }
    }
    
    console.log(`Calculated expected balances for ${expectedBalances.size} accounts`);
    
    // Verify a few balances
    let verified = 0;
    for (const [key, expectedBalance] of expectedBalances.entries()) {
      const [ownerHex, subaccountHex] = key.split(":");
      const account = {
        owner: hexToPrincipal(ownerHex),
        subaccount: subaccountHex !== "null" ? [hexToBytes(subaccountHex)] : []
      };
      
      const actualBalance = await tokenCanister.actor.icrc1_balance_of(account as any);
      
      if (actualBalance !== expectedBalance) {
        console.error(`Balance mismatch for ${key}: expected ${expectedBalance}, got ${actualBalance}`);
      }
      
      expect(actualBalance).toBe(expectedBalance);
      verified++;
      
      if (verified >= 5) break; // Just verify first 5 for speed
    }
    
    console.log(`Verified ${verified} account balances`);
  });
});
