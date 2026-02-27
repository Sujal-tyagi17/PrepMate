import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/email-templates";

/**
 * Cron endpoint to send scheduled notifications
 * POST /api/cron/send-notifications?type=daily|weekly
 * 
 * Setup in Vercel:
 * - Daily reminders: 0 9 * * * (9 AM every day)
 * - Weekly tips: 0 10 * * 1 (10 AM every Monday)
 */
export async function POST(req: NextRequest) {
    try {
        // Verify cron secret for security
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        if (type === 'daily') {
            return await sendDailyReminders();
        } else if (type === 'weekly') {
            return await sendWeeklyTips();
        } else {
            return NextResponse.json({ 
                error: "Invalid type. Use 'daily' or 'weekly'" 
            }, { status: 400 });
        }

    } catch (error) {
        console.error("[CRON] Error:", error);
        return NextResponse.json({ 
            error: "Failed to send notifications" 
        }, { status: 500 });
    }
}

async function sendDailyReminders() {
    const supabase = createClient();

    // Get users who want daily reminders
    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, total_interviews')
        .eq('notification_reminders', true);

    if (error) {
        console.error("[CRON] Error fetching users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let sent = 0;
    let failed = 0;

    for (const user of users || []) {
        try {
            // Calculate streak (simplified - you might want to calculate actual streak from interview dates)
            const streak = user.total_interviews || 0;

            const reminderEmail = emailTemplates.dailyReminder(user.name, streak);
            const result = await sendEmail({
                to: user.email,
                subject: reminderEmail.subject,
                html: reminderEmail.html
            });

            if (result.success) {
                sent++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error(`[CRON] Failed to send reminder to ${user.email}:`, error);
            failed++;
        }
    }

    console.log(`[CRON] Daily reminders: ${sent} sent, ${failed} failed`);
    return NextResponse.json({ 
        success: true, 
        type: 'daily',
        sent,
        failed 
    });
}

async function sendWeeklyTips() {
    const supabase = createClient();

    // Get users who want weekly tips
    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('notification_tips', true);

    if (error) {
        console.error("[CRON] Error fetching users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tips = [
        {
            title: "Master the STAR Method",
            content: "When answering behavioral questions, use the STAR method: Situation, Task, Action, Result. This structure helps you provide comprehensive and memorable answers."
        },
        {
            title: "Ask Smart Questions",
            content: "Always prepare 2-3 thoughtful questions about the role, team culture, or company challenges. It shows genuine interest and helps you evaluate if the position is right for you."
        },
        {
            title: "Practice Out Loud",
            content: "Don't just think about your answers - say them out loud! Practicing verbally helps you refine your delivery, timing, and confidence before the actual interview."
        },
        {
            title: "Research the Company",
            content: "Spend 30 minutes researching the company's recent news, products, and culture. Weave this knowledge into your answers to demonstrate genuine interest and preparation."
        },
        {
            title: "Handle Silence Gracefully",
            content: "It's okay to take 5-10 seconds to think before answering. Say 'Let me think about that for a moment' rather than rushing into an unpolished response."
        }
    ];

    // Rotate tips based on week number
    const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    const tipOfWeek = tips[weekNumber % tips.length];

    let sent = 0;
    let failed = 0;

    for (const user of users || []) {
        try {
            const tipEmail = emailTemplates.weeklyTip(
                user.name,
                tipOfWeek.content,
                tipOfWeek.title
            );

            const result = await sendEmail({
                to: user.email,
                subject: tipEmail.subject,
                html: tipEmail.html
            });

            if (result.success) {
                sent++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error(`[CRON] Failed to send tip to ${user.email}:`, error);
            failed++;
        }
    }

    console.log(`[CRON] Weekly tips: ${sent} sent, ${failed} failed`);
    return NextResponse.json({ 
        success: true, 
        type: 'weekly',
        sent,
        failed 
    });
}
