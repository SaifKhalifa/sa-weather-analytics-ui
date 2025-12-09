import React from 'react';
import { RefreshCw, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

const Header: React.FC<HeaderProps> = ({ title, onRefresh, isRefreshing, lastUpdated }) => {
  return (
    <header className="h-16 bg-[#101922]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-20">
      <h2 className="text-white text-lg font-bold">{title}</h2>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-gray-800/50 rounded-lg px-3 py-1.5 border border-gray-700/50">
          <span className="text-gray-400 text-xs font-medium mr-2">Last updated:</span>
          <span className="text-gray-200 text-sm">{lastUpdated}</span>
        </div>

        <button 
          onClick={onRefresh}
          className={`p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-all ${isRefreshing ? 'animate-spin text-primary' : ''}`}
        >
          <RefreshCw size={18} />
        </button>

        <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600">
           {/* Placeholder Avatar */}
           <User size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;