"use client";

import { useState } from "react";
import { getProblemById } from "./lib/api";
import ProblemSelector from "./components/ProblemSelector";
import ProblemViewer from "./components/ProblemViewer";
import CodeEditor from "./components/CodeEditor";

const DEFAULT_CODE = "#Write your code here"

export default function Home() {
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState(DEFAULT_CODE);

    async function handleSelect(id: string) {
        if (!id) {
            setProblem(null);
            return;
        }
        const data = await getProblemById(id);
        setProblem(data);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Mini Online Judge
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                        Select a problem and start coding!
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                            <ProblemSelector onSelect={handleSelect} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 min-h-[400px]">
                            <ProblemViewer problem={problem} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3">
                        <CodeEditor code={code} setCode={setCode} isDisabled={problem === null} />
                    </div>
                </div>
            </main>
        </div>
    );
}
