import React, { useState } from 'react';
import { CityStatistic } from '../types';
import { Search, Thermometer, Wind, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import Tooltip from '../components/Tooltip';

interface AllCitiesProps {
  cityStats: CityStatistic[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const AllCities: React.FC<AllCitiesProps> = ({ cityStats, loading, error, onRetry }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter cities based on search
  const filteredCities = cityStats.filter(city =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTempStatus = (avgTemp: number) => {
    if (avgTemp > 40) return { label: 'Hot', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (avgTemp > 30) return { label: 'Warm', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (avgTemp > 20) return { label: 'Normal', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    return { label: 'Cool', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white mb-2">All Cities</h2>
        <p className="text-gray-400">Comprehensive weather statistics for all Saudi Arabian cities</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for a city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card-dark border border-gray-700 text-white pl-11 pr-4 py-3 rounded-lg outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Cities Grid */}
      {filteredCities.length === 0 ? (
        <div className="bg-card-dark border border-gray-800 rounded-xl p-12 text-center">
          <Search className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-white text-lg font-semibold mb-2">No Cities Found</h3>
          <p className="text-gray-400 text-sm">
            {searchTerm ? `No cities match "${searchTerm}"` : 'No city data available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map((city) => {
            const status = getTempStatus(city.avg_temp);
            const tempRange = city.max_temp - city.min_temp;

            return (
              <div
                key={city._id}
                className="bg-card-dark border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                {/* City Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white font-bold text-xl">{city.city}</h3>
                  <Tooltip content={`Temperature status based on average: ${city.avg_temp.toFixed(1)}°C`}>
                    <span className={`text-xs px-3 py-1.5 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </Tooltip>
                </div>

                {/* Main Temperature */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{city.avg_temp.toFixed(1)}</span>
                    <span className="text-2xl text-gray-400">°C</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Average Temperature</p>
                </div>

                {/* Temperature Range */}
                <div className="bg-gray-800/30 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Tooltip content="Lowest temperature recorded for this city">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="text-blue-400" size={16} />
                        <span className="text-blue-400 font-semibold">{city.min_temp}°C</span>
                      </div>
                    </Tooltip>
                    <Tooltip content="Highest temperature recorded for this city">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-red-400" size={16} />
                        <span className="text-red-400 font-semibold">{city.max_temp}°C</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Temperature Range: {tempRange}°C
                  </p>
                </div>

                {/* Additional Stats */}
                <div className="space-y-3">
                  <Tooltip content="Average wind speed in kilometers per hour">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Wind size={16} />
                        <span>Wind Speed</span>
                      </div>
                      <span className="text-white font-medium">{city.avg_wind.toFixed(1)} km/h</span>
                    </div>
                  </Tooltip>

                  <Tooltip content="Average visibility distance in kilometers">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Eye size={16} />
                        <span>Visibility</span>
                      </div>
                      <span className="text-white font-medium">{city.avg_visibility.toFixed(1)} km</span>
                    </div>
                  </Tooltip>

                  <Tooltip content="Total number of weather records collected">
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-700">
                      <span className="text-gray-400">Total Records</span>
                      <span className="text-white font-medium">{(city.record_count || 0).toLocaleString()}</span>
                    </div>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {filteredCities.length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Cities Shown</p>
              <p className="text-white text-2xl font-bold">{filteredCities.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Temperature</p>
              <p className="text-white text-2xl font-bold">
                {(filteredCities.reduce((sum, c) => sum + c.avg_temp, 0) / filteredCities.length).toFixed(1)}°C
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Hottest City</p>
              <p className="text-white text-2xl font-bold">
                {filteredCities.reduce((max, c) => c.avg_temp > max.avg_temp ? c : max).city}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Records</p>
              <p className="text-white text-2xl font-bold">
                {filteredCities.reduce((sum, c) => sum + c.record_count, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCities;
