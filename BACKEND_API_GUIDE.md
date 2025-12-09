# Backend API Requirements for SA Weather Analytics

## Overview
This document describes the REST API endpoints your Scala/Kafka backend must implement to work with the React frontend dashboard.

## Base URL
- Development: `http://localhost:8080/api`
- Production: `https://your-domain.com/api`

## Authentication
Currently, no authentication is required. Consider adding JWT tokens for production.

## CORS Configuration
Your backend must allow requests from:
- Development: `http://localhost:3000`
- Production: Your deployed frontend domain

## Endpoints

### 1. Get Overview Statistics
**GET** `/weather/stats`

Returns key metrics displayed on the dashboard overview.

**Response:**
```json
[
  {
    "label": "Max Temperature",
    "value": "45°C",
    "subtext": "in Riyadh",
    "icon": "thermometer",
    "trend": "up"
  },
  {
    "label": "Highest Humidity",
    "value": "85%",
    "subtext": "in Dammam",
    "icon": "droplet",
    "trend": "up"
  },
  {
    "label": "Most Frequent Event",
    "value": "High Winds",
    "subtext": "Nationwide",
    "icon": "wind"
  },
  {
    "label": "Anomalies Today",
    "value": "3",
    "subtext": "Critical Alerts",
    "icon": "alert-triangle",
    "trend": "down"
  }
]
```

**MongoDB Query Example:**
```javascript
// Get max temperature across all cities today
db.weatherData.find({ 
  timestamp: { $gte: startOfDay } 
}).sort({ temperature: -1 }).limit(1)

// Count anomalies today
db.anomalies.countDocuments({ 
  timestamp: { $gte: startOfDay },
  severity: "Critical"
})
```

---

### 2. Get City Readings
**GET** `/weather/cities`

Returns latest weather readings for major cities.

**Response:**
```json
[
  {
    "name": "Riyadh",
    "temp": 45,
    "humidity": 15,
    "condition": "Clear",
    "lastUpdated": "2 min ago"
  },
  {
    "name": "Jeddah",
    "temp": 35,
    "humidity": 70,
    "condition": "Humid",
    "lastUpdated": "5 min ago"
  },
  {
    "name": "Dammam",
    "temp": 38,
    "humidity": 50,
    "condition": "Windy",
    "lastUpdated": "1 min ago"
  },
  {
    "name": "Abha",
    "temp": 25,
    "humidity": 40,
    "condition": "Cloudy",
    "lastUpdated": "10 min ago"
  }
]
```

**MongoDB Query:**
```javascript
// Get latest reading for each city
db.weatherData.aggregate([
  { $sort: { timestamp: -1 } },
  { $group: {
      _id: "$city",
      temp: { $first: "$temperature" },
      humidity: { $first: "$humidity" },
      condition: { $first: "$condition" },
      lastUpdated: { $first: "$timestamp" }
    }
  }
])
```

---

### 3. Get Temperature Data
**GET** `/weather/temperature?city={city}&range={range}`

Returns hourly temperature trends for visualization.

**Query Parameters:**
- `city` (optional): Filter by specific city
- `range` (optional): Time range - "24h" (default), "7d", "30d"

**Response:**
```json
[
  {
    "time": "00:00",
    "Riyadh": 35,
    "Jeddah": 32,
    "Dammam": 38
  },
  {
    "time": "04:00",
    "Riyadh": 30,
    "Jeddah": 30,
    "Dammam": 35
  },
  {
    "time": "08:00",
    "Riyadh": 38,
    "Jeddah": 33,
    "Dammam": 40
  }
]
```

**MongoDB Query:**
```javascript
// Get hourly averages for last 24 hours
db.weatherData.aggregate([
  { $match: { 
      timestamp: { $gte: last24Hours }
    }
  },
  { $group: {
      _id: { 
        hour: { $hour: "$timestamp" },
        city: "$city"
      },
      avgTemp: { $avg: "$temperature" }
    }
  },
  { $sort: { "_id.hour": 1 } }
])
```

---

### 4. Get Humidity Data
**GET** `/weather/humidity?cities={city1,city2}`

Returns humidity trends for comparison.

**Query Parameters:**
- `cities` (optional): Comma-separated list of cities

**Response:**
```json
[
  {
    "time": "00:00",
    "Riyadh": 12,
    "Jeddah": 65,
    "Dammam": 45
  },
  {
    "time": "04:00",
    "Riyadh": 15,
    "Jeddah": 70,
    "Dammam": 50
  }
]
```

---

### 5. Get Anomalies
**GET** `/weather/anomalies?severity={severity}&startDate={date}&endDate={date}`

