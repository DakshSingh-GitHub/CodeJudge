"use client";

import React from 'react';
import LanguageSelector from './LanguageSelector';

interface SettingsProps {
    fontSize: number;
    setFontSize: (size: number) => void;
}

const Settings = ({ fontSize, setFontSize }: SettingsProps) => {
    return (
        <div className="flex items-center gap-3">
            <LanguageSelector />
            <div className="h-4 w-px bg-gray-700/50" />
            <div className="flex items-center gap-2">
                <div className="relative">
                    <select
                        id="font-size"
                        value={fontSize}
                        onChange={(e) =>
                            setFontSize(parseInt(e.target.value, 10))
                        }
                        className="appearance-none w-16 md:w-20 bg-gray-800/50 border border-gray-700 hover:border-gray-600 pl-2 pr-6 py-1 rounded-md text-[10px] md:text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-gray-300 transition-colors cursor-pointer"
                    >
                        {[
                            12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                        ].map((size) => (
                            <option
                                key={size}
                                value={size}
                                className="bg-gray-900"
                            >
                                {size}px
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
                        <svg
                            className="fill-current h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
