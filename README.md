# 🌤️ SA Weather Analytics Dashboard

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
[![Build Status](https://img.shields.io/github/workflow/status/YOUR-USERNAME/sa-weather-analytics-ui/CI)](https://github.com/YOUR-USERNAME/sa-weather-analytics-ui/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **🚀 Live Demo:** [https://your-app.netlify.app](https://your-app.netlify.app)

A modern, real-time weather analytics dashboard for Saudi Arabia, displaying processed data from MongoDB through a Scala/Kafka backend pipeline.

## 📋 Overview

This dashboard provides comprehensive weather analytics for major Saudi Arabian cities, including:
- **Real-time monitoring** of temperature, humidity, and weather conditions
- **Anomaly detection** and critical alerts
- **Frequency analysis** of weather patterns using Count-Min Sketch algorithm
- **Interactive charts** for data visualization
- **Auto-refresh** capabilities for live data updates

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Data Source**: MongoDB (via Scala/Kafka backend)

## 📁 Project Structure

```
sa-weather-analytics-ui/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── ErrorBoundary.tsx
│   ├── ErrorState.tsx
│   └── LoadingState.tsx
├── pages/              # Page components
│   ├── Overview.tsx
│   ├── Temperature.tsx
│   ├── Humidity.tsx
│   ├── Anomalies.tsx
│   └── CMSFrequency.tsx
├── services/           # API service layer
│   └── weatherService.ts
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend API** running (Scala/Kafka service with MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sa-weather-analytics-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🔌 Backend API Requirements

Your Scala/Kafka backend must expose the following REST endpoints:

### API Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/weather/stats` | GET | Overview statistics | - |
| `/api/weather/cities` | GET | Current city readings | - |
| `/api/weather/temperature` | GET | Hourly temperature data | `city`, `range` |
| `/api/weather/humidity` | GET | Humidity data | `cities` |
| `/api/weather/anomalies` | GET | Weather anomalies | `severity`, `startDate`, `endDate` |
| `/api/weather/frequency` | GET | Frequency analysis | `timeRange`, `region` |

### Expected Response Formats

**Stats Response:**
```json
[
  {
    "label": "Max Temperature",
    "value": "45°C",
    "subtext": "in Riyadh",
    "icon": "thermometer",
    "trend": "up"
  }
]
```

**City Readings Response:**
```json
[
  {
    "name": "Riyadh",
    "temp": 45,
    "humidity": 15,
    "condition": "Clear",
    "lastUpdated": "2 min ago"
  }
]
```

**Temperature/Humidity Data:**
```json
[
  {
    "time": "00:00",
    "Riyadh": 35,
    "Jeddah": 32,
    "Dammam": 38
  }
]
```

**Anomalies Response:**
```json
[
  {
    "id": "1",
    "severity": "Critical",
    "timestamp": "2024-10-26 14:35 UTC",
    "city": "Riyadh",
    "description": "Extreme Temperature Spike (+52°C)"
  }
]
```

**Frequency Data:**
```json
[
  {
    "condition": "Clear",
    "count": 1200
  }
]
```

## ✨ Features

### ✅ Implemented
- 5 main dashboard pages (Overview, Temperature, Humidity, Anomalies, Frequency)
- Real-time data fetching with auto-refresh (30s interval)
- Interactive charts and visualizations
- Error handling with retry mechanism
- Loading states and skeletons
- Responsive design
- Dark theme UI
- CSV export functionality for anomalies
- Error boundaries for crash recovery

### 🔄 Recommended Enhancements
- WebSocket integration for real-time streaming
- Advanced filtering (date range picker, city selector)
- Historical data comparison
- Customizable dashboard widgets
- Light/dark theme toggle
- Mobile responsive sidebar
- User authentication
- Notification system

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080/api
```

### Auto-refresh Interval

To change the auto-refresh interval, edit `App.tsx`:

```typescript
// Current: 30 seconds
const interval = setInterval(() => {
  fetchData();
}, 30000); // Change this value (in milliseconds)
```

## 🐛 Troubleshooting

### Common Issues

**Problem**: "Failed to load data. Please check your connection."
- **Solution**: Ensure your backend API is running and accessible at the configured URL

**Problem**: CORS errors in browser console
- **Solution**: Configure CORS in your backend to allow requests from `http://localhost:3000`

**Problem**: Charts not displaying
- **Solution**: Check if the data format from your API matches the expected structure

## 📊 Data Flow

```
MongoDB ← Kafka ← Scala Processing App
   ↓
Backend REST API (Port 8080)
   ↓
React Frontend (Port 3000)
   ↓
User Dashboard
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of a Big Data Engineering course final project.

## 👥 Team

- **Course**: Big Data Engineering
- **Project**: Weather Analytics System
- **Frontend**: React + TypeScript Dashboard

---

**Note**: This is a frontend application that requires a backend API service to function. Ensure your Scala/Kafka backend is properly configured and running before starting the frontend.

For backend setup instructions, refer to the backend repository documentation.
