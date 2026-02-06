/* eslint-disable */
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isDark: boolean;
  toggleTheme: () => void;
  TITLE: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const TITLE = "Code Judge";

  useEffect(() => {
    // Check initial theme preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

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
    <AppContext.Provider value={{ isSidebarOpen, setIsSidebarOpen, isDark, toggleTheme, TITLE }}>
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
