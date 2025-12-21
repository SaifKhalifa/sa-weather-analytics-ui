import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FrequencyData } from '../types';
import { ArrowUp, BarChart2 } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface CMSFrequencyProps {
  data: FrequencyData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const CMSFrequency: React.FC<CMSFrequencyProps> = ({ data, loading, error, onRetry }) => {
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
       <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-1">Weather Condition Frequency</h2>
          <p className="text-gray-400">Visualize real-time weather data across Saudi Arabia.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Filter Sidebar (In-page) */}
         <div className="lg:col-span-3 flex flex-wrap gap-3">
            <div className="bg-card-dark border border-gray-700 px-4 py-2 rounded-lg text-sm text-gray-300">
               Time Range: <span className="font-semibold text-white">Last 7 Days</span>
            </div>
            <div className="bg-card-dark border border-gray-700 px-4 py-2 rounded-lg text-sm text-gray-300">
               Region: <span className="font-semibold text-white">All of KSA</span>
            </div>
         </div>

         {/* Chart Card */}
         <div className="lg:col-span-3 bg-card-dark border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-lg font-semibold text-white">Frequency of Weather Conditions</h3>
                  <p className="text-xs text-gray-500">Total recorded events in the selected period.</p>
               </div>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
               <span className="text-4xl font-bold text-white">1,230</span>
               <span className="flex items-center text-green-500 text-sm font-medium">
                  <ArrowUp size={16} /> +5.2% vs previous 7 days
               </span>
            </div>

            <div className="h-[350px] w-full">
              {data.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BarChart2 className="mx-auto text-gray-600 mb-4" size={48} />
                    <h3 className="text-white text-lg font-semibold mb-2">No Weather Data Available</h3>
                    <p className="text-gray-400 text-sm">Weather condition frequency data is currently being processed.</p>
                  </div>
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                   <Tooltip 
                     cursor={{fill: 'rgba(255,255,255,0.05)'}}
                     contentStyle={{ backgroundColor: '#1C252E', borderColor: '#2D3748', borderRadius: '8px', color: '#fff' }}
                   />
                   <XAxis dataKey="condition" axisLine={false} tickLine={false} tick={{fill: '#718096'}} dy={10} />
                   <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                     {data.map((entry) => (
                       <Cell key={entry.condition} fill={entry.condition === 'Clouds' ? '#137fec' : 'rgba(19, 127, 236, 0.2)'} />
                     ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
         </div>
       </div>
    </div>
  );
};

export default CMSFrequency;