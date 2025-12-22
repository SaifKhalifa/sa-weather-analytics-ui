import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';
import { FrequencyData } from '../types';
import { BarChart2, Cloud, MapPin, ArrowUpDown } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface CMSFrequencyProps {
  weatherFrequencies: FrequencyData[];
  cityFrequencies: FrequencyData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const CMSFrequency: React.FC<CMSFrequencyProps> = ({ weatherFrequencies, cityFrequencies, loading, error, onRetry }) => {
  const [activeTab, setActiveTab] = useState<'weather' | 'cities'>('weather');
  const [sortBy, setSortBy] = useState<'count-desc' | 'count-asc' | 'name-asc' | 'name-desc'>('count-desc');
  const [limit, setLimit] = useState<number>(10);
  
  // Transform and sort data based on active filters
  const processedData = useMemo(() => {
    const sourceData = activeTab === 'weather' ? weatherFrequencies : cityFrequencies;
    
    let data = sourceData.map(freq => ({
      condition: freq.item,
      count: freq.count
    }));

    // Sort data
    switch (sortBy) {
      case 'count-desc':
        data.sort((a, b) => b.count - a.count);
        break;
      case 'count-asc':
        data.sort((a, b) => a.count - b.count);
        break;
      case 'name-asc':
        data.sort((a, b) => a.condition.localeCompare(b.condition));
        break;
      case 'name-desc':
        data.sort((a, b) => b.condition.localeCompare(a.condition));
        break;
    }

    // Apply limit
    return data.slice(0, limit);
  }, [activeTab, weatherFrequencies, cityFrequencies, sortBy, limit]);

  const activeData = processedData;
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
          <h2 className="text-3xl font-bold text-white mb-1">Count-Min Sketch Frequency Analysis</h2>
          <p className="text-gray-400">Probabilistic data structure for frequency estimation across massive data streams.</p>
       </div>

       {/* Tab Selector */}
       <div className="flex gap-2 mb-6">
         <button
           onClick={() => setActiveTab('weather')}
           className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
             activeTab === 'weather' 
               ? 'bg-blue-600 text-white shadow-lg' 
               : 'bg-card-dark text-gray-400 hover:bg-gray-800 border border-gray-700'
           }`}
         >
           <Cloud size={20} />
           Weather Conditions
         </button>
         <button
           onClick={() => setActiveTab('cities')}
           className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
             activeTab === 'cities' 
               ? 'bg-blue-600 text-white shadow-lg' 
               : 'bg-card-dark text-gray-400 hover:bg-gray-800 border border-gray-700'
           }`}
         >
           <MapPin size={20} />
           City Distribution
         </button>
       </div>

       {/* Chart Card */}
       <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="text-lg font-semibold text-white">
                  {activeTab === 'weather' ? 'Weather Condition Frequencies' : 'City Recording Frequencies'}
                </h3>
                <p className="text-xs text-gray-500">
                  {activeTab === 'weather' 
                    ? 'Top 10 most frequent weather patterns across all Saudi cities' 
                    : 'Top 10 cities with highest data collection frequency'}
                </p>
             </div>
             
             {/* Filters */}
             <div className="flex items-center gap-3">
               {/* Sort Dropdown */}
               <div className="flex items-center gap-2">
                 <ArrowUpDown size={16} className="text-gray-400" />
                 <select
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value as any)}
                   className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                 >
                   <option value="count-desc">Highest Count</option>
                   <option value="count-asc">Lowest Count</option>
                   <option value="name-asc">Name (A-Z)</option>
                   <option value="name-desc">Name (Z-A)</option>
                 </select>
               </div>

               {/* Limit Dropdown */}
               <select
                 value={limit}
                 onChange={(e) => setLimit(Number(e.target.value))}
                 className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
               >
                 <option value={5}>Top 5</option>
                 <option value={10}>Top 10</option>
                 <option value={15}>Top 15</option>
                 <option value={20}>Top 20</option>
                 <option value={50}>Top 50</option>
               </select>
             </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
             <span className="text-4xl font-bold text-white">
               {activeData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
             </span>
             <span className="text-gray-400 text-sm font-medium">
               {activeTab === 'weather' ? 'Total in selection' : 'Total in selection'}
             </span>
             <span className="text-gray-500 text-xs ml-2">
               (Showing {activeData.length} of {activeTab === 'weather' ? weatherFrequencies.length : cityFrequencies.length})
             </span>
          </div>

          <div className="h-[400px] w-full">
            {activeData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart2 className="mx-auto text-gray-600 mb-4" size={48} />
                  <h3 className="text-white text-lg font-semibold mb-2">No Data Available</h3>
                  <p className="text-gray-400 text-sm">
                    {activeTab === 'weather' ? 'Weather' : 'City'} frequency data is currently being processed.
                  </p>
                </div>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData}>
                 <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{ 
                     backgroundColor: '#1C252E', 
                     borderColor: '#2D3748', 
                     borderRadius: '8px'
                   }}
                   labelStyle={{ color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                 />
                 <XAxis dataKey="condition" axisLine={false} tickLine={false} tick={{fill: '#718096'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#718096'}} />
                 <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                   {activeData.map((entry, index) => (
                     <Cell 
                       key={`cell-${index}`} 
                       fill={index === 0 ? '#137fec' : 'rgba(19, 127, 236, 0.5)'} 
                     />
                   ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
       </div>
    </div>
  );
};

export default CMSFrequency;