/**
 * Environment variable validation
 * Run this at app startup to ensure all required variables are present
 */

const requiredEnvVars = [
    'MONGODB_URI',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
] as const;

const requiredAIProvider = ['GEMINI_API_KEY', 'GROQ_API_KEY'] as const;

export function validateEnv() {
    // Check required variables
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
            `Please check docs/ENVIRONMENT_SETUP.md for setup instructions.`
        );
    }

    // Check at least one AI provider is configured
    const hasAIProvider = requiredAIProvider.some(key => {
        const value = process.env[key];
        return value && !value.startsWith('placeholder');
    });

    if (!hasAIProvider) {
        throw new Error(
            `❌ No AI provider configured. Set at least one of:\n` +
            `  - GEMINI_API_KEY (get from https://ai.google.dev)\n` +
            `  - GROQ_API_KEY (get from https://console.groq.com)\n\n` +
            `Both are FREE. See docs/ENVIRONMENT_SETUP.md for details.`
        );
    }

    // Warn about optional configs
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME_HERE') {
        console.warn(
            '⚠️  Cloudinary not configured. Image uploads will fail.\n' +
            '   This is optional - see docs/ENVIRONMENT_SETUP.md'
        );
    }

    console.log('✅ Environment variables validated successfully');
}

// Auto-validate on import (server-side only)
if (typeof window === 'undefined') {
    validateEnv();
}
