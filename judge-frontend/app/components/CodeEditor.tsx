"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";

import LanguageSelector from "./LanguageSelector";

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

        const handleInsert = (char: string) => {
        if (!editorRef.current) return;
        const editor = editorRef.current;
        const position = editor.getPosition();
        if (!position) return;
        editor.executeEdits("toolbar", [{
            range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            },
            text: char,
            forceMoveMarkers: true
        }]);
        editor.focus();
    };

    const Toolbar = () => (
        <div className="bg-gray-900 border-t border-gray-700 p-1 md:p-2 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-gray-300 text-sm px-4">
            <div className="flex items-center gap-4">
                <span className="font-semibold text-md text-gray-400">Editor Settings</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <LanguageSelector />
                <div className="flex items-center gap-2">
                    <label htmlFor="font-size" className="text-xs font-medium">Font Size</label>
                    <div className="relative">
                        <select
                            id="font-size"
                            value={fontSize}
                            onChange={(e) =>
                                setFontSize(parseInt(e.target.value, 10))
                            }
                            className="appearance-none w-24 bg-gray-800 border border-gray-600 hover:border-gray-500 pl-3 pr-8 py-1 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 text-white"
                        >
                            {[
                                12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                            ].map((size) => (
                                <option
                                    key={size}
                                    value={size}
                                    className="bg-gray-800"
                                >
                                    {size}px
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

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
                    }}
                />
            </div>
            {!isDisabled && <Toolbar />}
        </div>
    );
}
