import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    try {
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        // Convert file to base64 for Cloudinary upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "prepmate/resumes",
            resource_type: "raw",
            public_id: `${user.id}-${Date.now()}`,
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error("[RESUME UPLOAD]", error);
        return NextResponse.json(
            { error: "Failed to upload resume" },
            { status: 500 }
        );
    }
}
