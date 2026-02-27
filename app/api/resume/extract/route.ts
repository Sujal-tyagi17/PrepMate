import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { resumeUrl } = await req.json();

        if (!resumeUrl) {
            return NextResponse.json({ error: "Resume URL is required" }, { status: 400 });
        }

        // Fetch the PDF
        const pdfResponse = await fetch(resumeUrl);
        if (!pdfResponse.ok) {
            throw new Error("Failed to fetch PDF");
        }

        const arrayBuffer = await pdfResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Use pdf-parse to extract text
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);

        return NextResponse.json({
            text: pdfData.text,
            pages: pdfData.numpages,
        });
    } catch (error) {
        console.error("[RESUME EXTRACT]", error);
        return NextResponse.json(
            { error: "Failed to extract resume text" },
            { status: 500 }
        );
    }
}
