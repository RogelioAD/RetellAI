# Email Setup for Railway Deployment

## Problem: Connection Timeout

Railway often blocks outbound SMTP connections to prevent spam. This causes connection timeouts when trying to send emails through Gmail SMTP.

## Solutions (in order of recommendation)

### Option 1: Use SendGrid (Recommended - Free tier available)

SendGrid is designed for cloud environments and works reliably with Railway.

1. **Sign up for SendGrid** (free tier: 100 emails/day)
   - Go to https://sendgrid.com
   - Create account and verify email

2. **Create API Key**
   - Go to Settings > API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Update Railway Environment Variables:**
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=<your-sendgrid-api-key>
   EMAIL_FROM=josephasoofi04@gmail.com
   BOOKING_EMAIL=josephasoofi04@gmail.com
   ```

### Option 2: Use Mailgun (Free tier available)

1. **Sign up for Mailgun** (free tier: 5,000 emails/month)
   - Go to https://www.mailgun.com
   - Create account and verify domain

2. **Get SMTP credentials**
   - Go to Sending > Domain Settings
   - Copy SMTP credentials

3. **Update Railway Environment Variables:**
   ```
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=<your-mailgun-smtp-username>
   EMAIL_PASS=<your-mailgun-smtp-password>
   EMAIL_FROM=josephasoofi04@gmail.com
   BOOKING_EMAIL=josephasoofi04@gmail.com
   ```

### Option 3: Try Gmail with Port 465 (SSL)

Sometimes port 465 (SSL) works when 587 (TLS) doesn't.

1. **Update Railway Environment Variables:**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_USER=josephasoofi04@gmail.com
   EMAIL_PASS=msxirczycysymcuj
   EMAIL_FROM=josephasoofi04@gmail.com
   BOOKING_EMAIL=josephasoofi04@gmail.com
   ```

### Option 4: Use AWS SES (If you have AWS account)

1. **Set up AWS SES**
   - Verify your email address in SES
   - Get SMTP credentials

2. **Update Railway Environment Variables:**
   ```
   EMAIL_HOST=email-smtp.<region>.amazonaws.com
   EMAIL_PORT=587
   EMAIL_USER=<your-ses-smtp-username>
   EMAIL_PASS=<your-ses-smtp-password>
   EMAIL_FROM=josephasoofi04@gmail.com
   BOOKING_EMAIL=josephasoofi04@gmail.com
   ```

## Quick Test

After updating environment variables, redeploy and test the booking form. Check Railway logs for:
- "Email sent successfully" ✅
- Connection timeout errors ❌ (try next option)

## Why Railway Blocks SMTP

Railway blocks outbound SMTP connections (ports 25, 587, 465) to prevent spam and abuse. This is common with cloud platforms. Using a dedicated email service (SendGrid, Mailgun) is the recommended solution.
