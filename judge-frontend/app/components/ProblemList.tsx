"use client";

import { useEffect, useState } from "react";
import { getProblems } from "../lib/api";

interface Problem {
    id: string;
    title: string;
}

interface ProblemListProps {
    onSelect: (id: string) => void;
    selectedId?: string;
}

export default function ProblemList({ onSelect, selectedId }: ProblemListProps) {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getProblems().then((data) => {
            setProblems(data.problems || []);
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    Problems
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                        Loading problems...
                    </div>
                ) : problems.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                        No problems available
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {problems.map((problem) => (
                            <li key={problem.id}>
                                <button
                                    onClick={() => onSelect(problem.id)}
                                    className={`w-full text-left px-4 py-3 transition-colors duration-200 ${
                                        selectedId === problem.id
                                            ? "bg-indigo-50 dark:bg-indigo-900 border-l-4 border-indigo-600 dark:border-indigo-400 text-indigo-900 dark:text-indigo-50 font-medium"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <span className="block truncate">
                                        {problem.title}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
