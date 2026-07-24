# Cross-Origin-Opener-Policy (COOP) & Cross-Origin-Embedder-Policy (COEP) Fix

## Issues Fixed

1. **Cross-Origin-Opener-Policy policy would block the window.postMessage call**
2. **Failed to load resource: net::ERR_CONNECTION_TIMED_OUT** for Google OAuth

## Root Cause

Google OAuth and other modern web features require specific security headers:
- **Cross-Origin-Opener-Policy (COOP)**: Controls whether a window can interact with windows from other origins
- **Cross-Origin-Embedder-Policy (COEP)**: Controls whether a document can load cross-origin resources

Without these headers, Google Sign-In's popup authentication flow fails because it uses `window.postMessage()` for cross-origin communication.

## Changes Made

### 1. Server Configuration (`server/vercel.json`)
Added COOP and COEP headers to all server responses:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" },
        { "key": "Access-Control-Allow-Credentials", "value": "true" }
      ]
    }
  ]
}
```

### 2. Server Express Middleware (`server/src/index.ts`)
Added middleware to set COOP/COEP headers on all responses:
```typescript
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
```

### 3. Client Vercel Configuration (`client/vercel.json`)
Added security headers for the client-side deployment:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### 4. Client Vite Configuration (`client/vite.config.ts`)
Added headers for local development:
```typescript
server: {
  host: '0.0.0.0',
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp'
  },
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

## Google OAuth Configuration

### Verified Configuration
- **Client ID**: `312375796194-i9bji9oou7t6tpo7hqgu0ou388h5a2od.apps.googleusercontent.com`
- **Location**: `client/.env` and `server/.env`
- **Provider**: `@react-oauth/google` (v9+)

### Google Cloud Console Setup
Ensure your Google OAuth Client ID is configured with:
1. **Authorized JavaScript origins**:
   - `https://your-client-app.vercel.app`
   - `http://localhost:5173` (for local development)

2. **Authorized redirect URIs**:
   - `https://your-client-app.vercel.app`
   - `http://localhost:5173`

## Deployment Instructions

### 1. Deploy Server to Vercel
```bash
cd server
vercel --prod
```

### 2. Deploy Client to Vercel
```bash
cd client
vercel --prod
```

### 3. Update Environment Variables
In Vercel Dashboard, set the following environment variables:

**Server (e.g., `placement-portal-api`)**:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong secret for JWT tokens
- `JWT_REFRESH_SECRET`: Strong secret for refresh tokens
- `GEMINI_API_KEY`: Your Google Gemini API key
- `EMAIL_HOST`: SMTP host (e.g., smtp.gmail.com)
- `EMAIL_PORT`: SMTP port (e.g., 587)
- `EMAIL_USER`: Your email address
- `EMAIL_PASS`: Your email app password
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `CLIENT_ORIGIN`: Your client Vercel URL (e.g., `https://placement-portal.vercel.app`)

**Client (e.g., `placement-portal`)**:
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `VITE_MICROSOFT_CLIENT_ID`: Your Microsoft OAuth Client ID (if using Microsoft login)
- `VITE_API_URL`: Your server Vercel URL (e.g., `https://placement-portal-api.vercel.app/api`)

### 4. Redeploy After Environment Changes
After updating environment variables, redeploy both server and client:
```bash
vercel --prod
```

## Testing the Fix

1. **Local Testing**:
   ```bash
   # Terminal 1: Start server
   cd server
   npm run dev
   
   # Terminal 2: Start client
   cd client
   npm run dev
   ```
   
   Visit `http://localhost:5173` and test Google Sign-In.

2. **Production Testing**:
   - Visit your deployed Vercel client URL
   - Open browser DevTools → Network tab
   - Check that responses include COOP/COEP headers
   - Test Google Sign-In button

## Verification

Check headers are being sent correctly:

### Using curl:
```bash
curl -I https://your-server.vercel.app/health
```

Expected headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Access-Control-Allow-Origin: *
```

### Using browser DevTools:
1. Open Network tab
2. Make any API request
3. Check Response Headers for COOP/COEP

## Troubleshooting

### Issue: Google Sign-In still not working
**Solution**:
1. Verify Google OAuth Client ID is correct in both `client/.env` and `server/.env`
2. Check Google Cloud Console authorized origins match your deployment URLs
3. Ensure COOP/COEP headers are present in network responses
4. Clear browser cache and cookies
5. Try incognito mode to rule out extension conflicts

### Issue: Connection timeout
**Solution**:
1. Verify server is deployed and accessible
2. Check `VITE_API_URL` in client environment variables points to correct server URL
3. Ensure CORS is configured correctly on server
4. Check Vercel deployment logs for errors

### Issue: Headers not appearing in production
**Solution**:
1. Redeploy after updating `vercel.json`
2. Clear Vercel cache: `vercel --force`
3. Check Vercel deployment logs for JSON syntax errors in `vercel.json`

## Security Notes

- `Cross-Origin-Opener-Policy: same-origin` - Isolates your window from cross-origin windows
- `Cross-Origin-Embedder-Policy: require-corp` - Requires cross-origin resources to have CORP headers
- These headers enable powerful features like `SharedArrayBuffer` and improve security
- The combination is sometimes called "COOP/COEP" or "cross-origin isolation"

## References

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)
- [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)
- [Vercel Headers Configuration](https://vercel.com/docs/projects/environment-variables#system-environment-variables)