import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = createClient();
        
        const { data: question, error } = await supabase
            .from('questions')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            question,
        });
    } catch (error) {
        console.error("Error fetching question:", error);
        return NextResponse.json(
            { error: "Failed to fetch question" },
            { status: 500 }
        );
    }
}
