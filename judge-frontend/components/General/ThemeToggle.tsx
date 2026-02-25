"use client";

import { motion } from "framer-motion";

interface ThemeToggleProps {
    isDark: boolean;
    toggleTheme: () => void;
}

export default function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`relative flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 shadow-inner ${isDark ? "bg-indigo-950 border border-indigo-900/50" : "bg-sky-100 border border-sky-200"}`}
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`flex h-6 w-6 items-center justify-center rounded-full shadow-lg transition-colors duration-200 ${isDark ? "bg-indigo-500" : "bg-white"}`}
                style={{
                    marginLeft: isDark ? "auto" : "0",
                    marginRight: isDark ? "0" : "auto"
                }}
            >
                {isDark ? (
                    <motion.span initial={{ rotate: -45 }} animate={{ rotate: 0 }} className="text-[10px]">🌙</motion.span>
                ) : (
                    <motion.span initial={{ rotate: 45 }} animate={{ rotate: 0 }} className="text-[10px]">☀️</motion.span>
                )}
            </motion.div>
        </motion.div>
    );
}
