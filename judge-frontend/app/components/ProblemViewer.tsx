import { motion, AnimatePresence } from "framer-motion";
import { Problem } from "../lib/types";

interface ProblemViewerProps {
    problem: Problem | null;
}

export default function ProblemViewer({ problem }: ProblemViewerProps) {
    return (
        <AnimatePresence mode="wait">
            {!problem ? (
                <motion.div
                    key="no-problem"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        No Problem Selected
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Please choose a problem from the dropdown above to see its
                        details.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                        {problem.title}
                    </h2>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {problem.description}
                    </div>

                    {problem.input_format && (
                        <div className="space-y-2">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                Input Format
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                {problem.input_format}
                            </p>
                        </div>
                    )}

                    {problem.output_format && (
                        <div className="space-y-2">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                Output Format
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                                {problem.output_format}
                            </p>
                        </div>
                    )}

                    {problem.sample_test_cases && problem.sample_test_cases.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                Example
                            </h4>
                            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md text-sm text-gray-800 dark:text-gray-200 overflow-x-auto font-mono">
                                <p className="font-bold mb-1 text-gray-700 dark:text-gray-300">Input:</p>
                                <pre className="mb-4 whitespace-pre-wrap">{problem.sample_test_cases[0].input}</pre>
                                <p className="font-bold mb-1 text-gray-700 dark:text-gray-300">Output:</p>
                                <pre className="whitespace-pre-wrap">{problem.sample_test_cases[0].output}</pre>
                            </div>
                        </div>
                    )}

                    {problem.constraints && (
                        <div className="space-y-2">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                Constraints
                            </h4>
                            <pre className="mt-1 p-4 bg-gray-100 dark:bg-gray-900 rounded-md text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                                <code>
                                    {problem.constraints && typeof problem.constraints === 'object' ? (
                                        Object.entries(problem.constraints)
                                            .map(([key, value]) => `${key}: ${String(value)}`)
                                            .join('\n')
                                    ) : (
                                        problem.constraints
                                    )}
                                </code>
                            </pre>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
