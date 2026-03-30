"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Code, Scale, Zap, Shield, Globe, Cpu, ArrowRight, Github, BookOpen, BrainCircuit, Coffee } from 'lucide-react';
import { useAppContext } from './lib/context';
import Footer from "@/components/General/Footer";

export default function Home() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isDark, codeJudgePath } = useAppContext();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const features = [
        { icon: <Zap className="w-6 h-6" />, title: "Instant Evaluation", description: "Get real-time feedback on your code with our optimized judge engine." },
        { icon: <Shield className="w-6 h-6" />, title: "Secure Sandbox", description: "Your code runs in a isolated, secure environment protecting every execution." },
        { icon: <Globe className="w-6 h-6" />, title: "Global Standards", description: "Practice with problems that mirror top-tier technical interview patterns." },
        { icon: <Cpu className="w-6 h-6" />, title: "Python Optimized", description: "Currently optimized for Python, with seamless execution and instant feedback." }
    ];

    return (
        <div className="relative flex-1 flex flex-col min-h-0 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] dark:bg-[#07111d] text-slate-100 overflow-y-auto overflow-x-hidden font-sans selection:bg-slate-300/30">
            {/* Ambient Background Elements */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(51,65,85,0.22),transparent_48%),linear-gradient(135deg,rgba(2,6,23,0.18),transparent_35%,rgba(15,23,42,0.3)_100%)]" />
            <div className="pointer-events-none absolute left-[-8%] top-[12%] h-72 w-72 rounded-full bg-indigo-900/15 blur-[130px]" />
            <div className="pointer-events-none absolute bottom-[-6%] right-[-5%] h-80 w-80 rounded-full bg-purple-900/15 blur-[150px]" />
            <div className="pointer-events-none absolute left-[35%] top-[22%] h-56 w-56 rounded-full bg-slate-700/10 blur-[140px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                {/* Hero Section */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-24"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Next-Gen Platform</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.95] md:leading-[0.9] text-white"
                    >
                        Master the Art of <br />
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Problem Solving
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        CodeJudge — a fast, secure, and intuitive platform designed for developers to sharpen their skills and ace technical interviews.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <Link
                            href={codeJudgePath}
                            className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/25 hover:bg-indigo-500 transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden w-full sm:w-auto flex justify-center"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Link>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                href="https://github.com/DakshSingh-GitHub/CodeJudge"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/50 backdrop-blur-xl text-white rounded-2xl font-bold text-lg border border-slate-700/50 hover:border-indigo-500 transition-all duration-300 w-full sm:w-auto"
                            >
                                <Github className="w-5 h-5" /> GitHub
                            </Link>
                            <Link
                                href="/docs"
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/50 backdrop-blur-xl text-white rounded-2xl font-bold text-lg border border-slate-700/50 hover:border-indigo-500 transition-all duration-300 w-full sm:w-auto"
                            >
                                <BookOpen className="w-5 h-5" /> Documentation
                            </Link>
                        </div>
                    </motion.div>
                </motion.section>

                {/* Platform Selection */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 gap-8 mb-32"
                >
                    <Link href={codeJudgePath} className="group">
                        <motion.div
                            variants={itemVariants}
                            className="h-full p-8 rounded-[2.5rem] border border-slate-700/50 bg-[linear-gradient(180deg,rgba(17,24,39,0.4),rgba(24,33,50,0.3))] backdrop-blur-2xl hover:border-indigo-500/50 transition-all duration-500 relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-8 text-indigo-900/20 group-hover:text-indigo-400/20 transition-colors duration-500">
                                <Scale className="w-32 h-32 rotate-[-15deg] group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
                                    <Scale className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl md:text-3xl font-black mb-4 text-white">Code Judge</h3>
                                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed mb-8">
                                    Practice with 50+ hand-picked algorithmic problems. Experience instant evaluation with our industrial-grade sandbox runtime.
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-indigo-400 font-bold">
                                    Start Practice <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/code-ide" className="group">
                        <motion.div
                            variants={itemVariants}
                            className="h-full p-8 rounded-[2.5rem] border border-slate-700/50 bg-[linear-gradient(180deg,rgba(17,24,39,0.4),rgba(24,33,50,0.3))] backdrop-blur-2xl hover:border-purple-500/50 transition-all duration-500 relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-8 text-purple-900/20 group-hover:text-purple-400/20 transition-colors duration-500">
                                <Code className="w-32 h-32 rotate-15 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20">
                                    <Code className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl md:text-3xl font-black mb-4 text-white">Code IDE</h3>
                                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed mb-8">
                                    A versatile environment to think, prototype and build. Write code in multiple languages with professional-grade editor features.
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-purple-400 font-bold">
                                    Open IDE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/code-analysis" className="group">
                        <motion.div
                            variants={itemVariants}
                            className="h-full p-8 rounded-[2.5rem] border border-slate-700/50 bg-[linear-gradient(180deg,rgba(17,24,39,0.4),rgba(24,33,50,0.3))] backdrop-blur-2xl hover:border-emerald-500/50 transition-all duration-500 relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-8 text-emerald-900/20 group-hover:text-emerald-400/20 transition-colors duration-500">
                                <BrainCircuit className="w-32 h-32 rotate-15 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/20">
                                    <BrainCircuit className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl md:text-3xl font-black mb-4 text-white">Code Analysis</h3>
                                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed mb-8">
                                    A platform integrated for the users to analyse their code, Learn how good your code is and Improve them !
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-emerald-400 font-bold">
                                    Analyse code <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/meet-developer" className="group">
                        <motion.div
                            variants={itemVariants}
                            className="h-full p-8 rounded-[2.5rem] border border-slate-700/50 bg-[linear-gradient(180deg,rgba(17,24,39,0.4),rgba(24,33,50,0.3))] backdrop-blur-2xl hover:border-amber-500/50 transition-all duration-500 relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-8 text-amber-900/20 group-hover:text-amber-400/20 transition-colors duration-500">
                                <Coffee className="w-32 h-32 rotate-[-15deg] group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-600/20">
                                    <Coffee className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl md:text-3xl font-black mb-4 text-white">Meet Developer</h3>
                                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed mb-8">
                                    Let&apos;s have a cup of coffee together...:)
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-amber-400 font-bold">
                                    Get to know me.. <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </motion.section>

                {/* Features Grid */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight text-white">Built for Performance</h2>
                        <p className="text-sm md:text-base text-slate-400 font-medium">Engineered to provide the best possible coding experience.</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-4xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-700 text-indigo-400">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-white">{feature.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>
            <Footer/>
        </div>
    );
}
