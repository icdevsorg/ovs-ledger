


module {
  public let E8S_PER_ICP : Nat64 = 100_000_000;

  public let CYCLES_PER_XDR : Nat64 = 1_000_000_000_000; // 1T

  public func icpForXDR(desiredXDR_Myriad : Nat64, xdr_permyriad_per_icp: Nat64) : Nat64 {
    (desiredXDR_Myriad * E8S_PER_ICP)/xdr_permyriad_per_icp;
  };

  public let CANISTER_ID : Text = "rkp4c-7iaaa-aaaaa-aaaca-cai";

  public type IcpXdrConversionRate = {
    // The time for which the market data was queried, expressed in UNIX epoch
    // time in seconds.
    timestamp_seconds : Nat64;
    // The number of 10,000ths of IMF SDR (currency code XDR) that corresponds
    // to 1 ICP. This value reflects the current market price of one ICP token.
    xdr_permyriad_per_icp : Nat64;
  };

  public type IcpXdrConversionRateResponse = {
    // The latest ICP/XDR conversion rate.
    data : IcpXdrConversionRate;
    // CBOR-serialized hash tree as specified in
    // https://smartcontracts.org/docs/interface-spec/index.html#certification-encoding.
    // The hash tree is used for certification and hash the following structure:
    // ```
    // *
    // |
    // +-- ICP_XDR_CONVERSION_RATE -- [ Candid encoded IcpXdrConversionRate ]
    // |
    // `-- AVERAGE_ICP_XDR_CONVERSION_RATE -- [ Candid encoded IcpXdrConversionRate ]
    // ```
    hash_tree : Blob;
    // System certificate as specified in
    // https://smartcontracts.org/docs/interface-spec/index.html#certification-encoding
    certificate : Blob;
  };

  public type SubnetTypesToSubnetsResponse = {
    data : [{ types : Text; subnets : [Principal] }];
  };

  public type Interface = actor {
    // Returns the ICP/XDR conversion rate.
    get_icp_xdr_conversion_rate : query () -> async (IcpXdrConversionRateResponse);
  };
};
