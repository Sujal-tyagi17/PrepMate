import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

/**
 * Mark old in-progress interviews as abandoned
 * GET /api/interviews/cleanup
 * 
 * Marks interviews as "abandoned" if they meet these criteria:
 * - Status is "in-progress"
 * - Started more than 24 hours ago
 * - Belongs to the current user
 */
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createClient();
        
        // Calculate cutoff time (24 hours ago)
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - 24);
        const cutoffISO = cutoffTime.toISOString();

        // Find abandoned interviews for this user
        const { data: abandonedInterviews, error: fetchError } = await supabase
            .from('interviews')
            .select('id, started_at, type, company')
            .eq('user_id', user.id)
            .eq('status', 'in-progress')
            .lt('started_at', cutoffISO);

        if (fetchError) {
            console.error("[CLEANUP] Error fetching abandoned interviews:", fetchError);
            return NextResponse.json({ 
                error: "Failed to fetch interviews" 
            }, { status: 500 });
        }

        if (!abandonedInterviews || abandonedInterviews.length === 0) {
            return NextResponse.json({ 
                success: true, 
                cleaned: 0,
                message: "No abandoned interviews found"
            });
        }

        // Mark them as abandoned
        const { error: updateError } = await supabase
            .from('interviews')
            .update({ status: 'abandoned' })
            .eq('user_id', user.id)
            .eq('status', 'in-progress')
            .lt('started_at', cutoffISO);

        if (updateError) {
            console.error("[CLEANUP] Error updating interviews:", updateError);
            return NextResponse.json({ 
                error: "Failed to update interviews" 
            }, { status: 500 });
        }

        console.log(`[CLEANUP] Marked ${abandonedInterviews.length} interviews as abandoned for user ${user.id}`);

        return NextResponse.json({ 
            success: true, 
            cleaned: abandonedInterviews.length,
            message: `Marked ${abandonedInterviews.length} interview(s) as abandoned`
        });

    } catch (error) {
        console.error("[CLEANUP] Error:", error);
        return NextResponse.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
}

/**
 * Mark inactive in-progress interviews as completed (if they have answers)
 * POST /api/interviews/cleanup
 */
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createClient();
        
        // Find in-progress interviews with answers that are older than 2 hours
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - 2);
        const cutoffISO = cutoffTime.toISOString();

        const { data: interviews, error: fetchError } = await supabase
            .from('interviews')
            .select(`
                id,
                started_at,
                answers (id, score)
            `)
            .eq('user_id', user.id)
            .eq('status', 'in-progress')
            .lt('started_at', cutoffISO);

        if (fetchError) {
            console.error("[CLEANUP] Error fetching interviews:", fetchError);
            return NextResponse.json({ 
                error: "Failed to fetch interviews" 
            }, { status: 500 });
        }

        if (!interviews || interviews.length === 0) {
            return NextResponse.json({ 
                success: true, 
                completed: 0,
                message: "No interviews to auto-complete"
            });
        }

        let completedCount = 0;

        // Auto-complete interviews that have at least 3 answered questions
        for (const interview of interviews) {
            const answers = interview.answers || [];
            
            if (answers.length >= 3) {
                // Calculate average score
                const scores = answers.map((a: any) => a.score ?? 0);
                const avgScore = scores.length > 0 
                    ? Math.round((scores.reduce((s: number, n: number) => s + n, 0) / scores.length) * 10) / 10 
                    : 0;

                const now = new Date().toISOString();
                const duration = Math.floor(
                    (new Date(now).getTime() - new Date(interview.started_at).getTime()) / 1000
                );

                // Update to completed
                const { error: updateError } = await supabase
                    .from('interviews')
                    .update({
                        status: 'completed',
                        completed_at: now,
                        duration: duration,
                        overall_score: avgScore
                    })
                    .eq('id', interview.id);

                if (!updateError) {
                    completedCount++;
                }
            }
        }

        console.log(`[CLEANUP] Auto-completed ${completedCount} interviews for user ${user.id}`);

        return NextResponse.json({ 
            success: true, 
            completed: completedCount,
            message: `Auto-completed ${completedCount} interview(s)`
        });

    } catch (error) {
        console.error("[CLEANUP] Error:", error);
        return NextResponse.json({ 
            error: "Internal server error" 
        }, { status: 500 });
    }
}
