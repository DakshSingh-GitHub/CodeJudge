"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Filter, Layers, BadgeCheck, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        difficulty: string[];
        status: "all" | "solved" | "unsolved";
    };
    setFilters: (filters: { difficulty: string[]; status: "all" | "solved" | "unsolved" }) => void;
}

type Category = "difficulty" | "status";

export default function FilterModal({ isOpen, onClose, filters, setFilters }: FilterModalProps) {
    const [activeCategory, setActiveCategory] = useState<Category>("difficulty");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const categories = [
        { id: "difficulty", label: "Difficulty", icon: Layers, color: "from-indigo-500 to-blue-600" },
        { id: "status", label: "Status", icon: BadgeCheck, color: "from-emerald-500 to-teal-600" },
    ];

    const difficultyOptions = [
        { id: "easy", label: "Easy", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { id: "medium", label: "Medium", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        { id: "hard", label: "Hard", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    ];

    const statusOptions: Array<{ id: "all" | "solved" | "unsolved"; label: string; icon: string; desc: string }> = [
        { id: "all", label: "All Problems", icon: "🌐", desc: "Show everything available" },
        { id: "solved", label: "Solved Only", icon: "✅", desc: "Problems you've conquered" },
        { id: "unsolved", label: "Unsolved Only", icon: "🚀", desc: "New challenges to take on" },
    ];

    const toggleDifficulty = (diff: string) => {
        const newDiffs = filters.difficulty.includes(diff)
            ? filters.difficulty.filter((d) => d !== diff)
            : [...filters.difficulty, diff];
        setFilters({ ...filters, difficulty: newDiffs });
    };

    const resetFilters = () => {
        setFilters({ difficulty: [], status: "all" });
    };

    const activeFilterCount = filters.difficulty.length + (filters.status !== "all" ? 1 : 0);

    const ModalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-950/80 backdrop-blur-xl"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        className="relative w-full max-w-3xl bg-white dark:bg-gray-950 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 dark:border-gray-800 flex flex-col md:flex-row h-[600px] max-h-[90vh]"
                    >
                        {/* Sidebar */}
                        <div className="w-full md:w-72 bg-gray-50/50 dark:bg-gray-900/40 border-r border-gray-100 dark:border-gray-800 p-8 flex flex-col justify-between shrink-0">
                            <div>
                                <div className="flex items-center gap-4 mb-10 pl-2">
                                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30">
                                        <Filter className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                        Filter
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        const isActive = activeCategory === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id as Category)}
                                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 group ${isActive
                                                    ? "bg-white dark:bg-gray-800 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] dark:shadow-none border border-gray-100 dark:border-gray-700"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-800/40"
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl transition-all duration-500 scale-100 ${isActive ? `bg-gradient-to-br ${cat.color} text-white shadow-lg shadow-indigo-500/20` : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className={`font-black text-sm transition-colors ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                                    }`}>
                                                    {cat.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={resetFilters}
                                className="flex items-center justify-center gap-2 w-full py-3 text-xs font-black text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all active:scale-95 border-2 border-transparent hover:border-indigo-500/10 rounded-xl"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Selection
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 p-8 md:p-12">
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h4 className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mb-3">
                                        Filtering By {activeCategory}
                                    </h4>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {activeCategory === "difficulty" ? "How tough?" : "Your progress"}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group active:scale-90 border border-gray-100 dark:border-gray-800"
                                >
                                    <X className="w-6 h-6 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCategory}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="space-y-4"
                                    >
                                        {activeCategory === "difficulty" && (
                                            <div className="grid grid-cols-1 gap-4">
                                                {difficultyOptions.map((opt) => (
                                                    <label
                                                        key={opt.id}
                                                        className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer group active:scale-[0.98] ${filters.difficulty.includes(opt.id)
                                                            ? `border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/10`
                                                            : "border-gray-50 dark:border-gray-900 hover:border-gray-100 dark:hover:border-gray-800 bg-gray-50/30 dark:bg-gray-900/20"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <input
                                                                type="checkbox"
                                                                checked={filters.difficulty.includes(opt.id)}
                                                                onChange={() => toggleDifficulty(opt.id)}
                                                                className="hidden"
                                                            />
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-tighter ${opt.bg} ${opt.color} border-2 ${opt.border} shadow-sm group-hover:scale-110 transition-transform`}>
                                                                {opt.id[0]}
                                                            </div>
                                                            <div>
                                                                <span className="capitalize text-lg font-bold text-gray-900 dark:text-white block">
                                                                    {opt.label}
                                                                </span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Show {opt.id} problems
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${filters.difficulty.includes(opt.id)
                                                            ? "bg-indigo-600 scale-100 shadow-lg shadow-indigo-600/40"
                                                            : "bg-gray-200 dark:bg-gray-800 scale-90 opacity-0 group-hover:opacity-100"
                                                            }`}>
                                                            <Check className="w-5 h-5 text-white stroke-[4.5px]" />
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {activeCategory === "status" && (
                                            <div className="grid grid-cols-1 gap-4">
                                                {statusOptions.map((opt) => (
                                                    <label
                                                        key={opt.id}
                                                        className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer group active:scale-[0.98] ${filters.status === opt.id
                                                            ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/10"
                                                            : "border-gray-50 dark:border-gray-900 hover:border-gray-100 dark:hover:border-gray-800 bg-gray-50/30 dark:bg-gray-900/20"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <input
                                                                type="radio"
                                                                name="status"
                                                                checked={filters.status === opt.id}
                                                                onChange={() => setFilters({ ...filters, status: opt.id })}
                                                                className="hidden"
                                                            />
                                                            <div className="text-3xl w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                                                                {opt.icon}
                                                            </div>
                                                            <div>
                                                                <span className="text-lg font-bold text-gray-900 dark:text-white block">
                                                                    {opt.label}
                                                                </span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {opt.desc}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${filters.status === opt.id
                                                            ? "bg-emerald-600 scale-100 shadow-lg shadow-emerald-600/40"
                                                            : "bg-gray-200 dark:bg-gray-800 scale-90 opacity-0 group-hover:opacity-100"
                                                            }`}>
                                                            <Check className="w-5 h-5 text-white stroke-[4.5px]" />
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Sticky Bottom Actions */}
                            <div className="mt-8 pt-4">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white rounded-[1.5rem] text-base font-black shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] active:scale-[0.97] transition-all flex items-center justify-center gap-3 group"
                                >
                                    <div className="flex items-center gap-2">
                                        Apply Filters
                                        {activeFilterCount > 0 && (
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-md">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="bg-white/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                                        <Check className="w-5 h-5 stroke-[3px]" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(ModalContent, document.body);
}
