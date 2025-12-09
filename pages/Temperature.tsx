import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface TemperatureProps {
  data: ChartDataPoint[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Temperature: React.FC<TemperatureProps> = ({ data, loading, error, onRetry }) => {
  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={onRetry} type="network" />
      </div>
    );
  }

  if (loading) {
    return <LoadingState type="chart" />;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Temperature Trends</h2>
          <p className="text-gray-400 text-sm">Hourly forecast across major cities</p>
        </div>
        
        <div className="flex gap-2">
           <select className="bg-card-dark border border-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-primary">
             <option>Riyadh</option>
             <option>Jeddah</option>
             <option>Dammam</option>
           </select>
           <div className="flex bg-card-dark border border-gray-700 rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-medium rounded bg-gray-700 text-white">24h</button>
              <button className="px-3 py-1 text-xs font-medium rounded text-gray-400 hover:text-white">7d</button>
              <button className="px-3 py-1 text-xs font-medium rounded text-gray-400 hover:text-white">30d</button>
           </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-card-dark border border-gray-800 rounded-xl p-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRiyadh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#137fec" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorJeddah" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
            <XAxis dataKey="time" stroke="#718096" tick={{fill: '#718096', fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis stroke="#718096" tick={{fill: '#718096', fontSize: 12}} axisLine={false} tickLine={false} unit="°C" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1C252E', borderColor: '#2D3748', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area type="monotone" dataKey="Riyadh" stroke="#137fec" strokeWidth={3} fillOpacity={1} fill="url(#colorRiyadh)" />
            <Area type="monotone" dataKey="Jeddah" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorJeddah)" />
            <Area type="monotone" dataKey="Dammam" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Detailed Stats Table */}
         <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Latest Readings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500">
                    <th className="pb-3 font-medium">City</th>
                    <th className="pb-3 font-medium">Temp</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800/50">
                    <td className="py-3">Riyadh</td>
                    <td className="py-3 text-white font-medium">45°C</td>
                    <td className="py-3"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">High</span></td>
                  </tr>
                  <tr className="border-b border-gray-800/50">
                    <td className="py-3">Jeddah</td>
                    <td className="py-3 text-white font-medium">35°C</td>
                    <td className="py-3"><span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Normal</span></td>
                  </tr>
                  <tr>
                    <td className="py-3">Dammam</td>
                    <td className="py-3 text-white font-medium">38°C</td>
                    <td className="py-3"><span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Warm</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Temperature;