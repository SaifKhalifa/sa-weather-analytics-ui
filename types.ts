// MongoDB Collection: city_statistics
export interface CityStatistic {
  _id: string;
  city: string;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  avg_wind: number;
  avg_visibility: number;
  record_count: number;
  updated_at: string;
}

// MongoDB Collection: weather_conditions
export interface WeatherCondition {
  _id: string;
  weather: string;
  count: number;
  percentage: number;
  updated_at: string;
}

// MongoDB Collection: hourly_patterns
export interface HourlyPattern {
  _id: string;
  city?: string; // Optional - included when querying by city
  hour: number;
  avg_temp: number;
  record_count: number;
  updated_at: string;
}

// MongoDB Collection: monthly_patterns
export interface MonthlyPattern {
  _id: string;
  city?: string; // Optional - included when querying by city
  year: string;
  month: number;
  avg_temp: number;
  record_count: number;
  updated_at: string;
}

// MongoDB Collection: anomalies
export interface Anomaly {
  _id: string;
  city: string;
  date: string;
  time: string;
  temp: number;
  wind: number;
  visibility: number;
  weather: string;
  anomaly_type: 'EXTREME_HOT' | 'EXTREME_COLD' | 'NORMAL';
  change_direction: 'RAPID_WARMING' | 'RAPID_COOLING' | 'STABLE';
  anomaly_severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  temp_zscore: number;
  temp_change: number;
  created_at: string;
}

// MongoDB Collection: real_time_stats
export interface RealTimeStats {
  _id: string;
  city: string;
  window_start: string;
  window_end: string;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  avg_wind: number;
  avg_visibility: number;
  record_count: number;
  updated_at: string;
}

// Chart data interfaces
export interface ChartDataPoint {
  time: string;
  [key: string]: string | number; // Dynamic city keys
}

export interface WeatherChartData {
  labels: string[];
  data: number[];
  percentages: number[];
}

export interface TimeSeriesChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

// MongoDB Collection: global_statistics (NEW - from ENHANCED_ANALYTICS_API.md)
export interface GlobalStatistics {
  _id?: string;
  total_records: number;
  global_min_temp: number;
  global_max_temp: number;
  global_avg_temp: number;
  avg_humidity: number;
  avg_wind: number;
  avg_visibility: number;
  total_cities: number;
  total_weather_types: number;
  updated_at: string;
}

// UI helper interfaces
export interface WeatherStat {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface CityData {
  name: string;
  temp: number;
  humidity: number;
  condition: string;
  lastUpdated: string;
}

export interface FrequencyData {
  condition: string;
  count: number;
}