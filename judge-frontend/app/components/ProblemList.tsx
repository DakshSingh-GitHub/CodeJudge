"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getProblems } from "../lib/api";
import { Filter, ChevronDown, Check, Sparkles, SlidersHorizontal } from "lucide-react";
import { getSubmissions } from "../lib/storage";
import FilterModal from "./General/FilterModal";

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
    const [filters, setFilters] = useState<{ difficulty: string[]; status: "all" | "solved" | "unsolved" }>({
        difficulty: [],
        status: "all"
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterModalOpen(false);
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
        const fetchProblemsData = async () => {
            const data = await getProblems();
            const problemList: Problem[] = data.problems || [];

            // Fetch solved submissions
            try {
                const submissions = await getSubmissions();
                const solvedIds = new Set(
                    submissions
                        .filter(s => s.final_status === "Accepted")
                        .map(s => s.problemId)
                );
                setSolvedProblemIds(solvedIds);
            } catch (err) {
                console.error("Failed to fetch submissions", err);
            }

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
        };

        fetchProblemsData();

        // Listen for new submissions
        const handleSubmissionUpdate = () => {
            getSubmissions().then(submissions => {
                const solvedIds = new Set(
                    submissions
                        .filter(s => s.final_status === "Accepted")
                        .map(s => s.problemId)
                );
                setSolvedProblemIds(solvedIds);
            });
        };

        window.addEventListener('submission-updated', handleSubmissionUpdate);
        return () => window.removeEventListener('submission-updated', handleSubmissionUpdate);
    }, []);

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Difficulty Filter
        const matchesDifficulty = filters.difficulty.length === 0 ||
            filters.difficulty.includes((problem.difficulty || "medium").toLowerCase());

        // Status Filter
        const isSolved = solvedProblemIds.has(problem.id);
        const matchesStatus = filters.status === "all" ||
            (filters.status === "solved" && isSolved) ||
            (filters.status === "unsolved" && !isSolved);

        return matchesSearch && matchesDifficulty && matchesStatus;
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
                            className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500/30 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white dark:placeholder-gray-500"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsFilterModalOpen(true)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-all outline-none ${filters.difficulty.length > 0 || filters.status !== "all"
                            ? "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20"
                            : "text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                        {(filters.difficulty.length > 0 || filters.status !== "all") && (
                            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
                        )}
                    </motion.button>
                </div>

                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                />
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
                                        className={`w-full text-left px-4 py-3 transition-all duration-200 flex justify-between items-center group relative ${selectedId === problem.id
                                            ? "bg-indigo-50 dark:bg-indigo-900/40 border-l-4 border-indigo-600 dark:border-indigo-400 text-indigo-900 dark:text-indigo-50 font-medium"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {solvedProblemIds.has(problem.id) && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -20 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className="flex items-center justify-center shrink-0"
                                                >
                                                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px]" />
                                                </motion.div>
                                            )}
                                            <span className="truncate">
                                                {typeof problem.title === 'string' ? problem.title : JSON.stringify(problem.title || "Untitled")}
                                            </span>
                                        </div>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-opacity duration-200 uppercase tracking-tighter shrink-0 ${getDifficultyStyles(typeof problem.difficulty === 'string' ? problem.difficulty : 'medium')}`}>
                                            {typeof problem.difficulty === 'string' ? problem.difficulty : JSON.stringify(problem.difficulty || "Medium")}
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
