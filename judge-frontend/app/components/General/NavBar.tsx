"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle'; // Assuming ThemeToggle is in the same directory

interface NavBarProps {
    TITLE: string;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ TITLE, isSidebarOpen, setIsSidebarOpen, isDark, toggleTheme }) => {
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6 md:py-6 transition-colors duration-500"
        >
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
                        {TITLE}
                    </h1>
                    <p className="hidden md:block mt-2 text-gray-500 dark:text-gray-400">
                        Select a problem and start coding!
                    </p>
                </motion.div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() =>
                            setIsSidebarOpen(!isSidebarOpen)
                        }
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        title={
                            isSidebarOpen
                                ? "Hide sidebar"
                                : "Show sidebar"
                        }
                    >
                        {isSidebarOpen ? (
                            <svg
                                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        )}
                    </button>
                    <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                </div>
            </div>
        </motion.header>
    );
};

export default NavBar;
