/**
 * Helper to get the Supabase user from a Clerk userId.
 * Creates the user record on first login via webhook, but
 * this fallback ensures we always have a valid user.
 */
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@/types/database";

/**
 * Returns the authenticated userId from Clerk, or throws if not authenticated.
 */
export async function requireAuth(): Promise<string> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return userId;
}

/**
 * Returns the Supabase user document for the current Clerk session.
 * Auto-creates the user if it doesn't exist yet.
 */
export async function getCurrentUser(): Promise<User | null> {
    const { userId } = await auth();
    if (!userId) return null;

    try {
        const supabase = createClient();

        // Try to find existing user
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
            console.error("[AUTH] Error fetching user:", fetchError);
            return null;
        }

        // Auto-create if not found (edge case if webhook missed)
        if (!user) {
            const clerkUser = await currentUser();
            if (!clerkUser) return null;

            const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
            const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || email;
            const image = clerkUser.imageUrl;

            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    clerk_id: userId,
                    name,
                    email,
                    image,
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
                })
                .select()
                .single();

            if (createError) {
                console.error("[AUTH] Error creating user:", createError);
                return null;
            }

            return newUser;
        }

        return user;
    } catch (error) {
        console.error("[AUTH] Database operation failed:", error instanceof Error ? error.message : error);
        return null;
    }
}
