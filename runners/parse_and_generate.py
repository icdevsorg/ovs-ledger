#!/usr/bin/env python3
"""
Parse raw ICRC-3 block output (Candid text) from CycleShareLedger
and produce a JSON replay file + Candid batch files.

This script:
1. Reads raw Candid block dumps from __temp/raw_blocks/
2. Parses each block into a structured format
3. Outputs a JSON replay file at __temp/csl_replay.json
4. Generates Candid batch files at __temp/replay_args/
"""

import re
import os
import json
import binascii
import struct
import base64
import zlib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(SCRIPT_DIR, "..", "__temp", "raw_blocks")
REPLAY_JSON = os.path.join(SCRIPT_DIR, "..", "__temp", "csl_replay.json")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "__temp", "replay_args")
BATCH_SIZE = 25
TOTAL_BLOCKS = 336


# ── helpers ──────────────────────────────────────────────────────────

def principal_from_hex(hex_str):
    raw = binascii.unhexlify(hex_str)
    crc = zlib.crc32(raw) & 0xFFFFFFFF
    crc_bytes = struct.pack('>I', crc)
    b32 = base64.b32encode(crc_bytes + raw).decode().lower().rstrip('=')
    groups = [b32[i:i+5] for i in range(0, len(b32), 5)]
    return '-'.join(groups)

def hex_to_blob(hex_str):
    raw = binascii.unhexlify(hex_str)
    return 'blob "' + ''.join(f'\\{b:02x}' for b in raw) + '"'

def blob_escape_to_hex(blob_text):
    """Convert Candid blob literal like \\c0\\85\\69 to hex string."""
    raw = re.findall(r'\\([0-9a-fA-F]{2})', blob_text)
    return ''.join(raw)

def parse_account_from_array(array_text):
    """Parse an account from Array = vec { Blob ...; Blob ... }"""
    blobs = re.findall(r'variant \{ Blob = blob "([^"]*)" \}', array_text)
    if not blobs:
        return None
    
    owner_hex = blob_escape_to_hex(blobs[0])
    principal = principal_from_hex(owner_hex)
    
    subaccount = None
    if len(blobs) > 1:
        sub_hex = blob_escape_to_hex(blobs[1])
        if sub_hex and sub_hex != '0' * 64:
            subaccount = sub_hex
    
    return {"owner": owner_hex, "principal": principal, "subaccount": subaccount}


# ── block parsing ────────────────────────────────────────────────────

def read_all_raw():
    text = ""
    for start in range(0, TOTAL_BLOCKS, 50):
        path = os.path.join(RAW_DIR, f"blocks_{start}.txt")
        if os.path.exists(path):
            with open(path) as f:
                text += f.read()
    return text

def extract_block_segments(raw_text):
    """Split into per-block segments by 'id = N : nat'."""
    pattern = re.compile(r'record \{\s*id = (\d+) : nat;\s*block =')
    matches = list(pattern.finditer(raw_text))
    
    segments = {}
    for i, m in enumerate(matches):
        block_id = int(m.group(1))
        start = m.start()
        end = matches[i+1].start() if i+1 < len(matches) else len(raw_text)
        segments[block_id] = raw_text[start:end]
    return segments

def extract_value(segment, key):
    """Extract a Nat value for a given key from segment."""
    pat = re.compile(rf'"{key}";\s*variant \{{ Nat = ([\d_]+) : nat \}}')
    m = pat.search(segment)
    if m:
        return int(m.group(1).replace('_', ''))
    return None

def extract_text(segment, key):
    """Extract a Text value for a given key from segment."""
    pat = re.compile(rf'"{key}";\s*variant \{{ Text = "([^"]*)" \}}')
    m = pat.search(segment)
    if m:
        return m.group(1)
    return None

def extract_blob(segment, key):
    """Extract a Blob value for a given key from segment."""
    pat = re.compile(rf'"{key}";\s*variant \{{ Blob = blob "([^"]*)" \}}')
    m = pat.search(segment)
    if m:
        return blob_escape_to_hex(m.group(1))
    return None

def extract_account(segment, key):
    """Extract an account (Array of two Blobs) for a given key."""
    # Find the key, then the Array that follows
    pat = re.compile(
        rf'"{key}";\s*variant \{{\s*Array = vec \{{(.*?)\}}\s*\}}',
        re.DOTALL
    )
    m = pat.search(segment)
    if m:
        return parse_account_from_array(m.group(1))
    return None

