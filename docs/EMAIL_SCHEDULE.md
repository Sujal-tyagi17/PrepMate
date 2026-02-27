# Email Notification Schedule

## Automatic Email Triggers

### 1. **Welcome Email** 🎯
- **When**: Immediately when a new user signs up
- **Trigger**: Clerk webhook (`user.created` event)
- **Location**: `app/api/webhooks/clerk/route.ts`
- **Content**: Welcome message with quick start guide
- **Can be disabled**: No (sent to all new users)

### 2. **Score Update Email** 📊
- **When**: After completing an interview
- **Trigger**: Interview status changes to "completed"
- **Location**: `app/api/interview/[id]/route.ts`
- **Content**: Interview score, comparison with previous average
- **Can be disabled**: Yes (via Profile → Notifications → "Score Updates")

### 3. **Daily Reminder Email** 🔥
- **When**: Every day at 9:00 AM
- **Trigger**: Automated cron job
- **Location**: `app/api/cron/send-notifications/route.ts?type=daily`
- **Content**: Reminder to practice, current streak
- **Can be disabled**: Yes (via Profile → Notifications → "Daily Reminders")

### 4. **Weekly Tip Email** 💡
- **When**: Every Monday at 10:00 AM
- **Trigger**: Automated cron job
- **Location**: `app/api/cron/send-notifications/route.ts?type=weekly`
- **Content**: Interview tip from AI, best practices
- **Can be disabled**: Yes (via Profile → Notifications → "Weekly Tips")

### 5. **New Feature Email** 🚀
- **When**: Manually triggered by admins
- **Trigger**: Call to `/api/notifications` with type "feature"
- **Location**: `app/api/notifications/route.ts`
- **Content**: Announcement of new features
- **Can be disabled**: Yes (via Profile → Notifications → "Feature Updates")

## Email Service Configuration

**Provider**: Resend (https://resend.com)
- Free tier: 100 emails/day, 3,000 emails/month
- Test mode: Can only send to verified email (sujaltyagi12@gmail.com)
- Production: Requires verified domain

**Current Settings**:
```env
RESEND_API_KEY=re_gAquPu4h_2pEYy2GnWFDcqcFboTBZeS3C
RESEND_FROM_EMAIL=onboarding@resend.dev
```

## Setting Up Scheduled Emails (Vercel Deployment)

The `vercel.json` file configures automatic cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-notifications?type=daily",
      "schedule": "0 9 * * *"  // 9 AM daily
    },
    {
      "path": "/api/cron/send-notifications?type=weekly",
      "schedule": "0 10 * * 1"  // 10 AM every Monday
    }
  ]
}
```

**Security**: Set `CRON_SECRET` in production to prevent unauthorized access to cron endpoints.

## Email Templates

All templates are in `lib/email-templates.ts`:
- Professional HTML design
- Responsive for mobile
- Branded with PrepMate colors
- Call-to-action buttons
- Personalized content

## User Preferences

Users can control which emails they receive:
1. Go to **Profile → Notifications** tab
2. Toggle preferences:
   - ✅ Daily practice reminders
   - ✅ Score updates after interviews
   - ❌ New feature announcements
   - ✅ Weekly interview tips
3. Click **Save Settings**

Preferences are stored in the `users` table:
- `notification_reminders` → Daily reminders
- `notification_score_updates` → Score emails
- `notification_new_features` → Feature announcements
- `notification_tips` → Weekly tips

## Email Delivery Status

Check email logs:
- **Resend Dashboard**: https://resend.com/emails
- **Server logs**: Search for `[EMAIL]` prefix
- **Test page**: Real-time success/failure feedback

## Troubleshooting

**Issue**: "API key invalid"
- **Fix**: Get new API key from https://resend.com/api-keys

**Issue**: "Can only send to your own email"
- **Fix**: This is normal for free tier. Verify a domain or use test email.

**Issue**: Emails not sending in production
- **Fix**: 
  1. Check `RESEND_API_KEY` is set in Vercel environment variables
  2. Verify domain is configured
  3. Check Resend dashboard for errors
  4. Ensure `CRON_SECRET` is set for scheduled emails

**Issue**: Users not receiving emails
- **Fix**: 
  1. Check user's notification preferences in Profile
  2. Verify email address is correct
  3. Check spam folder
  4. Review Resend logs for delivery status

## Next Steps

To enable emails for all users in production:
1. **Verify a domain** at https://resend.com/domains
2. **Update FROM email** to use verified domain (e.g., `noreply@yourdomain.com`)
3. **Set environment variables** in Vercel:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `CRON_SECRET`
4. **Deploy to Vercel** - Cron jobs will start automatically
5. **Monitor** Resend dashboard for delivery metrics

## Email Limits (Resend Free Tier)

- **100 emails per day**
- **3,000 emails per month**
- If you exceed limits, upgrade to paid plan or implement email queuing
