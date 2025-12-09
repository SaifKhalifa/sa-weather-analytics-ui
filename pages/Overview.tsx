import React from 'react';
import { Thermometer, Droplet, Wind, AlertTriangle, ArrowRight } from 'lucide-react';
import { WeatherStat, CityData } from '../types';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface OverviewProps {
  stats: WeatherStat[];
  readings: CityData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Overview: React.FC<OverviewProps> = ({ stats, readings, loading, error, onRetry }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'thermometer': return Thermometer;
      case 'droplet': return Droplet;
      case 'wind': return Wind;
      case 'alert-triangle': return AlertTriangle;
      default: return Thermometer;
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={onRetry} type="network" />
      </div>
    );
  }

  if (loading && stats.length === 0) {
    return <LoadingState type="full" />;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = getIcon(stat.icon);
          return (
            <div key={stat.label} className="bg-card-dark border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="text-primary" size={20} />
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-white text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Awaiting Data Section (Visual Filler from Design) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
             <h3 className="text-white text-lg font-bold">Live City Status</h3>
             <button className="text-primary text-sm font-medium hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {readings.map((city) => (
             <div key={city.name} className="bg-card-dark border border-gray-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{city.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${city.temp > 40 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {city.temp > 40 ? 'High' : 'Normal'}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                        <p className="text-gray-500 text-xs">Temp</p>
                        <p className="text-xl text-white font-medium">{city.temp}°C</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Humidity</p>
                        <p className="text-xl text-white font-medium">{city.humidity}%</p>
                    </div>
                </div>
                <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                    <span>{city.condition}</span>
                    <span>{city.lastUpdated}</span>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;