"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial theme preference
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
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
