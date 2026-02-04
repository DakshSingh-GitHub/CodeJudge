"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getProblems } from "../lib/api";
import { Filter, ChevronDown, Check } from "lucide-react";

import { Problem } from "../lib/types";

interface ProblemListProps {
    onSelect: (id: string) => void;
    selectedId?: string;
    setIsSidebarOpen?: (open: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function ProblemList({ onSelect, selectedId, setIsSidebarOpen, searchQuery, setSearchQuery }: ProblemListProps) {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        getProblems().then((data) => {
            const problemList: Problem[] = data.problems || [];
            const sessionOrder = sessionStorage.getItem("problemOrder");

            if (sessionOrder) {
                try {
                    const orderIds: string[] = JSON.parse(sessionOrder);
                    const orderedProblems = orderIds
                        .map(id => problemList.find(p => p.id === id))
                        .filter((p): p is Problem => !!p);

                    // Add any problems that might be new or not in session storage
                    const remainingProblems = problemList.filter(p => !orderIds.includes(p.id));
                    setProblems([...orderedProblems, ...remainingProblems]);
                } catch (e) {
                    console.error("Failed to parse session order", e);
                    const shuffled = shuffleArray(problemList);
                    sessionStorage.setItem("problemOrder", JSON.stringify(shuffled.map(p => p.id)));
                    setProblems(shuffled);
                }
            } else {
                const shuffled = shuffleArray(problemList);
                sessionStorage.setItem("problemOrder", JSON.stringify(shuffled.map(p => p.id)));
                setProblems(shuffled);
            }
            setIsLoading(false);
        });
    }, []);

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "all" || (problem.difficulty || "medium").toLowerCase() === difficultyFilter.toLowerCase();
        return matchesSearch && matchesDifficulty;
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -10, y: 5 },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const getDifficultyStyles = (difficulty?: string) => {
        const diff = (difficulty || "medium").toLowerCase();
        switch (diff) {
            case "easy":
                return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
            case "medium":
                return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
            case "hard":
                return "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
            default:
                return "bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/20";
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-indigo-500" />
                    Problems
                </h2>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 text-sm text-gray-900 bg-white/50 dark:bg-gray-700/50 backdrop-blur-md border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-white dark:placeholder-gray-400"
                        />
                    </div>

                    <div className="relative" ref={filterRef}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-md border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-all outline-none min-w-25 justify-between"
                        >
                            <span className="capitalize">{difficultyFilter}</span>
                            <motion.div
                                animate={{ rotate: isFilterOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-4 h-4 opacity-60" />
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 5, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full z-50 w-40 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl ring-1 ring-black/5"
                                >
                                    {["all", "easy", "medium", "hard"].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => {
                                                setDifficultyFilter(level);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors scale-100 hover:scale-[1.02] active:scale-[0.98] ${difficultyFilter === level
                                                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                }`}
                                        >
                                            <span className="capitalize">{level}</span>
                                            {difficultyFilter === level && <Check className="w-3.5 h-3.5" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : filteredProblems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400"
                    >
                        No problems found
                    </motion.div>
                ) : (
                    <motion.ul
                        key={filteredProblems.length}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="divide-y divide-gray-200 dark:divide-gray-700"
                    >
                        <AnimatePresence>
                            {filteredProblems.map((problem) => (
                                <motion.li
                                    key={problem.id}
                                    variants={itemVariants}
                                >
                                    <button
                                        onClick={() => {
                                            onSelect(problem.id);
                                            if (window.innerWidth < 1024 && setIsSidebarOpen) {
                                                setIsSidebarOpen(false);
                                            }
                                        }}
                                        className={`w-full text-left px-4 py-3 transition-colors duration-200 flex justify-between items-center group ${selectedId === problem.id
                                            ? "bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-600 dark:border-indigo-400 text-indigo-900 dark:text-indigo-50 font-medium"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <span className="block truncate pr-2">
                                            {problem.title}
                                        </span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-opacity duration-200 uppercase tracking-tighter ${getDifficultyStyles(problem.difficulty)}`}>
                                            {problem.difficulty || "Medium"}
                                        </span>
                                    </button>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </motion.ul>
                )}
            </div>
        </div>
    );
}
