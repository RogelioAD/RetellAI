# Fix CORS and 502 Errors on Railway

## Your URLs:
- **Frontend**: `https://client-production-2ead.up.railway.app`
- **Backend**: `https://server-production-2fec.up.railway.app`

## Fix CORS Error

The CORS error happens because your frontend URL isn't in the allowed origins list.

### Steps:

1. **Go to your Railway Server project**
   - Click on your server project in Railway dashboard
   - Go to the **Variables** tab

2. **Update `ALLOWED_ORIGINS` environment variable:**
   ```
   https://client-production-2ead.up.railway.app
   ```
   
   Or if you want to allow both with and without www:
   ```
   https://client-production-2ead.up.railway.app,https://www.client-production-2ead.up.railway.app
   ```

3. **Redeploy your server** (Railway will auto-redeploy when you save the variable)

## Fix 502 Bad Gateway

The 502 error means your server isn't running or crashed. Check:

1. **Railway Logs**
   - Go to your server project in Railway
   - Click on the **Deployments** tab
   - Click on the latest deployment
   - Check the logs for errors

2. **Common Issues:**
   - **Database connection failed**: Check `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` are set correctly
   - **Email connection timeout**: This won't prevent server startup, but check logs
   - **Missing environment variables**: Check all required variables are set

3. **Required Environment Variables:**
   ```
   PORT=3001 (or Railway's auto-assigned port)
   NODE_ENV=production
   ALLOWED_ORIGINS=https://client-production-2ead.up.railway.app
   JWT_SECRET=john_3:16
   DB_HOST=<your-database-host>
   DB_PORT=3306
   DB_NAME=<your-database-name>
   DB_USER=<your-database-user>
   DB_PASS=<your-database-password>
   RETELL_API_KEY=key_56785a9d2513ece33086fae17d83
   RETELL_BASE_URL=https://api.retellai.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587 (or 465)
   EMAIL_USER=josephasoofi04@gmail.com
   EMAIL_PASS=msxirczycysymcuj
   EMAIL_FROM=josephasoofi04@gmail.com
   BOOKING_EMAIL=josephasoofi04@gmail.com
   ```

## Test After Fix

1. **Check server is running:**
   - Visit: `https://server-production-2fec.up.railway.app/health`
   - Should return: `{"status":"ok"}`

2. **Test form submission:**
   - Go to your frontend
   - Submit the booking form
   - Check browser console for errors
   - Check Railway server logs

## Quick Checklist

- [ ] `ALLOWED_ORIGINS` includes your frontend URL
- [ ] Server is running (check `/health` endpoint)
- [ ] All environment variables are set
- [ ] Database connection is working
- [ ] Server logs show no startup errors
