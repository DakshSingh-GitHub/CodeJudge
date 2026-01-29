"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import Toolbar from "./Toolbar";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    isDisabled?: boolean;
    isDark?: boolean;
}

export default function CodeEditor({
    code,
    setCode,
    isDisabled = false,
    isDark = false,
}: CodeEditorProps) {
    const [showMinimap, setShowMinimap] = useState(false);
    const editorRef = useRef<any>(null);
    const [fontSize, setFontSize] = useState(15);

    useEffect(() => {
        const checkScreenSize = () => {
            setShowMinimap(window.innerWidth >= 768);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };

    return (
        <div
            className={`h-full w-full rounded-xl overflow-hidden relative flex flex-col bg-gray-800 ${isDisabled ? "opacity-60" : ""}`}
        >
            {isDisabled && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50 cursor-not-allowed">
                    <p className="text-white text-lg font-semibold">
                        Select a problem to start coding
                    </p>
                </div>
            )}
            <div className="grow h-0">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme={isDark ? "vs-dark" : "vs"}
                    value={code}
                    onMount={handleEditorDidMount}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        fontSize: fontSize,
                        minimap: { enabled: showMinimap },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        readOnly: isDisabled,
                        cursorBlinking: "expand",
                        fontFamily: "Jetbrains Mono, sans-serif, Arial",
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: {
                            other: true,
                            comments: true,
                            strings: true,
                        },
                        parameterHints: { enabled: true },
                        tabCompletion: "on",
                    }}
                />
            </div>
            {!isDisabled && (
                <Toolbar fontSize={fontSize} setFontSize={setFontSize} />
            )}
        </div>
    );
}
