"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProblemById, submitCode } from "./lib/api";
import { saveSubmission, getSubmissionsByProblemId, deleteSubmission, Submission } from "./lib/storage";
import { Problem } from "./lib/types";
import { useAppContext } from "./lib/context";
import { FileText, Code, History } from "lucide-react";

import ProblemList from "./components/ProblemList";
import ProblemViewer from "./components/ProblemViewer";
import CodeEditor from "./components/Editor/CodeEditor";
import PastSubmissions from "./components/Editor/PastSubmissions";

const DEFAULT_CODE = "#Write your code here";

interface SubmissionResult {
    final_status: string;
    summary: {
        passed: number;
        total: number;
    };
    total_duration?: number | undefined;
    test_case_results?: { status: string }[];
    error?: string;
}

export default function Home() {
    // State Variable Declarations
    const { isSidebarOpen, setIsSidebarOpen, TITLE, isDark } = useAppContext();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [selectedProblemId, setSelectedProblemId] = useState<string>("");
    const [code, setCode] = useState(DEFAULT_CODE);
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<SubmissionResult | null>(null);
    const [activeTab, setActiveTab] = useState<"editor" | "submissions">("editor");
    const [pastSubmissions, setPastSubmissions] = useState<Submission[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isMobile, setIsMobile] = useState(false);
    const [mobileTab, setMobileTab] = useState<"problem" | "code" | "submissions">("problem");
    const [isMounted, setIsMounted] = useState(false);

    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [mainContentWidth, setMainContentWidth] = useState(50); // percentage
    const isResizingSidebar = useRef(false);
    const isResizingMain = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizingSidebar.current) {
                const newWidth = Math.max(200, Math.min(600, e.clientX - 16));
                setSidebarWidth(newWidth);
            }
            if (isResizingMain.current && mainContentRef.current) {
                const rect = mainContentRef.current.getBoundingClientRect();
                const relativeX = e.clientX - rect.left;
                const newPercentage = Math.max(20, Math.min(80, (relativeX / rect.width) * 100));
                setMainContentWidth(newPercentage);
            }
        };

        const handleMouseUp = () => {
            isResizingSidebar.current = false;
            isResizingMain.current = false;
            document.body.style.cursor = "default";
        };

        const checkScreenSize = () => {
            const width = window.innerWidth;
            const currentIsMobile = width <= 1024;
            if (isMobile !== currentIsMobile) {
                setIsSidebarOpen(!currentIsMobile);
            }
            setIsMobile(currentIsMobile);
        };

        if (!isMounted) {
            const width = window.innerWidth;
            const currentIsMobile = width <= 1024;
            setIsMobile(currentIsMobile);
            setIsSidebarOpen(!currentIsMobile);
            setIsMounted(true);
        }

        window.addEventListener("resize", checkScreenSize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isMobile, isMounted, setIsSidebarOpen]);

    const handleMouseDownSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        isResizingSidebar.current = true;
        document.body.style.cursor = "col-resize";
    };

    const handleMouseDownMain = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        isResizingMain.current = true;
        document.body.style.cursor = "col-resize";
    };

    // State restoration on mount
    useEffect(() => {
        const lastProblemId = sessionStorage.getItem("last_selected_problem_id");
        if (lastProblemId && !selectedProblemId) {
            handleSelect(lastProblemId).catch(console.error);
        }
    }, [selectedProblemId]);

    // Save code changes
    useEffect(() => {
        if (selectedProblemId) {
            sessionStorage.setItem(`draft_code_${selectedProblemId}`, code);
        }
    }, [code, selectedProblemId]);

    async function handleSelect(id: string) {
        setSelectedProblemId(id);
        if (id) {
            sessionStorage.setItem("last_selected_problem_id", id);
        }

        setSearchQuery("");
        if (!id) {
            setProblem(null);
            setPastSubmissions([]);
            return;
        }

        const savedCode = sessionStorage.getItem(`draft_code_${id}`);
        setCode(savedCode || DEFAULT_CODE);
        setResult(null);

        try {
            const data = await getProblemById(id);
            setProblem(data);
            const subs = await getSubmissionsByProblemId(id);
            setPastSubmissions(subs);
        } catch (error) {
            console.error("Failed to fetch problem", error);
        }
    }

    async function handleTest() {
        if (!selectedProblemId || !problem) return;

        setIsSubmitting(true);
        setResult(null);

        try {
            const data: SubmissionResult = await submitCode(selectedProblemId, code, true);

            const sampleCount = problem.sample_test_cases?.length || 0;
            if (data.test_case_results && data.test_case_results.length > sampleCount && sampleCount > 0) {
                const sampleResults = data.test_case_results.slice(0, sampleCount);
                const passedCount = sampleResults.filter(r => r.status === "Accepted").length;

                data.summary = {
                    passed: passedCount,
                    total: sampleCount
                };
                data.test_case_results = sampleResults;
                data.final_status = passedCount === sampleCount ? "Accepted" : "Failed";
            }

            setResult(data);
        } catch (error) {
            const err = error as Error;
            if (err.name === 'AbortError' || (err.message && err.message.toLowerCase().includes('cancel'))) {
                console.warn('Test request was canceled.');
                return;
            }
            setResult({ error: err.message || "Something went wrong", final_status: "Error", summary: { passed: 0, total: 0 } });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSubmit() {
        if (!selectedProblemId || !problem) return;

        setIsSubmitting(true);
        setResult(null);

        try {
            const data: SubmissionResult = await submitCode(selectedProblemId, code);
            setResult(data);

            const newSubmission = await saveSubmission({
                problemId: selectedProblemId,
                problemTitle: problem.title,
                code: code,
                final_status: data.final_status,
                summary: data.summary,
                total_duration: data.total_duration,
            });

            if (newSubmission) {
                setPastSubmissions(prev => [newSubmission, ...prev.slice(0, 49)]);
            }
        } catch (error) {
            const err = error as Error;
            if (err.name === 'AbortError' || (err.message && err.message.toLowerCase().includes('cancel'))) {
                console.warn('Submission request was canceled.');
                return;
            }
            setResult({ error: err.message || "Something went wrong", final_status: "Error", summary: { passed: 0, total: 0 } });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteSubmission(id: string) {
        try {
            await deleteSubmission(id);
            setPastSubmissions(prev => prev.filter(sub => sub.id !== id));
        } catch (error) {
            console.error("Failed to delete submission", error);
        }
    }


    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {!isMounted ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                    >
                        {typeof TITLE === 'string' ? TITLE : JSON.stringify(TITLE || "Code Judge")}
                    </motion.div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        className="h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-4 overflow-hidden"
                    >
                        <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full bg-white/30"
                        />
                    </motion.div>
                </div>
            ) : (
                <>
                    <div
                        ref={containerRef}
                        className={`flex flex-col md:flex-row flex-1 overflow-hidden gap-4 p-4 relative z-10`}
                    >
                        {/* Left Sidebar - Problem List */}
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    layout
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{
                                        width: isMobile ? "100%" : sidebarWidth + 20,
                                        opacity: 1
                                    }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                    className="flex flex-col md:flex-row h-full overflow-hidden shrink-0"
                                >
                                    <aside
                                        className="overflow-y-auto md:overflow-hidden shrink-0 w-full max-h-[60vh] md:max-h-none pr-0 md:pr-4"
                                        style={{ width: isMobile ? "100%" : `${sidebarWidth}px` }}
                                    >
                                        <ProblemList
                                            onSelect={handleSelect}
                                            selectedId={selectedProblemId}
                                            setIsSidebarOpen={setIsSidebarOpen}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                        />
                                    </aside>

                                    {/* Draggable Divider - Sidebar */}
                                    <div
                                        onMouseDown={handleMouseDownSidebar}
                                        className="hidden md:block w-1.5 bg-transparent hover:bg-indigo-500/30 cursor-col-resize mx-0.5 ml-2 transition-colors duration-200 self-stretch rounded-full"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            layout
                            ref={mainContentRef}
                            data-content-area
                            className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col lg:flex-row gap-4"
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        >


                            {/* Problem Selector and Viewer */}
                            <div
                                className={`flex-1 min-h-100 md:min-h-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col ${isMobile && mobileTab !== "problem" ? "hidden" : "flex"
                                    }`}
                                style={{ flex: isMobile ? "none" : mainContentWidth, width: isMobile ? "100%" : "auto", height: isMobile ? "100%" : "auto" }}
                            >
                                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                        Problem
                                    </h2>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 pb-28 flex flex-col">
                                    <div className="mt-8 flex-1 flex flex-col">
                                        <ProblemViewer problem={problem} />
                                    </div>
                                </div>
                            </div>

                            {/* Draggable Divider - Vertical */}
                            <div
                                onMouseDown={handleMouseDownMain}
                                className="hidden lg:block w-1.5 bg-transparent hover:bg-indigo-500/30 cursor-col-resize mx-0.5 transition-colors duration-200 self-stretch rounded-full"
                            />

                            <div
                                className={`flex-1 min-h-100 md:min-h-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl flex flex-col overflow-hidden ${isMobile && mobileTab === "problem" ? "hidden" : "flex"
                                    }`}
                                style={{ flex: isMobile ? "none" : 100 - mainContentWidth, width: isMobile ? "100%" : "auto", height: isMobile ? "100%" : "auto" }}
                            >
                                {/* Tabs Header - Desktop only or Submissions specific for mobile */}
                                <div className={`flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${isMobile ? "hidden" : "flex"}`}>
                                    <button
                                        onClick={() => setActiveTab("editor")}
                                        className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === "editor"
                                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800"
                                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        Code Editor
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("submissions")}
                                        className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === "submissions"
                                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800"
                                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        Past Submissions
                                    </button>
                                </div>

                                <div className="flex-1 min-h-0 p-4 pb-28 md:pb-4 flex flex-col gap-4">
                                    {/* Editor and Result Area - Kept mounted to avoid state loss and 'Canceled' errors */}
                                    <div className={`flex-1 min-h-0 flex flex-col gap-4 ${(activeTab === "editor" && !isMobile) || (isMobile && mobileTab === "code") ? "flex" : "hidden"}`}>
                                        <div className={`${isMobile ? "h-87.5" : "flex-1"} min-h-0 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner`}>
                                            <CodeEditor
                                                code={code}
                                                setCode={setCode}
                                                isDisabled={
                                                    !selectedProblemId || isSubmitting
                                                }
                                                isDark={isDark}
                                            />
                                        </div>
                                        <div className="flex-none min-h-16.25 max-h-45 flex flex-col md:flex-row w-full justify-between items-stretch gap-4 shrink-0">

                                            <div className="flex flex-row md:flex-col w-full md:w-1/4 gap-2">
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={
                                                        isSubmitting || !selectedProblemId
                                                    }
                                                    className={`px-6 py-1.5 rounded-xl font-semibold flex-1 flex justify-center items-center transition-all duration-300 shadow-md hover:shadow-lg text-sm
                                                ${isSubmitting
                                                            ? "bg-gray-500 cursor-not-allowed"
                                                            : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                                                        }
                                                text-white`}
                                                >
                                                    {isSubmitting ? "Judging..." : "Submit"}
                                                </button>
                                                <button
                                                    onClick={handleTest}
                                                    disabled={
                                                        isSubmitting || !selectedProblemId
                                                    }
                                                    className={`px-6 py-1.5 rounded-xl font-semibold flex-1 flex justify-center items-center transition-all duration-300 shadow-md hover:shadow-lg text-sm
                                                ${isSubmitting
                                                            ? "bg-gray-500 cursor-not-allowed"
                                                            : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                                                        }
                                                text-white`}
                                                >
                                                    {isSubmitting ? "Testing..." : "Test"}
                                                </button>
                                            </div>
                                            <div className="w-full md:w-3/4 h-full">
                                                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 h-full overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl custom-scrollbar transition-all duration-300">
                                                    <AnimatePresence mode="wait">
                                                        {!result ? (
                                                            <motion.div
                                                                key="empty"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex flex-col items-center justify-center h-full space-y-2"
                                                            >
                                                                <span className="text-2xl animate-bounce [animation-timing-function:cubic-bezier(.3,1.5,.7,1)]">😊</span>
                                                                <p className="text-gray-500 dark:text-gray-400 italic text-center text-sm">
                                                                    Happy coding! Think carefully before submission.
                                                                    <br />
                                                                    <span className="text-amber-400 text-xs mt-1">⚠️ Don&apos;t add Prompts to Input ⚠️</span>
                                                                </p>
                                                            </motion.div>
                                                        ) : result.error ? (
                                                            <motion.div
                                                                key="error"
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="flex items-center gap-2 text-red-400"
                                                            >
                                                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                                <p className="font-medium">{typeof result.error === 'string' ? result.error : JSON.stringify(result.error)}</p>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="result"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="flex flex-col h-full justify-center"
                                                            >
                                                                <div className="text-xl font-bold flex items-center gap-3">
                                                                    Verdict:{" "}
                                                                    <motion.span
                                                                        initial={{ scale: 0.8, filter: "blur(4px)" }}
                                                                        animate={{ scale: 1, filter: "blur(0px)" }}
                                                                        className={`px-3 py-1 rounded-lg text-sm uppercase tracking-wider font-black shadow-sm ${result.final_status === "Accepted"
                                                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                                            }`}
                                                                    >
                                                                        {result.final_status}
                                                                    </motion.span>
                                                                    {result.final_status === "Accepted" ? (
                                                                        <motion.div
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            className="p-0.5 bg-green-500 rounded-full"
                                                                        >
                                                                            <svg
                                                                                className="w-3.5 h-3.5 text-white"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={4}
                                                                                    d="M5 13l4 4L19 7"
                                                                                />
                                                                            </svg>
                                                                        </motion.div>
                                                                    ) : (
                                                                        <motion.div
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            className="p-0.5 bg-red-500 rounded-full"
                                                                        >
                                                                            <svg
                                                                                className="w-3.5 h-3.5 text-white"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={4}
                                                                                    d="M6 18L18 6M6 6l12 12"
                                                                                />
                                                                            </svg>
                                                                        </motion.div>
                                                                    )}
                                                                    <span className="text-gray-400 text-xs font-normal">
                                                                        ({result.total_duration ? result.total_duration.toFixed(1) : 0}s)
                                                                    </span>
                                                                </div>
                                                                <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden border border-gray-700">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(result.summary.passed / result.summary.total) * 100}%` }}
                                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                                        className={`h-full ${result.final_status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}
                                                                    />
                                                                </div>
                                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    Passed {String(result.summary.passed ?? 0)} /{" "}
                                                                    {String(result.summary.total ?? 0)} test cases
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Past Submissions - Kept mounted to avoid state loss */}
                                    <div className={`flex-1 overflow-y-auto ${(!isMobile && activeTab === "submissions") || (isMobile && mobileTab === "submissions") ? "block" : "hidden"}`}>
                                        <PastSubmissions
                                            submissions={pastSubmissions}
                                            onLoadCode={(savedCode) => {
                                                setCode(savedCode);
                                                if (isMobile) {
                                                    setMobileTab("code");
                                                } else {
                                                    setActiveTab("editor");
                                                }
                                            }}
                                            onDelete={handleDeleteSubmission}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {isMobile && (
                        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                            <div className="flex items-center gap-4 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/10 ring-1 ring-black/5">
                                <button
                                    onClick={() => setMobileTab("problem")}
                                    className={`relative px-5 py-2 rounded-full transition-all duration-300 ease-out flex flex-col items-center justify-center gap-0.5 min-w-17.5 ${mobileTab === "problem"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-500/50"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/30 dark:hover:bg-gray-800/30"
                                        }`}
                                >
                                    <FileText className={`w-5 h-5 ${mobileTab === "problem" ? "stroke-[2.5px]" : "stroke-2"}`} />
                                    <span className="text-[10px] font-bold tracking-wide">Problem</span>
                                </button>
                                <button
                                    onClick={() => setMobileTab("code")}
                                    className={`relative px-5 py-2 rounded-full transition-all duration-300 ease-out flex flex-col items-center justify-center gap-0.5 min-w-17.5 ${mobileTab === "code"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-500/50"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/30 dark:hover:bg-gray-800/30"
                                        }`}
                                >
                                    <Code className={`w-5 h-5 ${mobileTab === "code" ? "stroke-[2.5px]" : "stroke-2"}`} />
                                    <span className="text-[10px] font-bold tracking-wide">Code</span>
                                </button>
                                <button
                                    onClick={() => setMobileTab("submissions")}
                                    className={`relative px-5 py-2 rounded-full transition-all duration-300 ease-out flex flex-col items-center justify-center gap-0.5 min-w-17.5 ${mobileTab === "submissions"
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-500/50"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/30 dark:hover:bg-gray-800/30"
                                        }`}
                                >
                                    <History className={`w-5 h-5 ${mobileTab === "submissions" ? "stroke-[2.5px]" : "stroke-2"}`} />
                                    <span className="text-[10px] font-bold tracking-wide">Past</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
