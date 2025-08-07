"use client";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createContext, useEffect, useState } from 'react';
import { ClaimYourSolsState, initialClaimYourSolsState } from '@/app/types/ClaimYourSolsStage';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};
export const ClaimYourSolsStateContext = createContext({
  claimYourSolsState: initialClaimYourSolsState,
  setClainYourSolsState: (_: ClaimYourSolsState) => { },
  toggleTheme: () => { },
  isDarkMode: false,
});
export default function Providers({ children }: Props) {

  const [claimYourSolsState, setClaimYourSolsState] = useState<ClaimYourSolsState>(initialClaimYourSolsState);

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle between dark and light mode
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ClaimYourSolsStateContext.Provider value={{ isDarkMode, toggleTheme, claimYourSolsState, setClainYourSolsState: setClaimYourSolsState }}>
        {children}
      </ClaimYourSolsStateContext.Provider>
    </QueryClientProvider>
  );
}