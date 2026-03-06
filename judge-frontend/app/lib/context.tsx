/* eslint-disable */
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

type ThemeMode = "light" | "dark" | "system";

interface AppContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSubmissionsModalOpen: boolean;
  setIsSubmissionsModalOpen: (isOpen: boolean) => void;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  appFontScale: number;
  setAppFontScale: (scale: number) => void;
  editorFontSize: number;
  setEditorFontSize: (size: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  autoHideMobilePills: boolean;
  setAutoHideMobilePills: (enabled: boolean) => void;
  resetUiSettings: () => void;
  TITLE: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);

  // Initialize theme from localStorage immediately if on client
  // Initialize as false to match server, then update on mount
  const [isDark, setIsDark] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [appFontScale, setAppFontScaleState] = useState(1);
  const [editorFontSize, setEditorFontSizeState] = useState(15);
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [autoHideMobilePills, setAutoHideMobilePillsState] = useState(true);
  const [mounted, setMounted] = useState(false);
  const themeSwitchTimeoutRef = useRef<number | null>(null);

  const applyTheme = (mode: ThemeMode) => {
    if (typeof window === 'undefined') return;
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = mode === "dark" || (mode === "system" && isSystemDark);

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    localStorage.theme = shouldUseDark ? "dark" : "light";
    localStorage.setItem("theme_mode", mode);
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedThemeMode = localStorage.getItem("theme_mode");
      const savedFontScale = Number(localStorage.getItem("app_font_scale") || "1");
      const savedEditorFontSize = Number(localStorage.getItem("editor_font_size") || "15");
      const savedReduceMotion = localStorage.getItem("reduce_motion") === "1";
      const savedAutoHidePills = localStorage.getItem("autohide_mobile_pills");

      let initialThemeMode: ThemeMode = "system";
      if (savedThemeMode === "light" || savedThemeMode === "dark" || savedThemeMode === "system") {
        initialThemeMode = savedThemeMode;
      } else if (localStorage.theme === "light" || localStorage.theme === "dark") {
        initialThemeMode = localStorage.theme;
      }

      setThemeModeState(initialThemeMode);
      applyTheme(initialThemeMode);
      setAppFontScaleState(Number.isFinite(savedFontScale) && savedFontScale >= 0.85 && savedFontScale <= 1.2 ? savedFontScale : 1);
      setEditorFontSizeState(Number.isFinite(savedEditorFontSize) && savedEditorFontSize >= 12 && savedEditorFontSize <= 22 ? savedEditorFontSize : 15);
      setReduceMotionState(savedReduceMotion);
      setAutoHideMobilePillsState(savedAutoHidePills === null ? true : savedAutoHidePills === "1");
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
    applyTheme(themeMode);
  }, [themeMode, mounted]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (themeMode === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [themeMode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--app-font-scale", String(appFontScale));
    localStorage.setItem("app_font_scale", String(appFontScale));
  }, [appFontScale, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("editor_font_size", String(editorFontSize));
  }, [editorFontSize, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    localStorage.setItem("reduce_motion", reduceMotion ? "1" : "0");
  }, [reduceMotion, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("autohide_mobile_pills", autoHideMobilePills ? "1" : "0");
  }, [autoHideMobilePills, mounted]);

  const setThemeMode = (mode: ThemeMode) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.add("theme-switching");
    if (themeSwitchTimeoutRef.current !== null) {
      window.clearTimeout(themeSwitchTimeoutRef.current);
    }
    setThemeModeState(mode);
    themeSwitchTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove("theme-switching");
      themeSwitchTimeoutRef.current = null;
    }, 220);
  };

  const toggleTheme = () => {
    setThemeMode(isDark ? "light" : "dark");
  };

  const resetUiSettings = () => {
    setThemeMode("system");
    setAppFontScaleState(1);
    setEditorFontSizeState(15);
    setReduceMotionState(false);
    setAutoHideMobilePillsState(true);
  };

  return (
    <AppContext.Provider value={{
      isSidebarOpen,
      setIsSidebarOpen,
      isSubmissionsModalOpen,
      setIsSubmissionsModalOpen,
      isDark,
      themeMode,
      setThemeMode,
      toggleTheme,
      appFontScale,
      setAppFontScale: setAppFontScaleState,
      editorFontSize,
      setEditorFontSize: setEditorFontSizeState,
      reduceMotion,
      setReduceMotion: setReduceMotionState,
      autoHideMobilePills,
      setAutoHideMobilePills: setAutoHideMobilePillsState,
      resetUiSettings,
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
