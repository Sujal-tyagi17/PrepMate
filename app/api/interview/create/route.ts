import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        console.log("[CREATE INTERVIEW] Starting...");
        
        const user = await getCurrentUser();
        console.log("[CREATE INTERVIEW] User fetched:", user ? "Found" : "Not found");
        
        if (!user) {
            return NextResponse.json({ 
                error: "Unauthorized", 
                message: "User not authenticated"
            }, { status: 401 });
        }

        const body = await req.json();
        console.log("[CREATE INTERVIEW] Request body:", body);
        
        const { type, difficulty, role, company, jobDescription, resumeUrl, resumeText, totalQuestions } = body;

        if (!type || !difficulty) {
            return NextResponse.json(
                { error: "Type and difficulty are required" },
                { status: 400 }
            );
        }

        console.log("[CREATE INTERVIEW] Creating interview...");
        const supabase = createClient();
        
        const { data: interview, error } = await supabase
            .from('interviews')
            .insert({
                user_id: user.id,
                type,
                difficulty,
                role: role || null,
                company: company || null,
                job_description: jobDescription || null,
                resume_url: resumeUrl || null,
                resume_text: resumeText || null,
                total_questions: totalQuestions || 5,
                status: "in-progress",
            })
            .select()
            .single();

        if (error) {
            console.error("[CREATE INTERVIEW] Error:", error);
            return NextResponse.json(
                { error: "Failed to create interview", details: error.message },
                { status: 500 }
            );
        }

        console.log("[CREATE INTERVIEW] Interview created:", interview.id);

        return NextResponse.json({
            success: true,
            interview: {
                id: interview.id,
                type: interview.type,
                difficulty: interview.difficulty,
                role: interview.role,
                company: interview.company,
                status: interview.status,
                startedAt: interview.started_at,
            },
        });
    } catch (error) {
        console.error("[CREATE INTERVIEW] Error:", error);
        console.error("[CREATE INTERVIEW] Stack:", error instanceof Error ? error.stack : "No stack trace");
        return NextResponse.json(
            { 
                error: "Failed to create interview",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
