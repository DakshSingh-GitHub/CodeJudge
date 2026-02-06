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
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        },
                        exit: { opacity: 0 }
                    }}
                    className="space-y-6"
                >
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-50 dark:to-gray-400"
                    >
                        {typeof problem.title === 'string' ? problem.title : JSON.stringify(problem.title || "Untitled")}
                    </motion.h2>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    >
                        {typeof problem.description === 'string' ? problem.description : JSON.stringify(problem.description)}
                    </motion.div>

                    {problem.input_format && (
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="space-y-2 group"
                        >
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50 group-hover:text-indigo-500 transition-colors">
                                Input Format
                            </h4>
                            <div className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-transparent hover:border-indigo-500/30 transition-all whitespace-pre-wrap">
                                {typeof problem.input_format === 'string' ? problem.input_format : JSON.stringify(problem.input_format)}
                            </div>
                        </motion.div>
                    )}

                    {problem.output_format && (
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="space-y-2 group"
                        >
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50 group-hover:text-indigo-500 transition-colors">
                                Output Format
                            </h4>
                            <div className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-transparent hover:border-indigo-500/30 transition-all whitespace-pre-wrap">
                                {typeof problem.output_format === 'string' ? problem.output_format : JSON.stringify(problem.output_format)}
                            </div>
                        </motion.div>
                    )}

                    {problem.sample_test_cases && problem.sample_test_cases.length > 0 && (
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="space-y-2"
                        >
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                Example
                            </h4>
                            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm text-gray-800 dark:text-gray-200 overflow-x-auto font-mono border border-gray-200 dark:border-gray-700 shadow-inner">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold mb-1 text-indigo-600 dark:text-indigo-400 uppercase text-xs tracking-wider">Input:</p>
                                        <pre className="whitespace-pre-wrap">{typeof problem.sample_test_cases[0].input === 'string' ? problem.sample_test_cases[0].input : JSON.stringify(problem.sample_test_cases[0].input || '')}</pre>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold mb-1 text-emerald-600 dark:text-emerald-400 uppercase text-xs tracking-wider">Output:</p>
                                        <pre className="whitespace-pre-wrap">{typeof problem.sample_test_cases[0].output === 'string' ? problem.sample_test_cases[0].output : JSON.stringify(problem.sample_test_cases[0].output || '')}</pre>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {problem.constraints && (
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="space-y-2"
                        >
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                Constraints
                            </h4>
                            <pre className="mt-1 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm text-gray-800 dark:text-gray-200 overflow-x-auto border border-gray-200 dark:border-gray-700">
                                <code className="font-mono whitespace-pre-wrap">
                                    {problem.constraints && typeof problem.constraints === 'object' ? (
                                        Object.entries(problem.constraints)
                                            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
                                            .join('\n')
                                    ) : (
                                        typeof problem.constraints === 'string' ? problem.constraints : JSON.stringify(problem.constraints || '')
                                    )}
                                </code>
                            </pre>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
