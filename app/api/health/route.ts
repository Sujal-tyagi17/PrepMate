import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Health check endpoint
 * Returns 200 if the app is healthy, 503 otherwise
 */
export async function GET() {
    try {
        // Check database connection
        const supabase = createClient();
        const { error: dbError } = await supabase.from('users').select('id').limit(1);
        
        if (dbError) {
            throw new Error('Database connection failed');
        }

        // Check environment variables
        const hasAuth = !!process.env.CLERK_SECRET_KEY;
        const hasAI = !!(process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY);

        if (!hasAuth || !hasAI) {
            return NextResponse.json(
                {
                    status: 'unhealthy',
                    checks: {
                        database: 'ok',
                        auth: hasAuth ? 'ok' : 'missing',
                        ai: hasAI ? 'ok' : 'missing',
                    },
                },
                { status: 503 }
            );
        }

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            checks: {
                database: 'ok',
                auth: 'ok',
                ai: 'ok',
            },
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json(
            {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}