def parse_tx(segment, btype):
    """Parse the tx map inside a block segment."""
    # Extract the tx section
    tx_start = segment.find('"tx";')
    if tx_start < 0:
        return None
    
    # Get a subtring starting from tx
    tx_section = segment[tx_start:]
    
    op = extract_text(tx_section, "op")
    
    if op == "mint":
        to = extract_account(tx_section, "to")
        amt = extract_value(tx_section, "amt")
        memo_hex = extract_blob(tx_section, "memo")
        return {
            "mint": {
                "to": to,
                "amt": amt,
                "memo": memo_hex
            }
        }
    elif op == "burn":
        frm = extract_account(tx_section, "from")
        amt = extract_value(tx_section, "amt")
        memo_hex = extract_blob(tx_section, "memo")
        return {
            "burn": {
                "from": frm,
                "amt": amt, 
                "memo": memo_hex
            }
        }
    elif op == "xfer":
        frm = extract_account(tx_section, "from")
        to = extract_account(tx_section, "to")
        amt = extract_value(tx_section, "amt")
        fee = extract_value(tx_section, "fee")
        memo_hex = extract_blob(tx_section, "memo")
        spender = extract_account(tx_section, "spender")
        
        if spender:
            # This is actually a transfer_from (2xfer btype)
            return {
                "xfer_from": {
                    "from": frm,
                    "to": to,
                    "spender": spender,
                    "amt": amt,
                    "fee": fee,
                    "memo": memo_hex
                }
            }
        else:
            return {
                "xfer": {
                    "from": frm,
                    "to": to,
                    "amt": amt,
                    "fee": fee,
                    "memo": memo_hex
                }
            }
    elif op == "approve":
        frm = extract_account(tx_section, "from")
        spender = extract_account(tx_section, "spender")
        amt = extract_value(tx_section, "amt")
        fee = extract_value(tx_section, "fee")
        expires_at = extract_value(tx_section, "expected_allowance")
        if expires_at is None:
            expires_at = extract_value(tx_section, "expires_at")
        memo_hex = extract_blob(tx_section, "memo")
        return {
            "approve": {
                "from": frm,
                "spender": spender,
                "amt": amt,
                "fee": fee,
                "expires_at": expires_at,
                "memo": memo_hex
            }
        }
    else:
        print(f"  WARNING: Unknown op: {op}")
        return None

def parse_block(block_id, segment):
    """Parse a single block segment into a structured dict."""
    btype = extract_text(segment, "btype")
    ts = extract_value(segment, "ts")
    tx = parse_tx(segment, btype)
    
    if tx is None:
        print(f"  WARNING: Could not parse tx for block {block_id} (btype={btype})")
        return None
    
    return {
        "id": block_id,
        "btype": btype,
        "ts": ts,
        "tx": tx
    }


# ── Candid generation ───────────────────────────────────────────────

def account_to_candid(acct):
    principal = acct["principal"]
    sub = acct.get("subaccount")
    if sub:
        return f'record {{ owner = principal "{principal}"; subaccount = opt {hex_to_blob(sub)} }}'
    else:
        return f'record {{ owner = principal "{principal}"; subaccount = null }}'

def opt_nat(val):
    if val is None:
        return "null"
    return f"opt ({val} : nat)"

def opt_nat64(val):
    if val is None:
        return "null"
    return f"opt ({val} : nat64)"

def opt_blob(val):
    if val is None:
        return "null"
    return f"opt {hex_to_blob(val)}"

