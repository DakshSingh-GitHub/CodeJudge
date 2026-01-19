"use client";

import { useState, useRef, useEffect } from "react";
import { getProblemById, submitCode } from "./lib/api";
import ProblemList from "./components/ProblemList";
import ProblemViewer from "./components/ProblemViewer";
import CodeEditor from "./components/CodeEditor";
import ThemeToggle from "./components/ThemeToggle";

const DEFAULT_CODE = "#Write your code here";
const TITLE = "Code Judge";

export default function Home() {
    const [problem, setProblem] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState<string>("");
    const [code, setCode] = useState(DEFAULT_CODE);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"editor" | "submissions">("editor");

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSidebarOpen(window.innerWidth >= 768);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    async function handleSubmit() {
        if (!selectedProblemId || !code.trim()) return;
        try {
            setIsSubmitting(true);
            setResult(null);
            const response = await submitCode(selectedProblemId, code);
            setResult(response);
        } catch (error: any) {
            setResult({ error: error.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSelect(id: string) {
        setSelectedProblemId(id);
        if (!id) {
            setProblem(null);
            return;
        }
        const data = await getProblemById(id);
        setProblem(data);
        setCode(DEFAULT_CODE);
        setResult(null);
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
            <main className="flex h-screen flex-col">
                <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 px-6 py-6 transition-colors duration-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">
                                {TITLE}
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Select a problem and start coding!
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
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
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <div
                    ref={containerRef}
                    className={`flex flex-col md:flex-row flex-1 overflow-hidden gap-4 p-4`}
                >
                    {/* Left Sidebar - Problem List */}
                    {isSidebarOpen && (
                        <>
                            <aside
                                className="overflow-hidden flex-shrink-0 w-full md:w-80"
                            >
                                <ProblemList
                                    onSelect={handleSelect}
                                    selectedId={selectedProblemId}
                                />
                            </aside>

                            {/* Draggable Divider - Sidebar */}
                            <div
                                className="hidden md:block w-1 bg-gray-300 dark:bg-gray-600"
                            />
                        </>
                    )}

                    {/* Main Content Area */}
                    <div
                        data-content-area
                        className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4"
                    >
                        {/* Problem Selector and Viewer */}
                        <div
                            className="min-h-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col lg:w-1/2"
                        >
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                    Problem
                                </h2>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="mt-8">
                                    <ProblemViewer problem={problem} />
                                </div>
                            </div>
                        </div>

                        {/* Draggable Divider - Vertical */}
                        <div
                            className="hidden lg:block w-1 bg-gray-300 dark:bg-gray-600"
                        />

                        <div
                            className="min-h-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl flex flex-col overflow-hidden lg:w-1/2"
                        >
                            {/* Tabs Header */}
                            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
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
                                {activeTab === "editor" ? (
                                    <>
                                        <div className="flex-[9] min-h-0 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                                            <CodeEditor
                                                code={code}
                                                setCode={setCode}
                                                isDisabled={
                                                    !selectedProblemId || isSubmitting
                                                }
                                            />
                                        </div>
                                        <div className="flex-1 min-h-[100px] max-h-[250px] flex flex-col md:flex-row w-full justify-between items-stretch gap-4 shrink-0">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={
                                                    isSubmitting || !selectedProblemId
                                                }
                                                className={`px-6 py-2 rounded-xl font-semibold w-full md:w-1/4 flex justify-center items-center transition-all duration-300 shadow-md hover:shadow-lg
                                                ${isSubmitting
                                                        ? "bg-gray-500 cursor-not-allowed"
                                                        : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                                                    }
                                                text-white`}
                                            >
                                                {isSubmitting ? "Judging..." : "Submit"}
                                            </button>
                                            <div className="w-full md:w-3/4 h-full">
                                                <div className="p-5 rounded-xl bg-gray-900 text-gray-100 h-full overflow-y-auto border border-gray-700 shadow-2xl custom-scrollbar transition-all duration-300">
                                                    {!result ? (
                                                        <div className="flex flex-col items-center justify-center h-full space-y-2">
                                                            <span className="text-2xl animate-bounce">😊</span>
                                                            <p className="text-gray-400 italic text-center text-sm">
                                                                Happy coding! Think carefully before submission.
                                                                <br />
                                                                <span className="text-amber-400 text-xs mt-1">⚠️ Don't add Prompts to Input ⚠️</span>
                                                            </p>
                                                        </div>
                                                    ) : result.error ? (
                                                        <div className="flex items-center gap-2 text-red-400">
                                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                            <p className="font-medium">{result.error}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col h-full justify-center">
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
                                                                    <div className="p-1 bg-green-500 rounded-full">
                                                                        <svg
                                                                            className="w-4 h-4 text-white"
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
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-1 bg-red-500 rounded-full">
                                                                        <svg
                                                                            className="w-4 h-4 text-white"
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
                                                                    </div>
                                                                )}
                                                                <span className="text-gray-400 text-sm font-normal">
                                                                    ({result.total_duration ? result.total_duration.toFixed(1) : 0}s)
                                                                </span>
                                                            </div>
                                                            <div className="mt-4 w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ${result.final_status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}
                                                                    style={{ width: `${(result.summary.passed / result.summary.total) * 100}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-sm mt-2 text-gray-300 font-medium">
                                                                Passed {result.summary.passed} /{" "}
                                                                {result.summary.total} test cases
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
                                        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No Submissions Yet</h3>
                                            <p className="mt-2 max-w-xs">Past submissions logic will be implemented here soon. Keep coding!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}