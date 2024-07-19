|ICRC|Title|Author|Discussions|Status|Type|Category|Created|
|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
|86|Domain Claim Standard|Austin Fatheree (@skilesare), |Draft|Standards Track||2024-04-10|


# ICRC-86: Domain Claim Standard

ICRC-86 is a standard for claiming and managing the right control an domain and the its underlying namespaces on the Internet Computer. 

## Introduction

Domain are consist of a Top-level domain prefix and a series of more specific specifiers.  For example, com.foo, org.dfinity, com.github.skilesare.repos. The goal of ICRC-86 is to sync control of official TLD controlled by ICANN as well as provide domain names that are under decentralized control.

### Data Structures

#### Domains

Domains are represented by a `vec text` in reverse order of a typical web address. For example, subdomain.foo.com would be ["com","foo","subdomain"].

Undecorated position 0 items are assumed to be standard ICANN TLDs and should be vetted against the ICANN system.

Decentralized TLDs managed by the ICRC-86 system are decorated with an underscore at the end. For example: ["icp_","foo","subdomain"] would be managed by the server and validation would follow a different pathway than ICANN TLDs.

#### DomainClaimRequest

A request structure used when a user or a project claims a domain for participating in the cycle sharing.
```motoko
type DomainClaimRequest = {
  domain: vec text;
  controllers: vec principal;
  gateAccount: opt Account
  validationCode: opt text; //will be null for initial requests; provide this when automated authentication is available and DNS can be read
};
```
#### DomainClaimResponse
Defines the possible responses to a domain claim request.
```candid
type DomainClaimResponse = variant {
  ValidationRequired: {
    controllers: vec principal;
    existingControllers: vec principal;
    domain: vec text;
    validation: text;
  };
  Ok: {
    controllers: vec principal;
    domain: vec text;
  };
  RecordExists: {
    controllers: vec principal;
    domain: vec text;
  };
  Err: variant {
    ValidationGateFailed;
    ValidationRecordNotFound;
    ValidationRecordNotApproved;
    Unauthorized;
  };
};
```
#### DomainApprovalRequest
Used by an administrative system to approve a previously claimed domain.
```candid
type DomainApprovalRequest = {
  domain: vec text;
  validationCode: text;
};
```
#### DomainApprovalResponse
Possible responses to a domain approval request.
```candid
type DomainApprovalResponse = variant {
  Ok;
  Err : variant {
    #ValidationRecordNotFound;
    #ValidationSucceededButTransferError : record { message: text };
  };
};
```

### Update Functions

#### icrc86_claim_domain

This function allows a user or a project to claim a domain for managing their domains within the system. The claim request includes the domain identifier, an set of controlling principals, and a validation code for cases where automated verification is required.

Initial requests for a validation code are made with the validationCode property null.  This provided code can then be used to verify that the requested owner owns the indicated domain.

**Parameters:**
- `request`: DomainClaimRequest

**Returns:**
- `DomainClaimResponse`: The response can be one of several options indicating the status of the claim, such as validation needed, success, existing record, or errors related to the claiming process.

#### icrc86_approve_domain

This function is used to approve a previously claimed domain. It is typically called by an administrator or automated system after verifying the claimant's request. Ideal implementations should automate this by reading DNS via HTTPs outcalls.

**Parameters:**
- `request`: DomainApprovalRequest

**Returns:**
- `DomainApprovalResponse`: Indicates whether the approval was successful, or details about any errors or issues encountered during the approval process.

### Query Functions

#### icrc86_domain_look_up

This query function is designed to look up the information about a specific domain to determine if it has been claimed, by whom, and any related account information. It acts as a critical tool for transparency within a ICRC-86 system, allowing participants to verify ownership and claim status of namespaces.

**Parameters:**
- `domain`: vec{vec text}; - the domain identifiers for which information is requested.

**Returns:**
- `vec (opt vec principal, opt DomainValidationRecord)`: Returns an optional account that has claimed the domain and optionally details of the validation state. This includes the validation code, controllers associated, whether it is approved, and the timestamp of the claim or approval status. If the domain has not been claimed or found, returns `null`.

#### icrc86_namespace_look_up

This query function is designed to look up highest resolution information about a specific fully qualified namespace to determine the controllers.

**Parameters:**
- `namespaces`: vec {vec text}; - the fully qualified namespaces for which information is requested.

**Returns:**
- `vec { record { domain: vec text; controllers: vec principal}}`: Returns the list of highest resolution controllers.


For example:

A request for `vec {"com"; "foo"; "listframework"; "v1";}` might return the following if there is a record for `"com"; "foo"; "listframework"` but not `"com"; "foo"; "listframework"; "v1"`.

```
{
  domain: vec {"com"; "foo"; "listframework";};
  controllers vec {"principala", "principalb"}
}
```

### Block Schemas


### Block Schema for "86DomainApproved"

This block type logs when a domain is approved in an ICRC-86 system.

```shell
{
  "btype": "86DomainApp",
  "tx": {
    "domain": "Array(text)",
    "approvedBy": "Blob", //approver
    "ts": "Nat",
    "controllers" : "Array(Blob)
  }
}
```

**Description:**
- **btype**: String identifier for the block type (`"85App"`).
- **domain**: The text identifier of the domain that is approved.
- **approvedBy**: The principal ID of the user or system that approved the domain.
- **ts**: Timestamp when the approval was registered.
- **controllers**: Principals that now control the domain

### Block Schema for "86DomainRequested"

This block type captures requests for domain registrations in the ledger, which is crucial for initializing new projects or participants.

```shell
{
  "btype": "85DomainReq",
  "tx": {
    "domain": "Array(Text)",
    "requestedBy": "Blob",
    "controllers" : "#Array(Blob)
    "ts": "nat",
    "validation": "text"
  }
}
```

**_description:**
- **btype**: String identifier for the block type (`"85DomainReq"`).
- **domain**: The vec of text identifier of the domain requested.
- **requestedBy**: The principal ID of the user or system requesting the domain.
- **controllers**: Target Controllers for the 
- **requestedAt**: Timestamp when the request was made.
- **validation**: The Validation key produced for the validation

### icrc10_supported_standards

An implementation of ICRC-86 MUST implement the method `icrc10_supported_standards` as put forth in ICRC-10.

The result of the call MUST always have at least the following entries:

```candid
record { name = "ICRC-86"; url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-86"; }
record { name = "ICRC-10"; url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-10"; }
```

## Future features

Initial implementations may rely on administers or third party systems to detect, approve, and maintain validations of control. Eventually and automated system for ICANN lookups should be implemented.


