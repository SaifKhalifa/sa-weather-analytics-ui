import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';
import { ArrowUp } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface HumidityProps {
  data: ChartDataPoint[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Humidity: React.FC<HumidityProps> = ({ data, loading, error, onRetry }) => {
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-medium">Average Humidity</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-white">45%</span>
            <span className="flex items-center text-green-500 text-sm font-medium mb-1">
              <ArrowUp size={16} /> 2.1%
            </span>
          </div>
        </div>
        <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-medium">Highest Recorded</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-white">68%</span>
            <span className="text-gray-500 text-sm mb-1">in Jeddah</span>
          </div>
        </div>
        <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-medium">Lowest Recorded</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-white">15%</span>
            <span className="text-gray-500 text-sm mb-1">in Riyadh</span>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-white">City Humidity Comparison</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary text-sm">
              <span>Riyadh</span>
              <button className="hover:text-white">×</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary text-sm">
              <span>Jeddah</span>
              <button className="hover:text-white">×</button>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
               <XAxis dataKey="time" stroke="#718096" tick={{fill: '#718096', fontSize: 12}} axisLine={false} tickLine={false} />
               <YAxis stroke="#718096" tick={{fill: '#718096', fontSize: 12}} axisLine={false} tickLine={false} unit="%" />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#1C252E', borderColor: '#2D3748', color: '#fff' }}
               />
               <Line type="monotone" dataKey="Riyadh" stroke="#137fec" strokeWidth={4} dot={{r: 4, fill: '#137fec'}} />
               <Line type="monotone" dataKey="Jeddah" stroke="#38B2AC" strokeWidth={4} dot={false} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Humidity;