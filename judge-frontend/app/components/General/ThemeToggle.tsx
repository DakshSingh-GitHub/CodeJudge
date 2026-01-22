"use client";

import { motion } from "framer-motion";

interface ThemeToggleProps {
    isDark: boolean;
    toggleTheme: () => void;
}

export default function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
    return (
        <div
            onClick={toggleTheme}
            className={`flex h-8 w-16 cursor-pointer items-center rounded-full p-1 transition-colors duration-500 ${isDark ? "bg-slate-700" : "bg-sky-400"
                }`}
        >
            <motion.div
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md text-sm select-none"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{
                    marginLeft: isDark ? "auto" : "0",
                    marginRight: isDark ? "0" : "auto"
                }}
            >
                {isDark ? "🌙" : "☀️"}
            </motion.div>
        </div>
    );
}