Returns detected weather anomalies.

**Query Parameters:**
- `severity` (optional): "Critical", "High", "Warning", or "all"
- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string

**Response:**
```json
[
  {
    "id": "1",
    "severity": "Critical",
    "timestamp": "2024-10-26T14:35:00Z",
    "city": "Riyadh",
    "description": "Extreme Temperature Spike (+52°C)"
  },
  {
    "id": "2",
    "severity": "High",
    "timestamp": "2024-10-26T14:32:00Z",
    "city": "Jeddah",
    "description": "Unusual Wind Gust Detected (95 km/h)"
  }
]
```

**MongoDB Collection Structure:**
```javascript
{
  _id: ObjectId,
  severity: "Critical" | "High" | "Warning",
  timestamp: ISODate,
  city: String,
  description: String,
  detectedBy: "temperature" | "humidity" | "wind",
  value: Number,
  threshold: Number
}
```

---

### 6. Get Frequency Data
**GET** `/weather/frequency?timeRange={range}&region={region}`

Returns Count-Min Sketch frequency analysis results.

**Query Parameters:**
- `timeRange`: "24h", "7d" (default), "30d"
- `region`: "all" (default), or specific region

**Response:**
```json
[
  {
    "condition": "Clear",
    "count": 1200
  },
  {
    "condition": "Rain",
    "count": 350
  },
  {
    "condition": "Clouds",
    "count": 1300
  },
  {
    "condition": "Fog",
    "count": 600
  },
  {
    "condition": "Sandstorm",
    "count": 200
  },
  {
    "condition": "Haze",
    "count": 400
  }
]
```

**Note**: This data comes from your Count-Min Sketch algorithm implementation in Scala.

---

## Error Responses

All endpoints should return appropriate HTTP status codes:

**400 Bad Request**
```json
{
  "error": "Invalid parameter",
  "message": "Invalid date format"
}
```

**404 Not Found**
```json
{
  "error": "Not found",
  "message": "City not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

---

## MongoDB Collections

Your MongoDB database should have these collections:

### 1. `weatherData`
```javascript
{
  _id: ObjectId,
  city: String,
  temperature: Number,
  humidity: Number,
  pressure: Number,
  windSpeed: Number,
  condition: String,
  timestamp: ISODate,
  source: String
}
```

### 2. `anomalies`
```javascript
{
  _id: ObjectId,
  severity: String,
  city: String,
  description: String,
  timestamp: ISODate,
  type: String,
  value: Number
}
```

### 3. `frequencyData` (CMS results)
```javascript
{
  _id: ObjectId,
  condition: String,
  count: Number,
  timeRange: String,
  region: String,
  lastUpdated: ISODate
}
```

---

## Kafka Integration

Your Scala application should:
1. Consume weather data from Kafka topics
2. Process data (anomaly detection, CMS algorithm)
3. Store results in MongoDB
4. Expose REST API endpoints

**Example Kafka Topics:**
- `weather.raw` - Raw weather data
- `weather.processed` - Processed data
- `weather.anomalies` - Detected anomalies

---

## Performance Recommendations

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Indexing**: Create MongoDB indexes on:
   - `timestamp` (descending)
   - `city`
   - `severity` (for anomalies)
3. **Pagination**: Add pagination for large result sets
4. **Rate Limiting**: Implement rate limiting to prevent abuse

---

## Example Scala/Akka HTTP Implementation

```scala
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes

val route = 
  pathPrefix("api" / "weather") {
    path("stats") {
      get {
        complete(getOverviewStats())
      }
    } ~
    path("cities") {
      get {
        complete(getCityReadings())
      }
    } ~
    path("temperature") {
      get {
        parameters("city".optional, "range".optional) { (city, range) =>
          complete(getTemperatureData(city, range))
        }
      }
    } ~
    path("anomalies") {
      get {
        parameters("severity".optional, "startDate".optional, "endDate".optional) { 
          (severity, start, end) =>
            complete(getAnomalies(severity, start, end))
        }
      }
    }
  }
```

---

## Testing

Use these tools to test your API:
- **Postman**: Import collection for testing
- **curl**: Command-line testing
- **Frontend**: Use the React dashboard to verify integration

**Example curl command:**
```bash
curl http://localhost:8080/api/weather/stats
```

---

## Next Steps

1. ✅ Implement these endpoints in your Scala backend
2. ✅ Configure CORS to allow frontend requests
3. ✅ Test each endpoint with sample data
4. ✅ Connect frontend to backend
5. ✅ Deploy both applications

Good luck! 🚀