def tx_to_candid(tx):
    if "mint" in tx:
        m = tx["mint"]
        return f'variant {{ mint = record {{ to = {account_to_candid(m["to"])}; amt = {m["amt"]} : nat; memo = {opt_blob(m["memo"])} }} }}'
    elif "burn" in tx:
        b = tx["burn"]
        return f'variant {{ burn = record {{ from = {account_to_candid(b["from"])}; amt = {b["amt"]} : nat; memo = {opt_blob(b["memo"])} }} }}'
    elif "xfer" in tx:
        x = tx["xfer"]
        return f'variant {{ xfer = record {{ from = {account_to_candid(x["from"])}; to = {account_to_candid(x["to"])}; amt = {x["amt"]} : nat; fee = {opt_nat(x["fee"])}; memo = {opt_blob(x["memo"])} }} }}'
    elif "approve" in tx:
        a = tx["approve"]
        return f'variant {{ approve = record {{ from = {account_to_candid(a["from"])}; spender = {account_to_candid(a["spender"])}; amt = {a["amt"]} : nat; fee = {opt_nat(a["fee"])}; expires_at = {opt_nat64(a["expires_at"])}; memo = {opt_blob(a["memo"])} }} }}'
    elif "xfer_from" in tx:
        x = tx["xfer_from"]
        return f'variant {{ xfer_from = record {{ from = {account_to_candid(x["from"])}; to = {account_to_candid(x["to"])}; spender = {account_to_candid(x["spender"])}; amt = {x["amt"]} : nat; fee = {opt_nat(x["fee"])}; memo = {opt_blob(x["memo"])} }} }}'
    else:
        raise ValueError(f"Unknown tx type: {list(tx.keys())}")

def block_to_candid(block):
    return f'record {{ id = {block["id"]} : nat; btype = "{block["btype"]}"; ts = {block["ts"]} : nat; tx = {tx_to_candid(block["tx"])} }}'

def generate_batches(blocks):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    batch_count = 0
    for i in range(0, len(blocks), BATCH_SIZE):
        batch = blocks[i:i+BATCH_SIZE]
        items = ";\n  ".join(block_to_candid(b) for b in batch)
        candid = f"(vec {{\n  {items}\n}})"
        
        filename = os.path.join(OUTPUT_DIR, f"batch_{batch_count:03d}.candid")
        with open(filename, "w") as f:
            f.write(candid)
        
        batch_count += 1
        print(f"Batch {batch_count}: blocks {batch[0]['id']}-{batch[-1]['id']} ({len(batch)} blocks)")
    
    return batch_count


# ── main ─────────────────────────────────────────────────────────────

def main():
    print("=== Parsing CycleShareLedger blocks ===")
    
    raw_text = read_all_raw()
    if not raw_text:
        print("ERROR: No raw block files found. Run extract_blocks.sh first.")
        return
    
    segments = extract_block_segments(raw_text)
    print(f"Found {len(segments)} block segments")
    
    # Parse all blocks
    blocks = []
    errors = []
    for block_id in sorted(segments.keys()):
        block = parse_block(block_id, segments[block_id])
        if block:
            blocks.append(block)
        else:
            errors.append(block_id)
    
    print(f"\nParsed {len(blocks)} blocks successfully")
    if errors:
        print(f"ERRORS parsing blocks: {errors}")
    
    # Summarize by btype
    from collections import Counter
    btypes = Counter(b["btype"] for b in blocks)
    print(f"\nBlock types: {dict(btypes)}")
    
    # Extract fee info
    blocks_with_fee = 0
    for b in blocks:
        tx = b["tx"]
        for key in ("xfer", "approve", "xfer_from"):
            if key in tx and tx[key].get("fee") is not None:
                blocks_with_fee += 1
                break
    print(f"Blocks with fee: {blocks_with_fee}")
    
    # Collect unique accounts
    accounts = set()
    for b in blocks:
        tx = b["tx"]
        for key in tx:
            inner = tx[key]
            if isinstance(inner, dict):
                for field in ("to", "from", "spender"):
                    if field in inner and inner[field]:
                        acct = inner[field]
                        acct_key = acct["principal"]
                        if acct.get("subaccount"):
                            acct_key += ":" + acct["subaccount"]
                        accounts.add(acct_key)
    print(f"Unique accounts: {len(accounts)}")
    
    # Save replay JSON
    with open(REPLAY_JSON, 'w') as f:
        json.dump(blocks, f, indent=2)
    print(f"\nSaved replay data to {REPLAY_JSON}")
    
    # Generate Candid batches
    print(f"\n=== Generating Candid batch files ===")
    batch_count = generate_batches(blocks)
    print(f"\nGenerated {batch_count} batch files in {OUTPUT_DIR}")
    print(f"Total blocks: {len(blocks)}")

if __name__ == "__main__":
    main()
