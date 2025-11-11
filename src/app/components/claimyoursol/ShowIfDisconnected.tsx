"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ShowIfDisconnected({ children }: { children: React.ReactNode }) {
    const { connected } = useWallet();
    if (connected) return null;
    return <>{children}</>;
}
