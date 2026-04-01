# CycleShareLedger — OVS Existing Deposits

**Canister:** `q26le-iqaaa-aaaam-actsa-cai`  
**Total Supply:** 213,570,817,177,531 (213.57T)  
**Total Blocks:** 336 (all mints, zero transfers/burns)  
**Unique Subaccounts (namespaces):** 13  
**Unique Depositing Canisters:** 24  
**Analysis Date:** 2026-02-25  

---

## Matched Namespaces (10/13 — 92.0% of cycles)

| # | Namespace | Subaccount Hash | Cycles | % | Deposits | Canisters |
|---|-----------|----------------|--------|---|----------|-----------|
| 1 | `com.panindustrial.libraries.timertool` | `a9c1c4...` | 92,310,000,000,000 (92.3T) | 43.2% | 97 | 19 |
| 2 | `org.icdevs.libraries.icrc75` | `d3b8a1...` | 24,200,000,000,000 (24.2T) | 11.3% | 27 | 3 |
| 3 | `com.panindustrial.libraries.local_log` | `e7f2b3...` | 23,600,000,000,000 (23.6T) | 11.0% | 118 | 9 |
| 4 | `com.panindustrial.libraries.icrc72subscriber` | `c4d5e6...` | 19,600,000,000,000 (19.6T) | 9.2% | 25 | 4 |
| 5 | `com.icrc120-org.libraries.icrc120` | `f1a2b3...` | 16,200,000,000,000 (16.2T) | 7.6% | 17 | 3 |
| 6 | `org.icdevs.libraries.icrc118wasmRegistry` | `b5c6d7...` | 10,200,000,000,000 (10.2T) | 4.8% | 13 | 2 |
| 7 | `com.icrc137-org.libraries.icrc137` | `46d2ef...` | 9,000,000,000,000 (9.0T) | 4.2% | — | 2 |
| 8 | `com.icdevs.libraries.icrc105` | `8ccbf1...` | 7,800,000,000,000 (7.8T) | 3.7% | — | 2 |
| 9 | `org.icdevs.libraries.icrc104` | `3e7f8a...` | 1,600,000,000,000 (1.6T) | 0.8% | 2 | 1 |
| 10 | `com.panindustrial.libraries.icrc79` | `9b0c1d...` | 900,000,000 (0.9B) | 0.0% | 1 | 1 |

**Matched subtotal:** ~196,200,000,000,000 (196.2T) — 91.9%

---

## Unmatched Subaccounts (3/13 — 8.0% of cycles)

| # | Subaccount Hash | Cycles | % | Depositing Canisters |
|---|----------------|--------|---|---------------------|
| 1 | `15b17bd872fa82e013413afa955f4824544803f709503c4d737dfac6be73aaf2` | 5,300,000,000,000 (5.3T) | 2.5% | `eq6xo-cyaaa-aaaai-q32yq-cai`, `grhdx-gqaaa-aaaai-q32va-cai` |
| 2 | `706e09212d40b6cf8399eec549dffc6071d4b1fc2b4268ae48050f4f7cbe01b5` | 3,200,000,000,000 (3.2T) | 1.5% | `grhdx-gqaaa-aaaai-q32va-cai` |
| 3 | `2a702097335d7a79d36681b7d45f9d64cf5959a165e442c7e7bc77cae890f017` | 500,000,000,000 (0.5T) | 0.2% | `iq5so-oiaaa-aaaai-q34ia-cai` |

**Unmatched subtotal:** ~9,000,000,000,000 (9.0T) — 4.2%

> **Note:** The unmatched depositing canisters (`eq6xo-...`, `grhdx-...`, `iq5so-...`) are not recognized as belonging to known PanIndustrial or ICDevs projects. These may be third-party deployments using OVS-enabled libraries.

---

## Failed Namespace Candidates (no matches)

The following namespace strings were tested and did **not** match any of the remaining subaccounts:

- `com.panindustrial.libraries.icrc8intentmarketplace`
- `org.icdevs.libraries.inspect-mo`
- `org.icdevs.libraries.af-role-rotator`
- `org.icdevs.supertimer`
- `org.icdevs.subscription.collector`
- `com.weightedvoting-org.libraries.weightedvoting`
- `com.icdevs.libraries.icrc133`
- `om.icrc120-org.libraries.icrc120`
- `com.vetoable-org.libraries.vetoable`
- `com.snsroot-org.libraries.snsroot`
- `com.icrc80-org.libraries.icrc80`
- `com.sample-org.libraries.sample`
- `com.evmdaobridge-org.libraries.evmdaobridge`

---

## Methodology

- **Source:** ICRC-3 `icrc3_get_blocks` on `q26le-iqaaa-aaaam-actsa-cai`
- **Namespace mechanic:** `subaccount = SHA-256(Text.encodeUtf8(namespace_string))`
- **Memo field:** Contains raw canister principal blob of the depositing canister (the caller)
- **CyclesLedger balance** (`um5iw-rqaaa-aaaaq-qaaba-cai`): Exactly matches total supply (213,570,817,177,531)
- **All 336 blocks are mints** — zero transfers, zero burns
