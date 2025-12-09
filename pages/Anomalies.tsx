import React from 'react';
import { Anomaly } from '../types';
import { Info, MoreHorizontal, Calendar, RefreshCw, Download } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { exportToCSV } from '../services/weatherService';

interface AnomaliesProps {
  data: Anomaly[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Anomalies: React.FC<AnomaliesProps> = ({ data, loading, error, onRetry }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 bg-red-500';
      case 'High': return 'text-orange-500 bg-orange-500';
      case 'Warning': return 'text-yellow-500 bg-yellow-500';
      default: return 'text-gray-500 bg-gray-500';
    }
  };

  const handleExport = () => {
    exportToCSV(data, 'weather-anomalies');
  };

  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={onRetry} type="network" />
      </div>
    );
  }

  if (loading) {
    return <LoadingState type="table" />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h2 className="text-3xl font-black text-white mb-2">Detected Weather Anomalies</h2>
           <p className="text-gray-400">Real-time list of detected weather events.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            disabled={data.length === 0}
            className="flex items-center gap-2 bg-[#2D3748] hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 bg-[#2D3748] hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* System Notification */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-4 text-yellow-200">
        <Info className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">System Notification</p>
          <p className="text-sm opacity-80">Data pipeline is experiencing minor delays. Information may be up to 5 minutes behind.</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium whitespace-nowrap">All Severities</button>
        <button className="px-4 py-2 bg-[#2D3748] text-gray-300 hover:text-white rounded-lg text-sm font-medium">Critical</button>
        <button className="px-4 py-2 bg-[#2D3748] text-gray-300 hover:text-white rounded-lg text-sm font-medium">High</button>
        <button className="px-4 py-2 bg-[#2D3748] text-gray-300 hover:text-white rounded-lg text-sm font-medium">Warning</button>
        <button className="px-4 py-2 bg-[#2D3748] text-gray-300 hover:text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Calendar size={16} /> Date Range
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#2D3748]/30 rounded-xl border border-gray-700/50 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#2D3748]/50 border-b border-gray-700">
            <tr>
               <th className="px-6 py-4 font-medium text-gray-400">Severity</th>
               <th className="px-6 py-4 font-medium text-gray-400">Timestamp</th>
               <th className="px-6 py-4 font-medium text-gray-400">City/Region</th>
               <th className="px-6 py-4 font-medium text-gray-400">Description</th>
               <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.map((item) => {
              const colorClass = getSeverityColor(item.severity);
              return (
                <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${colorClass.split(' ')[1]}`}></div>
                        <span className={`font-medium ${colorClass.split(' ')[0]}`}>{item.severity}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{item.timestamp}</td>
                  <td className="px-6 py-4 text-white font-medium">{item.city}</td>
                  <td className="px-6 py-4 text-gray-300">{item.description}</td>
                  <td className="px-6 py-4 text-right">
                     <button className="text-gray-500 hover:text-white">
                       <MoreHorizontal size={20} />
                     </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length === 0 && (
            <div className="p-12 text-center text-gray-500">
                No active anomalies detected.
            </div>
        )}
      </div>
    </div>
  );
};

export default Anomalies;