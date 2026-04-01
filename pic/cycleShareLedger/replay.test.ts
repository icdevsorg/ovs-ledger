/**
 * Replay Test for CycleShareLedger
 * 
 * Tests the replay_blocks function to ensure blocks can be correctly
 * replayed into a fresh canister.
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
  owner: string; // hex-encoded bytes for Principal
  subaccount: string | null;
}

// Convert hex to Principal
function hexToPrincipal(hex: string): Principal {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return Principal.fromUint8Array(bytes);
}

// Convert hex to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Convert JSON account to Candid format
function convertAccount(json: AccountJson): { owner: Principal; subaccount: [] | [Uint8Array] } {
  return {
    owner: hexToPrincipal(json.owner),
    subaccount: json.subaccount ? [hexToBytes(json.subaccount)] : []
  };
}

// Convert JSON tx to Candid format
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

// Convert JSON block to Candid format
function convertBlock(json: ReplayBlockJson): object {
  return {
    id: BigInt(json.id),
    btype: json.btype,
    ts: BigInt(json.ts),
    tx: convertTx(json.tx)
  };
}

describe("CycleShareLedger Replay", () => {
  let pic: PocketIc;
  let tokenCanister: CanisterFixture<TokenService>;
  let owner: Identity;

  beforeAll(async () => {
    // Check if WASM exists
    if (!fs.existsSync(WASM_PATH)) {
      console.error(`WASM file not found at ${WASM_PATH}`);
      console.error("Run 'dfx build token' first");
      throw new Error("WASM file not found");
    }

    pic = await PocketIc.create(process.env.PIC_URL);
    owner = createIdentity("owner");

    // Deploy the token canister
    tokenCanister = await pic.setupCanister<TokenService>({
      idlFactory: tokenIDLFactory,
      wasm: WASM_PATH,
      sender: owner.getPrincipal(),
      arg: IDL.encode(tokenInit({IDL}), [[]])
    });

    console.log(`Deployed token canister: ${tokenCanister.canisterId.toText()}`);
  }, 60000);

  afterAll(async () => {
    await pic.tearDown();
  });

  it("should replay first 10 mint blocks", async () => {
    // Load replay data
    const replayDataPath = path.resolve(__dirname, "../../../ICRC_fungible/data/cycleshare_replay.json");
    const replayData: ReplayBlockJson[] = JSON.parse(fs.readFileSync(replayDataPath, "utf-8"));
    
    // Take first 10 blocks
    const first10 = replayData.slice(0, 10);
    const blocks = first10.map(convertBlock) as any;

    console.log(`Replaying ${blocks.length} blocks...`);

    // Call replay_blocks
    tokenCanister.actor.setIdentity(owner);
    const result = await tokenCanister.actor.replay_blocks(blocks);
    console.log("Replay result:", result);

    expect(result).toHaveProperty("Ok");
    expect((result as any).Ok.processed).toBe(10n);
  }, 30000);

  it("should have correct ledger size after replay", async () => {
    // Use icrc3_get_blocks to check the ledger
    const blocksResult = await tokenCanister.actor.icrc3_get_blocks([{ start: 0n, length: 100n }]);
    console.log("Blocks result log_length:", blocksResult.log_length);
    
    // Should have 10 blocks
    expect(blocksResult.log_length).toBe(10n);
  });

  it("should not allow non-owner to replay", async () => {
    const nonOwner = createIdentity("nonowner");
    tokenCanister.actor.setIdentity(nonOwner);

    const result = await tokenCanister.actor.replay_blocks([]);
    
    expect(result).toHaveProperty("Err");
    expect((result as any).Err).toHaveProperty("NotAuthorized");

    // Reset to owner
    tokenCanister.actor.setIdentity(owner);
  });

  it("should allow finalizing replay", async () => {
    tokenCanister.actor.setIdentity(owner);
    const result = await tokenCanister.actor.finalize_replay();
    expect(result).toHaveProperty("Ok");

    // Should not allow more replays
    const replayResult = await tokenCanister.actor.replay_blocks([]);
    expect(replayResult).toHaveProperty("Err");
    expect((replayResult as any).Err).toHaveProperty("AlreadyMigrated");
  });
});
