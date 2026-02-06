"use client";

import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
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
        if (!monaco) return;

        const provider = monaco.languages.registerCompletionItemProvider("python", {
            provideCompletionItems: function (model, position) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions = [
                    {
                        label: "print",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "print(${1:object})",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Print objects to the text stream file",
                        range: range,
                    },
                    {
                        label: "def",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "def ${1:func_name}(${2:args}):\n\t${3:pass}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Function definition",
                        range: range,
                    },
                    {
                        label: "if",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "if ${1:condition}:\n\t${2:pass}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "If statement",
                        range: range,
                    },
                    {
                        label: "for",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "for ${1:target} in ${2:iter}:\n\t${3:pass}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "For loop",
                        range: range,
                    },
                    {
                        label: "while",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "while ${1:condition}:\n\t${2:pass}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "While loop",
                        range: range,
                    },
                    {
                        label: "try",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText:
                            "try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:pass}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Try/Except block",
                        range: range,
                    },
                    {
                        label: "class",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText:
                            "class ${1:ClassName}:\n\tdef __init__(self, ${2:args}):\n\t\t${3:pass}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Class definition",
                        range: range,
                    },
                    {
                        label: "return",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "return ${1:value}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Return statement",
                        range: range,
                    },
                    {
                        label: "import",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "import ${1:module}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "Import statement",
                        range: range,
                    },
                    {
                        label: "from",
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: "from ${1:module} import ${2:name}",
                        insertTextRules:
                            monaco.languages.CompletionItemInsertTextRule
                                .InsertAsSnippet,
                        documentation: "From import statement",
                        range: range,
                    },
                ];

                return { suggestions: suggestions };
            },
        });

        return () => provider.dispose();
    }, [monaco]);

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
                <Toolbar code={code} fontSize={fontSize} setFontSize={setFontSize} />
            )}
        </div>
    );
}
