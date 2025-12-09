import { Anomaly, ChartDataPoint, CityData, FrequencyData, WeatherStat } from '../types';

// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8080/api';
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

// API Endpoints
export const getOverviewStats = async (): Promise<WeatherStat[]> => {
  try {
    return await fetchWithRetry<WeatherStat[]>(`${API_BASE_URL}/weather/stats`);
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    throw error;
  }
};

export const getCityReadings = async (): Promise<CityData[]> => {
  try {
    return await fetchWithRetry<CityData[]>(`${API_BASE_URL}/weather/cities`);
  } catch (error) {
    console.error('Error fetching city readings:', error);
    throw error;
  }
};

export const getHourlyTempData = async (city?: string, range: string = '24h'): Promise<ChartDataPoint[]> => {
  try {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    params.append('range', range);
    
    return await fetchWithRetry<ChartDataPoint[]>(
      `${API_BASE_URL}/weather/temperature?${params.toString()}`
    );
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error;
  }
};

export const getHumidityData = async (cities?: string[]): Promise<ChartDataPoint[]> => {
  try {
    const params = new URLSearchParams();
    if (cities && cities.length > 0) {
      params.append('cities', cities.join(','));
    }
    
    return await fetchWithRetry<ChartDataPoint[]>(
      `${API_BASE_URL}/weather/humidity?${params.toString()}`
    );
  } catch (error) {
    console.error('Error fetching humidity data:', error);
    throw error;
  }
};

export const getAnomalies = async (severity?: string, startDate?: string, endDate?: string): Promise<Anomaly[]> => {
  try {
    const params = new URLSearchParams();
    if (severity && severity !== 'all') params.append('severity', severity);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return await fetchWithRetry<Anomaly[]>(
      `${API_BASE_URL}/weather/anomalies?${params.toString()}`
    );
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    throw error;
  }
};

export const getFrequencyData = async (timeRange: string = '7d', region: string = 'all'): Promise<FrequencyData[]> => {
  try {
    const params = new URLSearchParams({ timeRange, region });
    return await fetchWithRetry<FrequencyData[]>(
      `${API_BASE_URL}/weather/frequency?${params.toString()}`
    );
  } catch (error) {
    console.error('Error fetching frequency data:', error);
    throw error;
  }
};

// Export data as CSV
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

// Export data as JSON
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
