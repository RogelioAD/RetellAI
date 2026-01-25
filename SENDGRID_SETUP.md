# SendGrid Setup Guide

## Step 1: Create SendGrid Account

1. Go to https://sendgrid.com
2. Click **"Start for free"** or **"Sign Up"**
3. Fill out the signup form
4. Verify your email address (check your inbox)

## Step 2: Create API Key

1. Once logged in, go to **Settings** → **API Keys** (in the left sidebar)
2. Click **"Create API Key"** button
3. Give it a name (e.g., "Railway Booking Form")
4. Select **"Full Access"** or **"Restricted Access"** with **"Mail Send"** permission
5. Click **"Create & View"**
6. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!
   - It will look like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Verify Sender Email (Optional but Recommended)

1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill out the form with:
   - **From Email**: `<your-email@example.com>`
   - **From Name**: `Quantum Consulting`
   - **Reply To**: `<your-email@example.com>`
4. Check your email and click the verification link
5. Wait for verification (usually instant)

## Step 4: Update Railway Environment Variables

Go to your **Railway Server project** → **Variables** tab and set:

```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=<paste-your-sendgrid-api-key-here>
EMAIL_FROM=<your-email@example.com>
BOOKING_EMAIL=<your-email@example.com>
```

**Important Notes:**
- `EMAIL_USER` must be exactly `apikey` (the literal word, not your username)
- `EMAIL_PASS` is your SendGrid API key (the long string starting with `SG.`)
- `EMAIL_FROM` should match your verified sender email
- `BOOKING_EMAIL` is where booking form submissions will be sent

## Step 5: Redeploy

1. Save the environment variables in Railway
2. Railway will automatically redeploy your server
3. Wait for deployment to complete

## Step 6: Test

1. Go to your frontend deployment URL
2. Fill out and submit the booking form
3. Check Railway server logs for:
   - ✅ `"Using SendGrid SMTP configuration"`
   - ✅ `"Email sent successfully"`
4. Check your inbox for the booking email

## Troubleshooting

### "Authentication failed" error
- Double-check that `EMAIL_USER` is exactly `apikey` (lowercase, no quotes)
- Verify your API key is correct (copy-paste again)
- Make sure the API key has "Mail Send" permissions

### "Connection timeout" error
- SendGrid should work on Railway, but if you still get timeouts:
  - Try port `465` instead of `587` (change `EMAIL_PORT=465`)
  - Check Railway logs for network errors

### Emails not arriving
- Check SendGrid dashboard → **Activity** → **Email Activity**
- Look for your email and check the status
- Make sure sender email is verified in SendGrid
- Check spam folder

### Free Tier Limits
- SendGrid free tier: **100 emails/day**
- If you exceed this, you'll need to upgrade or wait until the next day
- Check usage in SendGrid dashboard → **Settings** → **Plan Details**

## SendGrid Dashboard

Monitor your email sending:
- **Activity**: See all sent emails and their status
- **Stats**: View delivery rates, opens, clicks
- **Settings** → **API Keys**: Manage your API keys

## Support

- SendGrid Documentation: https://docs.sendgrid.com
- SendGrid Support: https://support.sendgrid.com
