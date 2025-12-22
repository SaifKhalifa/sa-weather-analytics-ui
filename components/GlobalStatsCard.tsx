import React from 'react';
import { GlobalStatistics } from '../types';
import { Thermometer, Droplet, Wind, Eye, Database, Cloud } from 'lucide-react';
import Tooltip from './Tooltip';

interface GlobalStatsCardProps {
  stats: GlobalStatistics | null;
  loading?: boolean;
}

const GlobalStatsCard: React.FC<GlobalStatsCardProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: Database,
      label: 'Total Records',
      value: stats.total_records.toLocaleString(),
      tooltip: 'Total number of weather records processed in the system',
      color: 'text-blue-400'
    },
    {
      icon: Thermometer,
      label: 'Max Temperature',
      value: `${stats.global_max_temp}°C`,
      tooltip: 'Highest temperature recorded across all cities',
      color: 'text-red-400'
    },
    {
      icon: Thermometer,
      label: 'Min Temperature',
      value: `${stats.global_min_temp}°C`,
      tooltip: 'Lowest temperature recorded across all cities',
      color: 'text-blue-400'
    },
    {
      icon: Thermometer,
      label: 'Avg Temperature',
      value: `${stats.global_avg_temp.toFixed(1)}°C`,
      tooltip: 'Average temperature across all cities and time periods',
      color: 'text-orange-400'
    },
    {
      icon: Droplet,
      label: 'Avg Humidity',
      value: `${stats.avg_humidity.toFixed(1)}%`,
      tooltip: 'Average humidity percentage across all locations',
      color: 'text-cyan-400'
    },
    {
      icon: Wind,
      label: 'Avg Wind Speed',
      value: `${stats.avg_wind.toFixed(1)} km/h`,
      tooltip: 'Average wind speed in kilometers per hour',
      color: 'text-gray-400'
    },
    {
      icon: Eye,
      label: 'Avg Visibility',
      value: `${stats.avg_visibility.toFixed(1)} km`,
      tooltip: 'Average visibility distance in kilometers',
      color: 'text-purple-400'
    },
    {
      icon: Database,
      label: 'Total Cities',
      value: stats.total_cities.toString(),
      tooltip: 'Number of distinct cities in the dataset',
      color: 'text-green-400'
    },
    {
      icon: Cloud,
      label: 'Weather Types',
      value: stats.total_weather_types.toString(),
      tooltip: 'Number of different weather conditions recorded',
      color: 'text-indigo-400'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">📊 Global Weather Statistics</h2>
        <span className="text-xs text-gray-400">
          Updated: {new Date(stats.updated_at).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Tooltip key={index} content={item.tooltip}>
              <div className="bg-card-dark/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:border-primary/30 transition-all cursor-help">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={item.color} size={18} />
                  <span className="text-gray-400 text-xs font-medium">{item.label}</span>
                </div>
                <p className="text-white text-2xl font-bold">{item.value}</p>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalStatsCard;
