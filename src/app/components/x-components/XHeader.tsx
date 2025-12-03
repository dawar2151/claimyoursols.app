"use client";

import { useState, useEffect, useContext, useRef } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGithub, FaTwitter, FaTelegram } from "react-icons/fa";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { Connection } from "@solana/web3.js";
import { getRpcEndpoint } from "@/app/types/ClaimYourSolsStage";

export const XHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rpcDropdownOpen, setRpcDropdownOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("mainnet-beta");

  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);

  const { claimYourSolsState, setClainYourSolsState } = useContext(
    ClaimYourSolsStateContext
  );

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleToggleRpcDropdown = () => {
    setRpcDropdownOpen(!rpcDropdownOpen);
  };

  const rpcOptions = [
    {
      name: "Solana RPC Mainnet",
      value: "mainnet-beta",
      icon: "/mainnet-icon.png",
      url: getRpcEndpoint(),
    },
    {
      name: "Solana RPC Testnet",
      value: "testnet",
      icon: "/testnet.svg",
      url: "https://api.testnet.solana.com",
    },
    {
      name: "Solana RPC Devnet",
      value: "devnet",
      icon: "/devnet.png",
      url: "https://api.devnet.solana.com",
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/dawar2151/claimyoursols.app",
      icon: FaGithub,
      hoverColor: "hover:text-gray-300",
    },
    {
      name: "Twitter",
      href: "https://x.com/claimyoursolsx",
      icon: FaTwitter,
      hoverColor: "hover:text-blue-400",
    },
    {
      name: "Telegram",
      href: "https://t.me/+AOcRPkMqg8QzYzk0",
      icon: FaTelegram,
      hoverColor: "hover:text-blue-500",
    },
  ];

  const handleRpcSelection = (
    selectedNetwork: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setSelectedNetwork(selectedNetwork);
    const rpcURL =
      rpcOptions.find((option) => option.value === selectedNetwork)?.url ||
      "https://api.devnet.solana.com";
    setClainYourSolsState({
      ...claimYourSolsState,
      network: selectedNetwork,
      connection: new Connection(rpcURL),
    });
    setRpcDropdownOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setRpcDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-left hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo-80-80.png"
              alt="ClaimYourSols Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ClaimYourSols
            </span>
          </button>

          {/* Desktop RPC Dropdown, Social Icons & Wallet */}
          <div className="hidden md:flex items-center space-x-6">
            {/* RPC Dropdown */}
            <div className="relative">
              <button
                onClick={handleToggleRpcDropdown}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Image
                  src={
                    rpcOptions.find(
                      (option) => option.value === selectedNetwork
                    )?.icon || "/mainnet-icon.png"
                  }
                  alt="Network"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium">
                  {rpcOptions.find((option) => option.value === selectedNetwork)
                    ?.name || "Mainnet"}
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${rpcDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {rpcDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-10">
                  {rpcOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => handleRpcSelection(option.value, e)}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      <Image
                        src={option.icon}
                        alt={`${option.name} icon`}
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <span className="text-sm font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-300 ${social.hoverColor} transition-colors duration-200`}
                    title={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={handleToggleMobileMenu}
              className="text-white hover:text-gray-200 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Mobile RPC Selection */}
              <div>
                <span className="text-sm font-medium text-gray-300 mb-2 block">
                  Network Selection:
                </span>
                <div className="space-y-2">
                  {rpcOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        handleRpcSelection(option.value, e);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full px-3 py-2 text-left rounded-lg transition-colors ${selectedNetwork === option.value
                        ? "bg-purple-700 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      <Image
                        src={option.icon}
                        alt={`${option.name} icon`}
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <span className="text-sm">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Social Icons */}
              <div>
                <span className="text-sm font-medium text-gray-300 mb-3 block">
                  Follow Us:
                </span>
                <div className="flex items-center space-x-6">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-300 ${social.hoverColor} transition-colors duration-200`}
                        title={social.name}
                      >
                        <IconComponent className="w-6 h-6" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default XHeader;
