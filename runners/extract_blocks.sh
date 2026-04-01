#!/usr/bin/env bash
set -euo pipefail

# Extract all blocks from production CycleShareLedger
CANISTER="q26le-iqaaa-aaaam-actsa-cai"
NETWORK="ic"
TOTAL=336
BATCH=50
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/../__temp/raw_blocks"

mkdir -p "$OUTPUT_DIR"

echo "=== Extracting $TOTAL blocks from production CycleShareLedger ==="

for ((start=0; start<TOTAL; start+=BATCH)); do
  remaining=$((TOTAL - start))
  count=$((remaining < BATCH ? remaining : BATCH))
  echo "Fetching blocks $start to $((start + count - 1))..."
  dfx canister call --network "$NETWORK" "$CANISTER" icrc3_get_blocks \
    "(vec { record { start = $start : nat; length = $count : nat } })" \
    > "$OUTPUT_DIR/blocks_${start}.txt" 2>&1
done

echo "=== Done. Raw output in $OUTPUT_DIR ==="
