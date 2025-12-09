export interface WeatherStat {
  label: string;
  value: string;
  subtext: string;
  icon: string; // Icon name
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

export interface ChartDataPoint {
  time: string;
  Riyadh: number;
  Jeddah: number;
  Dammam: number;
}

export interface Anomaly {
  id: string;
  severity: 'Critical' | 'High' | 'Warning';
  timestamp: string;
  city: string;
  description: string;
}

export interface FrequencyData {
  condition: string;
  count: number;
}