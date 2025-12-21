# Backend Integration Guide

## Overview
This document specifies the exact API endpoints that the backend must implement to work with this frontend.

## Base URL
- Development: `http://localhost:3000/api`
- Production: Set via `VITE_API_BASE_URL` environment variable

## Required API Endpoints

### 1. City Statistics
**GET `/api/cities`**
Returns all city weather statistics.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "city": "Riyadh",
    "avg_temp": 28.5,
    "min_temp": 15,
    "max_temp": 45,
    "avg_wind": 12.3,
    "avg_visibility": 9.5,
    "record_count": 15234,
    "updated_at": "2024-12-21T10:30:00Z"
  }
]
```

**GET `/api/cities/:cityName`**
Returns statistics for a specific city.

**GET `/api/cities/top/hottest?limit=5`**
Returns top N hottest cities.

---

### 2. Weather Distribution
**GET `/api/weather/distribution`**
Returns weather condition distribution.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "weather": "Clear",
    "count": 12500,
    "percentage": 45.2,
    "updated_at": "2024-12-21T10:30:00Z"
  }
]
```

**GET `/api/weather/distribution/chart`**
Returns data formatted for charts.

**Response:**
```json
{
  "labels": ["Clear", "Cloudy", "Rain"],
  "data": [12500, 8500, 2000],
  "percentages": [45.2, 30.7, 7.2]
}
```

---

### 3. Hourly Patterns
**GET `/api/patterns/hourly`**
Returns 24-hour temperature patterns.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "hour": 0,
    "avg_temp": 22.5,
    "record_count": 1250,
    "updated_at": "2024-12-21T10:30:00Z"
  }
]
```

**GET `/api/patterns/hourly/chart`**
Returns time series data for charts.

**Response:**
```json
{
  "labels": ["00:00", "01:00", ..., "23:00"],
  "datasets": [
    {
      "label": "Average Temperature",
      "data": [22.5, 21.8, 21.2, ...]
    }
  ]
}
```

---

### 4. Monthly Patterns
**GET `/api/patterns/monthly?year=2017`**
Returns monthly temperature patterns.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "year": "2017",
    "month": 1,
    "avg_temp": 18.5,
    "record_count": 3456,
    "updated_at": "2024-12-21T10:30:00Z"
  }
]
```

**GET `/api/patterns/monthly/chart?year=2017`**
Returns time series data for charts.

---

### 5. Anomalies
**GET `/api/anomalies?severity=CRITICAL&city=Riyadh&limit=50`**
Returns filtered anomalies.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "city": "Riyadh",
    "date": "2024-12-21T14:30:00Z",
    "time": "14:30",
    "temp": 48,
    "wind": 45,
    "visibility": 2,
    "weather": "Dust",
    "anomaly_type": "EXTREME_HOT",
    "change_direction": "RAPID_WARMING",
    "anomaly_severity": "CRITICAL",
    "temp_zscore": 3.5,
    "temp_change": 15.2,
    "created_at": "2024-12-21T14:31:00Z"
  }
]
```

**GET `/api/anomalies/critical`**
Returns only critical anomalies (top 10).

**GET `/api/anomalies/stats`**
Returns aggregated anomaly statistics.

**GET `/api/anomalies/cities/:cityName`**
Returns anomalies for specific city.

---

### 6. Real-Time Stats
**GET `/api/realtime/latest`**
Returns latest real-time statistics for all cities.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "city": "Riyadh",
    "window_start": "2024-12-21T14:00:00Z",
    "window_end": "2024-12-21T14:30:00Z",
    "avg_temp": 32.5,
    "min_temp": 30.2,
    "max_temp": 35.8,
    "avg_wind": 15.3,
    "avg_visibility": 8.5,
    "record_count": 180,
    "updated_at": "2024-12-21T14:30:00Z"
  }
]
```

**GET `/api/realtime/cities/:cityName`**
Returns latest real-time stats for specific city.

**GET `/api/realtime/history/:cityName?hours=24`**
Returns real-time history for a city.

---

### 7. Download Endpoints
**GET `/api/download/list`**
Returns list of available CSV downloads.

**Response:**
```json
[
  {
    "id": "city-stats",
    "name": "City Statistics",
    "description": "City-level weather statistics"
  }
]
```

**GET `/api/download/csv/:type`**
Downloads CSV file. Types: `city-stats`, `weather-conditions`, `hourly`, `monthly`, `anomalies`

---

## MongoDB Collections

### city_statistics
```javascript
{
  city: String,
  avg_temp: Number,
  min_temp: Number,
  max_temp: Number,
  avg_wind: Number,
  avg_visibility: Number,
  record_count: Number,
  updated_at: Date
}
```

### weather_conditions
```javascript
{
  weather: String,
  count: Number,
  percentage: Number,
  updated_at: Date
}
```

### hourly_patterns
```javascript
{
  hour: Number,  // 0-23
  avg_temp: Number,
  record_count: Number,
  updated_at: Date
}
```

### monthly_patterns
```javascript
{
  year: String,
  month: Number,  // 1-12
  avg_temp: Number,
  record_count: Number,
  updated_at: Date
}
```

### anomalies
```javascript
{
  city: String,
  date: Date,
  time: String,
  temp: Number,
  wind: Number,
  visibility: Number,
  weather: String,
  anomaly_type: String,  // EXTREME_HOT, EXTREME_COLD, NORMAL
  change_direction: String,  // RAPID_WARMING, RAPID_COOLING, STABLE
  anomaly_severity: String,  // CRITICAL, HIGH, MEDIUM, LOW
  temp_zscore: Number,
  temp_change: Number,
  created_at: Date
}
```

### real_time_stats
```javascript
{
  city: String,
  window_start: String,
  window_end: String,
  avg_temp: Number,
  min_temp: Number,
  max_temp: Number,
  avg_wind: Number,
  avg_visibility: Number,
  record_count: Number,
  updated_at: Date
}
```

## Error Handling
All endpoints should return appropriate HTTP status codes:
- **200**: Success
- **400**: Bad Request
- **404**: Not Found
- **500**: Internal Server Error

Error response format:
```json
{
  "error": "Error message",
  "statusCode": 500
}
```

## CORS Configuration
Backend must allow requests from:
- Development: `http://localhost:3000`
- Production: Your Netlify domain

## Next Steps
1. Review this specification
2. Implement backend using BACKEND_API.md as reference
3. Test each endpoint using Postman or curl
4. Set `VITE_API_BASE_URL` in Netlify dashboard
5. Deploy and verify integration
