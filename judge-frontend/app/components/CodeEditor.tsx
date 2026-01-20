"use client";

import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    isDisabled?: boolean;
}

export default function CodeEditor({ code, setCode, isDisabled = false }: CodeEditorProps) {
    const [showMinimap, setShowMinimap] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setShowMinimap(window.innerWidth >= 768);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <div className={`h-full w-full rounded-xl overflow-hidden relative ${isDisabled ? 'opacity-60' : ''}`}>
             {isDisabled && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50 cursor-not-allowed">
                    <p className="text-white text-lg font-semibold">Select a problem to start coding</p>
                </div>
            )}
            <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                    fontSize: 16,
                    minimap: { enabled: showMinimap },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: isDisabled,
                    cursorBlinking: "expand",
                    fontFamily: "Jetbrains Mono, sans-serif, Arial"
                }}
            />
        </div>
    );
}
