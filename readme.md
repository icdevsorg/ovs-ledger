# OVS Ledger Library for Internet Computer

The OVS Ledger Library is designed to manage the sharing of cycles within the Internet Computer (IC) environment, implementing ICRC-85 standards for cycle sharing. This library provides an interface for capturing shared cycles to support OpenSource development and to expose them using a token that follows token standards including ICRC-1, ICRC-2, ICRC-3, and ICRC-4.

## Key Features

- **Token Management**: Supports creating and managing the ledger for OVS according to ICRC-1, ICRC-2, ICRC-3, and ICRC-4 standards.
- **Cycle Deposit and Withdrawal**: Facilitates the minting and withdrawal of shared cycles to open source code authors, promoting easy value transfer.
- **Namespace Management**: Allows managing unique namespaces for capturing value to a particular address.
- **Transaction History and Archiving**: Implements ICRC-3 for maintaining a record of transactions with archival support.

## System Requirements

- DFINITY Internet Computer SDK
- Motoko Programming Language

## Installation and Setup

This library is designed as a Motoko actor class that can be imported and integrated into your IC project. To use this library:
1. Ensure you have the DFINITY Canister SDK installed.
2. Clone this repository or copy the code into your IC project.
3. Include the Motoko code in your project and deploy it to the Internet Computer network.

### Depositing Tokens

Depositing tokens into the cycles sharing ledger is managed via the `icrc85_deposit_cycles` or `icrc85_deposit_cycles_notify`function. These function handles the allocation of shared cycles to designated namespaces, either reserving them for later claims or directly minting tokens into the account of a namespace owner. Namespace owners can claim their cycles at a later time, ensuring a flexible and robust management system for cycle distribution.

#### Workflow for Depositing Tokens
1. **Cycle Reception**: Cycles are received into the ledger canister through direct deposition. Cycles should be added to the call using the proper system api(`ExperimentalCycles.add()` in motoko)
2. **Token Allocation**: Depending on the predefined rules, these cycles are either:
   - Reserved for unclaimed namespaces where they are kept until a valid claim is made.
   - Immediately minted into tokens and allocated to the namespace owner's account.
3. **Claim Process**: Namespace owners can claim their reserved cycles by proving ownership of the namespace, which is then verified. Upon successful verification, cycles are converted to tokens and transferred to the owner's account.

#### Sample Call Example
Here's how you can execute a cycle deposit using the `icrc85_deposit_cycles` function:

```motoko
        // Example namespace and share amount
        let namespace: Text = "com.yourco.libraryname";
        let shareAmount: Nat = 1_000_000_000; // Example share amount in cycles

        // Prepare the share argument
        let shareArgs = [(namespace, 1)];
        ExperamentalCycles.add(shareArgs)
        let result = await CyclesShareLedger.icrc85_deposit_cycles(shareArgs);
```

#### Distributing to Multiple namespaces

The platform distributes the shared cycles across a set of namespaces if provided according to the share value provided. In the following example the 1/3 would go to namespace1 and 2/3 to namespace 2:

```
  let shareArgs = [("namespace1", 1),("namespace1", 2)];
```

### Withdrawing Tokens

Withdrawing tokens allows stakeholders to convert their OVS cycles back into raw cycles via the Cycles Ledger. Tokens can be withdrawn by calling the `icrc84_withdraw` method or via burning them using the traditional method of sending them to the OVS Ledger minting account. When tokens are withdrawn using either method they are effectively removed from the circulation and the equivalent cycles are transmitted to the user's Cycle Ledger account.

#### Workflow for Withdrawing Tokens:
1. **Validation**: Ensure the caller owns the tokens.
2. **Token Burn or Transfer**: Tokens can be withdrawn via `icrc84_withdraw`, or they can be burnt, which triggers a removal from circulation, subsequently releasing the equivalent cycles.
3. **Cycles Dispatch**: Successfully burnt or transferred tokens result in cycles being sent to the account tied to the canister responsible for managing cycles at `um5iw-rqaaa-aaaaq-qaaba-cai`.

#### Example of Withdrawing Tokens:
Here’s how tokens can be withdrawn by initiating a transaction where a user requests to convert their tokens back to cycles:

```motoko
import CyclesShareLedger from "...";

// Define the arguments for withdrawal
let withdrawalArgs = {
    to: { owner = userPrincipalId; subaccount = optUserSubaccount },
    amount: 1_000_000_000,  // Amount of tokens to withdraw
    token = #icrc1(cyclesLedgerPrincipalId)  // Token identifier tied to the cycles um5iw-rqaaa-aaaaq-qaaba-cai
};

// Execute the withdrawal
let withdrawalResult = await CyclesShareLedger.icrc84_withdraw(withdrawalArgs);
```

In the event that users wish to burn their tokens, sending them directly to the minting account will ensure they are removed from circulation, and corresponding cycles are paid out based on the current market rate minus any handling fees.

#### Burning Tokens to Minting Account Example:
This operation results in the removal of tokens by sending them to the minting account:

