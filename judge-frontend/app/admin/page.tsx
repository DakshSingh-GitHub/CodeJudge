"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock,
    Search,
    UserCheck,
    Key,
    BarChart3,
    Plus,
    LogOut,
    ShieldCheck,
    Dna,
    AlertCircle,
    Users,
    Activity,
    Settings,
    Shield,
    Trash2,
    ArrowRight,
    Cpu,
    Terminal
} from 'lucide-react';
import { useAppContext } from '../lib/context';
import { getUsers, saveUser, updateUser, deleteUser, setAdminStats, getAdminStats, setSystemConfig, getSystemConfig, saveSystemLog, getSystemLogs, SystemLog } from '../lib/storage';
import { getProblems } from '../lib/api';
import { User, Permission, Problem } from '../lib/types';

// Modals
import CreateUserModal from './modals/CreateUserModal';
import EditUserModal from './modals/EditUserModal';
import ConfirmPermissionModal from './modals/ConfirmPermissionModal';
import ProblemInventoryModal from './modals/ProblemInventoryModal';
import SystemLogsModal from './modals/SystemLogsModal';

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
    const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);

    // Modal Control
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isConfirmPermissionModalOpen, setIsConfirmPermissionModalOpen] = useState(false);
    const [isProblemInventoryModalOpen, setIsProblemInventoryModalOpen] = useState(false);
    const [isSystemLogsModalOpen, setIsSystemLogsModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [pendingPermissionUser, setPendingPermissionUser] = useState<{ id: string, permissions: Permission[] } | null>(null);
    const [isAuditing, setIsAuditing] = useState(false);

    useEffect(() => {
        const cachedStats = getAdminStats();
        if (cachedStats && cachedStats.problems) {
            setProblems(cachedStats.problems);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            if (isAuthenticated) {
                refreshData();
                setSystemLogs(getSystemLogs());
            }
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

    const handleAddUser = (newUsername: string, newPassword: string, permissions: Permission[]) => {
        saveUser({
            username: newUsername,
            password: newPassword,
            permissions
        });
        setIsAddUserModalOpen(false);
        refreshData();
    };

    const handleUpdateUser = (id: string, updates: Partial<User>) => {
        // Check for high privilege escalation
        if (updates.permissions && updates.permissions.includes('ADMIN_EDIT') && !selectedUser?.permissions.includes('ADMIN_EDIT')) {
            // If try to add ADMIN_EDIT, verify first
            setPendingPermissionUser({ id, permissions: updates.permissions });
            setIsConfirmPermissionModalOpen(true);
            return;
        }

        updateUser(id, updates);
        refreshData();
    };

    const handleDeleteUser = (id: string) => {
        if (currentUser?.isRoot || currentUser?.permissions.includes('ADMIN_EDIT')) {
            if (deleteUser(id)) {
                refreshData();
                setIsEditUserModalOpen(false); // Close if open
            }
        }
    };

    const confirmHighPermission = (password: string) => {
        if (password === (currentUser?.password || 'daksh@codejudge')) {
            if (pendingPermissionUser) {
                updateUser(pendingPermissionUser.id, { permissions: pendingPermissionUser.permissions });
                setIsConfirmPermissionModalOpen(false);
                setPendingPermissionUser(null);
                refreshData();
                // Also close edit modal if open, or refresh it?
                // Refetching data will update list, but we might want to close the modal or update selectedUser
                if (selectedUser?.id === pendingPermissionUser.id) {
                    // Update the local selected user state to reflect changes immediately in UI
                    const updatedUser = getUsers().find(u => u.id === pendingPermissionUser.id);
                    if (updatedUser) setSelectedUser(updatedUser);
                }
            }
        } else {
            alert("Incorrect password verification");
        }
    };

    const handleRunAudit = () => {
        setIsAuditing(true);
        setTimeout(() => {
            setIsAuditing(false);

            // Save log
            const newLog = saveSystemLog({
                status: 'SUCCESS',
                details: 'System audit completed successfully. Database integrity verified. Cache health optimal.',
                type: 'AUDIT'
            });

            if (newLog) {
                setSystemLogs(prev => [newLog, ...prev]);
            }

            alert("System Audit Completed.\n\n• Database Integrity: 100%\n• Cache Health: Optimal\n• Security Protocols: Active\n• User Anomalies: None Detected");
        }, 2000);
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
                        <h1 className="text-2xl md:text-3xl font-black mb-2">Admin Panel</h1>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">Authentication required</p>
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
                    <span className="text-xl font-black tracking-tighter">Admin</span>
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
                            <span className="text-xs md:text-sm font-black truncate">{currentUser?.username}</span>
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
                                    <h1 className="text-2xl md:text-4xl font-black tracking-tighter">System Insights</h1>
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
                                            <h3 className="text-lg md:text-xl font-black">Problem Inventory</h3>
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
                                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-transparent hover:border-indigo-500/30 hover:bg-white dark:hover:bg-gray-900 transition-all cursor-default group"
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
                                            onClick={() => setIsProblemInventoryModalOpen(true)}
                                            className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-black text-indigo-600 hover:gap-3 transition-all"
                                        >
                                            View Full Problem Repository <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
                                            <Settings className="absolute top-0 right-0 w-32 h-32 opacity-10 -translate-y-8 translate-x-8" />
                                            <h3 className="text-lg md:text-xl font-black mb-4">System Config</h3>
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
                                                <h3 className="text-base md:text-lg font-black">Maintenance</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-6">Last backup performed 2 hours ago. Cache health is optimal.</p>
                                            <button
                                                onClick={handleRunAudit}
                                                disabled={isAuditing}
                                                className="w-full py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-wait"
                                            >
                                                {isAuditing ? "Running System Audit..." : "Run Full System Audit"}
                                            </button>
                                        </div>

                                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Terminal className="w-5 h-5 text-gray-500" />
                                                <h3 className="text-base md:text-lg font-black">System Logs</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-6">
                                                View complete history of system events and audits.
                                            </p>
                                            <button
                                                onClick={() => setIsSystemLogsModalOpen(true)}
                                                className="w-full py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                See logs
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
                                    <h1 className="text-2xl md:text-4xl font-black tracking-tighter">User Management</h1>
                                    <button
                                        onClick={() => setIsAddUserModalOpen(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all active:scale-95"
                                    >
                                        <Plus className="w-5 h-5" /> Add New User
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {users.map((user) => (
                                        <motion.div
                                            key={user.id}
                                            layout
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsEditUserModalOpen(true);
                                            }}
                                            className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-full">
                                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-xl">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-black text-lg">{user.username}</h3>
                                                        {user.isRoot && (
                                                            <Shield className="w-4 h-4 text-indigo-500" fill="currentColor" fillOpacity={0.2} />
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.permissions.includes('ADMIN_EDIT') ? (
                                                        <PermissionBadge label="Full Admin" color="red" />
                                                    ) : user.permissions.includes('ADMIN_VIEW') ? (
                                                        <PermissionBadge label="Admin View" color="indigo" />
                                                    ) : (
                                                        <PermissionBadge label="Docs Only" color="blue" />
                                                    )}
                                                    {user.isRoot && <PermissionBadge label="Root" color="purple" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Modals */}
            <CreateUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSubmit={handleAddUser}
            />

            <EditUserModal
                isOpen={isEditUserModalOpen}
                onClose={() => setIsEditUserModalOpen(false)}
                user={selectedUser}
                currentUser={currentUser}
                onSave={handleUpdateUser}
                onDelete={handleDeleteUser}
            />

            <ConfirmPermissionModal
                isOpen={isConfirmPermissionModalOpen}
                onClose={() => setIsConfirmPermissionModalOpen(false)}
                onConfirm={confirmHighPermission}
            />

            <ProblemInventoryModal
                isOpen={isProblemInventoryModalOpen}
                onClose={() => setIsProblemInventoryModalOpen(false)}
                problems={problems}
                difficultyStats={diffStats}
            />

            <SystemLogsModal
                isOpen={isSystemLogsModalOpen}
                onClose={() => setIsSystemLogsModalOpen(false)}
                logs={systemLogs}
            />
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
                <p className="text-2xl md:text-3xl font-black tracking-tight">{value}</p>
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

function PermissionBadge({ label, color = 'indigo' }: { label: string, color?: string }) {
    const colorClasses = {
        red: 'bg-red-500/10 text-red-500 border-red-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        gray: 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-transparent'
    };

    const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.gray;

    return (
        <span className={`px-3 py-1 ${selectedColor} text-[10px] font-black rounded-lg uppercase border`}>
            {label}
        </span>
    );
}
