import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const supabase = createClient();
        const { searchParams } = new URL(req.url);
        
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        // Start building the query
        let query = supabase.from('questions').select('*', { count: 'exact' });

        // Apply filters
        if (category && category !== "all") {
            query = query.eq('category', category);
        }

        if (difficulty && difficulty !== "all") {
            query = query.eq('difficulty', difficulty);
        }

        if (search) {
            query = query.or(`text.ilike.%${search}%,tags.cs.{${search}}`);
        }

        // Apply pagination
        const offset = (page - 1) * limit;
        query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

        const { data: questions, error, count } = await query;

        if (error) {
            console.error("Error fetching questions:", error);
            return NextResponse.json(
                { error: "Failed to fetch questions" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            questions,
            pagination: {
                page,
                limit,
                total: count || 0,
                pages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createClient();

        const body = await req.json();
        const { text, category, difficulty, tags, company, role, sampleAnswer } = body;

        if (!text || !category || !difficulty) {
            return NextResponse.json(
                { error: "Text, category, and difficulty are required" },
                { status: 400 }
            );
        }

        const { data: question, error } = await supabase
            .from('questions')
            .insert({
                text,
                category,
                difficulty,
                tags: tags || [],
                company: company || null,
                role: role || null,
                sample_answer: sampleAnswer || null,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating question:", error);
            return NextResponse.json(
                { error: "Failed to create question" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            question,
        });
    } catch (error) {
        console.error("Error creating question:", error);
        return NextResponse.json(
            { error: "Failed to create question" },
            { status: 500 }
        );
    }
}
