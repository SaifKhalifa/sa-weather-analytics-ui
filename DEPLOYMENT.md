# 🚀 Deployment Guide

## Prerequisites
- Backend API running and accessible
- MongoDB connected to backend
- Kafka streaming data to backend

## Quick Deploy Options

### Option 1: Vercel (Recommended for React)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-api.com/api`

---

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify Drop**
   - Go to https://app.netlify.com/drop
   - Drag and drop your `dist` folder

4. **Set Environment Variables**
   - Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL`

---

### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   # Build stage
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t sa-weather-dashboard .
   docker run -p 80:80 -e VITE_API_BASE_URL=http://your-api sa-weather-dashboard
   ```

---

### Option 4: AWS S3 + CloudFront

1. **Build**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** for SPA routing

---

## Backend Deployment (Scala/Kafka)

Your backend needs to be deployed first!

### Recommended Options:
- **AWS EC2** with Docker
- **Heroku** with buildpack
- **DigitalOcean Droplet**
- **Azure App Service**

### Backend Requirements:
✅ Expose REST API endpoints (see BACKEND_API_GUIDE.md)
✅ Connect to MongoDB
✅ Process Kafka streams
✅ Configure CORS for frontend domain

---

## Production Checklist

### Backend ✅
- [ ] API deployed and accessible
- [ ] MongoDB connection configured
- [ ] Kafka consumer running
- [ ] CORS configured for frontend domain
- [ ] SSL/HTTPS enabled
- [ ] Error logging configured
- [ ] Environment variables set

### Frontend ✅
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set
- [ ] API URL points to production backend
- [ ] HTTPS enabled
- [ ] CDN configured (optional)
- [ ] Monitoring setup (optional)

---

## Environment Variables

### Development (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production
```env
VITE_API_BASE_URL=https://api.yourbackend.com/api
```

---

## Monitoring & Logging

### Recommended Tools:
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **LogRocket** - Session replay
- **Datadog** - Performance monitoring

### Setup Example (Sentry):
```bash
npm install @sentry/react
```

```typescript
// In index.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

---

## Performance Optimization

1. **Enable Gzip/Brotli compression**
2. **Use CDN for static assets**
3. **Enable HTTP/2**
4. **Lazy load routes** (code splitting)
5. **Optimize images**
6. **Cache API responses**

---

## Security Best Practices

1. **Use HTTPS** for all connections
2. **Implement rate limiting** on backend
3. **Sanitize user inputs**
4. **Use Content Security Policy** headers
5. **Regular dependency updates**

---

## Scaling

### Frontend:
- Use CDN (CloudFlare, AWS CloudFront)
- Enable caching headers
- Implement service workers (PWA)

### Backend:
- Load balancer (Nginx, AWS ALB)
- Multiple API instances
- Redis caching layer
- Database read replicas

---

## Maintenance

### Regular Tasks:
- Monitor error rates
- Check API response times
- Review logs for anomalies
- Update dependencies monthly
- Backup MongoDB regularly

---

## Support

For issues or questions:
1. Check logs (backend + frontend console)
2. Verify API connectivity
3. Check MongoDB connection
4. Review Kafka consumer status

---

Good luck with your deployment! 🎉
