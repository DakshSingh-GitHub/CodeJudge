"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import CodeEditor from "../components/Editor/CodeEditor";
import { useAppContext } from "../lib/context";

export default function CodeTestPage() {
    const { TITLE, isDark } = useAppContext();
    const [code, setCode] = useState("# Write your code here to test\nprint('Hello, CodeJudge!')");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 relative z-10 overflow-hidden">
                {/* Left Pane - Code Editor */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-2">
                            {/* <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                            </div> */}
                            <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">script.py</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                            Editor
                        </div>
                    </div>
                    <div className="flex-1 min-h-0">
                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            isDisabled={false}
                            isDark={isDark}
                        />
                    </div>
                </motion.div>

                {/* Right Pane - Output */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-50 uppercase tracking-widest">
                            Execution Output
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Ready</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
                        {/* Decorative Background for Output Box */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: 0.3
                            }}
                            className="relative group"
                        >
                            {/* Animated Glow behind the box */}
                            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                            <div className="relative px-10 py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-2xl">
                                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Output coming soon
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-60 text-sm leading-relaxed">
                                        We're currently wire-heading the judge systems. Real-time execution output will be appearing here.
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 1, 0.3],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                            className="w-2 h-2 rounded-full bg-indigo-500"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Terminal-like hint at bottom */}
                        <div className="mt-auto w-full max-w-md p-4 bg-gray-900/5 dark:bg-black/20 rounded-xl border border-gray-200/50 dark:border-white/5">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 dark:text-gray-500">
                                <span className="text-green-500">$</span>
                                <span className="animate-pulse">_</span>
                                <span className="ml-auto">awaiting_connection...</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
