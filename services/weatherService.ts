import { 
  Anomaly, 
  CityStatistic, 
  WeatherCondition, 
  HourlyPattern, 
  MonthlyPattern,
  RealTimeStats,
  WeatherChartData,
  TimeSeriesChartData
} from '../types';

// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

// Custom Error Types
export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Helper function for API calls with retry logic
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        response.status,
        `API request failed: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Retry on network errors or 5xx errors
    if (retries > 0 && (error.name === 'AbortError' || error.statusCode >= 500)) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      return fetchWithRetry<T>(url, options, retries - 1);
    }

    throw error;
  }
}

// =====================
// CITY STATISTICS APIs
// =====================

export const getCities = async (): Promise<CityStatistic[]> => {
  try {
    return await fetchWithRetry<CityStatistic[]>(`${API_BASE_URL}/cities`);
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const getCity = async (cityName: string): Promise<CityStatistic> => {
  try {
    return await fetchWithRetry<CityStatistic>(`${API_BASE_URL}/cities/${cityName}`);
  } catch (error) {
    console.error(`Error fetching city ${cityName}:`, error);
    throw error;
  }
};

export const getHottestCities = async (limit: number = 5): Promise<CityStatistic[]> => {
  try {
    return await fetchWithRetry<CityStatistic[]>(`${API_BASE_URL}/cities/top/hottest?limit=${limit}`);
  } catch (error) {
    console.error('Error fetching hottest cities:', error);
    throw error;
  }
};

// ===========================
// WEATHER DISTRIBUTION APIs
// ===========================

export const getWeatherDistribution = async (): Promise<WeatherCondition[]> => {
  try {
    return await fetchWithRetry<WeatherCondition[]>(`${API_BASE_URL}/weather/distribution`);
  } catch (error) {
    console.error('Error fetching weather distribution:', error);
    throw error;
  }
};

export const getWeatherChart = async (): Promise<WeatherChartData> => {
  try {
    return await fetchWithRetry<WeatherChartData>(`${API_BASE_URL}/weather/distribution/chart`);
  } catch (error) {
    console.error('Error fetching weather chart:', error);
    throw error;
  }
};

// ====================
// PATTERN APIs
// ====================

export const getHourlyPatterns = async (): Promise<HourlyPattern[]> => {
  try {
    return await fetchWithRetry<HourlyPattern[]>(`${API_BASE_URL}/patterns/hourly`);
  } catch (error) {
    console.error('Error fetching hourly patterns:', error);
    throw error;
  }
};

export const getHourlyChart = async (): Promise<TimeSeriesChartData> => {
  try {
    return await fetchWithRetry<TimeSeriesChartData>(`${API_BASE_URL}/patterns/hourly/chart`);
  } catch (error) {
    console.error('Error fetching hourly chart:', error);
    throw error;
  }
};

export const getMonthlyPatterns = async (year?: string): Promise<MonthlyPattern[]> => {
  try {
    const url = year 
      ? `${API_BASE_URL}/patterns/monthly?year=${year}`
      : `${API_BASE_URL}/patterns/monthly`;
    return await fetchWithRetry<MonthlyPattern[]>(url);
  } catch (error) {
    console.error('Error fetching monthly patterns:', error);
    throw error;
  }
};

export const getMonthlyChart = async (year?: string): Promise<TimeSeriesChartData> => {
  try {
    const url = year 
      ? `${API_BASE_URL}/patterns/monthly/chart?year=${year}`
      : `${API_BASE_URL}/patterns/monthly/chart`;
    return await fetchWithRetry<TimeSeriesChartData>(url);
  } catch (error) {
    console.error('Error fetching monthly chart:', error);
    throw error;
  }
};

// ====================
// ANOMALY APIs
// ====================

export const getAnomalies = async (params?: {
  severity?: string;
  city?: string;
  limit?: number;
}): Promise<Anomaly[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.severity) searchParams.append('severity', params.severity);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const url = searchParams.toString() 
      ? `${API_BASE_URL}/anomalies?${searchParams.toString()}`
      : `${API_BASE_URL}/anomalies`;
      
    return await fetchWithRetry<Anomaly[]>(url);
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    throw error;
  }
};

export const getCriticalAnomalies = async (): Promise<Anomaly[]> => {
  try {
    return await fetchWithRetry<Anomaly[]>(`${API_BASE_URL}/anomalies/critical`);
  } catch (error) {
    console.error('Error fetching critical anomalies:', error);
    throw error;
  }
};

export const getAnomalyStats = async (): Promise<any> => {
  try {
    return await fetchWithRetry<any>(`${API_BASE_URL}/anomalies/stats`);
  } catch (error) {
    console.error('Error fetching anomaly stats:', error);
    throw error;
  }
};

export const getCityAnomalies = async (cityName: string): Promise<Anomaly[]> => {
  try {
    return await fetchWithRetry<Anomaly[]>(`${API_BASE_URL}/anomalies/cities/${cityName}`);
  } catch (error) {
    console.error(`Error fetching anomalies for ${cityName}:`, error);
    throw error;
  }
};

// ====================
// REAL-TIME APIs
// ====================

export const getRealTimeLatest = async (): Promise<RealTimeStats[]> => {
  try {
    return await fetchWithRetry<RealTimeStats[]>(`${API_BASE_URL}/realtime/latest`);
  } catch (error) {
    console.error('Error fetching real-time latest:', error);
    throw error;
  }
};

export const getCityRealTime = async (cityName: string): Promise<RealTimeStats> => {
  try {
    return await fetchWithRetry<RealTimeStats>(`${API_BASE_URL}/realtime/cities/${cityName}`);
  } catch (error) {
    console.error(`Error fetching real-time data for ${cityName}:`, error);
    throw error;
  }
};

export const getRealTimeHistory = async (cityName: string, hours: number = 24): Promise<RealTimeStats[]> => {
  try {
    return await fetchWithRetry<RealTimeStats[]>(
      `${API_BASE_URL}/realtime/history/${cityName}?hours=${hours}`
    );
  } catch (error) {
    console.error(`Error fetching real-time history for ${cityName}:`, error);
    throw error;
  }
};

// ====================
// DOWNLOAD APIs
// ====================

export const getDownloadList = async (): Promise<any[]> => {
  try {
    return await fetchWithRetry<any[]>(`${API_BASE_URL}/download/list`);
  } catch (error) {
    console.error('Error fetching download list:', error);
    throw error;
  }
};

export const downloadCSV = async (type: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/download/csv/${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/csv',
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, `Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Error downloading CSV ${type}:`, error);
    throw error;
  }
};

// =========================
// EXPORT UTILITY FUNCTIONS
// =========================

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replaceAll('"', '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToJSON = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};
