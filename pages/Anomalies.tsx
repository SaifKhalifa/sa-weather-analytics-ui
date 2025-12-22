import React, { useState, useMemo } from 'react';
import { Anomaly } from '../types';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Thermometer, Wind, Eye, Filter } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';

interface AnomaliesProps {
  anomalies: Anomaly[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const Anomalies: React.FC<AnomaliesProps> = ({ anomalies, loading, error, onRetry }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(anomalies.map(a => a.city))).sort();
    return uniqueCities;
  }, [anomalies]);

  // Filter anomalies
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter(anomaly => {
      if (filterSeverity !== 'all' && anomaly.anomaly_severity !== filterSeverity) return false;
      if (filterCity !== 'all' && anomaly.city !== filterCity) return false;
      if (filterType !== 'all' && anomaly.anomaly_type !== filterType) return false;
      return true;
    });
  }, [anomalies, filterSeverity, filterCity, filterType]);

  // Count by severity
  const severityCounts = useMemo(() => {
    return {
      CRITICAL: anomalies.filter(a => a.anomaly_severity === 'CRITICAL').length,
      HIGH: anomalies.filter(a => a.anomaly_severity === 'HIGH').length,
      MEDIUM: anomalies.filter(a => a.anomaly_severity === 'MEDIUM').length,
      LOW: anomalies.filter(a => a.anomaly_severity === 'LOW').length,
    };
  }, [anomalies]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'LOW': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EXTREME_HOT': return <TrendingUp size={16} className="text-red-400" />;
      case 'EXTREME_COLD': return <TrendingDown size={16} className="text-blue-400" />;
      default: return <Minus size={16} className="text-gray-400" />;
    }
  };

  const getChangeIcon = (direction: string) => {
    switch (direction) {
      case 'RAPID_WARMING': return <TrendingUp size={14} className="text-orange-400" />;
      case 'RAPID_COOLING': return <TrendingDown size={14} className="text-blue-400" />;
      default: return <Minus size={14} className="text-gray-400" />;
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={onRetry} type="network" />
      </div>
    );
  }

  if (loading) {
    return <LoadingState type="table" />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-1">Weather Anomalies</h2>
        <p className="text-gray-400">Real-time detection of unusual weather patterns and extreme conditions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Critical</p>
              <p className="text-white text-2xl font-bold mt-1">{severityCounts.CRITICAL}</p>
            </div>
            <AlertTriangle className="text-red-400" size={24} />
          </div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">High</p>
              <p className="text-white text-2xl font-bold mt-1">{severityCounts.HIGH}</p>
            </div>
            <AlertTriangle className="text-orange-400" size={24} />
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Medium</p>
              <p className="text-white text-2xl font-bold mt-1">{severityCounts.MEDIUM}</p>
            </div>
            <AlertTriangle className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Low</p>
              <p className="text-white text-2xl font-bold mt-1">{severityCounts.LOW}</p>
            </div>
            <AlertTriangle className="text-blue-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card-dark border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={18} className="text-gray-400" />
          
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="EXTREME_HOT">Extreme Hot</option>
            <option value="EXTREME_COLD">Extreme Cold</option>
            <option value="NORMAL">Normal</option>
          </select>

          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Cities</option>
            {cities.map((city, index) => (
              <option key={`${city}-${index}`} value={city}>{city}</option>
            ))}
          </select>

          <div className="ml-auto text-sm text-gray-400">
            Showing <span className="text-white font-semibold">{filteredAnomalies.length}</span> of {anomalies.length} anomalies
          </div>
        </div>
      </div>

      {/* Anomalies Cards */}
      <div className="space-y-3">
        {filteredAnomalies.length === 0 ? (
          <div className="bg-card-dark border border-gray-800 rounded-xl p-12 text-center">
            <AlertTriangle className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-white text-lg font-semibold mb-2">No Anomalies Found</h3>
            <p className="text-gray-400 text-sm">
              {anomalies.length === 0 
                ? "There are currently no weather anomalies detected in the system." 
                : "No anomalies match your selected filters. Try adjusting the filters above."}
            </p>
          </div>
        ) : (
          filteredAnomalies.map((anomaly) => {
            const severityClass = getSeverityColor(anomaly.anomaly_severity);
            return (
              <div
                key={anomaly._id}
                className="bg-card-dark border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {/* Severity Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityClass}`}>
                        {anomaly.anomaly_severity}
                      </span>
                      
                      {/* Type Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 rounded-lg">
                        {getTypeIcon(anomaly.anomaly_type)}
                        <span className="text-xs text-gray-300">
                          {anomaly.anomaly_type.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Change Direction */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 rounded-lg">
                        {getChangeIcon(anomaly.change_direction)}
                        <span className="text-xs text-gray-300">
                          {anomaly.change_direction.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* City & Date */}
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-white">{anomaly.city}</h3>
                      <span className="text-sm text-gray-400">
                        {anomaly.date} at {anomaly.time}
                      </span>
                    </div>

                    {/* Weather Condition */}
                    <p className="text-gray-300 text-sm mb-3">
                      Weather: <span className="text-white font-medium">{anomaly.weather}</span>
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                        <Thermometer size={16} className="text-orange-400" />
                        <div>
                          <p className="text-xs text-gray-400">Temperature</p>
                          <p className="text-sm font-semibold text-white">{anomaly.temp.toFixed(1)}°C</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                        <Wind size={16} className="text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">Wind</p>
                          <p className="text-sm font-semibold text-white">{anomaly.wind.toFixed(1)} km/h</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                        <Eye size={16} className="text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Visibility</p>
                          <p className="text-sm font-semibold text-white">{anomaly.visibility.toFixed(1)} km</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                        <TrendingUp size={16} className="text-yellow-400" />
                        <div>
                          <p className="text-xs text-gray-400">Temp Change</p>
                          <p className="text-sm font-semibold text-white">{anomaly.temp_change > 0 ? '+' : ''}{anomaly.temp_change.toFixed(1)}°C</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                        <AlertTriangle size={16} className="text-red-400" />
                        <div>
                          <p className="text-xs text-gray-400">Z-Score</p>
                          <p className="text-sm font-semibold text-white">{anomaly.temp_zscore.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Anomalies;