# 🚀 Quick Start Guide

## Overview
This guide will help you get both the frontend and backend running locally within 10 minutes.

---

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ MongoDB database populated with weather data from Spark

---

## Step 1: Backend Setup (5 minutes)

### 1.1 Navigate to backend folder
```bash
cd "d:/Courses/Big Data Engineering/Final Project Resources/sa-weather-api"
```

### 1.2 Install dependencies
```bash
npm install
```

### 1.3 Configure environment
```bash
# Copy example file
cp .env.example .env

# Edit .env file
notepad .env  # Windows
# OR
nano .env     # Linux/Mac
```

**Set these values in .env:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=sa-weather-analytics
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 1.4 Start backend server
```bash
npm run dev
```

**Expected output:**
```
✅ Connected to MongoDB
🚀 Server running on port 3000
📍 API URL: http://localhost:3000/api
🏥 Health check: http://localhost:3000/health
```

### 1.5 Test backend
Open new terminal and test:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/cities
```

✅ **Backend is ready!** Keep this terminal running.

---

## Step 2: Frontend Setup (3 minutes)

### 2.1 Navigate to frontend folder
```bash
cd "d:/Courses/Big Data Engineering/Final Project Resources/sa-weather-analytics-ui"
```

### 2.2 Update environment variable
```bash
# Create or edit .env.local
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env.local
```

**Or manually create `.env.local` with:**
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2.3 Install dependencies (if needed)
```bash
npm install
```

### 2.4 Start frontend
```bash
npm run dev
```

**Expected output:**
```
  VITE v6.4.1  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 2.5 Open in browser
Visit: **http://localhost:5173**

✅ **Frontend is running!**

---

## Step 3: Verify Everything Works

### 3.1 Check Dashboard Loads
- You should see the SA Weather Analytics Dashboard
- No error messages
- Data should start loading

### 3.2 Check All Pages
Navigate through:
- **Overview** - Should show city statistics
- **Temperature** - Should show hourly chart
- **Humidity** - Should show monthly patterns  
- **Anomalies** - Should show anomaly table
- **CMS Frequency** - Should show weather distribution

### 3.3 Check Browser Console
Press F12 → Console tab
- ✅ No red errors
- ✅ API calls should be 200 status

---

## Troubleshooting

### "Failed to load data" Error

**Problem:** Frontend can't reach backend

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:3000/health

# 2. Check VITE_API_BASE_URL
cat .env.local
# Should be: VITE_API_BASE_URL=http://localhost:3000/api

# 3. Restart frontend
# Press Ctrl+C in frontend terminal
npm run dev
```

### "MongoDB connection failed"

**Problem:** Backend can't connect to MongoDB

**Solution:**
```bash
# 1. Check MongoDB URI in backend/.env
cd ../sa-weather-api
cat .env

# 2. Verify MongoDB Atlas:
# - IP whitelist includes your IP (or 0.0.0.0/0 for testing)
# - Database user credentials are correct
# - Network access allows connections

# 3. Test with MongoDB Compass
# Use same URI to connect
```

### CORS Error

**Problem:** Browser blocks API requests

**Solution:**
```bash
# 1. Check backend CORS_ORIGIN in .env
cd ../sa-weather-api
cat .env
# Should include: CORS_ORIGIN=http://localhost:3000

# 2. Restart backend
# Press Ctrl+C
npm run dev
```

### No Data in Charts

**Problem:** MongoDB collections are empty

**Solution:**
```bash
# 1. Verify Spark Consumer has run
# Check MongoDB Compass for these collections:
# - city_statistics
# - weather_conditions
# - hourly_patterns
# - monthly_patterns
# - anomalies
# - real_time_stats

# 2. Run Spark Consumer to populate data
# (Refer to your Spark project documentation)
```

---

## Development Workflow

### Terminal 1: Backend
```bash
cd sa-weather-api
npm run dev
```

### Terminal 2: Frontend
```bash
cd sa-weather-analytics-ui
npm run dev
```

### Terminal 3: Testing
```bash
# Test backend endpoints
curl http://localhost:3000/api/cities
curl http://localhost:3000/api/anomalies

# Or use browser
# Open: http://localhost:5173
```

---

## Production Deployment

See [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) for deployment instructions.

---

## Next Steps

1. ✅ Verify both servers are running
2. ✅ Test all dashboard pages
3. ✅ Check data is loading correctly
4. 📝 Deploy backend to Heroku/Railway
5. 📝 Update Netlify environment variable
6. 📝 Test production deployment

---

## Quick Commands Reference

```bash
# Backend
cd sa-weather-api
npm install              # Install dependencies
npm run dev             # Start development server
npm start               # Start production server
curl http://localhost:3000/health  # Test health

# Frontend  
cd sa-weather-analytics-ui
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
curl http://localhost:3000/api/cities
curl http://localhost:3000/api/anomalies?severity=CRITICAL
curl -O http://localhost:3000/api/download/csv/city-stats
```

---

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)
3. Check backend logs for errors
4. Verify MongoDB data exists
5. Check browser console for frontend errors

---

**Time to complete:** ~10 minutes
**Status:** Ready for development! 🎉
