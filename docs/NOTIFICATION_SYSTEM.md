# Notification System Setup

## Overview

PrepMate includes a comprehensive notification system that allows users to receive:
- **Interview reminders**: Daily nudges when streak is at risk
- **Score updates**: When analytics change significantly  
- **New features**: Product announcements and updates
- **Tips & best practices**: Weekly interview tips from AI

## Current Status

✅ **Implemented:**
- User notification preferences stored in database
- Settings UI for managing notification preferences
- API endpoints for saving/retrieving preferences
- Notification API endpoint structure

⚠️ **To Complete:**
- Email service integration (choose from options below)
- Scheduled notification jobs (cron/background workers)

## Database Schema

The `users` table includes these notification preference columns:
```sql
notification_reminders        BOOLEAN DEFAULT true
notification_score_updates    BOOLEAN DEFAULT true
notification_new_features     BOOLEAN DEFAULT false
notification_tips             BOOLEAN DEFAULT true
```

## Email Service Integration

Choose one of these email services to enable actual email sending:

### Option 1: Resend (Recommended) ⭐

**Pros:** Modern, developer-friendly, generous free tier (3000 emails/month), great DX

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Install the SDK:
   ```bash
   npm install resend
   ```

4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   RESEND_FROM_EMAIL=noreply@yourapp.com
   ```

5. Create `lib/email.ts`:
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   export async function sendEmail({
     to,
     subject,
     html
   }: {
     to: string;
     subject: string;
     html: string;
   }) {
     try {
       const data = await resend.emails.send({
         from: process.env.RESEND_FROM_EMAIL!,
         to,
         subject,
         html,
       });
       return { success: true, data };
     } catch (error) {
       console.error('Email send failed:', error);
       return { success: false, error };
     }
   }
   ```

6. Update `app/api/notifications/route.ts` to use it:
   ```typescript
   import { sendEmail } from '@/lib/email';
   
   // Replace the console.log with:
   await sendEmail({
     to: user.email,
     subject: title,
     html: message
   });
   ```

### Option 2: SendGrid

**Pros:** Enterprise-grade, reliable, 100 emails/day free tier

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Install:
   ```bash
   npm install @sendgrid/mail
   ```
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxx
   SENDGRID_FROM_EMAIL=noreply@yourapp.com
   ```

4. Implementation in `lib/email.ts`:
   ```typescript
   import sgMail from '@sendgrid/mail';
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   
   export async function sendEmail({
     to,
     subject,
     html
   }: {
     to: string;
     subject: string;
     html: string;
   }) {
     try {
       await sgMail.send({
         to,
         from: process.env.SENDGRID_FROM_EMAIL!,
         subject,
         html,
       });
       return { success: true };
     } catch (error) {
       console.error('Email send failed:', error);
       return { success: false, error };
     }
   }
   ```

### Option 3: AWS SES

**Pros:** Very cheap, highly scalable, 62,000 free emails/month (with EC2)

1. Set up AWS SES in your AWS console
2. Install:
   ```bash
   npm install @aws-sdk/client-ses
   ```
3. Configure credentials in `.env.local`
4. See AWS SES documentation for implementation

## Scheduled Notifications

To send notifications automatically, you need a cron job or background worker.

### Option 1: Vercel Cron Jobs (Recommended for Vercel deployments)

1. Create `app/api/cron/daily-reminders/route.ts`:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import { createClient } from '@/lib/supabase/server';
   import { sendEmail } from '@/lib/email';
   
   export async function GET(req: NextRequest) {
     // Verify cron secret
     const authHeader = req.headers.get('authorization');
     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
   
     const supabase = createClient();
     
     // Find users who need reminders
     const { data: users } = await supabase
       .from('users')
       .select('email, name')
       .eq('notification_reminders', true);
     
     // Send emails
     for (const user of users || []) {
       await sendEmail({
         to: user.email,
         subject: '🔥 Keep your interview streak alive!',
         html: `Hi ${user.name}, don't forget to practice today!`
       });
     }
     
     return NextResponse.json({ success: true, sent: users?.length || 0 });
   }
   ```

2. Add to `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/daily-reminders",
         "schedule": "0 9 * * *"
       }
     ]
   }
   ```

3. Add to `.env.local`:
   ```
   CRON_SECRET=your-random-secret-here
   ```

### Option 2: GitHub Actions (Free)

Create `.github/workflows/daily-notifications.yml`:
```yaml
name: Daily Notifications
on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM UTC daily
  workflow_dispatch:

jobs:
  send-notifications:
    runs-on: ubuntu-latest
    steps:
      - name: Send notifications
        run: |
          curl -X GET ${{ secrets.APP_URL }}/api/cron/daily-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option 3: Third-party Services

- **EasyCron**: Free tier available
- **cron-job.org**: Free, reliable
- **Railway Cron**: If deploying to Railway

## Testing Notifications

### Test via API:

```bash
# Send a test notification
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "type": "tip",
    "title": "Test Notification",
    "message": "<h1>Hello!</h1><p>This is a test.</p>"
  }'
```

### Check user preferences:

```bash
curl http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

## Email Templates

Create reusable email templates in `lib/email-templates.ts`:

```typescript
export const emailTemplates = {
  dailyReminder: (name: string) => ({
    subject: '🔥 Keep your interview streak alive!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h1>Hi ${name}! 👋</h1>
        <p>Your interview streak is at risk!</p>
        <a href="https://yourapp.com/interview/new" 
           style="background: #8b5cf6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 8px; display: inline-block;">
          Start Interview
        </a>
      </div>
    `
  }),
  
  scoreUpdate: (name: string, newScore: number, improvement: number) => ({
    subject: '📈 Your interview score improved!',
    html: `
      <h1>Great job, ${name}! 🎉</h1>
      <p>Your average score increased by ${improvement}% to ${newScore}%</p>
    `
  }),
  
  weeklyTip: (name: string, tip: string) => ({
    subject: '💡 Weekly Interview Tip',
    html: `
      <h1>Hi ${name}!</h1>
      <p>${tip}</p>
    `
  })
};
```

## Migration Steps

Run the database migration:

```bash
# Using Supabase CLI
supabase db push

# Or apply directly in Supabase dashboard
# Copy contents of supabase/migrations/006_add_notification_preferences.sql
```

## Security Best Practices

1. **Never expose API keys in client code**
2. **Use environment variables** for all secrets
3. **Validate cron requests** with a secret token
4. **Rate limit** notification endpoints
5. **Honor unsubscribe requests** immediately
6. **Include unsubscribe links** in all emails

## Monitoring

Add logging to track:
- Email delivery success/failure rates
- User opt-out rates per notification type
- Notification engagement metrics

```typescript
// Example logging
console.log('[NOTIFICATION]', {
  type,
  userId,
  delivered: true,
  timestamp: new Date().toISOString()
});
```

## Next Steps

1. ✅ Choose an email service provider (Resend recommended)
2. ✅ Set up email sending in `lib/email.ts`
3. ✅ Create email templates
4. ✅ Set up cron jobs for scheduled notifications
5. ✅ Test thoroughly
6. ✅ Monitor delivery rates
7. ✅ Add unsubscribe functionality

## Support

For issues or questions about the notification system:
- Check the API logs for errors
- Verify environment variables are set
- Test email service connection separately
- Check user notification preferences in database
