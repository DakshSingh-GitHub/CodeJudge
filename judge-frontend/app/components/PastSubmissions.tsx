"use client";

import { Submission } from "../lib/storage";

interface PastSubmissionsProps {
    submissions: Submission[];
    onLoadCode: (code: string) => void;
}

export default function PastSubmissions({ submissions, onLoadCode }: PastSubmissionsProps) {
    if (submissions.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4 py-12">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No Submissions Yet</h3>
                    <p className="mt-2 max-w-xs">You haven't submitted anything for this problem yet. Give it a try!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {submissions.map((sub) => (
                <div
                    key={sub.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${sub.final_status === "Accepted"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                {sub.final_status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(sub.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={() => onLoadCode(sub.code)}
                            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                        >
                            Refill Code
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span className="text-gray-600 dark:text-gray-300">
                                    Passed: {sub.summary.passed}/{sub.summary.total}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span className="text-gray-600 dark:text-gray-300">
                                    Time: {sub.total_duration.toFixed(2)}s
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                        <div
                            className={`h-full ${sub.final_status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}
                            style={{ width: `${(sub.summary.passed / sub.summary.total) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
