"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { colors } from "@/app/utils/colors";

interface ReferralProps {}

const Referral: React.FC<ReferralProps> = () => {
  const { publicKey } = useWallet();
  const referralLink = `https:/claimyoursols.app?ref=${
    publicKey?.toBase58() || ""
  }`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Solana Referral Link",
          text: "Join now and earn 50% more SOL with my referral link!",
          url: referralLink,
        });
      } catch (err) {
        console.error("Error sharing link:", err);
        alert("Failed to share the link. Please copy it instead.");
      }
    } else {
      alert("Sharing is not supported on this device. Please copy the link.");
    }
  };

  return (
    <div
      className="my-12 w-full mx-auto p-6 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl"
      style={{ backgroundColor: colors.background.white }}
    >
      <h3
        className="text-2xl md:text-3xl font-extrabold mb-4 text-center text-transparent bg-clip-text tracking-tight"
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Unlock 50% Extra SOL with Referrals!
      </h3>
      <p
        className="text-center text-sm md:text-base mb-6"
        style={{ color: colors.text.secondary }}
      >
        Invite friends to redeem their Locked SOL and{" "}
        <span className="font-bold" style={{ color: colors.secondary }}>
          earn 50% more SOL
        </span>{" "}
        for every successful referral! Share your unique link below and start
        boosting your rewards today!
      </p>
      <QRCodeCanvas
        value={referralLink}
        size={128}
        className="mx-auto mb-6 rounded-lg p-2"
        style={{
          backgroundColor: colors.background.white,
          border: `4px solid ${colors.border}/50`,
        }}
      />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        <div className="w-full sm:w-auto flex-1">
          <input
            type="text"
            value={publicKey ? referralLink : "Connect your wallet first..."}
            readOnly
            className="w-full px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 transition duration-300"
            style={{
              backgroundColor: `${colors.background.light}`,
              color: colors.text.secondary,
            }}
          />
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={copyLink}
          className="px-6 py-2 rounded-full font-semibold transition duration-300"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            color: colors.background.white,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(to right, ${colors.secondary}, ${colors.secondary})`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(to right, ${colors.primary}, ${colors.accent})`;
          }}
        >
          Copy Link
        </button>
        <button
          onClick={shareLink}
          className="px-6 py-2 rounded-full font-semibold transition duration-300"
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            color: colors.background.white,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(to right, ${colors.secondary}, ${colors.secondary})`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(to right, ${colors.primary}, ${colors.accent})`;
          }}
        >
          Share Link
        </button>
      </div>
    </div>
  );
};
export default Referral;
