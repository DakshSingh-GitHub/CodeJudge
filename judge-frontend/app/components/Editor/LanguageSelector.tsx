"use client";

import React from 'react';

const LanguageSelector = () => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-xs font-medium">Language</label>
      <div className="relative">
        <select
          id="language-select"
          className="appearance-none w-24 bg-gray-800 border border-gray-600 hover:border-gray-500 pl-3 pr-8 py-1 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 text-white"
          defaultValue="python"
        >
          <option value="python" className="bg-gray-800">Python</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
