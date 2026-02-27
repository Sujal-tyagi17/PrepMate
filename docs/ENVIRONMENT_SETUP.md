# Environment Variables Setup Guide

This guide explains all the environment variables required for PrepMate.

## Required Variables

### Database
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prepmate
```
- **Where to get**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Purpose**: Connection string for your MongoDB database

### Clerk Authentication
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```
- **Where to get**: [Clerk Dashboard](https://dashboard.clerk.com)
- **Purpose**: Authentication and user management
- **Setup**:
  1. Create a free account at clerk.com
  2. Create a new application
  3. Copy the publishable and secret keys from API Keys section
  4. Set up a webhook endpoint pointing to `/api/webhooks/clerk`
  5. Copy the webhook secret

### AI API (at least ONE required)

#### Option 1: Google Gemini (Recommended - Free)
```bash
GEMINI_API_KEY=AIzaSy...
```
- **Where to get**: [Google AI Studio](https://ai.google.dev)
- **Purpose**: Primary AI provider for interviews and feedback
- **Free tier**: Very generous quotas

#### Option 2: Groq (Alternative - Free)
```bash
GROQ_API_KEY=gsk_...
```
- **Where to get**: [Groq Console](https://console.groq.com)
- **Purpose**: Fallback AI provider (uses Llama models)
- **Free tier**: Excellent performance

**Note**: The app will automatically use Gemini first, then fall back to Groq if Gemini fails.

## Optional Variables

### Cloudinary (Image Uploads)
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123...
```
- **Where to get**: [Cloudinary](https://cloudinary.com) (free tier available)
- **Purpose**: Profile image uploads and avatar management
- **Without it**: Image uploads will fail, but the app works fine otherwise

## Example .env.local File

```bash
# Database (REQUIRED)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prepmate?retryWrites=true&w=majority

# Clerk Auth (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AI APIs (at least one REQUIRED - both are FREE)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXX
GROQ_API_KEY=gsk_XXXXXXXXXXXXXX

# Cloudinary (OPTIONAL)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

## Security Notes

1. **Never commit .env.local** - It's already in .gitignore
2. **Rotate secrets regularly** - Especially webhook secrets
3. **Use environment-specific keys** - Different keys for dev/staging/production
4. **Restrict API key domains** - In Google AI Studio and other dashboards

## Troubleshooting

### "No AI provider configured" error
- Make sure at least one of GEMINI_API_KEY or GROQ_API_KEY is set
- Check that the key doesn't start with "placeholder"

### Authentication not working
- Verify all Clerk environment variables are set
- Make sure webhook URL is correctly configured in Clerk dashboard
- Check that URLs in .env.local match your actual routes

### Database connection failed
- Test your MongoDB URI in MongoDB Compass
- Check if your IP is whitelisted in MongoDB Atlas
- Verify username/password are correct and URL-encoded
