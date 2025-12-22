import React, { useState, useEffect } from 'react';
import { RefreshCw, Power, Timer } from 'lucide-react';
import { GlobalStatistics } from '../types';

interface HeaderProps {
  title: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  globalStats: GlobalStatistics | null;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  refreshInterval: number;
  onChangeInterval: (interval: number) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onRefresh, isRefreshing, globalStats, autoRefresh, onToggleAutoRefresh, refreshInterval, onChangeInterval }) => {
  const [countdown, setCountdown] = useState(refreshInterval / 1000);
  const [relativeTime, setRelativeTime] = useState('Never');
  const [fullTimestamp, setFullTimestamp] = useState('');
  
  // Update relative time display from globalStats.updated_at
  useEffect(() => {
    const updateRelativeTime = () => {
      if (!globalStats?.updated_at) {
        setRelativeTime('Never');
        setFullTimestamp('');
        return;
      }
      
      const lastUpdate = new Date(globalStats.updated_at);
      setFullTimestamp(lastUpdate.toLocaleString());
      
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      
      if (diffSecs < 10) {
        setRelativeTime('Just now');
      } else if (diffSecs < 60) {
        setRelativeTime(`${diffSecs}s ago`);
      } else if (diffSecs < 3600) {
        const mins = Math.floor(diffSecs / 60);
        setRelativeTime(`${mins}m ago`);
      } else if (diffSecs < 86400) {
        const hours = Math.floor(diffSecs / 3600);
        setRelativeTime(`${hours}h ago`);
      } else {
        const days = Math.floor(diffSecs / 86400);
        setRelativeTime(`${days}d ago`);
      }
    };
    
    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 1000);
    return () => clearInterval(interval);
  }, [globalStats]);
  
  useEffect(() => {
    if (!autoRefresh) {
      setCountdown(refreshInterval / 1000);
      return;
    }
    
    setCountdown(refreshInterval / 1000);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) return refreshInterval / 1000;
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval]);
  
  const intervalOptions = [
    { value: 10000, label: '10s' },
    { value: 30000, label: '30s' },
    { value: 60000, label: '1m' },
    { value: 300000, label: '5m' },
  ];
  
  return (
    <header className="h-16 bg-[#101922]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-20">
      <h2 className="text-white text-lg font-bold">{title}</h2>
      
      <div className="flex items-center gap-3">
        <div 
          className="hidden md:flex items-center bg-gray-800/50 rounded-lg px-3 py-1.5 border border-gray-700/50 cursor-help"
          title={fullTimestamp}
        >
          <span className="text-gray-400 text-xs font-medium mr-2">Last updated:</span>
          <span className="text-gray-200 text-sm">{relativeTime}</span>
        </div>

        {autoRefresh && (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
            <Timer size={16} className="text-primary" />
            <span className="text-primary text-sm font-medium">{countdown}s</span>
          </div>
        )}

        <select
          value={refreshInterval}
          onChange={(e) => onChangeInterval(Number(e.target.value))}
          className="bg-gray-800/50 border border-gray-700/50 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-primary transition-all hover:border-gray-600"
          title="Select refresh interval"
        >
          {intervalOptions.map(option => (
            <option key={option.value} value={option.value}>
              Every {option.label}
            </option>
          ))}
        </select>

        <button 
          onClick={onToggleAutoRefresh}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
            autoRefresh 
              ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20' 
              : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
        >
          <Power size={16} />
          <span className="text-xs font-medium hidden lg:inline">Auto</span>
        </button>

        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-50 ${isRefreshing ? 'animate-spin text-primary' : ''}`}
          title="Refresh now"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;