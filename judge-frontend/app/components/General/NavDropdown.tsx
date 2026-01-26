"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

export default function NavDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const routes = [
        { name: "Code Judge", path: "/", icon: "⚖️", subtext: "Select a problem and start solving!" },
        { name: "Code IDE", path: "/code", icon: "💻", subtext: "Think and Build!" }
    ];

    const currentRoute = routes.find(r => r.path === pathname) || routes[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleNavigate = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleDropdown}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
                <span className="text-xl">{currentRoute.icon}</span>
                <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    {currentRoute.name}
                </span>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-2">
                            {routes.map((route) => (
                                <motion.button
                                    key={route.path}
                                    whileHover={{ x: 0, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                                    onClick={() => handleNavigate(route.path)}
                                    className={`w-full my-2 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === route.path
                                        ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                                        }`}
                                >
                                    <span className="text-xl">{route.icon}</span>
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-bold">{route.name}</span>
                                        <span className="text-[11px] leading-tight opacity-70 font-medium">
                                            {route.subtext}
                                        </span>
                                    </div>
                                    {pathname === route.path && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="ml-auto w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
