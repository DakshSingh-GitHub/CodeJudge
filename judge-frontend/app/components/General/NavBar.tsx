"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import ThemeToggle from './ThemeToggle'; // Assuming ThemeToggle is in the same directory
import NavDropdown from './NavDropdown';

interface NavBarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isSubmissionsModalOpen: boolean;
    setIsSubmissionsModalOpen: (isOpen: boolean) => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isSidebarOpen, setIsSidebarOpen, isSubmissionsModalOpen, setIsSubmissionsModalOpen, isDark, toggleTheme }) => {
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6 md:py-3 transition-all duration-500 sticky top-0 z-50 shrink-0"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4"
                >
                    <NavDropdown />
                </motion.div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setIsSubmissionsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 border border-indigo-100 dark:border-indigo-800/50 group"
                        title="See Submissions"
                    >
                        <History className="w-4 h-4 group-hover:rotate-[-20deg] transition-transform" />
                    </button>
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
