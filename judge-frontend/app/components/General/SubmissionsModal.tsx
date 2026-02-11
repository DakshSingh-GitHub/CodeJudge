"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, History, Sparkles, ChevronDown, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getSubmissions, Submission } from "../../lib/storage";

interface SubmissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface GroupedSubmissions {
    [problemId: string]: {
        title: string;
        submissions: Submission[];
    };
}

export default function SubmissionsModal({ isOpen, onClose }: SubmissionsModalProps) {
    const [mounted, setMounted] = useState(false);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchSubmissions();
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const data = await getSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    const grouped: GroupedSubmissions = submissions.reduce((acc, sub) => {
        if (!acc[sub.problemId]) {
            acc[sub.problemId] = {
                title: sub.problemTitle || "Unknown Problem",
                submissions: []
            };
        }
        acc[sub.problemId].submissions.push(sub);
        return acc;
    }, {} as GroupedSubmissions);

    const toggleGroup = (id: string) => {
        const next = new Set(expandedGroups);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedGroups(next);
    };

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(timestamp));
    };

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
                        className="absolute inset-0 bg-gray-950/60 backdrop-blur-xl"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="relative w-full max-w-3xl bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 dark:border-gray-800 flex flex-col h-[650px] max-h-[90vh]"
                    >
                        {/* Header Section */}
                        <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-xl shadow-indigo-500/30">
                                    <History className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                                        Your Submissions
                                        <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">
                                            BETA
                                        </div>
                                    </h3>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                        Total of {submissions.length} attempts recorded
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all active:scale-90 group"
                            >
                                <X className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
                                    />
                                    <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Loading records...</p>
                                </div>
                            ) : Object.keys(grouped).length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative">
                                        <History className="w-10 h-10 text-gray-200 dark:text-gray-700" />
                                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-100 dark:border-gray-800 animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Empty History</h4>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                            Start solving challenges to see your journey mapped out here.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(grouped).map(([id, group], index) => {
                                        const isExpanded = expandedGroups.has(id);
                                        const latestStatus = group.submissions[0].final_status;
                                        const isSolved = group.submissions.some(s => s.final_status === "Accepted");

                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={id}
                                                className={`rounded-[2rem] border transition-all duration-500 ${isExpanded
                                                    ? "bg-indigo-50/30 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                                                    : "bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggleGroup(id)}
                                                    className="w-full p-6 flex items-center justify-between text-left group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${isSolved
                                                            ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                                            }`}>
                                                            {isSolved ? <CheckCircle2 className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                {group.title}
                                                            </h4>
                                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-tighter">
                                                                {group.submissions.length} attempts • Latest: <span className={latestStatus === "Accepted" ? "text-emerald-500" : "text-rose-500"}>{latestStatus}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`p-2 rounded-xl transition-all duration-500 ${isExpanded ? "bg-indigo-500 text-white rotate-180" : "bg-gray-50 dark:bg-gray-800 text-gray-400"}`}>
                                                        <ChevronDown className="w-5 h-5" />
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-6 pb-6 space-y-3">
                                                                <div className="h-px bg-gray-100 dark:bg-gray-800 mx-2 mb-4" />
                                                                {group.submissions.map((sub) => (
                                                                    <div
                                                                        key={sub.id}
                                                                        className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/20 transition-all group/item"
                                                                    >
                                                                        <div className="flex items-center gap-4">
                                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sub.final_status === "Accepted" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500" : "bg-rose-100 dark:bg-rose-500/20 text-rose-500"}`}>
                                                                                {sub.final_status === "Accepted" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">ID: {sub.id.toUpperCase()}</span>
                                                                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                                                                    <span className={`text-[10px] font-black uppercase ${sub.final_status === "Accepted" ? "text-emerald-500" : "text-rose-500"}`}>
                                                                                        {sub.final_status}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                                                    <div className="flex items-center gap-1">
                                                                                        <Clock className="w-3 h-3" />
                                                                                        {formatDate(sub.timestamp)}
                                                                                    </div>
                                                                                    {sub.total_duration > 0 && (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                                                                            {Math.round(sub.total_duration)}ms
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <button className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all opacity-0 group-hover/item:opacity-100">
                                                                            <ExternalLink className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer decorative bar */}
                        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(ModalContent, document.body);
}
