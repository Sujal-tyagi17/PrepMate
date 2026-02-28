import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/email-templates";

interface ClerkWebhookEvent {
    type: string;
    data: {
        id: string;
        email_addresses: Array<{ email_address: string }>;
        first_name: string | null;
        last_name: string | null;
        image_url: string;
    };
}

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    // If no webhook secret configured, skip verification (dev mode)
    const body = await req.text();
    const headerPayload = await headers();

    if (WEBHOOK_SECRET && !WEBHOOK_SECRET.startsWith("whsec_placeholder")) {
        const svixId = headerPayload.get("svix-id");
        const svixTimestamp = headerPayload.get("svix-timestamp");
        const svixSignature = headerPayload.get("svix-signature");

        if (!svixId || !svixTimestamp || !svixSignature) {
            return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
        }

        const wh = new Webhook(WEBHOOK_SECRET);
        try {
            wh.verify(body, {
                "svix-id": svixId,
                "svix-timestamp": svixTimestamp,
                "svix-signature": svixSignature,
            });
        } catch {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    }

    const event: ClerkWebhookEvent = JSON.parse(body);
    const supabase = createClient();

    if (event.type === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const email = email_addresses[0]?.email_address ?? "";
        const name = `${first_name ?? ""} ${last_name ?? ""}`.trim() || email;

        // Upsert user (insert or update if exists)
        const { error } = await supabase
            .from('users')
            .upsert({
                clerk_id: id,
                name,
                email,
                image: image_url,
                bio: '',
                default_difficulty: 'medium',
                default_duration: 30,
                total_interviews: 0,
                average_score: 0,
                focus_areas: [],
                notification_reminders: true,
                notification_score_updates: true,
                notification_new_features: false,
                notification_tips: true,
                voice_speed: 1.0,
                strict_mode: false,
            }, {
                onConflict: 'clerk_id'
            });

        if (error) {
            console.error("[WEBHOOK] Error creating user:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Send welcome email (only in production with verified domain)
        if (process.env.NODE_ENV === 'production') {
            try {
                const welcomeEmail = emailTemplates.welcome(name);
                await sendEmail({
                    to: email,
                    subject: welcomeEmail.subject,
                    html: welcomeEmail.html
                });
                console.log("[WEBHOOK] Welcome email sent to:", email);
            } catch (emailError) {
                console.error("[WEBHOOK] Failed to send welcome email:", emailError);
                // Don't fail webhook if email fails
            }
        }
    }

    if (event.type === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const email = email_addresses[0]?.email_address ?? "";
        const name = `${first_name ?? ""} ${last_name ?? ""}`.trim() || email;

        const { error } = await supabase
            .from('users')
            .update({
                name,
                email,
                image: image_url,
            })
            .eq('clerk_id', id);

        if (error) {
            console.error("[WEBHOOK] Error updating user:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    if (event.type === "user.deleted") {
        const { id } = event.data;
        
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('clerk_id', id);

        if (error) {
            console.error("[WEBHOOK] Error deleting user:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
