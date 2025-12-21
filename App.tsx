import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Overview from './pages/Overview';
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
  getWeatherChart 
} from './services/weatherService';
import { 
  CityStatistic,
  RealTimeStats, 
  TimeSeriesChartData,
  Anomaly, 
  WeatherChartData 
} from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('Never');
  
  // Data State - MongoDB collections
  const [cityStats, setCityStats] = useState<CityStatistic[]>([]);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats[]>([]);
  const [hourlyChart, setHourlyChart] = useState<TimeSeriesChartData | null>(null);
  const [monthlyChart, setMonthlyChart] = useState<TimeSeriesChartData | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [weatherChart, setWeatherChart] = useState<WeatherChartData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [cities, realTime, hourly, monthly, anomaliesData, weather] = await Promise.all([
        getCities(),
        getRealTimeLatest(),
        getHourlyChart(),
        getMonthlyChart('2017'),
        getAnomalies({ limit: 50 }),
        getWeatherChart()
      ]);
      
      setCityStats(cities);
      setRealTimeStats(realTime);
      setHourlyChart(hourly);
      setMonthlyChart(monthly);
      setAnomalies(anomaliesData);
      setWeatherChart(weather);
      
      setLastUpdated('Just now');
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
    const interval = setInterval(() => {
       fetchData();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const renderPage = () => {
    switch(currentPage) {
      case 'overview':
        return <Overview cityStats={cityStats} realTimeStats={realTimeStats} loading={loading} error={error} onRetry={fetchData} />;
      case 'temperature':
        return <Temperature hourlyChart={hourlyChart} loading={loading} error={error} onRetry={fetchData} />;
      case 'humidity':
        return <Humidity monthlyChart={monthlyChart} loading={loading} error={error} onRetry={fetchData} />;
      case 'anomalies':
        return <Anomalies anomalies={anomalies} loading={loading} error={error} onRetry={fetchData} />;
      case 'frequency':
      case 'cms-frequency':
        return <CMSFrequency weatherChart={weatherChart} loading={loading} error={error} onRetry={fetchData} />;
      default:
        return <Overview cityStats={cityStats} realTimeStats={realTimeStats} loading={loading} error={error} onRetry={fetchData} />;
    }
  };

  const getPageTitle = () => {
    switch(currentPage) {
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
            lastUpdated={lastUpdated}
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