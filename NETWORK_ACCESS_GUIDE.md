# Network Access Configuration Guide

## 🌐 Accessing ByteRyte from Other Devices on Your Network

### Frontend Configuration (Already Done! ✅)

The frontend now automatically detects the correct API URL:
- When accessed via `localhost` → uses `http://localhost:3000/api`
- When accessed via IP (e.g., `192.168.10.135`) → uses `http://192.168.10.135:3000/api`

### Backend Configuration (You Need to Do This)

Your backend server needs to:

#### 1. Listen on All Network Interfaces

Make sure your backend is listening on `0.0.0.0` instead of just `localhost`.

**For Node.js/Express:**
```javascript
// Instead of:
app.listen(3000, 'localhost');

// Use:
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
```

#### 2. Configure CORS to Allow Network Access

Your backend needs to accept requests from different origins.

**For Node.js/Express with CORS middleware:**
```javascript
const cors = require('cors');

// Allow all origins (for development)
app.use(cors({
  origin: '*',  // In production, specify exact origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Or allow specific origins:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:8080',           // Local development
    'http://127.0.0.1:8080',          // Local development
    'http://192.168.10.135:8080'      // Network access
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**For NestJS:**
```typescript
// In main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*',  // Or specify allowed origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  
  await app.listen(3000, '0.0.0.0');
}
```

#### 3. Verify Backend is Running on Network

After starting your backend, verify it's accessible:

```bash
# On the same machine
curl http://192.168.10.135:3000/api/health

# Or visit in browser
http://192.168.10.135:3000/api/health
```

### Testing Network Access

1. **Start Backend** (configured with CORS and listening on 0.0.0.0)
   ```bash
   cd backend
   npm run dev  # or your start command
   ```

2. **Start Frontend**
   ```bash
   cd ByteRyte-FrontEnd
   npm run dev
   ```

3. **Access from Another Device**
   - Open browser on another device on the same network
   - Navigate to: `http://192.168.10.135:8080`
   - Try registering/logging in

4. **Check Browser Console**
   - You should see: `API Base URL: http://192.168.10.135:3000/api`
   - No CORS errors

### Troubleshooting

#### "Cannot read properties of undefined"
- Check browser console for the API Base URL
- Verify backend is running on `0.0.0.0:3000`
- Check for CORS errors in browser console

#### CORS Error
```
Access to fetch at 'http://192.168.10.135:3000/api/...' from origin 
'http://192.168.10.135:8080' has been blocked by CORS policy
```

**Solution:** Configure CORS in backend as shown above

#### Connection Refused
- Backend is not running
- Backend is only listening on localhost, not 0.0.0.0
- Firewall is blocking the port

#### Check Firewall (Windows)
```powershell
# Allow port 3000 through Windows Firewall
New-NetFirewallRule -DisplayName "Backend API Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Production Considerations

For production deployment:

1. **Use environment variables** for allowed origins
2. **Never use `origin: '*'`** in production
3. **Use HTTPS** for secure communication
4. **Implement rate limiting**
5. **Use proper authentication tokens**

### Current Setup Summary

✅ Frontend auto-detects API URL based on hostname
✅ Works on localhost automatically
✅ Works on network IP automatically
⚠️ Backend needs CORS configuration
⚠️ Backend needs to listen on 0.0.0.0

### Quick Backend CORS Fix

If you're using Express, add this to your backend:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins (development only!)
app.use(cors());

// Your routes here...

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
  console.log('Accessible on network at: http://192.168.10.135:3000');
});
```

That's it! After configuring your backend, restart both servers and try accessing from another device.
