|ICRC|Title|Author|Discussions|Status|Type|Category|Created|
|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
|85|CycleShare Standard|Austin Fatheree (@skilesare), |Draft|Standards Track||2024-04-10|


# ICRC-85: Open Value Sharing Implementation Standards

ICRC-85 is a set of standards for implementing Open Value Sharing (OVS) developed by [Demergent Labs](https://github.com/demergent-labs) on the Internet Computer, enabling projects to individually or collectively manage and distribute cycles for open-source software development and operational sustainability. This standard only attempts to codify best practices of the OVS standard for the current set of languages and development environments available on the Internet Computer.

## Introduction

The [OVS system](https://github.com/demergent-labs/open_value_sharing) provides a standardized method to contribute, manage, and distribute cycles within a decentralized application ecosystem on the Internet Computer. It allows sustainable funding and resource allocation for open-source contributors and projects.

Cycles are broadcast to a canister specified by an open source library. That canister may be a developer controlled canister, a cycle ledger that provides shared custody and efficiently wraps them for later retrieval, or some other community or DAO based canister that manages cycle payments benefiting developers.

It may be possible in the future for ICRC-85 to be implemented into the official Cycles Ledger deployed by the NNS. A temporary cycle collector canister has been deployed on mainnet at `q26le-iqaaa-aaaam-actsa-cai`.  The source code for this canister can be found at [ovs-ledger](https://github.com/icdevsorg/ovs-ledger) and the status of the operations of this canister can be found at [status](https://github.com/icdevsorg/ovs-ledger/blob/main/status.md).

## Guiding Principals

ICRC-85 follows the following Principals as defined in the OVS specification at [`https://github.com/demergent-labs/open_value_sharing`](https://github.com/demergent-labs/open_value_sharing) at 

1. Minimize or eliminate consumer (payer) friction
2. No changes required to existing dependency licenses
3. Voluntary participation from consumers and dependencies
4. Flexibility across platforms, payment mechanisms, sharing heuristics, and other parameters
5. Heuristics over perfection

Participation in OVS MUST be voluntary. Applications that do not wish to use the system should be able to easily turn it off without any deprecation in service.  We would suggest not doing so as OVS can be the lifeblood to open source developers.

When implementing default OVS pathways, the application developer should use discretion and generally make the library as inexpensive to use as possible initially.  Charges should be capped at some reasonable amount as well.

## Code Implementation Strategies

Libraries MUST allow users to turn off default OVS behavior.
Libraries MUST allow users to provide a handler for alternative strategies.

Alternative Strategies MUST ultimately broadcast a set of payment details and determined weights along with a bundle of cycles.

## Shared Custody

Each time a canister sends cycles a cost is incurred. Because of this ICRC-85 provides the opportunity fro shared custody of cycles in a single canister so that a single call can transmit cycle ownership to a large number of cycle recipients.

Shared custody IS NOT required for ICRC-85 implementation, but those that do implement it will enjoy the following advantages:

1. Reduced cycle transmission cost
2. Built in statistics tracking via ICRC-3 Transaction Logs
3. Security against namespace highjacking


### Rust

todo

### Azel

Azel currently supports configuration via simple json configuration. Your library can put a configuration file at the root of the project to participate in OVS:

```
[
    {
        "platform": "icp",
        "asset": "cycles",
        "payment_mechanism": "wallet_receive",
        "custom": {
            "principal": "bw4dl-smaaa-aaaaa-qaacq-cai"
        }
    }
]
```

Specify where you would like your cycles sent via the custom.principal item.

Azel currently only supports paying to a particular principal via the `deposit_cycles` and `wallet_receive endpoint.

Suggested: Implement sending to `icrc84_deposit_cycles_notify` and an optional namespace to override the principal property  when sending data to the receiving canister.

**Overrides**

Customer overrides are handled via the dfx.json config file by adding an openValueSharing node to the custom node of your canister's configuration.  The provided example shows the user overriding the Burned Weight Halving to send cycles to the azel package(and the principal configured there), a hard coded principal, and a hard coded ICRC-1 account:

```
"backend": {
    "type": "azle",
    "main": "src/backend/index.ts",
    "assets": [["src/frontend/dist", "dist"]],
    "build_assets": "npm run build",
    "custom": {
      killSwitch : false;
      platforms : ["icp"];
      assets : "cycles";
      sharedPercentage : 1;
      period : 2_880;
      sharingHeuristic : "BurnedWeightHalving;
      weights : {
          "azel": 50;
          "7nqmm-3byi2-wmrec-ccm5q-h6pcs-qxnxj-6jtmo-ytrbv-nlw4b-dkmbx-rqe" : 25
          ""k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae-dfxgiyy.102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20" : 25

      };
    };
}


```

### Motoko

#### Library Implementation

Libraries wishing to allow users to include their library in an ICRC-85 OVSs strategy to collect cycles should include an motoko file with the OVS configuration in their `src` folder. The file should be named `openvaluesharing.mo`. The file should be a standard motoko module that exposes a public property with the following OpenValueShareRecord type:

```

type CustomItem = variant {
  text: text;
  number: nat32;
};

type OpenValueShareRecord = record {
  platform : text; //recommended: "icp"
  asset : text; //recommended: "cycles"
  payment_mechanism : text; //recommended: "icrc85_deposit_cycles"
  custom : vec record {key : text; value : customItem;}
};

```

#####  Fields

- **platform** - text - The platform the item runs on. Currently only "icp" but may be extended to other platforms as motoko becomes more widely available.
- **asset** - text - The asset to be shared. Possible values: 
   - "cycles" - uses the ICP sdk native cycle transfer api to add cycles to a call to transfer them.
   - "{principal}" If the asset can be parsed as a principal, the asset being shared may point to an ICRC2 canister that has approved cycles for the canister to share cycles
- **payment_mechanism** - text - the IC method that should be called on the target canister that should receive the payment. Possible values:
  - "deposit_cycles" - a function with the signature `shared () -> ()` providing a one shot call to send cycles with no metadata or namespace information.
  - "wallet_receive" - a function with the signature `shared () -> async nat` providing a call that returns the number of cycles accepted.
  - "icrc85_deposit_cycles_notify" - a function as defined in this specification that takes a parameter: vec record(text; nat;) allowing payment to multiple recipients in one payment. This is a one shot call and does not have a return value.
  - "icrc85_deposit_cycles" - a function as defined in this specification that takes a parameter: vec record(text; nat;) allowing payment to multiple recipients in one payment. Returns a ShareResult. Warning: If payment is made to an unknown canister it may beable to disrupt or block upgrades on the source canister. It is recommended to use icrc85_deposit_cycles_notify;

**Custom**

- **principal** - text - the principal in text representation you would like the cycles sent to.
- **account** - text - optional the ICRC-1 text representation you would like the cycles assigned to by the indecated principal 
- **namespace** - optional text - a namespace to include with the payment when using icrc85_deposit_cycles or icrc85_deposit_cycles_notify. Overrides the account if provided.

If neither principal or account is provided, the service should default the identifier to the target principal.

An example file:

```
module {
  public let openValueSharing = {
    platform = "icp";
    asset = "cycles";
    payment_mechanism = "icrc85_deposit_cycles";
    custom = [
      {
        key = "namespace";
        value = #text("com.yourco.libraries.tool.0.1.1");
      },
      {
        key = "principal";
        value = #text("q26le-iqaaa-aaaam-actsa-cai");
      }
    ]
  };
};
```

#### OVS Handlers

Motoko does not have OVS implemented at the core layer at this time. As a result, libraries likely need to implement their own strategy for sharing(optional), and offer the user an override so that sharing can be handed off to a handler function that can coordinate payments across all included libraries.

For example, a library can reference a Burned Weighted Halving component to handle the reporting of their usage. The Burned Weighted Halving component will override the default behavior and implement the strategy according to its own specification.

#### Build Tools

Motoko build tools should utilize the `openvaluesharing.mo` files in the dependency tree to construct the strategy used and selected by the user (see user overrides). 

For example, for Burned Weighted Halving, the build system will analyze the dependency tree and output a openvaluesharing.consumer.mo file in the source file that can be imported by the implementing actor.

The file should be a standard motoko actor and implement the OVS standard with the following candid structure:

```
type OVSConsumer = ?{
  kill_switch: opt bool;
  handler:  opt func (vec record (text; Map)) -> ();
  period: opt nat;
  asset: opt text;
  platform: opt text;
  tree: opt vec Text;
  collector: opt principal;
};
```

As an example:

```
import BurnedWeightHalving "mo:BurnedWeightHalving";

module {
  public let consumer = ?{
    kill_switch = null;
    handler = ?BurnedWeightHalving.handler;
    period = null; // handled at strategy level
    asset = null; // handled at strategy level
    platform = null; // handled at strategy level
    tree = null; // handled at strategy level
    collector = null; // handled at strategy level
  };
};

```

If no strategy is selected and a component uses its own implementation the file should look as follows

```

module {
  public let consumer = null;
};

```

#### Implementing For Classes

use the Class+ model and include the following paths in their environment parameter:

```motoko

import OVSConsumer "openvaluesharing.consumer.mo";

{
  advanced: ?{
    icrc85: OVSConsumer.consumer;
  }
}
```

**Scenario A**, turning off the cycles share:
  ```motoko
  ?{
      kill_switch = ?true;
      handler = null;
      period = null;
      tree = null;
      collector = null;
      asset = null;
      platform = null;
    }

  ```
  This configuration effectively turns off the OVS behavior for the component, ensuring that it does not participate in the sharing or distribution of cycles.

**Scenario B**, providing a handler and period that reports to a BURNED_WEIGHTED_HALVING strategy that the entire actor shares:
  ```motoko
     ?{
        kill_switch = null;
        handler = ?(([(Text, Nat, Map)]) : async* () => {
          // Implement a custom distribution strategy here, such as calculating the weight based on the period being reported and the level of the codebase.
          // The Map on each item in the vector can contain additional data such as level of the code, etc
          // further logic for using burned_share and active_share
        });
        period = ?One_Hour; // 1 hour in nanosecods
        tree = ?["com.demergent.frameworka","com.aviate.shatool","com.dom.cryptoalgo"];
        collector = null;
        asset = null;
        platform = null;
      }
    
  ```

#### handler

The handler function is called by a library when it tries to run it's default open value sharing pathway. If the handler exists, the default pathway should be abandoned an the library should call the handler with the following data and allow the handler to execute the open value sharing heuristic.

##### Data Values

The handler has the following signature: `([(Text, Map)]) : async* ()`

The Position 0 Text is the Principal, Account, or Namespace the library wants to be known as.
The Position 1 Map allows for reporting of additional metadata as below:

A developer reporting a OVS event SHOULD report the following values in the Map. These values can be ignored by the heuristic or used to allocate the cycles:

- **report_period** - #Nat - nanoseconds since the last report
- **units** - #Nat - a Nat indicating the suggested execution units that should be accounted for. The implementation does not have to honor this for any calculations, but it may be used. The library should document what it is reporting in this value
- **tree** - #Array(#Text)the list parent libraries in order from highest to the immediate parent.
- **asset** - #Text - the asset the component has requested
- **platform** - #Text - the platform the component has requested
- **principal** - #Text - the payment target the component has requested.

### C++

todo

### Data Definitions

This section defines the data structures and types used throughout the CycleShare system.

#### Shares 

A representation of the proportional amount of cycles a principal, account, or namespace should receive. Defined as a vector of records containing a identifier and the amount as a natural number.

```motoko
type Shares = vec { record{ text; nat; }};
```

#### ShareArgs
The arguments required to share cycles among identifiers.

```candid
type ShareArgs = {
  shares: Shares;
};

```

#### ShareCycleResult

Defines the possible errors that can occur during the sharing of cycles. Only available for non-notify endpoint.
```motoko
type ShareCycleError = {
  #NotEnoughCycles : { Nat;Nat }; //required; available
  #CustomError : Text;
};

type ShareResult = variant{
    Ok: nat;
    Err: ShareCycleError;
  };

```

### Update Functions

#### icrc85_deposit_cycles

This function is designed to distribute cycles among various namespaces based on predefined shares. This method is vital for redistributing available resources equitably among participants.  The icrc85 canister should distribute the cycles as minted tokens for the provided namespaces. 

If the namespace has not been claimed, they should be reserved until the namespace is claimed.

```candid

type ShareArgs = vec { record{ text; nat; }};

icrc85_deposit_cycles : (ShareArgs) -> async ShareResults

```

**Parameters:**
- `request`: ShareArgs.

**Returns:**
- `ShareResult`: A result type that details success or specific errors encountered while distributing cycles, such as not having enough cycles available or other custom errors defined by the system.

#### icrc85_deposit_cycles_notify

Same as icrc85_deposit_cycles but as a one shot call

**Parameters:**
- `request`: ShareArgs.

**Returns:**
 - no return

```

 icrc85_deposit_cycles_notify : (ShareArgs) -> ()

```

### Query Functions

Query functions are optional and only required when an ICRC-85 canister utilizes the namespace features of ICRC-85

#### icrc85_namespace_look_up

This query function is designed to look up the information about a specific namespace to determine if it has been associated with an account.

**Parameters:**
- `namespace`: Text - the namespace identifier for which information is requested.

**Returns:**
- `(opt Account)`: Returns an optional account that the namespace shared cycles will be forwarded to. If the namespace has not been claimed or found, returns `null`.

#### icrc85_namespace_temp_account

This function returns the reserved account for the specified namespace. It helps in identifying and managing reserved but unclaimed namespaces, ensuring that tokens or cycles intended for a namespace are correctly accounted for until an actual account claims them.

**Parameters:**
- `namespace`: Text - the namespace identifier for which the reserved account information is requested.

**Returns:**
- `Account`: The system-reserved account holding any tokens or assets for the namespace until claimed. If no assets are reserved, it will still return an account that would be associated with the namespace.

### Block Schemas

Block logs are not required for ICRC-85, but they are provided for those that would like to provide a transaction log for their ICRC-85 compatible canister.

#### Block Schema for "85withdraw"

When a participant withdraws cycles from the shared ledger, their request and the state change associated with the transaction are logged as an "85withdraw" block. This block contains the necessary information to track and audit the withdrawal process.

```shell
{
  "btype": "84Withdraw",
  "tx": {
    "to" : Array(Blob, Blob);
    "amount" : Nat;
    "token" : Map; //(Text, Principal); ("icrc1",Blob);
    "caller": "Blob",
    "ts": "Nat",
    "fee" : "Nat",
    "index": "Nat"//transaction index on target ledger
  }
}
```

**Description:**
- **to**: Account the withdraw went to. Principal.toBlob, ?subaccount;
- **amount**: Amount of the withdraw.
- **token**: ICRC-84 token representation
- **caller**: Principal as Blob.
- **ts**: time of the withdraw
- **fee**: fee of the withdraw(if in addition to remote ledger fee)
- **index**: remote ledger index id

#### Block schema for payment of OVS payments.

Deposits into the CycleShare ledger can be detected via the 1mint blocks in the ICRC3 ledger.  The memo should be the sending Principal as a blob.

Transfers from namespace accounts to target accounts will be 1xfer transactions.

Withdraws will also have a 1burn associated with them.

### `icrc10_supported_standards`

An implementation of ICRC-7 MUST implement the method `icrc10_supported_standards` as put forth in ICRC-10.

The result of the call MUST always have at least the following entries:

```candid
record { name = "ICRC-85"; url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-85"; }
record { name = "ICRC-10"; url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-10"; }
```

## Dependance on ICRC-75, ICRC-86, ICRC-84

The following only applies to ICRC-85 ledgers implementing shared custody of cycles via a wrapped cycle ledger:

ICRC-85 canisters MUST implement ICRC-75 for managing the account associated with each namespace.  ICRC-85 imposes the following additional requirements on the ICRC-75 canister:

The `ManageListPropertyRequestItem.Create` functions should be gated by an ICRC-86 domain look up. The creating principal must be a controller for the domain. For example, to create the namespace `com.foo.listframework.v1`, the caller MUST control the `["com", "foo"]` or `["com", "foo", "listframework"]` or `["com", "foo", "listframework", "v1"]` domain name on the ICRC-86 system according to the icrc86_namespace_look_up query.

In detail this means that if they control "com.foo", but do not control "com.foo.listframework" then they CANNOT create or manage the namespace.
