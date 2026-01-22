"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProblemById, submitCode } from "./lib/api";
import ProblemList from "./components/ProblemList";
import ProblemViewer from "./components/ProblemViewer";
import CodeEditor from "./components/CodeEditor";
import ThemeToggle from "./components/ThemeToggle";
import PastSubmissions from "./components/PastSubmissions";
import { saveSubmission, getSubmissionsByProblemId, Submission } from "./lib/storage";
import { Problem } from "./lib/types";

const DEFAULT_CODE = "#Write your code here";
const TITLE = "Code Judge";

export default function Home() {
	// State Variable Declarations
    const [problem, setProblem] = useState<Problem | null>(null);
    const [selectedProblemId, setSelectedProblemId] = useState<string>("");
    const [code, setCode] = useState(DEFAULT_CODE);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"editor" | "submissions">("editor");
    const [pastSubmissions, setPastSubmissions] = useState<Submission[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDark, setIsDark] = useState(false);

    const [isMobile, setIsMobile] = useState(false);
    const [mobileTab, setMobileTab] = useState<"problem" | "code" | "submissions">("problem");
    const [isMounted, setIsMounted] = useState(false);

    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [mainContentWidth, setMainContentWidth] = useState(50); // percentage
    const isResizingSidebar = useRef(false);
    const isResizingMain = useRef(false);

    useEffect(() => {
        // Check initial theme preference
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            setIsDark(true);
        }
    };

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
    }, [isMobile, isMounted]);

    const handleMouseDownSidebar = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizingSidebar.current = true;
        document.body.style.cursor = "col-resize";
    };

    const handleMouseDownMain = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizingMain.current = true;
        document.body.style.cursor = "col-resize";
    };

    async function handleSelect(id: string) {
        setSelectedProblemId(id);
        setSearchQuery("");
        if (!id) {
            setProblem(null);
            setPastSubmissions([]);
            return;
        }
        const data = await getProblemById(id);
        setProblem(data);
        setCode(DEFAULT_CODE);
        setResult(null);
        setPastSubmissions(getSubmissionsByProblemId(id));
    }

    async function handleSubmit() {
        if (!selectedProblemId || !problem) return;

        setIsSubmitting(true);
        setResult(null);

        try {
            const data = await submitCode(selectedProblemId, code);
            setResult(data);

            const newSubmission = saveSubmission({
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
        } catch (error: any) {
            if (error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('cancel'))) {
                console.warn('Submission request was canceled.');
                return; // Do not show an error for cancellations
            }
            setResult({ error: error.message || "Something went wrong" });
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
            <main className="flex h-screen flex-col">
                {!isMounted ? (
                    <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
                        <div className="text-xl font-bold animate-pulse text-indigo-600">Loading {TITLE}...</div>
                    </div>
                ) : (
                    <>
                        <motion.header
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6 md:py-6 transition-colors duration-500"
                        >
                            <div className="flex items-center justify-between">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
                                        {TITLE}
                                    </h1>
                                    <p className="hidden md:block mt-2 text-gray-500 dark:text-gray-400">
                                        Select a problem and start coding!
                                    </p>
                                </motion.div>
                                <div className="flex items-center gap-2 md:gap-4">
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

                        <div
                            ref={containerRef}
                            className={`flex flex-col md:flex-row flex-1 overflow-hidden gap-4 p-4`}
                        >
                            {/* Left Sidebar - Problem List */}
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.div
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -100, opacity: 0 }}
                                        className="flex flex-col md:flex-row h-full"
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
                                            className="hidden md:block w-1.5 bg-transparent hover:bg-indigo-500/30 cursor-col-resize mx-0.5 transition-colors duration-200 self-stretch rounded-full"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Main Content Area */}
                            <div
                                ref={mainContentRef}
                                data-content-area
                                className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col lg:flex-row gap-4"
                            >
                                {/* Mobile Tabs */}
                                {isMobile && (
                                    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl overflow-hidden shrink-0">
                                        <button
                                            onClick={() => setMobileTab("problem")}
                                            className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${mobileTab === "problem"
                                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-gray-50 dark:bg-gray-700/50"
                                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                }`}
                                        >
                                            Problem
                                        </button>
                                        <button
                                            onClick={() => setMobileTab("code")}
                                            className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${mobileTab === "code"
                                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-gray-50 dark:bg-gray-700/50"
                                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                }`}
                                        >
                                            Code
                                        </button>
                                        <button
                                            onClick={() => setMobileTab("submissions")}
                                            className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${mobileTab === "submissions"
                                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-gray-50 dark:bg-gray-700/50"
                                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                }`}
                                        >
                                            Past
                                        </button>
                                    </div>
                                )}

                                {/* Problem Selector and Viewer */}
                                <div
                                    className={`flex-1 min-h-100 md:min-h-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col ${isMobile && mobileTab !== "problem" ? "hidden" : "flex"
                                        }`}
                                    style={{ flex: isMobile ? "none" : mainContentWidth, width: isMobile ? "100%" : "auto", height: isMobile ? "80%" : "auto" }}
                                >
                                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                            Problem
                                        </h2>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 flex flex-col">
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
                                    style={{ flex: isMobile ? "none" : 100 - mainContentWidth, width: isMobile ? "100%" : "auto", height: isMobile ? "80%" : "auto" }}
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

                                    <div className="flex-1 min-h-0 p-4 flex flex-col gap-4">
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
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={
                                                        isSubmitting || !selectedProblemId
                                                    }
                                                    className={`px-6 py-1.5 rounded-xl font-semibold w-full md:w-1/4 flex justify-center items-center transition-all duration-300 shadow-md hover:shadow-lg text-sm
                                            ${isSubmitting
                                                            ? "bg-gray-500 cursor-not-allowed"
                                                            : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                                                        }
                                            text-white`}
                                                >
                                                    {isSubmitting ? "Judging..." : "Submit"}
                                                </button>
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
                                                                        <span className="text-amber-400 text-xs mt-1">⚠️ Don't add Prompts to Input ⚠️</span>
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
                                                                    <p className="font-medium">{result.error}</p>
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
                                                                        <span
                                                                            className={`px-3 py-1 rounded-lg text-sm uppercase tracking-wider ${result.final_status === "Accepted"
                                                                                ? "bg-green-500/20 text-green-400"
                                                                                : "bg-red-500/20 text-red-400"
                                                                                }`}
                                                                        >
                                                                            {result.final_status}
                                                                        </span>
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
                                                                    <p className="text-sm mt-2 text-gray-300 font-medium">
                                                                        Passed {result.summary.passed} /{" "}
                                                                        {result.summary.total} test cases
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
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
