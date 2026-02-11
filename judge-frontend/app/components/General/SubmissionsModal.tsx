"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, History, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SubmissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SubmissionsModal({ isOpen, onClose }: SubmissionsModalProps) {
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
                        className="absolute inset-0 bg-gray-950/40 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-[500px] max-h-[80vh]"
                    >
                        {/* Header Section */}
                        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                                    <History className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        Your Submissions
                                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Track your progress and past attempts
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors group"
                            >
                                <X className="w-6 h-6 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Content Area - Intentionally Blank as requested */}
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4"
                            >
                                {/* We could add a nice placeholder here or leave it completely empty */}
                                {/* For now, keeping it visually appealing but without actual data content */}
                                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                                    <History className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-400 dark:text-gray-500">
                                    No submissions yet
                                </h4>
                            </motion.div>
                        </div>

                        {/* Footer / Decorative bottom */}
                        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(ModalContent, document.body);
}
