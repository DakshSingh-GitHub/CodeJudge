"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppContext } from "../lib/context";
import { runCode } from "../lib/api";
import { Play, Terminal, Cpu, AlertCircle, Loader2, MessageSquare, RotateCcw } from "lucide-react";

import CodeEditor from "../components/Editor/CodeEditor";

export default function CodeTestPage() {
    const { isDark } = useAppContext();
    const [code, setCode] = useState("# Write your code here to test\nprint('Hello, CodeJudge!')");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<{
        stdout: string;
        stderr: string | null;
        status: string;
        duration: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedCode = sessionStorage.getItem("code-ide-code");
        if (savedCode) {
            setCode(savedCode);
        }
        const savedInput = sessionStorage.getItem("code-ide-input");
        if (savedInput) {
            setInput(savedInput);
        }
        const savedOutput = sessionStorage.getItem("code-ide-output");
        if (savedOutput) {
            try {
                setOutput(JSON.parse(savedOutput));
            } catch (e) {
                console.error("Failed to parse saved output", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            sessionStorage.setItem("code-ide-code", code);
        }
    }, [code, isMounted]);

    useEffect(() => {
        if (isMounted) {
            sessionStorage.setItem("code-ide-input", input);
        }
    }, [input, isMounted]);

    useEffect(() => {
        if (isMounted) {
            if (output) {
                sessionStorage.setItem("code-ide-output", JSON.stringify(output));
            } else {
                sessionStorage.removeItem("code-ide-output");
            }
        }
    }, [output, isMounted]);

    const handleRun = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setOutput(null);
        try {
            const res = await runCode(code, input);
            setOutput(res);
        } catch (error: unknown) {
            const err = error as Error;
            setOutput({
                stdout: "",
                stderr: err.message || "Something went wrong",
                status: "Internal Error",
                duration: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setInput("");
        setOutput(null);
        sessionStorage.removeItem("code-ide-input");
        sessionStorage.removeItem("code-ide-output");
    };

    if (!isMounted) return null;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 relative overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans transition-colors duration-500">
            {/* Premium Ambient Background Elements */}
            <div className="absolute top-0 right-[-10%] w-125 h-125 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-75 h-75 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex-1 flex flex-col p-4 md:p-6 lg:p-8 xl:p-12 pb-16 md:pb-6 lg:pb-8 xl:pb-12 max-w-450 mx-auto w-full gap-4 md:gap-6 lg:gap-8 min-h-0 lg:h-full">
                {/* Mobile Title - Only visible on small screens */}
                <div className="lg:hidden flex flex-col gap-1 px-2 mb-2">
                    <h1 className="text-2xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Code <span className="text-indigo-600 dark:text-indigo-400">IDE</span>
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Think, build, and prototype</p>
                </div>

                <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 min-h-0">
                    {/* Left Pane - Expanded Editor Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-7 xl:col-span-8 flex flex-col bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200/50 dark:shadow-none rounded-4xl overflow-hidden border border-gray-100 dark:border-gray-800 lg:h-full min-h-112.5 lg:min-h-0"
                    >
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80 dark:bg-gray-800/50 border border-red-500/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 dark:bg-gray-800/50 border border-amber-500/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80 dark:bg-gray-800/50 border border-green-500/10" />
                                </div>
                                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                                <div className="flex items-center gap-2">
                                    <div className="p-1 px-2 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 uppercase tracking-wider">PY</div>
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-tight">playground.py</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    title="Reset IDE"
                                    className="p-2 rounded-xl transition-all bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900/50 hover:shadow-sm"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRun}
                                    disabled={isLoading}
                                    title="Run Code"
                                    className={`group relative p-2.5 rounded-xl transition-all shadow-lg overflow-hidden ${isLoading
                                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                        : "bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700"
                                        }`}
                                >
                                    <div className="relative z-10 flex items-center justify-center">
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                    </div>
                                    {!isLoading && (
                                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    )}
                                </motion.button>
                            </div>
                        </div>
                        <div className="flex-1 relative min-h-0">
                            <CodeEditor
                                code={code}
                                setCode={setCode}
                                isDisabled={isLoading}
                                isDark={isDark}
                            />
                        </div>
                    </motion.div>

                    {/* Right Pane - Interaction & Result Panels */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:h-full min-h-0"
                    >
                        {/* Desktop Title & Description Section - Hidden on mobile */}
                        <div className="hidden lg:flex flex-col gap-1 px-4 mb-2">
                            <h1 className="text-3xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                Code <span className="text-indigo-600 dark:text-indigo-400">IDE</span>
                            </h1>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Think, build, and prototype</p>
                        </div>

                        {/* Input Box */}
                        <div className="flex-none h-45 lg:h-50 flex flex-col bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-4xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-900/50">
                                <MessageSquare className="w-4 h-4 text-indigo-500" />
                                <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Input Stream</h2>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 p-6 bg-transparent outline-none resize-none font-mono text-sm placeholder:text-gray-300 dark:placeholder:text-gray-700 border-none"
                                placeholder="Write input here..."
                            />
                        </div>

                        {/* Result Area */}
                        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-4xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 min-h-75 lg:min-h-0">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-purple-500" />
                                    <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Output Sink</h2>
                                </div>

                                {output && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500">
                                            {output.duration < 1 ? `${(output.duration * 1000).toFixed(0)}ms` : `${output.duration.toFixed(2)}s`}
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${output.status === "Success"
                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                                            }`}>
                                            {output.status}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex-1 p-6 relative flex flex-col min-h-0 bg-[radial-gradient(circle_at_bottom_right,var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
                                <AnimatePresence mode="wait">
                                    {!output && !isLoading ? (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex-1 flex flex-col items-center justify-center text-center opacity-40 overflow-hidden"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                                                <Terminal className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Waiting for Run</p>
                                        </motion.div>
                                    ) : isLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex-1 flex flex-col items-center justify-center space-y-4"
                                        >
                                            <div className="w-10 h-10 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest animate-pulse">Running...</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex-1 flex flex-col min-h-0 overflow-hidden"
                                        >
                                            <div className="flex-1 overflow-auto rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800/50 p-5 font-mono text-sm leading-relaxed custom-scrollbar">
                                                {output?.stdout && (
                                                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                        {output.stdout}
                                                    </div>
                                                )}
                                                {output?.stderr && (
                                                    <div className="text-red-500 dark:text-red-400 whitespace-pre-wrap mt-2 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                                                        <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-red-500 opacity-60">
                                                            <AlertCircle className="w-3 h-3" /> Error Stream
                                                        </div>
                                                        {output.stderr}
                                                    </div>
                                                )}
                                                {!output?.stdout && !output?.stderr && (
                                                    <div className="text-gray-400 italic text-xs">No output returned.</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between opacity-50 flex-none">
                                    <div className="flex items-center gap-2 font-mono text-[10px]">
                                        <span className="text-green-500">➜</span>
                                        <span className="text-gray-500 dark:text-gray-400">python runtime</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">UTF-8</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Explicit spacer for mobile bottom padding to ensure scroll visibility */}
                <div className="lg:hidden h-20 w-full flex-none" />
            </div>
        </div>
    );
}
