import React, { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesChartData } from '../types';
import { Thermometer } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface TemperatureProps {
  hourlyChart: TimeSeriesChartData | null;
  monthlyChart: TimeSeriesChartData | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Temperature: React.FC<TemperatureProps> = ({ hourlyChart, monthlyChart, loading, error, onRetry }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [timeRange, setTimeRange] = useState<'hourly' | 'monthly'>('hourly');
  
  // Use hourly or monthly data based on selection
  const activeChart = timeRange === 'hourly' ? hourlyChart : monthlyChart;
  
  console.log('Temperature page - activeChart:', activeChart);
  console.log('Temperature page - timeRange:', timeRange);
  
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

  // Get available cities from the dataset
  const availableCities = activeChart?.datasets.map(d => d.label) || [];
  
  // Filter datasets based on selected city
  const filteredDatasets = useMemo(() => {
    if (!activeChart || selectedCity === 'All Cities') {
      return activeChart?.datasets || [];
    }
    return activeChart.datasets.filter(d => d.label === selectedCity);
  }, [activeChart, selectedCity]);
  
  // Get latest temperature for each city (last data point)
  const latestReadings = useMemo(() => {
    if (!activeChart || activeChart.datasets.length === 0) return [];
    
    return activeChart.datasets.map(dataset => {
      const lastTemp = dataset.data[dataset.data.length - 1];
      return {
        city: dataset.label,
        temp: lastTemp,
        status: lastTemp > 40 ? 'High' : lastTemp > 30 ? 'Warm' : 'Normal',
        statusColor: lastTemp > 40 ? 'bg-red-500/20 text-red-400' : lastTemp > 30 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
      };
    });
  }, [activeChart]);
  
  console.log('Available cities:', availableCities);
  console.log('Filtered datasets:', filteredDatasets);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Temperature Trends</h2>
          <p className="text-gray-400 text-sm">{timeRange === 'hourly' ? 'Hourly' : 'Monthly'} patterns across major cities</p>
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

      {/* Main Chart */}
      <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
        {!activeChart || activeChart.labels.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <Thermometer className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-white text-lg font-semibold mb-2">No Temperature Data Available</h3>
              <p className="text-gray-400 text-sm">{timeRange === 'hourly' ? 'Hourly' : 'Monthly'} temperature data is currently being processed.</p>
            </div>
          </div>
        ) : (
        <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeChart.labels.map((label, i) => ({
            time: label,
            ...filteredDatasets.reduce((acc, dataset) => ({
              ...acc,
              [dataset.label]: dataset.data[i]
            }), {})
          }))}>
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
            {filteredDatasets.map((dataset, idx) => (
              <Area 
                key={dataset.label}
                type="monotone" 
                dataKey={dataset.label} 
                stroke={idx === 0 ? '#137fec' : idx === 1 ? '#14b8a6' : '#f59e0b'} 
                strokeWidth={3} 
                fillOpacity={idx < 2 ? 1 : 0} 
                fill={idx === 0 ? 'url(#colorRiyadh)' : idx === 1 ? 'url(#colorJeddah)' : 'none'} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Detailed Stats Table */}
         <div className="bg-card-dark border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Latest Readings</h3>
            {latestReadings.length === 0 ? (
              <p className="text-gray-400 text-sm">No temperature data available</p>
            ) : (
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
                  {latestReadings.map((reading, index) => (
                    <tr key={reading.city} className={index < latestReadings.length - 1 ? "border-b border-gray-800/50" : ""}>
                      <td className="py-3">{reading.city}</td>
                      <td className="py-3 text-white font-medium">{reading.temp.toFixed(1)}°C</td>
                      <td className="py-3">
                        <span className={`${reading.statusColor} px-2 py-1 rounded text-xs`}>
                          {reading.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Temperature;