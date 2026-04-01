#!/usr/bin/env bash
set -euo pipefail

# Replay blocks to the test CycleShareLedger canister
TEST_CANISTER="lhw23-vyaaa-aaaam-ahiwa-cai"
NETWORK="ic"
IDENTITY="icdevmanager"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BATCH_DIR="$SCRIPT_DIR/../__temp/replay_args"

echo "=== Replaying blocks to test canister $TEST_CANISTER ==="

# Count batch files
BATCH_FILES=("$BATCH_DIR"/batch_*.candid)
TOTAL_BATCHES=${#BATCH_FILES[@]}
echo "Found $TOTAL_BATCHES batch files"

SUCCEEDED=0
FAILED=0

for BATCH_FILE in "${BATCH_FILES[@]}"; do
  BATCH_NAME=$(basename "$BATCH_FILE")
  echo -n "Replaying $BATCH_NAME... "
  
  RESULT=$(dfx canister call --network "$NETWORK" --identity "$IDENTITY" \
    "$TEST_CANISTER" replay_blocks \
    "$(cat "$BATCH_FILE")" 2>&1)
  
  if echo "$RESULT" | grep -q "Ok"; then
    PROCESSED=$(echo "$RESULT" | grep -oE 'processed = [0-9_]+' | head -1)
    LAST_IDX=$(echo "$RESULT" | grep -oE 'lastIndex = [0-9_]+' | head -1)
    echo "OK ($PROCESSED, $LAST_IDX)"
    SUCCEEDED=$((SUCCEEDED + 1))
  else
    echo "FAILED: $RESULT"
    FAILED=$((FAILED + 1))
    # Don't stop - show the error but continue to see if it's a batch issue
    if echo "$RESULT" | grep -q "AlreadyMigrated"; then
      echo "  -> Replay already finalized. Stopping."
      break
    fi
  fi
done

echo ""
echo "=== Replay Complete ==="
echo "Succeeded: $SUCCEEDED / $TOTAL_BATCHES"
if [ "$FAILED" -gt 0 ]; then
  echo "Failed: $FAILED"
fi
