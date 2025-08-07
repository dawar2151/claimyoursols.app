"use client";

import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { Connection } from "@solana/web3.js";

export const XHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rpcDropdownOpen, setRpcDropdownOpen] = useState(false);
  const [navigationDropdownOpen, setNavigationDropdownOpen] = useState<
    string | null
  >(null);
  const [selectedNetwork, setSelectedNetwork] = useState("mainnet-beta");

  const { claimYourSolsState, setClainYourSolsState: setclaimYourSolsState } = useContext(
    ClaimYourSolsStateContext
  );

  const headerRef = useRef<HTMLDivElement>(null);

  const rpcOptions = [
    {
      name: "Solana RPC Mainnet",
      value: "mainnet-beta",
      icon: "/mainnet-icon.png",
      url: "https://solana-mainnet.g.alchemy.com/v2/RRb0J5PtEH1eOlcXgMgx0F6idlzeIOvx",
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

  const handleRpcSelection = (selectedNetwork: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNetwork(selectedNetwork);
    const rpcURL =
      rpcOptions.find((option) => option.value === selectedNetwork)?.url ||
      "https://api.devnet.solana.com";
    setclaimYourSolsState({
      ...claimYourSolsState,
      network: selectedNetwork,
      connection: new Connection(rpcURL),
    });
    setRpcDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleToggleMobileMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setMobileMenuOpen((prev) => {
      console.log("Mobile menu toggled, new state:", !prev); // Debug log
      return !prev;
    });
  };

  // Close dropdowns and mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setRpcDropdownOpen(false);
        setNavigationDropdownOpen(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  interface NavigationItem {
    name: string;
    href: string;
    dropdown: string[] | null;
  }

  const navigation: NavigationItem[] = [
    // { name: "Create Tokens", href: "/create-spl-spl22-tokens", dropdown: null },
    // { name: "Mint Tokens", href: "/mint-spl-spl22-tokens", dropdown: null },
    // { name: "Claim your sol", href: "/claimyoursol", dropdown: null },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg"
    >
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Image
              src="/claimyoursols-logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            <Link href="/" className="px-2 text-xl font-semibold text-white">
              Claim Your SOLs
            </Link>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navigation.map((item) => (
            <div key={item.name} className="relative">
              {item.dropdown ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNavigationDropdownOpen(
                        navigationDropdownOpen === item.name ? null : item.name
                      );
                    }}
                    className="flex items-center text-white font-medium hover:underline space-x-2"
                  >
                    <span>{item.name}</span>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-white transform transition-transform ${navigationDropdownOpen === item.name ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {navigationDropdownOpen === item.name && (
                    <div className="absolute mt-2 bg-white rounded-md shadow-lg w-48 p-2 z-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem}
                          href={`/${subItem.toLowerCase().replace(" ", "-")}`}
                          className="block px-4 py-2 text-gray-900 hover:bg-gray-200 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className="text-white font-medium hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}

          {/* RPC Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRpcDropdownOpen(!rpcDropdownOpen);
              }}
              className="flex items-center text-white font-medium hover:underline space-x-2"
            >
              <Image
                src={
                  rpcOptions.find((option) => option.value === selectedNetwork)
                    ?.icon || "/default-icon.png"
                }
                alt={`${selectedNetwork} icon`}
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span>
                {
                  rpcOptions.find((option) => option.value === selectedNetwork)
                    ?.name
                }
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 text-white transform transition-transform ${rpcDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {rpcDropdownOpen && (
              <div className="absolute mt-2 bg-white rounded-md shadow-lg w-72 p-4 z-50">
                {rpcOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => handleRpcSelection(option.value, e)}
                    className="flex items-center w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-200 rounded-lg space-x-2"
                  >
                    <Image
                      src={option.icon}
                      alt={`${option.name} icon`}
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <WalletMultiButton style={{ width: "170px", justifyContent: "center" }} />
          <button
            onClick={handleToggleMobileMenu}
            className="md:hidden text-white hover:text-gray-200 focus:outline-none"
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
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full z-50">
          <nav className="flex flex-col p-4 space-y-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavigationDropdownOpen(
                          navigationDropdownOpen === item.name ? null : item.name
                        );
                      }}
                      className="flex items-center justify-between w-full text-gray-900 font-medium hover:bg-gray-200 rounded-lg px-4 py-2"
                    >
                      <span>{item.name}</span>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-gray-900 transform transition-transform ${navigationDropdownOpen === item.name ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {navigationDropdownOpen === item.name && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem}
                            href={`/${subItem.toLowerCase().replace(" ", "-")}`}
                            className="block px-4 py-2 text-gray-900 hover:bg-gray-200 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-gray-900 font-medium hover:bg-gray-200 rounded-lg px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile RPC Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRpcDropdownOpen(!rpcDropdownOpen);
                }}
                className="flex items-center justify-between w-full text-gray-900 font-medium hover:bg-gray-200 rounded-lg px-4 py-2"
              >
                <div className="flex items-center space-x-2">
                  <Image
                    src={
                      rpcOptions.find((option) => option.value === selectedNetwork)
                        ?.icon || "/default-icon.png"
                    }
                    alt={`${selectedNetwork} icon`}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  <span>
                    {
                      rpcOptions.find((option) => option.value === selectedNetwork)
                        ?.name
                    }
                  </span>
                </div>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-900 transform transition-transform ${rpcDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              {rpcDropdownOpen && (
                <div className="mt-2 bg-gray-100 rounded-md shadow-lg p-4">
                  {rpcOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => handleRpcSelection(option.value, e)}
                      className="flex items-center w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-200 rounded-lg space-x-2"
                    >
                      <Image
                        src={option.icon}
                        alt={`${option.name} icon`}
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};