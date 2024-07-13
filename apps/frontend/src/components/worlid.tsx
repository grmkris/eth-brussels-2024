import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { useConnectWorldCoinPlayer } from "@/hooks/player/useConnectPlayer";

export const WorldID = () => {
  if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!process.env.NEXT_PUBLIC_WLD_ACTION) {
    throw new Error("app_id is not set in environment variables!");
  }

  const handleWorldId = useConnectWorldCoinPlayer();

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    window.alert(
      "Successfully verified with World ID! Your nullifier hash is: " +
        result.nullifier_hash,
    );
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      verification_level: result.verification_level,
      action: process.env.NEXT_PUBLIC_WLD_ACTION,
      signal: "",
    };
    console.log(reqBody);
    const handledWorldId = await handleWorldId.mutateAsync({
      worldCoinSignature: reqBody,
    });
    console.log(handledWorldId);
  };

  return (
    <div>
      <IDKitWidget
        action={process.env.NEXT_PUBLIC_WLD_ACTION!}
        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
        onSuccess={onSuccess}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Orb} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
      >
        {({ open }) => (
          <button className="border border-black rounded-md" onClick={open}>
            <div className="mx-3 my-1">Verify with World ID</div>
          </button>
        )}
      </IDKitWidget>
    </div>
  );
};
