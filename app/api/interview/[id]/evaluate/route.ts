import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";
import { INTERVIEW_PROMPTS } from "@/lib/prompts";

interface EvaluationResult {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    followUp?: string;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { question, answer } = body;

        if (!question || !answer || answer.trim() === "[No answer provided]") {
            return NextResponse.json(
                { error: "Question and valid answer are required" },
                { status: 400 }
            );
        }

        const { id } = await params;
        const supabase = createClient();

        const { data: interview, error: fetchError } = await supabase
            .from('interviews')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !interview) {
            return NextResponse.json({ error: "Interview not found" }, { status: 404 });
        }

        if (interview.user_id !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Evaluate using Gemini (via lib/ai.ts)
        const systemPrompt = INTERVIEW_PROMPTS.systemPrompt(
            interview.type,
            interview.difficulty,
            interview.role,
            interview.company,
            interview.resume_text,
            interview.job_description
        );
        const userPrompt = INTERVIEW_PROMPTS.evaluateAnswer(question, answer, interview.type);

        const evaluation = await generateJSON<EvaluationResult>(userPrompt, systemPrompt);

        // Clamp score between 0-10
        const score = Math.min(10, Math.max(0, evaluation.score ?? 5));

        // Insert answer into answers table
        const { error: insertError } = await supabase
            .from('answers')
            .insert({
                interview_id: id,
                question_text: question,
                user_answer: answer,
                score,
                feedback: evaluation.feedback,
                strengths: evaluation.strengths ?? [],
                improvements: evaluation.improvements ?? [],
            });

        if (insertError) {
            console.error("Error inserting answer:", insertError);
            return NextResponse.json(
                { error: "Failed to save answer" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            evaluation: {
                score,
                feedback: evaluation.feedback,
                strengths: evaluation.strengths ?? [],
                improvements: evaluation.improvements ?? [],
                followUp: evaluation.followUp,
            },
        });
    } catch (error) {
        console.error("Error evaluating answer:", error);
        return NextResponse.json(
            { error: "Failed to evaluate answer" },
            { status: 500 }
        );
    }
}
