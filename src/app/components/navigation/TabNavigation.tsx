"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors } from "@/app/utils/colors";
import { motion } from "framer-motion";

const TabNavigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const TabLink = ({ label, href }: { label: string; href: string }) => (
    <Link href={href}>
      <button
        className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 ${
          isActive(href)
            ? "text-[var(--tab-active)]"
            : "text-[var(--tab-inactive)]"
        }`}
        style={
          {
            "--tab-active": colors.secondary,
            "--tab-inactive": colors.text.secondary,
          } as React.CSSProperties
        }
      >
        {label}
        {isActive(href) && (
          <motion.div
            layoutId="tab-underline"
            className="absolute left-0 bottom-0 w-full h-[2px]"
            style={{ backgroundColor: colors.secondary }}
          />
        )}
      </button>
    </Link>
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Navigation Tabs */}
      <div
        className="flex justify-center mb-6 border-b"
        style={{ borderColor: "#E5E7EB" }}
      >
        <TabLink label="Close Accounts with zero balance" href="/" />
        <TabLink
          label="Burn & Close Accounts"
          href="/burn-and-close-accounts"
        />
        <TabLink label="Close Mint Accounts" href="/close-mint-accounts" />
      </div>
    </div>
  );
};

export default TabNavigation;
