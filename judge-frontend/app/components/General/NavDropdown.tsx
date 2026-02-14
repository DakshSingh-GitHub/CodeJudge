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
        { name: "Code Judge", path: "/code-judge", icon: "⚖️", subtext: "Select a problem and start solving!" },
        { name: "Code IDE", path: "/code-ide", icon: "💻", subtext: "Think and Build!" },
        { name: "Code Home", path: "/", icon: "👋", subtext: "See you here!" }
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
                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-gray-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    {currentRoute.icon}
                </div>
                <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
                    {currentRoute.name}
                </span>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-0 mt-3 w-80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-2xl p-3 z-50 overflow-hidden"
                    >
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <motion.button
                                    key={route.path}
                                    // whileHover={{ x: 5 }}
                                    onClick={() => handleNavigate(route.path)}
                                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${pathname === route.path
                                        ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                                        }`}
                                >
                                    <span className="text-2xl">{route.icon}</span>
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-bold text-[15px] tracking-tight">{route.name}</span>
                                        <span className="text-[10px] leading-tight opacity-60 font-medium">
                                            {route.subtext}
                                        </span>
                                    </div>
                                    {pathname === route.path && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
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
