"use client";
import React from "react";
import { colors } from "@/app/utils/colors";

interface SolanaToolsProps { }

const SolanaTools: React.FC<SolanaToolsProps> = () => {
  const tools = [
    {
      title: "Create Token",
      description: "Create Your Coin on Solana",
      url: "https://solclaimer.app/create-token",
    },
    {
      title: "Mint Tokens",
      description: "Mint your created tokens easily with your mint authority",
      url: "https://solclaimer.app/mint-tokens",
    },
    {
      title: "Airdrop Token",
      description: "Distribute SOL, SPL and SPL22 tokens to multiple wallets",
      url: "https://solclaimer.app/bulksender",
    },
  ];

  const handleToolClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
        Solana Token Tools
      </h3>
      <p
        className="text-center text-sm md:text-base mb-6"
        style={{ color: colors.text.secondary }}
      >
        Create, mint, and distribute tokens on the Solana blockchain with our
        comprehensive suite of tools.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {tools.map((tool, index) => (
          <div key={index} className="flex-1 text-center flex flex-col">
            <h4
              className="text-lg font-bold mb-2 h-14 flex items-center justify-center"
              style={{ color: colors.text.primary }}
            >
              {tool.title}
            </h4>
            <p
              className="text-sm mb-4 px-2 flex-1 flex items-center justify-center"
              style={{ color: colors.text.secondary }}
            >
              {tool.description}
            </p>
            <button
              onClick={() => handleToolClick(tool.url)}
              className="px-4 py-1.5 rounded-full font-semibold transition duration-300 w-full sm:w-auto text-sm"
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
              {tool.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolanaTools;
