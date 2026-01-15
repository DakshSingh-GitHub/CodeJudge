"use client";

import { useState, useRef, useEffect } from "react";
import { getProblemById, submitCode } from "./lib/api";
import ProblemList from "./components/ProblemList";
import ProblemViewer from "./components/ProblemViewer";
import CodeEditor from "./components/CodeEditor";

const DEFAULT_CODE = "#Write your code here";

export default function Home() {
    const [problem, setProblem] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState<string>("");
    const [code, setCode] = useState(DEFAULT_CODE);
    const [sidebarWidth, setSidebarWidth] = useState(320); // Initial width in pixels
    const [problemViewerWidth, setProblemViewerWidth] = useState(50); // Width as percentage
    const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
    const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

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

    // Handle sidebar horizontal resize
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingSidebar || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newWidth = e.clientX - containerRect.left;

            // Constrain width between 250px and 600px
            if (newWidth >= 250 && newWidth <= 600) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDraggingSidebar(false);
        };

        if (isDraggingSidebar) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDraggingSidebar]);

    // Handle vertical resize between problem viewer and code editor
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingHorizontal || !containerRef.current) return;

            const contentArea = containerRef.current.querySelector(
                "[data-content-area]"
            );
            if (!contentArea) return;

            const contentRect = contentArea.getBoundingClientRect();
            const newWidth =
                ((e.clientX - contentRect.left) / contentRect.width) * 100;

            // Constrain width between 30% and 70%
            if (newWidth >= 30 && newWidth <= 70) {
                setProblemViewerWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDraggingHorizontal(false);
        };

        if (isDraggingHorizontal) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDraggingHorizontal]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
            <main className="flex h-screen flex-col">
                <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 px-6 py-6">
                    <div className="flex items-center justify-center">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">
                                Mini Online Judge
                            </h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Select a problem and start coding!
                            </p>
                        </div>
                    </div>
                </header>

                <div
                    ref={containerRef}
                    className={`flex flex-1 overflow-hidden gap-4 p-4 ${
                        isDraggingSidebar || isDraggingHorizontal
                            ? "select-none"
                            : ""
                    }`}
                >
                    {/* Left Sidebar - Problem List */}
                    {isSidebarOpen && (
                        <>
                            <aside
                                style={{ width: `${sidebarWidth}px` }}
                                className="overflow-hidden flex-shrink-0"
                            >
                                <ProblemList
                                    onSelect={handleSelect}
                                    selectedId={selectedProblemId}
                                />
                            </aside>

                            {/* Draggable Divider - Sidebar */}
                            <div
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setIsDraggingSidebar(true);
                                }}
                                className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-indigo-500 dark:hover:bg-indigo-400 cursor-col-resize transition-colors duration-200 flex-shrink-0 select-none"
                            />
                        </>
                    )}

                    {/* Main Content Area */}
                    <div
                        data-content-area
                        className="flex-1 overflow-hidden flex flex-row gap-4"
                    >
                        {/* Problem Selector and Viewer */}
                        <div
                            style={{ flex: `1 1 ${problemViewerWidth}%` }}
                            className="min-h-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                    Problem
                                </h2>
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
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="mt-8">
                                    <ProblemViewer problem={problem} />
                                </div>
                            </div>
                        </div>

                        {/* Draggable Divider - Vertical */}
                        <div
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setIsDraggingHorizontal(true);
                            }}
                            className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-indigo-500 dark:hover:bg-indigo-400 cursor-col-resize transition-colors duration-200 flex-shrink-0 select-none"
                        />

                        {/* Code Editor */}
                        <div
                            style={{ flex: `1 1 ${100 - problemViewerWidth}%` }}
                            className="min-h-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 overflow-hidden"
                        >
                            <div className="h-[84%] w-full">
                                <CodeEditor
                                    code={code}
                                    setCode={setCode}
                                    isDisabled={
                                        !selectedProblemId || isSubmitting
                                    }
                                />
                            </div>
                            <div className="flex flex-row w-full justify-between items-stretch px-2 gap-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        isSubmitting || !selectedProblemId
                                    }
                                    className={`mt-4 px-6 py-2 rounded-lg font-semibold w-1/4 justify-center items-center transition
                                    ${
                                        isSubmitting
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700"
                                    }
                                    text-white`}
                                >
                                    {isSubmitting ? "Judging..." : "Submit"}
                                </button>
                                <div className="w-3/4">
                                    <div className="mt-4 p-4 rounded-lg bg-gray-900 text-gray-100">
                                        {!result ? (
                                            <p className="text-gray-400 italic text-center">
                                                😊 Happy coding! Think
                                                carefully, see results after
                                                submission. ⚠️Don't add Prompts to Input⚠️
                                            </p>
                                        ) : result.error ? (
                                            <p className="text-red-400">
                                                ❌ {result.error}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-lg font-semibold">
                                                    Verdict:{" "}
                                                    {result.final_status}
                                                </p>
                                                <p className="text-sm mt-1">
                                                    Passed{" "}
                                                    {result.summary.passed} /{" "}
                                                    {result.summary.total} tests
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
