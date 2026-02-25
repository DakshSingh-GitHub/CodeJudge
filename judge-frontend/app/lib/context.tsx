/* eslint-disable */
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

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
  // Initialize as false to match server, then update on mount
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const themeSwitchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isStorageDark = localStorage.theme === "dark";
      const isStorageMissing = !("theme" in localStorage);

      if (isStorageDark || (isStorageMissing && isSystemDark)) {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (themeSwitchTimeoutRef.current !== null) {
        window.clearTimeout(themeSwitchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.add("theme-switching");

    if (themeSwitchTimeoutRef.current !== null) {
      window.clearTimeout(themeSwitchTimeoutRef.current);
    }

    setIsDark((prev) => !prev);

    themeSwitchTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove("theme-switching");
      themeSwitchTimeoutRef.current = null;
    }, 220);
  };

  return (
    <AppContext.Provider value={{
      isSidebarOpen,
      setIsSidebarOpen,
      isSubmissionsModalOpen,
      setIsSubmissionsModalOpen,
      isDark,
      toggleTheme,
      TITLE: "Code Judge"
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
