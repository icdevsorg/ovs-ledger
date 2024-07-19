export const idlFactory = ({ IDL }) => {
  const ShareCycleError = IDL.Variant({
    'NotEnoughCycles' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'CustomError' : IDL.Record({ 'code' : IDL.Nat, 'message' : IDL.Text }),
  });
  const ShareResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ShareCycleError });
  const Broadcaster = IDL.Service({
    'broadcast' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat],
        [ShareResult],
        [],
      ),
  });
  return Broadcaster;
};
export const init = ({ IDL }) => { return []; };
