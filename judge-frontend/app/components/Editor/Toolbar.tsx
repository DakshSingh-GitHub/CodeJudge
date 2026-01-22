"use client";

import React from 'react';
import Settings from './Settings';

interface ToolbarProps {
    fontSize: number;
    setFontSize: (size: number) => void;
}

const Toolbar = ({ fontSize, setFontSize }: ToolbarProps) => {
    return (
        <div className="bg-gray-900 border-t border-gray-700 p-1 md:p-2 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-gray-300 text-sm px-4">
            <div className="flex items-center gap-4">
                <span className="font-semibold text-md text-gray-400">Editor Settings</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <Settings fontSize={fontSize} setFontSize={setFontSize} />
            </div>
        </div>
    );
};

export default Toolbar;
