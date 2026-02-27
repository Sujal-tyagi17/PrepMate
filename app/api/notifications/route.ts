import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

type NotificationType = 'reminder' | 'score_update' | 'new_feature' | 'tip';

/**
 * Send a notification to a user
 * POST /api/notifications/send
 * 
 * Body:
 * {
 *   userId?: string,  // Optional - defaults to current user
 *   type: 'reminder' | 'score_update' | 'new_feature' | 'tip',
 *   title: string,
 *   message: string
 * }
 */
export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { userId, type, title, message } = body;

        if (!type || !title || !message) {
            return NextResponse.json(
                { error: "Missing required fields: type, title, message" },
                { status: 400 }
            );
        }

        const validTypes: NotificationType[] = ['reminder', 'score_update', 'new_feature', 'tip'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: "Invalid notification type" },
                { status: 400 }
            );
        }

        const targetUserId = userId || currentUser.id;
        const supabase = createClient();

        // Get user's notification preferences
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('email, notification_reminders, notification_score_updates, notification_new_features, notification_tips')
            .eq('id', targetUserId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user has this notification type enabled
        const notificationEnabled: Record<NotificationType, boolean> = {
            'reminder': user.notification_reminders,
            'score_update': user.notification_score_updates,
            'new_feature': user.notification_new_features,
            'tip': user.notification_tips
        };

        if (!notificationEnabled[type as NotificationType]) {
            return NextResponse.json({ 
                success: true, 
                sent: false, 
                message: "User has disabled this notification type" 
            });
        }

        // Send the email
        const emailResult = await sendEmail({
            to: user.email,
            subject: title,
            html: message
        });

        if (!emailResult.success) {
            console.error('[NOTIFICATION] Failed to send email:', emailResult.error);
            return NextResponse.json({ 
                success: false, 
                error: 'Failed to send notification email' 
            }, { status: 500 });
        }

        console.log('[NOTIFICATION] Email sent successfully to:', user.email);

        return NextResponse.json({ 
            success: true, 
            sent: true,
            message: "Notification queued for delivery"
        });

    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { error: "Failed to send notification" },
            { status: 500 }
        );
    }
}

/**
 * Get notification preferences for current user
 * GET /api/notifications
 */
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            preferences: {
                reminders: user.notification_reminders,
                scoreUpdates: user.notification_score_updates,
                newFeatures: user.notification_new_features,
                tips: user.notification_tips
            }
        });

    } catch (error) {
        console.error("Error fetching notification preferences:", error);
        return NextResponse.json(
            { error: "Failed to fetch preferences" },
            { status: 500 }
        );
    }
}
