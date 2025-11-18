
import React from 'react';
import type { View } from '../types';
import { BotIcon, ImageIcon } from './Icon';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItemClasses = "flex items-center gap-2 px-4 py-3 rounded-md transition-colors duration-200";
  const activeClasses = "bg-blue-600 text-white shadow-md";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700";

  return (
    <header className="bg-gray-800 shadow-lg p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9.64 5.013l.002.002a.75.75 0 0 1 .831.309l1.415 2.502a.75.75 0 0 1-.66 1.085H9.013a.75.75 0 0 1-.66-1.085l1.415-2.502a.75.75 0 0 1 .872-.31Z M12 10.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75ZM14.36 5.013a.75.75 0 0 1 .872.31l1.415 2.502a.75.75 0 0 1-.66 1.085h-2.216a.75.75 0 0 1-.66-1.085l1.415-2.502a.75.75 0 0 1 .831-.309l.002.002Z"/></svg>
          Gemini Creative Suite
        </h1>
        <nav className="flex items-center bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => onViewChange('chat')}
            className={`${navItemClasses} ${currentView === 'chat' ? activeClasses : inactiveClasses}`}
          >
            <BotIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Chat</span>
          </button>
          <button
            onClick={() => onViewChange('image')}
            className={`${navItemClasses} ${currentView === 'image' ? activeClasses : inactiveClasses}`}
          >
            <ImageIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Image Generator</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
