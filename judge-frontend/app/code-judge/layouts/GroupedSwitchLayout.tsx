"use client";

import { useEffect, useRef, useState } from "react";
import { anime } from "../../lib/anime";
import type { DesktopLayoutProps } from "./types";
import { useAppContext } from "../../lib/context";

type LeftPanelTab = "selector" | "description";

export default function GroupedSwitchLayout({
    mainContentRef,
    selectedProblemId,
    isResizing,
    mainContentWidth,
    onMouseDownMain,
    problemList,
    problemDescription,
    editorPanel
}: DesktopLayoutProps) {
    const introRef = useRef<HTMLDivElement>(null);
    const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>("selector");
    const { reduceMotion } = useAppContext();

    // Initial intro animation using anime.js (kept for complex stagger effect)
    useEffect(() => {
        if (!introRef.current) return;
        
        const animation = anime({
            targets: introRef.current.querySelectorAll("[data-layout-panel]"),
            opacity: [0, 1],
            translateY: [16, 0],
            scale: [0.995, 1],
            duration: 520,
            delay: (_el: Element, index: number) => index * 60,
            easing: "easeOutCubic"
        });

        const maybeThenable = animation as unknown as { catch?: (onRejected: () => void) => void };
        maybeThenable.catch?.(() => undefined);

        return () => {
            const maybeCancelable = animation as { cancel?: () => void };
            maybeCancelable.cancel?.();
        };
    }, []);

    useEffect(() => {
        if (selectedProblemId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLeftPanelTab("description");
        }
    }, [selectedProblemId]);

    // CSS Transition configuration
    // We use a bezier curve that mimics easeOutExpo for a premium feel
    const transitionStyle = reduceMotion 
        ? "none" 
        : "transform 400ms cubic-bezier(0.19, 1, 0.22, 1)";

    return (
        <div ref={introRef} className="flex-1 overflow-hidden p-4 relative z-10">
            <div
                ref={mainContentRef}
                data-content-area
                className="h-full w-full grid gap-4"
                style={{
                    gridTemplateColumns: `minmax(0, calc(${mainContentWidth}% - 0.375rem)) 0.375rem minmax(0, calc(${100 - mainContentWidth}% - 0.375rem))`,
                    gridTemplateRows: "minmax(0, 1fr)",
                    gridTemplateAreas: `"left mdiv editor"`,
                    transition: isResizing
                        ? "none"
                        : "grid-template-columns 300ms cubic-bezier(0.4,0,0.2,1), grid-template-rows 300ms cubic-bezier(0.4,0,0.2,1)"
                }}
            >
                <div
                    data-layout-panel
                    style={{ gridArea: "left" }}
                    className="min-h-0 min-w-0 overflow-hidden rounded-2xl border border-white/20 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl flex flex-col"
                >
                    <div className="px-4 py-3 border-b border-gray-100/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/40 z-20 relative">
                        <div className="flex w-full rounded-lg p-1 bg-gray-100/70 dark:bg-gray-800/70">
                            <button
                                onClick={() => setLeftPanelTab("selector")}
                                className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold text-center transition-colors ${leftPanelTab === "selector"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    }`}
                            >
                                Problems
                            </button>
                            <button
                                onClick={() => setLeftPanelTab("description")}
                                className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold text-center transition-colors ${leftPanelTab === "description"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    }`}
                            >
                                Description
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden relative transform-gpu">
                        <div 
                            className="absolute inset-0 w-full h-full will-change-transform"
                            style={{ 
                                transform: leftPanelTab === 'selector' ? 'translateX(0%) translateZ(0)' : 'translateX(-100%) translateZ(0)',
                                transition: transitionStyle,
                            }}
                        >
                            {problemList}
                        </div>
                        <div 
                            className="absolute inset-0 w-full h-full will-change-transform"
                            style={{ 
                                transform: leftPanelTab === 'description' ? 'translateX(0%) translateZ(0)' : 'translateX(100%) translateZ(0)',
                                transition: transitionStyle,
                            }}
                        >
                            {problemDescription}
                        </div>
                    </div>
                </div>

                <div
                    style={{ gridArea: "mdiv" }}
                    onMouseDown={onMouseDownMain}
                    className="rounded-full bg-transparent hover:bg-indigo-500/30 cursor-col-resize transition-colors duration-200"
                />

                <div data-layout-panel style={{ gridArea: "editor" }} className="min-h-0 min-w-0">
                    {editorPanel}
                </div>
            </div>
        </div>
    );
}