```motoko
let burnArgs = {
    to: await CyclesShareLedger.icrc1_minting_account();
    amount: 500_000_000; // Half a billion tokens for withdrawl
    from_subaccount: null;
    fee: ?100_000_000;
    created_at_time: null;
    memo: null;
};

// Execute the burn
let burnResult = await CyclesShareLedger.transfer(burnArgs);
```

### Claiming Namespaces

To manage the distribution of shared cycles and tokens accurately, namespaces allow identification and association of resources with specific entities or projects. To claim a namespace for your project or entity, you must demonstrate control over the corresponding domain in a manner that aligns with the ICRC-85 standard.

#### Process of Claiming a Namespace

Claiming a namespace follows a process of validation to ensure that the claimant has legitimate control over the namespace they intend to manage. Here is how you can claim a namespace:

1. **Registration Gate**: Currently a user must use icrc2_approve to approve 5 XDR worth of ICP to procure a validation code. This keeps spam of the platform and funds cycles for the Ledger's operation.

2. **Control Verification**: Ensure you control the domain corresponding to the namespace you want to claim. For instance, to claim the namespace `com.example.*`, you should control the `example.com` domain.

3. **Validation Code**: When you initiate a namespace claim, you will receive a validation code. Place this code within a TXT record for your domain `@`, with the value`icrc85validation={validation_code}` where you replace {validation_code} with the code returned from .

4. **Ledger Update**: Upon successful validation of the domain control (checked against the TXT record), the ledger is updated to reflect your ownership of the namespace.

#### Function Call Example

Here's an example call to `icrc85_claim_namespace` method to claim a namespace:

```motoko

let approve = await NNSLedger.icrc2_approve({
   fee = ?10_000;
   amount = 2_0000_0000; //2 ICP should be enough as long as ICP is over $7. Only 5XDR worth will be taken
   expires_at = null;
   expected_allowance = null;
   memo = null;
   spender = {
    owner = Principal.fromText("q26le-iqaaa-aaaam-actsa-cai");
    subaccount = null;
   };
   from_subaccount = null;
});

// Define the namespace claim arguments
let claimArgs = {
    namespace: "com.yourdomain",
    account: {owner = yourPrincipal; subaccount = null;},  // Optionally specify an IC account
    validationCode: null
};

// Make the claim request
let claimResult = await Token.icrc85_claim_namespace(claimArgs);

switch(calaimResult){
  case(#ValidationRequired(val)){
    return val.validation; //this is your validation code that you need to put into DNS for validation.
  }
}
```

Upon successful processing, the ledger records your claim, linking the specified namespace to your control. If necessary, it prompts you to add the validation code to your DNS records, completing the validation loop.

#### Revalidation

To change the destination account for a namespace, the same process can be repeated.

#### Automated Validation (Future Implementation)

In future releases, the validation process for claiming namespaces will be automated further, reducing manual steps and enhancing user experience. This will streamline the process, ensuring a seamless integration of namespace validation within domain management workflows.

#### Current Validation

Validations for the OVS ledger at `q26le-iqaaa-aaaam-actsa-cai` are currently controlled by ICDevs.org.

## Testing

Testing is critical to ensure the reliability and robustness of the OVS Ledger. This project uses Jest, a delightful JavaScript Testing Framework, to perform automated tests.

### Setting Up Tests

Before running the tests, you need to install the dependencies which include the Jest testing framework. Follow these steps to set up the test environment:

1. **Install dependencies**:

   Run the following command to install all necessary dependencies, including Jest:

   ```bash
   npm install
   ```

2. **Running tests**:

   To execute the tests, run:

   ```bash
   npm jest
   ```


## Dependencies

This project relies on the following external libraries and schemas:
- `base`: A collection of basic utilities and types in Motoko.
- `cert`: Certificate utilities for the Internet Computer.
- `icrc1-mo`, `icrc2-mo`, `icrc3-mo`, `icrc4-mo`: Libraries that implement the respective ICRC token standards.
- `sha2`: For hashing and book keeping in memo fields

## OVS Default Behavior

This motoko class has a default OVS behavior that sends cycles to the developer to provide funding for maintenance and continued development. In accordance with the OVS specification and ICRC85, this behavior may be overridden by another OVS sharing heuristic or turned off. We encourage all users to implement some form of OVS sharing as it helps us provide quality software and support to the community.

Default behavior: This library is dependent on other libraries that utilize OVS but does not employ any additional default behavior unless an OVS heuristic is provided.

Default Beneficiary: ICDevs.org

Additional Behavior: Utilizes the icrc75.mo library by ICDevs.org: https://github.com/icdevsorg/icrc75.mo

## Contributing

Contributions to the project are welcome! Please refer to the project’s issues and pull requests sections to join in development efforts.

## License

This software is licensed under the [Apache License 2.0](LICENSE).

---

For more information on developing with the Internet Computer, visit the [DFINITY developer center](https://sdk.dfinity.org).
