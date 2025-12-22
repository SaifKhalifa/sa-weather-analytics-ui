import React from 'react';
import { Thermometer, Droplet, Wind, AlertTriangle, Activity } from 'lucide-react';
import { CityStatistic, RealTimeStats, GlobalStatistics } from '../types';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import Tooltip from '../components/Tooltip';
import GlobalStatsCard from '../components/GlobalStatsCard';

interface OverviewProps {
  cityStats: CityStatistic[];
  realTimeStats: RealTimeStats[];
  globalStats: GlobalStatistics | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Overview: React.FC<OverviewProps> = ({ cityStats, realTimeStats, globalStats, loading, error, onRetry }) => {
  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={onRetry} type="network" />
      </div>
    );
  }

  if (loading && cityStats.length === 0) {
    return <LoadingState type="full" />;
  }

  // Deduplicate cities by city name (keep first occurrence)
  const uniqueCities = cityStats.reduce((acc, city) => {
    if (!acc.find(c => c.city === city.city)) {
      acc.push(city);
    }
    return acc;
  }, [] as CityStatistic[]);

  // Calculate overview statistics
  const avgTemp = uniqueCities.length > 0
    ? (uniqueCities.reduce((sum, city) => sum + city.avg_temp, 0) / uniqueCities.length).toFixed(1)
    : '0.0';
  
  const maxTemp = uniqueCities.length > 0
    ? Math.max(...uniqueCities.map(c => c.max_temp))
    : 0;
    
  const avgWind = uniqueCities.length > 0
    ? (uniqueCities.reduce((sum, city) => sum + city.avg_wind, 0) / uniqueCities.length).toFixed(1)
    : '0.0';
    
  const totalRecords = uniqueCities.reduce((sum, city) => sum + city.record_count, 0);

  const stats = [
    { label: 'Average Temperature', value: `${avgTemp}°C`, subtext: 'Across all cities', icon: 'thermometer', trend: 'up' as const, trendValue: '+2°' },
    { label: 'Max Temperature', value: `${maxTemp}°C`, subtext: 'Highest recorded', icon: 'alert-triangle', trend: 'neutral' as const },
    { label: 'Average Wind Speed', value: `${avgWind} km/h`, subtext: 'Across all cities', icon: 'wind', trend: 'down' as const, trendValue: '-3%' },
    { label: 'Total Records', value: totalRecords.toLocaleString(), subtext: 'Data points analyzed', icon: 'activity', trend: 'up' as const, trendValue: '+12%' },
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'thermometer': return Thermometer;
      case 'droplet': return Droplet;
      case 'wind': return Wind;
      case 'alert-triangle': return AlertTriangle;
      case 'activity': return Activity;
      default: return Thermometer;
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Global Statistics */}
      <GlobalStatsCard stats={globalStats} loading={loading} />

      {/* City Statistics Cards */}
      <div className="space-y-4">
        <h3 className="text-white text-lg font-bold">City Statistics</h3>
        
        {uniqueCities.length === 0 ? (
          <div className="bg-card-dark border border-gray-800 rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <Thermometer className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-white text-lg font-semibold mb-2">No City Data Available</h3>
              <p className="text-gray-400 text-sm">Weather data is currently being processed. Please check back in a few moments.</p>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {uniqueCities.slice(0, 8).map((city) => (
             <div key={city._id} className="bg-card-dark border border-gray-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{city.city}</span>
                    <Tooltip content={`${city.avg_temp > 40 ? 'Very high temperatures above 40°C' : city.avg_temp > 30 ? 'Warm temperatures between 30-40°C' : 'Normal comfortable temperatures below 30°C'}`}>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        city.avg_temp > 40 
                          ? 'bg-red-500/20 text-red-400' 
                          : city.avg_temp > 30 
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                          {city.avg_temp > 40 ? 'Hot' : city.avg_temp > 30 ? 'Warm' : 'Normal'}
                      </span>
                    </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                        <p className="text-gray-500 text-xs">Avg Temp</p>
                        <p className="text-xl text-white font-medium">{city.avg_temp.toFixed(1)}°C</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Wind</p>
                        <p className="text-xl text-white font-medium">{city.avg_wind.toFixed(1)} km/h</p>
                    </div>
                </div>
                <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                    <span>Min: {city.min_temp ?? 'N/A'}°C / Max: {city.max_temp ?? 'N/A'}°C</span>
                </div>
             </div>
          ))}
        </div>
        )}
      </div>

      {/* Real-Time Stats */}
      {realTimeStats.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-bold">Real-Time Updates</h3>
            <span className="text-xs text-gray-500">
              Updated {new Date(realTimeStats[0].updated_at).toLocaleTimeString()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realTimeStats.slice(0, 4).map((stat) => (
              <div key={stat._id} className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">{stat.city}</span>
                  <Activity className="text-primary" size={16} />
                </div>
                
                <div className="flex items-baseline space-x-2">
                  <p className="text-white text-2xl font-bold">{stat.avg_temp.toFixed(1)}°C</p>
                  <p className="text-gray-400 text-sm">live</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Min</p>
                    <p className="text-white font-medium">{stat.min_temp.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Max</p>
                    <p className="text-white font-medium">{stat.max_temp.toFixed(1)}°C</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;