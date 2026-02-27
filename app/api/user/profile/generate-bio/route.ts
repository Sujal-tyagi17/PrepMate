import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, focusAreas } = await req.json();

        const systemPrompt = `You are an expert profile writer. Generate a professional, engaging, and concise bio for a user's interview preparation profile. The bio should be 2-3 sentences highlighting their background, goals, and areas of focus.`;

        const prompt = `Generate a professional bio for ${name || "a user"}${focusAreas && focusAreas.length > 0 ? ` who is focusing on: ${focusAreas.join(", ")}` : ""}. Keep it under 150 words and make it engaging and personal.`;

        const bio = await generateText(prompt, systemPrompt);

        return NextResponse.json({ success: true, bio });
    } catch (error) {
        console.error("Error generating bio:", error);
        return NextResponse.json({ error: "Failed to generate bio" }, { status: 500 });
    }
}
