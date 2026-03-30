"use client";

import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { anime } from '../lib/anime';
import { Zap, Shield, BarChart, BrainCircuit, TriangleAlert, Sparkles, Lock, User, KeyRound, ChevronDown, Code2, Loader2, X, History, Terminal, Cpu } from 'lucide-react';
import CodeEditor from '../../components/Editor/CodeEditor';
import { useAppContext } from '../lib/context';

const DEFAULT_CODE = `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

# Example:
# print(factorial(5))
`;

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface AnalysisFinding {
    title: string;
    detail: string;
    severity: Severity;
    location?: string;
    suggestion?: string;
}

interface AnalysisResult {
    summary: string;
    complexity: {
        time: string;
        space: string;
        explanation: string;
    };
    staticAnalysis: {
        overview: string;
        findings: AnalysisFinding[];
    };
    security: {
        overview: string;
        findings: AnalysisFinding[];
    };
    suggestions: string[];
}

interface AnalysisRecord {
    id: string;
    createdAt: string;
    code: string;
    result: AnalysisResult;
}

const ANALYSIS_RECORDS_KEY = "code-analysis-records-v1";
const MAX_ANALYSIS_RECORDS = 25;
const RECORDS_MODAL_ANIMATION_MS = 220;

export default function CodeAnalysisPage() {
    const { isDark, reduceMotion, TITLE, useNewUi } = useAppContext();
    const pathname = usePathname();
    const router = useRouter();
    const [code, setCode] = useState(DEFAULT_CODE);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [records, setRecords] = useState<AnalysisRecord[]>([]);
    const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
    const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
    const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
    const recordsModalCloseTimerRef = useRef<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileTab, setMobileTab] = useState<"code" | "analysis">("code");
    const [mobileSwipeDirection, setMobileSwipeDirection] = useState<"left" | "right" | null>(null);
    const codePanelRef = useRef<HTMLDivElement>(null);
    const analysisPanelRef = useRef<HTMLDivElement>(null);

    const loaderTitleRef = useRef<HTMLDivElement>(null);
    const loaderBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!useNewUi && pathname === "/code-analysis-mde") {
            router.replace("/code-analysis");
        }
    }, [pathname, router, useNewUi]);

    useEffect(() => {
        setIsMounted(true);
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason as { msg?: string; message?: string; type?: string } | undefined;
            const type = (reason?.type || "").toLowerCase();
            const msg = (reason?.msg || reason?.message || "").toLowerCase();
            if (type.includes("cancel") || msg.includes("manually canceled")) {
                event.preventDefault();
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);
        return () => {
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    useEffect(() => {
        if (!isMounted && loaderTitleRef.current && loaderBarRef.current) {
            anime({
                targets: loaderTitleRef.current,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 500,
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutQuad'
            });

            anime({
                targets: loaderBarRef.current,
                translateX: ['-100%', '100%'],
                duration: 1500,
                loop: true,
                easing: 'linear'
            });
        }
    }, [isMounted]);

    useEffect(() => {
        const unlocked = sessionStorage.getItem("code-analysis-unlocked") === "1";
        if (unlocked) {
            setIsAuthorized(true);
        }

        const stored = localStorage.getItem(ANALYSIS_RECORDS_KEY);
        const parsed = parseStoredRecords(stored);
        setRecords(parsed);

        const seededCode = sessionStorage.getItem("code-analysis-code");
        if (seededCode && seededCode.trim().length > 0) {
            setCode(seededCode);
            sessionStorage.removeItem("code-analysis-code");
        }

        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1023px)");
        const updateIsMobile = () => {
            setIsMobile(mediaQuery.matches);
            if (!mediaQuery.matches) {
                setMobileTab("code");
            }
        };

        updateIsMobile();
        mediaQuery.addEventListener("change", updateIsMobile);
        return () => {
            mediaQuery.removeEventListener("change", updateIsMobile);
        };
    }, []);

    useEffect(() => {
        if (!isMobile || reduceMotion || !mobileSwipeDirection) {
            return;
        }

        const target = mobileTab === "code" ? codePanelRef.current : analysisPanelRef.current;
        if (!target) {
            return;
        }

        const fromX = mobileSwipeDirection === "left" ? 36 : -36;
        target.animate(
            [
                { transform: `translateX(${fromX}px)`, opacity: 0.85 },
                { transform: "translateX(0px)", opacity: 1 }
            ],
            {
                duration: 280,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)"
            }
        );
    }, [mobileTab, isMobile, reduceMotion, mobileSwipeDirection]);

    const handleMobileTabChange = (nextTab: "code" | "analysis") => {
        if (nextTab === mobileTab) {
            return;
        }
        setMobileSwipeDirection(nextTab === "analysis" ? "left" : "right");
        setMobileTab(nextTab);
    };

    const openRecordsModal = () => {
        if (recordsModalCloseTimerRef.current) {
            window.clearTimeout(recordsModalCloseTimerRef.current);
            recordsModalCloseTimerRef.current = null;
        }
        setIsRecordsModalOpen(true);
        requestAnimationFrame(() => {
            setIsRecordsModalVisible(true);
        });
    };

    const closeRecordsModal = () => {
        setIsRecordsModalVisible(false);
        if (recordsModalCloseTimerRef.current) {
            window.clearTimeout(recordsModalCloseTimerRef.current);
        }
        recordsModalCloseTimerRef.current = window.setTimeout(() => {
            setIsRecordsModalOpen(false);
            setExpandedRecordId(null);
            recordsModalCloseTimerRef.current = null;
        }, RECORDS_MODAL_ANIMATION_MS);
    };

    useEffect(() => {
        return () => {
            if (recordsModalCloseTimerRef.current) {
                window.clearTimeout(recordsModalCloseTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleOpenRecords = () => openRecordsModal();
        window.addEventListener("open-code-analysis-records", handleOpenRecords);
        return () => {
            window.removeEventListener("open-code-analysis-records", handleOpenRecords);
        };
    }, []);

    useEffect(() => {
        if (!isRecordsModalOpen) {
            return;
        }
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeRecordsModal();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isRecordsModalOpen]);

    const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAuthError(null);
        setIsAuthenticating(true);

        try {
            const response = await fetch("/api/code-analysis/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || "Access denied.");
            }

            sessionStorage.setItem("code-analysis-unlocked", "1");
            setIsAuthorized(true);
            setPassword("");
        } catch (err) {
            setAuthError(err instanceof Error ? err.message : "Authentication failed.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleAnalyze = async () => {
        setError(null);
        setAnalysisResult(null);
        setIsLoading(true);
        if (isMobile) {
            handleMobileTabChange("analysis");
        }
        try {
            const response = await fetch("/api/code-analysis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code })
            });

            const payload = await response.json();

            if (!response.ok || !payload?.ok || !payload?.analysis) {
                throw new Error(payload?.error || "Analysis failed.");
            }

            const nextResult = payload.analysis as AnalysisResult;
            setAnalysisResult(nextResult);
            setRecords((prev) => {
                const nextRecords = [
                    {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        createdAt: new Date().toISOString(),
                        code,
                        result: nextResult
                    },
                    ...prev
                ].slice(0, MAX_ANALYSIS_RECORDS);

                localStorage.setItem(ANALYSIS_RECORDS_KEY, JSON.stringify(nextRecords));
                return nextRecords;
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Analysis failed.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isHydrated) {
        return (
            <div className="flex-1 flex flex-col min-h-0 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] dark:bg-[#07111d]" />
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex-1 flex flex-col min-h-0 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] dark:bg-[#07111d] text-slate-100 relative overflow-hidden font-sans selection:bg-slate-300/30">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(51,65,85,0.32),transparent_38%),linear-gradient(135deg,rgba(2,6,23,0.18),transparent_35%,rgba(15,23,42,0.3)_100%)]" />
                <div className="pointer-events-none absolute left-[-8%] top-[12%] h-72 w-72 rounded-full bg-indigo-900/20 blur-[130px]" />
                <div className="pointer-events-none absolute bottom-[-6%] right-[-5%] h-80 w-80 rounded-full bg-purple-900/20 blur-[150px]" />

                <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-[2.5rem] border border-slate-700/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.97),rgba(10,15,26,0.95))] backdrop-blur-2xl shadow-[0_18px_48px_rgba(2,6,23,0.35)] p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                <Lock className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-white">Secure Access</h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized Personnel Only</p>
                            </div>
                        </div>

                        <form onSubmit={handleUnlock} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative group">
                                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="username"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-700/50 bg-slate-900/50 text-white placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                                        placeholder="Enter your handle"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Key</label>
                                <div className="relative group">
                                    <KeyRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-700/50 bg-slate-900/50 text-white placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {authError && (
                                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
                                    <TriangleAlert className="w-4 h-4 text-rose-400 shrink-0" />
                                    <p className="text-xs font-bold text-rose-400 uppercase tracking-tight">{authError}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isAuthenticating}
                                className="w-full py-4 rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_12px_24px_rgba(79,70,229,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isAuthenticating ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Authenticating</span>
                                    </div>
                                ) : "Unlock Analysis"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] dark:bg-[#07111d] text-slate-100 relative overflow-hidden font-sans selection:bg-slate-300/30">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(51,65,85,0.32),transparent_38%),linear-gradient(135deg,rgba(2,6,23,0.18),transparent_35%,rgba(15,23,42,0.3)_100%)]" />
            <div className="pointer-events-none absolute left-[-8%] top-[12%] h-72 w-72 rounded-full bg-indigo-900/20 blur-[130px]" />
            <div className="pointer-events-none absolute bottom-[-6%] right-[-5%] h-80 w-80 rounded-full bg-purple-900/20 blur-[150px]" />
            <div className="pointer-events-none absolute left-[35%] top-[22%] h-56 w-56 rounded-full bg-slate-700/10 blur-[140px]" />

            {!isMounted ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/70 dark:bg-[#07111d] z-50">
                    <div
                        ref={loaderTitleRef}
                        className="text-2xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-300 to-slate-500"
                    >
                        {typeof TITLE === 'string' ? TITLE : "Code Judge"} Analysis
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full mt-4 overflow-hidden w-48">
                        <div ref={loaderBarRef} className="w-full h-full bg-white/30" />
                    </div>
                </div>
            ) : (
                <>
                    <div className={`relative z-10 flex-1 flex flex-col p-4 md:p-6 lg:p-8 xl:p-10 ${isMobile && mobileTab === "analysis" ? "pb-20" : "pb-20"} md:pb-20 lg:pb-8 xl:pb-10 w-full min-h-0 h-full overflow-hidden`}>
                        <div className="lg:hidden flex flex-col gap-1 px-2 mb-4 shrink-0">
                            <h1 className="text-2xl font-black tracking-tighter leading-none text-white">
                                Code <span className="text-indigo-400">Analysis</span>
                            </h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">AI-Powered Insights</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0">
                            {/* Code Editor Panel */}
                            <div
                                ref={codePanelRef}
                                className={`h-full min-h-0 flex-col rounded-[2.5rem] border border-slate-700/70 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(24,33,50,0.9))] backdrop-blur-2xl shadow-[0_18px_48px_rgba(2,6,23,0.32)] overflow-hidden ${isMobile && mobileTab !== "code" ? "hidden" : "flex"}`}
                            >
                                <div className="px-6 py-4 border-b border-slate-700/70 flex items-center justify-between bg-slate-900/40">
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                        </div>
                                        <div className="h-4 w-px bg-slate-700/70" />
                                        <div className="flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-indigo-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Source Analysis</span>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-2">
                                        <div className="p-1 px-2 rounded-md bg-indigo-500/10 text-[10px] font-black text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">PRO</div>
                                        <span className="text-xs font-bold text-slate-300 tracking-tight">AI Inspector</span>
                                    </div>
                                </div>

                                <div className="flex-1 relative min-h-0">
                                    <CodeEditor
                                        code={code}
                                        setCode={setCode}
                                        isDisabled={isLoading}
                                        isDark={isDark}
                                    />
                                </div>

                                <div className="p-6 border-t border-slate-700/70 bg-slate-900/40">
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isLoading}
                                        className={`w-full group relative py-4 rounded-[1.25rem] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden active:scale-[0.98] ${isLoading
                                            ? "bg-slate-800 text-slate-500"
                                            : "bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white hover:brightness-110"
                                            }`}
                                    >
                                        <div className="relative z-10 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.25em]">
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Inspecting Code...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                                                    <span>Analyze with AI</span>
                                                </>
                                            )}
                                        </div>
                                        {!isLoading && (
                                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Analysis Results Panel */}
                            <div
                                ref={analysisPanelRef}
                                className={`h-full min-h-0 flex-col rounded-[2.5rem] border border-slate-700/70 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(24,33,50,0.9))] backdrop-blur-2xl shadow-[0_18px_48px_rgba(2,6,23,0.32)] overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10 ${isMobile && mobileTab !== "analysis" ? "hidden" : "flex"}`}
                            >
                                <div className="px-6 py-4 border-b border-slate-700/70 flex items-center justify-between bg-slate-900/40">
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Intelligence Sink</h2>
                                    </div>
                                    <div className="flex items-center gap-2 font-mono text-[10px] opacity-50">
                                        <span className="text-emerald-500">➜</span>
                                        <span className="text-slate-400 uppercase">Analysis Ready</span>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 lg:p-8 relative flex flex-col min-h-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.05),transparent_70%)] overflow-y-auto custom-scrollbar">
                                    {isLoading ? (
                                        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                                            <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
                                            <div className="text-center space-y-2">
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Deep Inspection</p>
                                                <p className="text-xs text-slate-500 font-medium tracking-tight">AI is identifying patterns and complexities...</p>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                                                <TriangleAlert className="w-8 h-8 text-rose-400" />
                                            </div>
                                            <h3 className="text-xl font-black text-white mb-2">Analysis Failed</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{error}</p>
                                            <button onClick={handleAnalyze} className="mt-6 px-6 py-2 rounded-full border border-slate-700 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Retry Analysis</button>
                                        </div>
                                    ) : analysisResult ? (
                                        <div className="space-y-8 pb-4">
                                            <div className="relative p-6 rounded-[1.75rem] border border-indigo-500/20 bg-indigo-500/5 shadow-[inset_0_0_30px_rgba(99,102,241,0.05)]">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Summary Overview</p>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed font-medium">{analysisResult.summary}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <BarChart className="w-4 h-4 text-purple-400" />
                                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Computational Complexity</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <MetricPill label="Time" value={analysisResult.complexity.time} />
                                                    <MetricPill label="Space" value={analysisResult.complexity.space} />
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed font-medium bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
                                                    {analysisResult.complexity.explanation}
                                                </p>
                                            </div>

                                            <AnalysisSection
                                                icon={Zap}
                                                title="Static Analysis"
                                                overview={analysisResult.staticAnalysis.overview}
                                                findings={analysisResult.staticAnalysis.findings}
                                                color="cyan"
                                            />

                                            <AnalysisSection
                                                icon={Shield}
                                                title="Security Audit"
                                                overview={analysisResult.security.overview}
                                                findings={analysisResult.security.findings}
                                                color="rose"
                                            />

                                            <div className="p-6 rounded-[1.75rem] border border-emerald-500/20 bg-emerald-500/5">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                                    <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Improvement Roadmap</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {analysisResult.suggestions.map((suggestion, idx) => (
                                                        <div key={idx} className="flex gap-3 text-sm text-slate-300 font-medium">
                                                            <span className="flex-none w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] border border-emerald-500/20">{idx + 1}</span>
                                                            <p className="leading-relaxed">{suggestion}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
                                                <Terminal className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Awaiting Stream</p>
                                            <p className="text-xs text-slate-600 max-w-[180px]">AI insights will materialize once you start analysis.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="px-6 py-4 border-t border-slate-700/70 flex items-center justify-between bg-slate-900/40 shrink-0">
                                    <div className="flex items-center gap-2 font-mono text-[10px] opacity-50">
                                        <Cpu className="w-3 h-3" />
                                        <span className="text-slate-400 uppercase tracking-widest">Neural Runtime V4</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">UTF-8</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isMobile && (
                        <div className="fixed bottom-6 left-1/2 z-50 transition-all duration-300 ease-out translate-x-[-50%]">
                            <div className="flex items-center gap-2 p-1.5 rounded-full bg-[linear-gradient(135deg,rgba(8,12,20,0.98),rgba(15,23,42,0.92))] backdrop-blur-3xl border border-slate-700/70 shadow-[0_18px_42px_rgba(2,6,23,0.35)]">
                                <button
                                    onClick={() => handleMobileTabChange("code")}
                                    className={`relative px-4 py-2 rounded-full transition-all duration-300 ease-out flex flex-col items-center justify-center gap-0.5 min-w-16 ${mobileTab === "code"
                                        ? "bg-slate-800/70 text-white"
                                        : "text-slate-400 hover:bg-slate-800/60"
                                        }`}
                                >
                                    <Code2 className={`w-5 h-5 ${mobileTab === "code" ? "stroke-[2.5px]" : "stroke-2"}`} />
                                    <span className="text-[10px] font-bold tracking-wide">Code</span>
                                </button>
                                <button
                                    onClick={() => handleMobileTabChange("analysis")}
                                    className={`relative px-4 py-2 rounded-full transition-all duration-300 ease-out flex flex-col items-center justify-center gap-0.5 min-w-16 ${mobileTab === "analysis"
                                        ? "bg-slate-800/70 text-white"
                                        : "text-slate-400 hover:bg-slate-800/60"
                                        }`}
                                >
                                    <BrainCircuit className={`w-5 h-5 ${mobileTab === "analysis" ? "stroke-[2.5px]" : "stroke-2"}`} />
                                    <span className="text-[10px] font-bold tracking-wide">Insights</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {isRecordsModalOpen && (
                        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-10">
                            <button
                                onClick={closeRecordsModal}
                                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isRecordsModalVisible ? "opacity-100" : "opacity-0"}`}
                                aria-label="Close records"
                            />
                            <div
                                className={`relative z-10 w-full max-w-7xl h-full flex flex-col rounded-[2.5rem] border border-slate-700/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(10,15,26,0.96))] backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ${isRecordsModalVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
                            >
                                <div className="px-8 py-6 border-b border-slate-700/70 flex items-center justify-between bg-slate-900/40 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                            <History className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight text-white">Analysis Vault</h3>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Latest {records.length} Cached Inspections</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeRecordsModal}
                                        className="p-2.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 transition-all active:scale-95"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 min-h-0 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar">
                                    {records.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-800/50 bg-slate-900/20 opacity-40">
                                            <History className="w-16 h-16 mb-4 text-slate-600" />
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Archive Empty</p>
                                        </div>
                                    ) : (
                                        records.map((record, index) => (
                                            <article key={record.id} className="group relative rounded-[2rem] border border-slate-700/50 bg-slate-900/40 overflow-hidden hover:border-slate-500/50 transition-all duration-300">
                                                <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/20">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">IDX #{records.length - index}</span>
                                                        <div className="h-3 w-px bg-slate-700" />
                                                        <p className="text-xs font-bold text-slate-400 tracking-tight uppercase">{formatRecordTime(record.createdAt)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setExpandedRecordId((prev) => prev === record.id ? null : record.id)}
                                                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all active:scale-95"
                                                    >
                                                        {expandedRecordId === record.id ? "Hide Details" : "View Details"}
                                                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedRecordId === record.id ? "rotate-180" : ""}`} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-6 p-6">
                                                    <section className="h-fit rounded-2xl border border-slate-700/50 bg-slate-950/50 overflow-hidden shadow-inner">
                                                        <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-900/40">
                                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Analysis Target</p>
                                                        </div>
                                                        <pre className="max-h-[320px] overflow-auto p-5 text-xs leading-relaxed font-mono text-slate-300 whitespace-pre-wrap break-words custom-scrollbar">
                                                            {record.code}
                                                        </pre>
                                                    </section>

                                                    <section className="space-y-4">
                                                        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Inspection Outcome</p>
                                                            </div>
                                                            <p className="text-xs text-slate-300 leading-relaxed font-medium">{record.result.summary}</p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <MetricPill label="Time Complexity" value={record.result.complexity.time} />
                                                            <MetricPill label="Space Complexity" value={record.result.complexity.space} />
                                                        </div>

                                                        {expandedRecordId === record.id && (
                                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                                <AnalysisSection
                                                                    icon={Zap}
                                                                    title="Static Patterns"
                                                                    overview={record.result.staticAnalysis.overview}
                                                                    findings={record.result.staticAnalysis.findings}
                                                                    color="cyan"
                                                                />
                                                                <AnalysisSection
                                                                    icon={Shield}
                                                                    title="Security Integrity"
                                                                    overview={record.result.security.overview}
                                                                    findings={record.result.security.findings}
                                                                    color="rose"
                                                                />
                                                            </div>
                                                        )}
                                                    </section>
                                                </div>
                                            </article>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function parseStoredRecords(raw: string | null): AnalysisRecord[] {
    if (!raw) {
        return [];
    }
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter((item) =>
                item
                && typeof item.id === "string"
                && typeof item.createdAt === "string"
                && typeof item.code === "string"
                && item.result
            )
            .slice(0, MAX_ANALYSIS_RECORDS) as AnalysisRecord[];
    } catch {
        return [];
    }
}

function formatRecordTime(isoString: string): string {
    const parsed = new Date(isoString);
    if (Number.isNaN(parsed.getTime())) {
        return "Unknown date";
    }
    return parsed.toLocaleString();
}


interface MetricPillProps {
    label: string;
    value: string;
}

function MetricPill({ label, value }: MetricPillProps) {
    return (
        <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/40 p-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-base font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
        </div>
    );
}

function severityClasses(severity: Severity) {
    switch (severity) {
        case "critical":
            return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
        case "high":
            return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";
        case "medium":
            return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
        default:
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    }
}

function AnalysisSection({ icon: Icon, title, overview, findings, color }: AnalysisCardProps) {
    const colorClasses = {
        cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
        rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
    };

    return (
        <div className={`p-5 rounded-2xl border ${colorClasses[color]}`}>
            <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[1]}`} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{overview}</p>
            {findings.length > 0 ? (
                <div className="space-y-3">
                    {findings.map((finding, idx) => (
                        <div key={`${finding.title}-${idx}`} className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/40 p-4">
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{finding.title}</p>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase ${severityClasses(finding.severity)}`}>
                                    {finding.severity}
                                </span>
                            </div>
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{finding.detail}</p>
                            {finding.location ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Location: {finding.location}
                                </p>
                            ) : null}
                            {finding.suggestion ? (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    Suggestion: {finding.suggestion}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-base text-gray-600 dark:text-gray-300">No major findings.</p>
            )}
        </div>
    );
}

interface AnalysisCardProps {
    icon: React.ElementType;
    title: string;
    overview: string;
    findings: AnalysisFinding[];
    color: 'cyan' | 'rose';
}
