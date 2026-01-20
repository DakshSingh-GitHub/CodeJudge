"use client";

import { useEffect, useState } from "react";
import { getProblems } from "../lib/api";

import { Problem } from "../lib/types";

interface ProblemListProps {
    onSelect: (id: string) => void;
    selectedId?: string;
}

export default function ProblemList({ onSelect, selectedId }: ProblemListProps) {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getProblems().then((data) => {
            setProblems(data.problems || []);
            setIsLoading(false);
        });
    }, []);

    const filteredProblems = problems.filter((problem) =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3">
                    Problems
                </h2>
                <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:text-white dark:placeholder-gray-400"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                        Loading problems...
                    </div>
                ) : filteredProblems.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                        No problems found
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredProblems.map((problem) => (
                            <li key={problem.id}>
                                <button
                                    onClick={() => onSelect(problem.id)}
                                    className={`w-full text-left px-4 py-3 transition-colors duration-200 ${selectedId === problem.id
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
