import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Overview from './pages/Overview';
import AllCities from './pages/AllCities';
import Temperature from './pages/Temperature';
import Humidity from './pages/Humidity';
import Anomalies from './pages/Anomalies';
import CMSFrequency from './pages/CMSFrequency';

import { 
  getCities, 
  getRealTimeLatest,
  getHourlyChart, 
  getMonthlyChart,
  getAnomalies,
  getWeatherChart,
  getGlobalStatistics,
  getWeatherFrequencies,
  getCityFrequencies
} from './services/weatherService';
import { 
  CityStatistic,
  RealTimeStats, 
  TimeSeriesChartData,
  Anomaly, 
  WeatherChartData,
  GlobalStatistics,
  FrequencyData
} from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // in milliseconds
  
  // Data State - MongoDB collections
  const [cityStats, setCityStats] = useState<CityStatistic[]>([]);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats[]>([]);
  const [hourlyChart, setHourlyChart] = useState<TimeSeriesChartData | null>(null);
  const [monthlyChart, setMonthlyChart] = useState<TimeSeriesChartData | null>(null);
  const [hourlyHumidityChart, setHourlyHumidityChart] = useState<TimeSeriesChartData | null>(null);
  const [monthlyHumidityChart, setMonthlyHumidityChart] = useState<TimeSeriesChartData | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [weatherChart, setWeatherChart] = useState<WeatherChartData | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStatistics | null>(null);
  const [weatherFrequencies, setWeatherFrequencies] = useState<FrequencyData[]>([]);
  const [cityFrequencies, setCityFrequencies] = useState<FrequencyData[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cities, realTime, hourlyTemp, monthlyTemp, hourlyHumid, monthlyHumid, anomaliesData, weather, global, weatherFreqs, cityFreqs] = await Promise.all([
        getCities(),
        getRealTimeLatest(),
        getHourlyChart('temp'),
        getMonthlyChart('2017', 'temp'),
        getHourlyChart('humidity'),
        getMonthlyChart('2017', 'humidity'),
        getAnomalies({ limit: 100 }), // Increased limit for diverse city coverage
        getWeatherChart(),
        getGlobalStatistics(),
        getWeatherFrequencies(10),
        getCityFrequencies(10)
      ]);
      
      setCityStats(cities);
      setRealTimeStats(realTime);
      setHourlyChart(hourlyTemp);
      setMonthlyChart(monthlyTemp);
      setHourlyHumidityChart(hourlyHumid);
      setMonthlyHumidityChart(monthlyHumid);
      setAnomalies(anomaliesData);
      setWeatherChart(weather);
      setGlobalStats(global);
      setWeatherFrequencies(weatherFreqs);
      setCityFrequencies(cityFreqs);
      
      console.log('City Stats received:', cities);
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
       fetchData();
  }, refreshInterval);
  return () => clearInterval(interval);
}, [fetchData, autoRefresh, refreshInterval]);

  const renderPage = () => {
    switch(currentPage) {
      case 'overview':
        return <Overview cityStats={cityStats} realTimeStats={realTimeStats} globalStats={globalStats} loading={loading} error={error} onRetry={fetchData} />;
      case 'all-cities':
        return <AllCities cityStats={cityStats} loading={loading} error={error} onRetry={fetchData} />;
      case 'temperature':
        return <Temperature hourlyChart={hourlyChart} monthlyChart={monthlyChart} loading={loading} error={error} onRetry={fetchData} />;
      case 'humidity':
        return <Humidity hourlyChart={hourlyHumidityChart} monthlyChart={monthlyHumidityChart} loading={loading} error={error} onRetry={fetchData} />;
      case 'anomalies':
        return <Anomalies anomalies={anomalies} loading={loading} error={error} onRetry={fetchData} />;
      case 'frequency':
      case 'cms-frequency':
        return <CMSFrequency weatherFrequencies={weatherFrequencies} cityFrequencies={cityFrequencies} loading={loading} error={error} onRetry={fetchData} />;
      default:
        return <Overview cityStats={cityStats} realTimeStats={realTimeStats} globalStats={globalStats} loading={loading} error={error} onRetry={fetchData} />;
    }
  };

  const getPageTitle = () => {
    switch(currentPage) {
      case 'all-cities': return 'All Cities';
      case 'frequency': 
      case 'cms-frequency': 
        return 'Frequency Analysis';
      case 'anomalies': return 'Anomalies & Alerts';
      default: return currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full bg-[#101922] text-white font-sans overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header 
            title={getPageTitle()} 
            onRefresh={fetchData} 
            isRefreshing={loading}
            globalStats={globalStats}
            autoRefresh={autoRefresh}
            onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
            refreshInterval={refreshInterval}
            onChangeInterval={setRefreshInterval}
          />
          
          <main className="flex-1 overflow-y-auto bg-[#101922] scroll-smooth">
            {renderPage()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;