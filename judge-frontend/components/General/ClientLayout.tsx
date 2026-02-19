"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../../app/lib/context';
import NavBar from './NavBar';
import SubmissionsModal from './SubmissionsModal';
import { History } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { TITLE, isSidebarOpen, setIsSidebarOpen, isSubmissionsModalOpen, setIsSubmissionsModalOpen, isDark, toggleTheme } = useAppContext();
    const pathname = usePathname();
    const excludedPaths = ['/', '/docs', '/docs-int', '/admin', '/visuals']
    const isHomePage = excludedPaths.includes(pathname);

    return (
        <main className="flex h-screen flex-col">
            {!isHomePage && (
                <NavBar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSubmissionsModalOpen={isSubmissionsModalOpen}
                    setIsSubmissionsModalOpen={setIsSubmissionsModalOpen}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />
            )}
            <div className="flex-1 min-h-0 flex flex-col">
                {children}
            </div>
            <SubmissionsModal
                isOpen={isSubmissionsModalOpen}
                onClose={() => setIsSubmissionsModalOpen(false)}
            />
        </main>
    );
}
