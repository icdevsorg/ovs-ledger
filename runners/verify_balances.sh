#!/usr/bin/env bash
set -euo pipefail

# Compare balances between production and test CycleShareLedger canisters
PROD="q26le-iqaaa-aaaam-actsa-cai"
TEST="lhw23-vyaaa-aaaam-ahiwa-cai"
NETWORK="ic"
IDENTITY="icdevmanager"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPLAY_JSON="$SCRIPT_DIR/../__temp/csl_replay.json"

echo "=== Balance Comparison: Production vs Test CycleShareLedger ==="
echo "Production: $PROD"
echo "Test:       $TEST"
echo ""

# Extract unique accounts from replay JSON
python3 -c "
import json

with open('$REPLAY_JSON') as f:
    blocks = json.load(f)

accounts = {}  # key -> {principal, subaccount}
for b in blocks:
    tx = b['tx']
    for key in tx:
        inner = tx[key]
        if isinstance(inner, dict):
            for field in ('to', 'from', 'spender'):
                if field in inner and inner[field]:
                    acct = inner[field]
                    p = acct['principal']
                    sub = acct.get('subaccount')
                    acct_key = p + (':' + sub if sub else '')
                    if acct_key not in accounts:
                        accounts[acct_key] = {'principal': p, 'subaccount': sub}

for key, acct in sorted(accounts.items()):
    if acct['subaccount']:
        print(f'{acct[\"principal\"]}|{acct[\"subaccount\"]}')
    else:
        print(f'{acct[\"principal\"]}|null')
" | while IFS='|' read -r PRINCIPAL SUBACCOUNT; do
  if [ "$SUBACCOUNT" = "null" ]; then
    ARG="(record { owner = principal \"$PRINCIPAL\"; subaccount = null })"
  else
    BLOB=$(python3 -c "
import binascii
h = '$SUBACCOUNT'
raw = binascii.unhexlify(h)
print('blob \"' + ''.join(f'\\\\{b:02x}' for b in raw) + '\"')
")
    ARG="(record { owner = principal \"$PRINCIPAL\"; subaccount = opt $BLOB })"
  fi
  
  PROD_BAL=$(dfx canister call --query --network "$NETWORK" --identity "$IDENTITY" "$PROD" icrc1_balance_of "$ARG" 2>&1 | grep -oE '[0-9_]+' | head -1)
  TEST_BAL=$(dfx canister call --query --network "$NETWORK" --identity "$IDENTITY" "$TEST" icrc1_balance_of "$ARG" 2>&1 | grep -oE '[0-9_]+' | head -1)
  
  PROD_CLEAN=$(echo "$PROD_BAL" | tr -d '_')
  TEST_CLEAN=$(echo "$TEST_BAL" | tr -d '_')
  
  if [ "$PROD_CLEAN" = "$TEST_CLEAN" ]; then
    STATUS="✓"
  else
    STATUS="✗ MISMATCH"
  fi
  
  SHORT_PRINCIPAL="${PRINCIPAL:0:15}..."
  if [ "$SUBACCOUNT" = "null" ]; then
    echo "$STATUS  $SHORT_PRINCIPAL  prod=$PROD_BAL  test=$TEST_BAL"
  else
    SHORT_SUB="${SUBACCOUNT:0:8}..."
    echo "$STATUS  $SHORT_PRINCIPAL (sub=$SHORT_SUB)  prod=$PROD_BAL  test=$TEST_BAL"
  fi
done

echo ""

# Compare total supply
echo "--- Total Supply ---"
PROD_SUPPLY=$(dfx canister call --query --network "$NETWORK" --identity "$IDENTITY" "$PROD" icrc1_total_supply 2>&1 | grep -oE '[0-9_]+' | head -1)
TEST_SUPPLY=$(dfx canister call --query --network "$NETWORK" --identity "$IDENTITY" "$TEST" icrc1_total_supply 2>&1 | grep -oE '[0-9_]+' | head -1)
echo "Production total_supply: $PROD_SUPPLY"
echo "Test total_supply:       $TEST_SUPPLY"

PROD_S_CLEAN=$(echo "$PROD_SUPPLY" | tr -d '_')
TEST_S_CLEAN=$(echo "$TEST_SUPPLY" | tr -d '_')
if [ "$PROD_S_CLEAN" = "$TEST_S_CLEAN" ]; then
  echo "✓ Total supply matches"
else
  echo "✗ Total supply MISMATCH"
fi

echo ""
echo "=== Done ==="
