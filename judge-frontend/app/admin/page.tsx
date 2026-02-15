"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    Search,
    UserCheck,
    Key,
    LayoutDashboard,
    Users,
    BarChart3,
    Plus,
    Shield,
    Trash2,
    X,
    Check,
    ArrowRight,
    Home,
    LogOut,
    ShieldAlert,
    Cpu,
    Globe,
    Zap,
    Activity,
    Settings,
    ShieldCheck,
    Dna,
    AlertCircle,
    FileCode,
    Terminal,
    FolderOpen,
    CircleCheck,
    Eye
} from 'lucide-react';
import { useAppContext } from '../lib/context';
import { getUsers, saveUser, updateUser, deleteUser, setAdminStats, getAdminStats, setSystemConfig, getSystemConfig } from '../lib/storage';
import { getProblems } from '../lib/api';
import { User, Permission, Problem } from '../lib/types';
import Link from 'next/link';

export default function AdminPage() {
    const { isDark } = useAppContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState<'insights' | 'users'>('insights');

    // Dashboard Data
    const [users, setUsers] = useState<User[]>([]);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [systemSettings, setSystemSettings] = useState(getSystemConfig());

    // Modal Control
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isConfirmPermissionModalOpen, setIsConfirmPermissionModalOpen] = useState(false);
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    const [pendingPermissionUser, setPendingPermissionUser] = useState<{ id: string, permissions: Permission[] } | null>(null);
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const cachedStats = getAdminStats();
        if (cachedStats && cachedStats.problems) {
            setProblems(cachedStats.problems);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            refreshData();
        }
    }, [isAuthenticated]);

    const refreshData = async () => {
        setIsLoading(true);
        const allUsers = getUsers();
        setUsers(allUsers);

        try {
            // Force refresh to ensure we get latest test case counts
            const problemsData = await getProblems(true);
            let newProblems: Problem[] = [];
            if (Array.isArray(problemsData)) {
                newProblems = problemsData;
            } else if (problemsData.problems) {
                newProblems = problemsData.problems;
            }
            setProblems(newProblems);
            setAdminStats({ problems: newProblems });
        } catch (e) {
            console.error("Failed to fetch problems", e);
        }
        setIsLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const allUsers = getUsers();
        const user = allUsers.find(u => u.username === username && u.password === password);

        if (user) {
            if (user.permissions.includes('ADMIN_VIEW')) {
                setIsAuthenticated(true);
                setCurrentUser(user);
                setError("");
            } else {
                setError("You don't have administrative access.");
            }
        } else {
            setError("You aren't a insider..sorry :(");
        }
    };

    const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newUsername = formData.get('username') as string;
        const newPassword = formData.get('password') as string;
        const permissionStr = formData.get('permissions') as string;

        let permissions: Permission[] = ['DOCS_INT'];
        if (permissionStr === 'BOTH') permissions = ['DOCS_INT', 'ADMIN_VIEW'];

        saveUser({
            username: newUsername,
            password: newPassword,
            permissions
        });

        setIsAddUserModalOpen(false);
        refreshData();
    };

    const handleDeleteUser = (id: string) => {
        if (currentUser?.isRoot || currentUser?.permissions.includes('ADMIN_EDIT')) {
            if (deleteUser(id)) {
                refreshData();
            }
        }
    };

    const handlePermissionChange = (id: string, pType: 'DOCS_ONLY' | 'BOTH' | 'ALL') => {
        if (!currentUser?.isRoot && !currentUser?.permissions.includes('ADMIN_EDIT')) return;

        let permissions: Permission[] = ['DOCS_INT'];
        if (pType === 'BOTH') permissions = ['DOCS_INT', 'ADMIN_VIEW'];
        if (pType === 'ALL') {
            setPendingPermissionUser({ id, permissions: ['DOCS_INT', 'ADMIN_VIEW', 'ADMIN_EDIT'] });
            setIsConfirmPermissionModalOpen(true);
            return;
        }

        updateUser(id, { permissions });
        refreshData();
    };

    const confirmHighPermission = () => {
        if (confirmPassword === (currentUser?.password || 'daksh@codejudge')) {
            if (pendingPermissionUser) {
                updateUser(pendingPermissionUser.id, { permissions: pendingPermissionUser.permissions });
                setIsConfirmPermissionModalOpen(false);
                setPendingPermissionUser(null);
                setConfirmPassword("");
                refreshData();
            }
        } else {
            alert("Incorrect password verification");
        }
    };

    const getDifficultyStats = () => {
        const stats = { Easy: 0, Medium: 0, Hard: 0 };
        problems.forEach(p => {
            const rawDiff = p.difficulty || 'Medium';
            // Normalize: "easy" -> "Easy", "HARD" -> "Hard"
            const diff = rawDiff.charAt(0).toUpperCase() + rawDiff.slice(1).toLowerCase();

            if (stats[diff as keyof typeof stats] !== undefined) {
                stats[diff as keyof typeof stats]++;
            } else {
                // Fallback for unexpected values
                stats['Medium']++;
            }
        });
        return stats;
    };

    if (!isAuthenticated) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800"
                >
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-indigo-600/20">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black mb-2">Admin Panel</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Authentication required</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Username</label>
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none font-medium"
                                    placeholder="Admin username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                            <div className="relative">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-bold text-center">{error}</motion.p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <UserCheck className="w-5 h-5" />
                            Access Dashboard
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    const diffStats = getDifficultyStats();

    return (
        <div className="flex-1 flex bg-gray-50 dark:bg-gray-950 min-h-0">
            {/* Admin Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col items-center py-10 px-6 shrink-0 z-20">
                <div className="flex items-center gap-3 mb-16 self-start px-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">Admin <span className="text-indigo-600">Pro</span></span>
                </div>

                <nav className="w-full space-y-2">
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'insights' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        Insights
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <Users className="w-5 h-5" />
                        User Management
                    </button>
                </nav>

                <div className="mt-auto w-full space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                                {currentUser?.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-black truncate">{currentUser?.username}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                            {currentUser?.isRoot ? 'System Root' : 'Administrator'}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Dashboard Content */}
            <main className="flex-1 min-w-0 overflow-y-auto p-10">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'insights' ? (
                            <motion.div
                                key="insights"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center justify-between">
                                    <h1 className="text-4xl font-black tracking-tighter">System Insights</h1>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-xs font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        System Online
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <StatCard title="Active Problems" value={problems.length} icon={<Cpu className="w-5 h-5" />} color="purple" />
                                    <StatCard title="Security Score" value="A+" icon={<ShieldCheck className="w-5 h-5" />} color="blue" />
                                    <StatCard title="Uptime" value="99.9%" icon={<Activity className="w-5 h-5" />} color="emerald" />
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-black">Problem Inventory</h3>
                                            <div className="flex gap-2">
                                                <div className="px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-[10px] font-black">{diffStats.Easy} Easy</div>
                                                <div className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-600 text-[10px] font-black">{diffStats.Medium} Medium</div>
                                                <div className="px-3 py-1 rounded-lg bg-red-500/10 text-red-600 text-[10px] font-black">{diffStats.Hard} Hard</div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {problems.slice(0, 6).map(prob => (
                                                <div
                                                    key={prob.id}
                                                    onClick={() => { setSelectedProblem(prob); setIsProblemModalOpen(true); }}
                                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-transparent hover:border-indigo-500/30 hover:bg-white dark:hover:bg-gray-900 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center font-bold text-xs border border-gray-100 dark:border-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                                                            <Dna className="w-4 h-4 text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm truncate max-w-[200px]">{prob.title}</h4>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                                ID: {prob.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${prob.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                                                            prob.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                                                                'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                            {prob.difficulty || 'Medium'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {problems.length === 0 && (
                                                <div className="py-12 text-center text-gray-400 font-bold">Loading problems...</div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => { setSelectedProblem(problems[0] || null); setIsProblemModalOpen(true); }}
                                            className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-black text-indigo-600 hover:gap-3 transition-all"
                                        >
                                            View Full Problem Repository <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
                                            <Settings className="absolute top-0 right-0 w-32 h-32 opacity-10 -translate-y-8 translate-x-8" />
                                            <h3 className="text-xl font-black mb-4">System Config</h3>
                                            <div className="space-y-4">
                                                <ConfigToggle
                                                    label="Stop All Submissions (Maintenance)"
                                                    active={systemSettings.maintenanceMode}
                                                    onChange={(val) => {
                                                        const newConfig = { ...systemSettings, maintenanceMode: val };
                                                        setSystemSettings(newConfig);
                                                        setSystemConfig(newConfig);
                                                    }}
                                                />
                                                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <ShieldCheck className="w-4 h-4 text-green-300" />
                                                        <span className="text-xs font-bold text-indigo-50">Security Level: High</span>
                                                    </div>
                                                    <p className="text-[10px] text-indigo-200/70">Root protection enabled. Audit logs active.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <div className="flex items-center gap-2 mb-4">
                                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                                <h3 className="text-lg font-black">Maintenance</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-6">Last backup performed 2 hours ago. Cache health is optimal.</p>
                                            <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                Run Full System Audit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="users"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center justify-between">
                                    <h1 className="text-4xl font-black tracking-tighter">User Management</h1>
                                    <button
                                        onClick={() => setIsAddUserModalOpen(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all active:scale-95"
                                    >
                                        <Plus className="w-5 h-5" /> Add New User
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">User Identity</th>
                                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Permissions</th>
                                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {users.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center font-black text-indigo-600">
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black">{user.username}</span>
                                                                        {user.isRoot && (
                                                                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg uppercase">Root</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                                        ID: {user.id} • Joined {new Date(user.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <PermissionBadge active={user.permissions.includes('DOCS_INT')} label="Docs" />
                                                                <PermissionBadge active={user.permissions.includes('ADMIN_VIEW')} label="Admin View" />
                                                                <PermissionBadge active={user.permissions.includes('ADMIN_EDIT')} label="Full Access" color="red" />

                                                                {!user.isRoot && (currentUser?.isRoot || currentUser?.permissions.includes('ADMIN_EDIT')) && (
                                                                    <div className="relative group ml-4">
                                                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all text-gray-400 hover:text-indigo-500">
                                                                            <Shield className="w-4 h-4" />
                                                                        </button>
                                                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-30">
                                                                            <PermissionOption onClick={() => handlePermissionChange(user.id, 'DOCS_ONLY')} label="View Docs Only" />
                                                                            <PermissionOption onClick={() => handlePermissionChange(user.id, 'BOTH')} label="View Both (No Edit)" />
                                                                            <PermissionOption onClick={() => handlePermissionChange(user.id, 'ALL')} label="Full Controller" color="text-red-500" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            {!user.isRoot ? (
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            ) : (
                                                                <div className="p-3 text-gray-200 cursor-not-allowed">
                                                                    <Lock className="w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {isAddUserModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddUserModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8"
                        >
                            <h2 className="text-2xl font-black mb-6">Add Authenticated User</h2>
                            <form onSubmit={handleAddUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Username</label>
                                    <input name="username" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 rounded-2xl outline-none border border-transparent focus:border-indigo-500" placeholder="New username" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                                    <input name="password" type="password" required className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 rounded-2xl outline-none border border-transparent focus:border-indigo-500" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Default Permission Level</label>
                                    <select name="permissions" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-950 rounded-2xl outline-none border border-transparent focus:border-indigo-500 font-bold">
                                        <option value="DOCS">Internal Docs Access Only</option>
                                        <option value="BOTH">Docs + Admin View access</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg">Create User Identity</button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isConfirmPermissionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-red-100 dark:border-red-900/30"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <ShieldAlert className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-black text-center mb-2">High Permission Alert</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-medium mb-8 leading-relaxed">
                                You are about to grant <span className="text-red-500 font-black">Admin Edit</span> rights. This user will be able to manage other users.
                            </p>

                            <div className="space-y-4">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Enter YOUR admin password"
                                    className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-950 rounded-2xl outline-none border border-transparent focus:border-red-500 font-bold"
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setIsConfirmPermissionModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold">Cancel</button>
                                    <button onClick={confirmHighPermission} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold">Authorize</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isProblemModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProblemModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                        <FolderOpen className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight">Problem Inventory</h2>
                                        <div className="flex gap-4 mt-2">
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-[10px] font-black uppercase">
                                                {diffStats.Easy} Easy
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-600 text-[10px] font-black uppercase">
                                                {diffStats.Medium} Medium
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 text-red-600 text-[10px] font-black uppercase">
                                                {diffStats.Hard} Hard
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsProblemModalOpen(false)}
                                    className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all text-gray-400"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 dark:bg-gray-950/30">
                                <div className="grid grid-cols-1 gap-4">
                                    {problems.map(prob => (
                                        <motion.div
                                            key={prob.id}
                                            className="group relative p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                <div className="flex items-start gap-5 min-w-0">
                                                    <div className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                                        <FileCode className="w-6 h-6 text-indigo-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-3 flex-wrap mb-1">
                                                            <h3 className="text-lg font-black truncate">{prob.title}</h3>
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${prob.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                                                                prob.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                                                                    'bg-yellow-100 text-yellow-600'
                                                                }`}>
                                                                {prob.difficulty || 'Medium'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 line-clamp-1">{prob.description}</p>
                                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                            <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-indigo-500" /> ID: {prob.id}</span>
                                                            <span className="flex items-center gap-1.5"><CircleCheck className="w-3 h-3 text-green-500" /> Ready</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 shrink-0 overflow-x-auto pb-1 lg:pb-0">
                                                    <TestCaseBadge count={prob.sample_test_cases_count || 0} label="Sample Cases" color="blue" />
                                                    <TestCaseBadge count={prob.hidden_test_cases_count || 0} label="Hidden Cases" color="purple" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
                                <button
                                    onClick={() => setIsProblemModalOpen(false)}
                                    className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all"
                                >
                                    Close Inventory
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TestCaseBadge({ count, label, color }: { count: number, label: string, color: 'blue' | 'purple' }) {
    const shadow = color === 'blue' ? 'shadow-blue-500/10' : 'shadow-purple-500/10';
    const bg = color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-purple-50 dark:bg-purple-900/10';
    const text = color === 'blue' ? 'text-blue-600' : 'text-purple-600';

    return (
        <div className={`px-4 py-3 rounded-2xl ${bg} border border-transparent flex flex-col gap-1 min-w-[100px] shadow-sm ${shadow}`}>
            <span className={`text-xl font-black ${text}`}>{count}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
    const colors = {
        indigo: 'bg-indigo-500 text-indigo-500 border-indigo-500/10',
        blue: 'bg-blue-500 text-blue-500 border-blue-500/10',
        purple: 'bg-purple-500 text-purple-500 border-purple-500/10',
        emerald: 'bg-emerald-500 text-emerald-500 border-emerald-500/10'
    };

    return (
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10 ${colors[color as keyof typeof colors].split(' ')[0]} ${colors[color as keyof typeof colors].split(' ')[1]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{title}</p>
                <p className="text-3xl font-black tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function ConfigToggle({ label, active, onChange }: { label: string, active: boolean, onChange: (val: boolean) => void }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/5">
            <span className="text-xs font-bold text-indigo-50">{label}</span>
            <button
                onClick={() => onChange(!active)}
                className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-green-400' : 'bg-white/20'}`}
            >
                <motion.div
                    animate={{ x: active ? 20 : 2 }}
                    className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    );
}

function PermissionBadge({ active, label, color = 'indigo' }: { active: boolean, label: string, color?: string }) {
    if (!active) return (
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-400 text-[10px] font-black rounded-lg uppercase border border-transparent">
            {label}
        </span>
    );

    const colorClasses = color === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';

    return (
        <span className={`px-3 py-1 ${colorClasses} text-[10px] font-black rounded-lg uppercase border`}>
            {label}
        </span>
    );
}

function PermissionOption({ onClick, label, color = 'text-gray-700 dark:text-gray-300' }: { onClick: () => void, label: string, color?: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-[11px] font-black uppercase tracking-tight transition-colors ${color}`}
        >
            {label}
        </button>
    );
}
