# CORS Configuration Fix

## Problem
Your backend API at `https://sa-weather-api-production.up.railway.app` is blocking requests from your Netlify frontend at `https://saweatheranalysis.netlify.app` due to CORS (Cross-Origin Resource Sharing) policy.

## Error Message
```
Access to fetch at 'https://sa-weather-api-production.up.railway.app/api/...' from origin 'https://saweatheranalysis.netlify.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

You need to configure CORS on your backend server to allow requests from your Netlify domain.

### For Express.js (Node.js)

1. Install the CORS package:
```bash
npm install cors
```

2. Add CORS middleware to your server:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS
const corsOptions = {
  origin: [
    'https://saweatheranalysis.netlify.app',
    'http://localhost:5173',  // For local development
    'http://localhost:3000'   // For local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Your routes...
```

### For Spring Boot (Java)

Add this configuration class:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "https://saweatheranalysis.netlify.app",
                    "http://localhost:5173",
                    "http://localhost:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### For Flask (Python)

1. Install flask-cors:
```bash
pip install flask-cors
```

2. Configure CORS:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://saweatheranalysis.netlify.app",
            "http://localhost:5173",
            "http://localhost:3000"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Your routes...
```

### For FastAPI (Python)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://saweatheranalysis.netlify.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your routes...
```

### Railway Environment Variable (Alternative)

If your backend framework supports it, you can set CORS origins via environment variables on Railway:

1. Go to your Railway project
2. Navigate to Variables
3. Add: `CORS_ORIGIN=https://saweatheranalysis.netlify.app,http://localhost:5173`
4. Update your backend code to read from this environment variable

## After Fixing

Once you've updated your backend with CORS configuration:

1. Deploy the changes to Railway
2. Wait for the deployment to complete
3. Test your Netlify site again

The errors should be resolved and your frontend will be able to communicate with the backend API.

## Testing CORS

You can test if CORS is properly configured by running this in your browser console:

```javascript
fetch('https://sa-weather-api-production.up.railway.app/api/cities', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

If this works without errors, your CORS is properly configured.
