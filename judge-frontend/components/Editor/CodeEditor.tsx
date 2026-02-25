"use client";

import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import { useState, useEffect, useRef, memo } from "react";
import Toolbar from "./Toolbar";
import { DEEP_SPACE_THEME, PYTHON_SNIPPETS } from "../../app/lib/editor-config";
import { anime } from "../../app/lib/anime";

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    isDisabled?: boolean;
    isDark?: boolean;
}

const CodeEditor = memo(function CodeEditor({
    code,
    setCode,
    isDisabled = false,
    isDark = false,
}: CodeEditorProps) {
    const [showMinimap, setShowMinimap] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<unknown>(null);
    const [fontSize, setFontSize] = useState(15);
    const monaco = useMonaco();

    useEffect(() => {
        const checkScreenSize = () => {
            setShowMinimap(window.innerWidth >= 768);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    useEffect(() => {
        if (!rootRef.current) return;
        anime({
            targets: rootRef.current,
            opacity: [0, 1],
            translateY: [12, 0],
            scale: [0.99, 1],
            duration: 460,
            easing: "easeOutCubic"
        });
    }, []);

    useEffect(() => {
        if (!rootRef.current) return;
        anime({
            targets: rootRef.current,
            opacity: isDisabled ? 0.72 : 1,
            duration: 220,
            easing: "easeOutQuad"
        });
    }, [isDisabled]);

    // Use beforeMount to ensure theme is defined BEFORE the editor is created
    function handleEditorWillMount(monaco: any) {
        monaco.editor.defineTheme("deep-space", DEEP_SPACE_THEME);

        // Register snippets (can also be done here or kept in useEffect, but consistency is good)
        monaco.languages.registerCompletionItemProvider("python", {
            provideCompletionItems: function (model: any, position: any) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions = PYTHON_SNIPPETS.map(snippet => ({
                    label: snippet.label,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: snippet.insertText,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: snippet.documentation,
                    range: range,
                }));

                return { suggestions: suggestions };
            },
        });
    }

    // No need for separate useEffect for theme definition
    useEffect(() => {
        if (!monaco) return;
        // Logic moved to handleEditorWillMount
    }, [monaco]);

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };

    return (
        <div
            ref={rootRef}
            className={`h-full w-full rounded-xl overflow-hidden relative flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-inner ${isDisabled ? "opacity-60 grayscale" : ""}`}
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
                    theme={isDark ? "deep-space" : "vs"}
                    value={code}
                    beforeMount={handleEditorWillMount}
                    onMount={handleEditorDidMount}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        fontSize: fontSize,
                        minimap: { enabled: showMinimap },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        readOnly: isDisabled,
                        cursorBlinking: "expand",
                        fontFamily: "Jetbrains Mono, monospace",
                        fontLigatures: true,
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: {
                            other: true,
                            comments: true,
                            strings: true,
                        },
                        parameterHints: { enabled: true },
                        tabCompletion: "on",
                        smoothScrolling: true,
                        cursorSmoothCaretAnimation: "on",
                        formatOnPaste: true,
                        formatOnType: true,
                        renderLineHighlight: "all",
                        scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                            useShadows: false
                        }
                    }}
                />
            </div>
            {!isDisabled && (
                <Toolbar code={code} fontSize={fontSize} setFontSize={setFontSize} />
            )}
        </div>
    );
});
CodeEditor.displayName = "CodeEditor";

export default CodeEditor;
