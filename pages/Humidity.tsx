import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesChartData } from '../types';
import { Droplet } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface HumidityProps {
  hourlyChart: TimeSeriesChartData | null;
  monthlyChart: TimeSeriesChartData | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Humidity: React.FC<HumidityProps> = ({ hourlyChart, monthlyChart, loading, error, onRetry }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [timeRange, setTimeRange] = useState<'hourly' | 'monthly'>('monthly');
  
  const activeChart = timeRange === 'hourly' ? hourlyChart : monthlyChart;
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

  const availableCities = activeChart?.datasets.map(d => d.label) || [];
  
  const filteredDatasets = useMemo(() => {
    if (!activeChart || selectedCity === 'All Cities') {
      return activeChart?.datasets || [];
    }
    return activeChart.datasets.filter(d => d.label === selectedCity);
  }, [activeChart, selectedCity]);
  
  const kpiMetrics = useMemo(() => {
    if (!activeChart || activeChart.datasets.length === 0) {
      return { avgHumidity: 0, highestCity: 'N/A', highestValue: 0, lowestCity: 'N/A', lowestValue: 0 };
    }
    const cityAverages = activeChart.datasets.map(dataset => {
      const avg = dataset.data.reduce((sum, val) => sum + val, 0) / dataset.data.length;
      const max = Math.max(...dataset.data);
      return { city: dataset.label, avg, max };
    });
    const overallAvg = cityAverages.reduce((sum, c) => sum + c.avg, 0) / cityAverages.length;
    const highest = cityAverages.reduce((max, c) => c.max > max.max ? c : max, cityAverages[0]);
    const lowest = cityAverages.reduce((min, c) => c.avg < min.avg ? c : min, cityAverages[0]);
    return {
      avgHumidity: overallAvg,
      highestCity: highest.city,
      highestValue: highest.max,
      lowestCity: lowest.city,
      lowestValue: lowest.avg
    };
  }, [activeChart]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Humidity Trends</h2>
          <p className="text-gray-400 text-sm">{timeRange === 'hourly' ? 'Hourly' : 'Monthly'} humidity patterns across major cities</p>
        </div>
        <div className="flex gap-2">
           <select 
             value={selectedCity}
             onChange={(e) => setSelectedCity(e.target.value)}
             className="bg-card-dark border border-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-primary"
           >
             <option>All Cities</option>
             {availableCities.map(city => (
               <option key={city} value={city}>{city}</option>
             ))}
           </select>
           <div className="flex bg-card-dark border border-gray-700 rounded-lg p-1">
              <button 
                onClick={() => setTimeRange('hourly')}
                className={`px-3 py-1 text-xs font-medium rounded ${timeRange === 'hourly' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Hourly
              </button>
              <button 
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 text-xs font-medium rounded ${timeRange === 'monthly' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Monthly
              </button>
           </div>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-medium">Average Humidity</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-white">{kpiMetrics.avgHumidity.toFixed(1)}%</span>
          </div>
        </div>
        <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-medium">Highest Recorded</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-white">{kpiMetrics.highestValue.toFixed(1)}%</span>
            <span className="text-gray-500 text-sm mb-1">in {kpiMetrics.highestCity}</span>
          </div>
        </div>
        <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-medium">Lowest Average</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-white">{kpiMetrics.lowestValue.toFixed(1)}%</span>
            <span className="text-gray-500 text-sm mb-1">in {kpiMetrics.lowestCity}</span>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-white">City Humidity Comparison</h3>
        </div>

        {!activeChart || activeChart.labels.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <Droplet className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-white text-lg font-semibold mb-2">No Humidity Data Available</h3>
              <p className="text-gray-400 text-sm">{timeRange === 'hourly' ? 'Hourly' : 'Monthly'} humidity data is currently being processed.</p>
            </div>
          </div>
        ) : (
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
             <LineChart data={activeChart.labels.map((label, i) => ({
               time: label,
               ...filteredDatasets.reduce((acc, dataset) => ({
                 ...acc,
                 [dataset.label]: dataset.data[i]
               }), {})
             }))}>
               <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
               <XAxis dataKey="time" stroke="#718096" tick={{fill: '#718096', fontSize: 12}} axisLine={false} tickLine={false} />
               <YAxis stroke="#718096" tick={{fill: '#718096', fontSize: 12}} axisLine={false} tickLine={false} unit="%" />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#1C252E', borderColor: '#2D3748', borderRadius: '8px', color: '#fff' }}
                 itemStyle={{ color: '#fff' }}
               />
               <Legend verticalAlign="top" height={36} iconType="circle" />
               {filteredDatasets.map((dataset, idx) => (
                 <Line 
                   key={dataset.label}
                   type="monotone" 
                   dataKey={dataset.label} 
                   stroke={idx === 0 ? '#137fec' : idx === 1 ? '#38B2AC' : idx === 2 ? '#f59e0b' : '#ec4899'} 
                   strokeWidth={3} 
                   dot={{r: 3}} 
                 />
               ))}
             </LineChart>
           </ResponsiveContainer>
        </div>
        )}
      </div>
    </div>
  );
};

export default Humidity;