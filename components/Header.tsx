
import React from 'react';
import { FileTextIcon } from './icons';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <FileTextIcon className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          PDF ➜ Excel PO Parser
        </h1>
      </div>
    </header>
  );
}
