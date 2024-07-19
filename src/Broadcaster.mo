
import D "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";


import Text "mo:base/Text";

import Nat "mo:base/Nat";




shared ({ caller = _owner }) actor class Broadcaster  () = this{

  public type ShareResult = {
    #Ok: Nat;
    #Err: ShareCycleError;
  };

  public type ShareCycleError = {
    #NotEnoughCycles: (Nat, Nat);
    #CustomError: {
      code: Nat;
      message: Text;
    };
  };


  public func broadcast (cycleShareLedger: Text, items : [(Text, Nat)], cycles: Nat) : async ShareResult {
    D.print("Broadcasting cycles to " # debug_show((cycleShareLedger, items, cycles)));
    let broadcaster : actor {icrc85_deposit_cycles : ([(Text, Nat)]) -> async ShareResult} = actor(cycleShareLedger);
    ExperimentalCycles.add(cycles);
    return await broadcaster.icrc85_deposit_cycles(items);
  };
};
