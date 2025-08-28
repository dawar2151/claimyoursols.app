"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletSection = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <WalletMultiButton style={{ justifyContent: "center" }} />
    </div>
  );
};

export default WalletSection;
