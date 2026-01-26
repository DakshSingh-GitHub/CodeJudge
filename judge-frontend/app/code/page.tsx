"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import CodeEditor from "../components/Editor/CodeEditor";
import { useAppContext } from "../lib/context";
import { runCode } from "../lib/api";
import { Play, Terminal, Cpu, Info, AlertCircle, CheckCircle2, Loader2, MessageSquare } from "lucide-react";

export default function CodeTestPage() {
    const { TITLE, isDark } = useAppContext();
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
    }, []);

    const handleRun = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setOutput(null);
        try {
            const res = await runCode(code, input);
            setOutput(res);
        } catch (error: any) {
            setOutput({
                stdout: "",
                stderr: error.message || "Something went wrong",
                status: "Internal Error",
                duration: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 relative overflow-hidden font-sans">
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
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/40" />
                                <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500/40" />
                                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/40" />
                            </div>
                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1" />
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-tight">playground.py</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRun}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${isLoading
                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                    : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/25"
                                }`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4 fill-current" />
                            )}
                            {isLoading ? "Running..." : "Run"}
                        </motion.button>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            isDisabled={isLoading}
                            isDark={isDark}
                        />
                    </div>
                </motion.div>

                {/* Right Pane - Interaction & Output */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex-1 flex flex-col gap-6 min-h-0"
                >
                    {/* Input Pane */}
                    <div className="flex flex-col h-1/3 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50">
                            <MessageSquare className="w-4 h-4 text-indigo-500" />
                            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                Standard Input
                            </h2>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 border-none"
                            placeholder="Provide any input your code expects..."
                        />
                    </div>

                    {/* Output Pane */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 min-h-0">
                        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-purple-500" />
                                <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                    Execution Results
                                </h2>
                            </div>

                            {output && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                                        <Info className="w-3 h-3 text-gray-500" />
                                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                                            {output.duration < 1 ? `${(output.duration * 1000).toFixed(0)}ms` : `${output.duration.toFixed(2)}s`}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${output.status === "Success"
                                            ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                            : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                                        }`}>
                                        {output.status === "Success" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                        <span className="text-[10px] font-black uppercase tracking-wider">{output.status}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-6 relative flex flex-col min-h-0">
                            {/* Decorative Background for Output Box */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {!output && !isLoading ? (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                                    >
                                        <div className="p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                                            <Play className="w-8 h-8 text-indigo-500/40" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ready for execution</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">Written output will appear here</p>
                                        </div>
                                    </motion.div>
                                ) : isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex flex-col items-center justify-center space-y-4"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin relative" />
                                        </div>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                                    className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="output"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex-1 flex flex-col min-h-0"
                                    >
                                        <div className="flex-1 overflow-auto rounded-xl bg-gray-900/5 dark:bg-black/40 border border-gray-200/50 dark:border-white/5 p-4 font-mono text-sm custom-scrollbar">
                                            {output?.stdout && (
                                                <div className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap mb-4">
                                                    {output.stdout}
                                                </div>
                                            )}
                                            {output?.stderr && (
                                                <div className="text-red-600 dark:text-red-400 whitespace-pre-wrap bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-red-500 opacity-60">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Standard Error / Traceback
                                                    </div>
                                                    {output.stderr}
                                                </div>
                                            )}
                                            {!output?.stdout && !output?.stderr && (
                                                <div className="text-gray-400 italic text-xs">
                                                    (Process exited with no output)
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Terminal Footer */}
                            {!isLoading && (
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-gray-400 dark:text-gray-500">
                                    <span className="text-green-500">$</span>
                                    <span className="flex items-center gap-1">
                                        python playground.py
                                        <span className="w-1 h-3 bg-indigo-500 animate-pulse" />
                                    </span>
                                    <span className="ml-auto opacity-50">UTF-8</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
