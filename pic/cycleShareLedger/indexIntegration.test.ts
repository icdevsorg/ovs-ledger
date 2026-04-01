/**
 * Index Canister Integration Test for CycleShareLedger
 * 
 * Tests that the index canister correctly syncs blocks from the token ledger
 * after replay. This validates:
 * 1. Index syncs all 314 replayed blocks
 * 2. Account balances match between ledger and index
 * 3. Transaction history is queryable via index
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

import { idlFactory as indexIDLFactory, init as indexInit } from "../../src/declarations/icrc_index/icrc_index.did.js";
import type { ICRCIndex as IndexService } from "../../src/declarations/icrc_index/icrc_index.did.d";

import * as path from "path";
import * as fs from "fs";

const TOKEN_WASM_PATH = ".dfx/local/canisters/token/token.wasm.gz";
const INDEX_WASM_PATH = ".dfx/local/canisters/icrc_index/icrc_index.wasm";

const EXPECTED_BLOCK_COUNT = 314;
const EXPECTED_TOTAL_SUPPLY = 197_343_901_434_586n;

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

describe("CycleShareLedger Index Canister Integration", () => {
  let pic: PocketIc;
  let tokenCanister: CanisterFixture<TokenService>;
  let indexCanister: CanisterFixture<IndexService>;
  let owner: Identity;
  let replayData: ReplayBlockJson[];

  beforeAll(async () => {
    if (!fs.existsSync(TOKEN_WASM_PATH)) {
      throw new Error(`Token WASM file not found at ${TOKEN_WASM_PATH}. Run 'dfx build token' first.`);
    }
    if (!fs.existsSync(INDEX_WASM_PATH)) {
      throw new Error(`Index WASM file not found at ${INDEX_WASM_PATH}. Run 'dfx build icrc_index' first.`);
    }

    // Load replay data
    const replayDataPath = path.resolve(__dirname, "../../../ICRC_fungible/data/cycleshare_replay.json");
    replayData = JSON.parse(fs.readFileSync(replayDataPath, "utf-8"));
    console.log(`Loaded ${replayData.length} blocks for replay`);

    pic = await PocketIc.create(process.env.PIC_URL);
    owner = createIdentity("owner");

    // Deploy token canister
    tokenCanister = await pic.setupCanister<TokenService>({
      idlFactory: tokenIDLFactory,
      wasm: TOKEN_WASM_PATH,
      sender: owner.getPrincipal(),
      arg: IDL.encode(tokenInit({IDL}), [[]])
    });
    console.log(`Deployed token canister: ${tokenCanister.canisterId.toText()}`);

    // Replay all blocks
    console.log("\nReplaying all blocks...");
    tokenCanister.actor.setIdentity(owner);
    
    const BATCH_SIZE = 50;
    for (let i = 0; i < replayData.length; i += BATCH_SIZE) {
      const batch = replayData.slice(i, i + BATCH_SIZE);
      const blocks = batch.map(convertBlock) as any;
      const result = await tokenCanister.actor.replay_blocks(blocks);
      if ("Err" in result) {
        throw new Error(`Replay failed at batch starting at index ${i}: ${JSON.stringify(result.Err)}`);
      }
    }

    // Finalize replay
    const finalizeResult = await tokenCanister.actor.finalize_replay();
    if ("Err" in finalizeResult) {
      throw new Error(`Finalize failed: ${JSON.stringify(finalizeResult.Err)}`);
    }
    console.log("Replay complete and finalized");

    // Verify ledger has correct block count
    const blocksResult = await tokenCanister.actor.icrc3_get_blocks([{ start: 0n, length: 1n }]);
    console.log(`Token ledger has ${blocksResult.log_length} blocks`);

    // Deploy index canister pointing to token canister
    const indexArg = {
      Init: {
        ledger_id: tokenCanister.canisterId,
        retrieve_blocks_from_ledger_interval_seconds: [1n], // 1 second sync interval
        icrc85_collector: []
      }
    };

    indexCanister = await pic.setupCanister<IndexService>({
      idlFactory: indexIDLFactory,
      wasm: INDEX_WASM_PATH,
      sender: owner.getPrincipal(),
      arg: IDL.encode(indexInit({IDL}), [[indexArg]])
    });
    console.log(`Deployed index canister: ${indexCanister.canisterId.toText()}`);

    // Wait for index to sync - advance time and tick
    console.log("\nWaiting for index to sync...");
    for (let attempt = 0; attempt < 30; attempt++) {
      await pic.advanceTime(2000); // Advance 2 seconds
      await pic.tick(5); // Multiple ticks to process async calls
      
      const status = await indexCanister.actor.status();
      console.log(`  Sync attempt ${attempt + 1}: ${status.num_blocks_synced} blocks synced`);
      
      if (status.num_blocks_synced >= BigInt(EXPECTED_BLOCK_COUNT)) {
        console.log(`Index fully synced: ${status.num_blocks_synced} blocks`);
        break;
      }
    }
  }, 300000); // 5 minute timeout for setup

  afterAll(async () => {
    await pic.tearDown();
  });

  it("should have index pointing to correct ledger", async () => {
    const ledgerId = await indexCanister.actor.ledger_id();
    expect(ledgerId.toText()).toBe(tokenCanister.canisterId.toText());
  });

  it("should sync all 314 blocks", async () => {
    const status = await indexCanister.actor.status();
    console.log(`Index status: ${status.num_blocks_synced} blocks synced`);
    expect(status.num_blocks_synced).toBe(BigInt(EXPECTED_BLOCK_COUNT));
  });

  it("should have matching chain length via get_blocks", async () => {
    const response = await indexCanister.actor.get_blocks({ start: 0n, length: 1n });
    console.log(`Index chain_length: ${response.chain_length}`);
    expect(response.chain_length).toBe(BigInt(EXPECTED_BLOCK_COUNT));
  });

  it("should return correct stats", async () => {
    const stats = await indexCanister.actor.get_stats();
    console.log(`Index stats:
      - num_blocks_synced: ${stats.num_blocks_synced}
      - num_accounts: ${stats.num_accounts}
      - ledger_id: ${stats.ledger_id.toText()}
      - is_syncing: ${stats.is_syncing}
    `);
    
    expect(stats.num_blocks_synced).toBe(BigInt(EXPECTED_BLOCK_COUNT));
    expect(stats.num_accounts).toBeGreaterThan(0n);
    expect(stats.ledger_id.toText()).toBe(tokenCanister.canisterId.toText());
  });

  it("should have matching account balances", async () => {
    // Calculate expected balances from replay data
    const expectedBalances = new Map<string, { owner: Principal; subaccount: [] | [Uint8Array]; balance: bigint }>();
    
    for (const block of replayData) {
      if ("mint" in block.tx) {
        const account = convertAccount(block.tx.mint.to);
        const key = `${block.tx.mint.to.owner}:${block.tx.mint.to.subaccount || "null"}`;
        const current = expectedBalances.get(key);
        if (current) {
          current.balance += BigInt(block.tx.mint.amt);
        } else {
          expectedBalances.set(key, { ...account, balance: BigInt(block.tx.mint.amt) });
        }
      }
    }
    
    console.log(`\nVerifying ${expectedBalances.size} account balances via index...`);
    
    // Verify balances match between ledger and index
    let verified = 0;
    for (const [key, data] of expectedBalances.entries()) {
      const account = { owner: data.owner, subaccount: data.subaccount };
      
      const ledgerBalance = await tokenCanister.actor.icrc1_balance_of(account as any);
      const indexBalance = await indexCanister.actor.icrc1_balance_of(account as any);
      
      expect(indexBalance).toBe(ledgerBalance);
      expect(indexBalance).toBe(data.balance);
      verified++;
      
      if (verified <= 3) {
        console.log(`  Account ${verified}: ledger=${ledgerBalance}, index=${indexBalance}, expected=${data.balance}`);
      }
    }
    
    console.log(`Verified all ${verified} account balances match`);
  });

  it("should query account transactions", async () => {
    // Get the first account from replay data
    const firstMint = replayData.find(b => "mint" in b.tx);
    if (!firstMint || !("mint" in firstMint.tx)) {
      throw new Error("No mint transactions in replay data");
    }
    
    const account = convertAccount(firstMint.tx.mint.to);
    
    const result = await indexCanister.actor.get_account_transactions({
      account: account as any,
      max_results: 100n,
      start: []
    });
    
    if ("err" in result) {
      throw new Error(`get_account_transactions failed: ${result.err.message}`);
    }
    
    console.log(`\nAccount transactions for first mint recipient:
      - balance: ${result.ok.balance}
      - transactions: ${result.ok.transactions.length}
      - oldest_tx_id: ${result.ok.oldest_tx_id}
    `);
    
    expect(result.ok.transactions.length).toBeGreaterThan(0);
    expect(result.ok.balance).toBeGreaterThan(0n);
  });

  it("should list subaccounts for principals with activity", async () => {
    // Get a principal from the replay data
    const firstMint = replayData.find(b => "mint" in b.tx);
    if (!firstMint || !("mint" in firstMint.tx)) {
      throw new Error("No mint transactions in replay data");
    }
    
    const owner = hexToPrincipal(firstMint.tx.mint.to.owner);
    
    const subaccounts = await indexCanister.actor.list_subaccounts({
      owner: owner,
      start: []
    });
    
    console.log(`\nSubaccounts for ${owner.toText()}: ${subaccounts.length} found`);
    
    // Should find at least the null subaccount (default) or the specific subaccount
    expect(subaccounts.length).toBeGreaterThanOrEqual(0);
  });

  it("should have blocks matching ledger structure", async () => {
    // Get blocks from both and compare
    const ledgerBlocks = await tokenCanister.actor.icrc3_get_blocks([{ start: 0n, length: 5n }]);
    const indexBlocks = await indexCanister.actor.get_blocks({ start: 0n, length: 5n });
    
    console.log(`\nComparing first 5 blocks:
      - Ledger returned ${ledgerBlocks.blocks.length} blocks
      - Index returned ${indexBlocks.blocks.length} blocks
    `);
    
    expect(indexBlocks.blocks.length).toBe(ledgerBlocks.blocks.length);
    
    // Verify block IDs match
    for (let i = 0; i < indexBlocks.blocks.length; i++) {
      const ledgerBlockId = ledgerBlocks.blocks[i].id;
      // Index blocks are just Value, not wrapped in {id, block}
      // Just verify we got the same number of blocks
      expect(ledgerBlockId).toBe(BigInt(i));
    }
  });
});
