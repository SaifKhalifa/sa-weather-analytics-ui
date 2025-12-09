import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Overview from './pages/Overview';
import Temperature from './pages/Temperature';
import Humidity from './pages/Humidity';
import Anomalies from './pages/Anomalies';
import CMSFrequency from './pages/CMSFrequency';

import { getOverviewStats, getCityReadings, getHourlyTempData, getHumidityData, getAnomalies, getFrequencyData } from './services/weatherService';
import { WeatherStat, CityData, ChartDataPoint, Anomaly, FrequencyData } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('Never');
  
  // Data State
  const [stats, setStats] = useState<WeatherStat[]>([]);
  const [readings, setReadings] = useState<CityData[]>([]);
  const [tempData, setTempData] = useState<ChartDataPoint[]>([]);
  const [humidityData, setHumidityData] = useState<ChartDataPoint[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [frequencyData, setFrequencyData] = useState<FrequencyData[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, readingsData, tempDataRes, humidityDataRes, anomaliesData, frequencyDataRes] = await Promise.all([
        getOverviewStats(),
        getCityReadings(),
        getHourlyTempData(),
        getHumidityData(),
        getAnomalies(),
        getFrequencyData()
      ]);
      
      setStats(statsData);
      setReadings(readingsData);
      setTempData(tempDataRes);
      setHumidityData(humidityDataRes);
      setAnomalies(anomaliesData);
      setFrequencyData(frequencyDataRes);
      
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
        return <Overview stats={stats} readings={readings} loading={loading} error={error} onRetry={fetchData} />;
      case 'temperature':
        return <Temperature data={tempData} loading={loading} error={error} onRetry={fetchData} />;
      case 'humidity':
        return <Humidity data={humidityData} loading={loading} error={error} onRetry={fetchData} />;
      case 'anomalies':
        return <Anomalies data={anomalies} loading={loading} error={error} onRetry={fetchData} />;
      case 'frequency':
        return <CMSFrequency data={frequencyData} loading={loading} error={error} onRetry={fetchData} />;
      default:
        return <Overview stats={stats} readings={readings} loading={loading} error={error} onRetry={fetchData} />;
    }
  };

  const getPageTitle = () => {
    switch(currentPage) {
      case 'frequency': return 'Frequency Analysis';
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