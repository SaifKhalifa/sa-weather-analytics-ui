import React from 'react';
import { LayoutDashboard, Thermometer, Droplet, BarChart3, AlertTriangle, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'humidity', label: 'Humidity', icon: Droplet },
    { id: 'frequency', label: 'CMS Frequency', icon: BarChart3 },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-[#111418] border-r border-gray-800 flex flex-col h-full shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs">
          SA
        </div>
        <div>
          <h1 className="text-white font-bold text-sm">SA Weather</h1>
          <p className="text-gray-500 text-xs">Analytics Dashboard</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <Settings size={20} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;