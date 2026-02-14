/* eslint-disable */
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSubmissionsModalOpen: boolean;
  setIsSubmissionsModalOpen: (isOpen: boolean) => void;
  isDark: boolean;
  toggleTheme: () => void;
  TITLE: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);

  // Initialize theme from localStorage immediately if on client
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
        return true;
      }
    }
    return false;
  });

  const TITLE = "Code Judge";

  useEffect(() => {
    // Ensure the DOM is synced with the state on mount/updates (double check)
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDark(true);
    }
  };

  return (
    <AppContext.Provider value={{
      isSidebarOpen,
      setIsSidebarOpen,
      isSubmissionsModalOpen,
      setIsSubmissionsModalOpen,
      isDark,
      toggleTheme,
      TITLE
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppWrapper');
  }
  return context;
}
