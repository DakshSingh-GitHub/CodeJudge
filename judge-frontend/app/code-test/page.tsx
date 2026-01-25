"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Code() {
    const [positions, setPositions] = useState<{ top: string; left: string }[]>([]);

    useEffect(() => {
        const newPositions = [...Array(6)].map(() => ({
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
        }));
        setPositions(newPositions);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative min-h-0">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 inline-block"
                >
                    <div className="text-6xl md:text-8xl mb-4">💻</div>
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        Code IDE
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                    A powerful, modern code editor is currently under development.
                </p>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full mb-8 max-w-xs mx-auto overflow-hidden"
                >
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full bg-white/30"
                    />
                </motion.div>

                <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-[0.3em] uppercase mb-12">
                    Coming Soon
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href="/"
                        className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 mx-auto w-fit"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </motion.div>
            </motion.div>

            {/* Subtle Floating Elements */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                    className="absolute text-2xl opacity-10 pointer-events-none hidden md:block"
                    style={positions[i]}
                >
                    {['{ }', '</>', '( )', '//', '=>', '::'][i]}
                </motion.div>
            ))}
        </div>
    );
}