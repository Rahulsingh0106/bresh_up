import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        // Convert file to a Blob
        const fileBuffer = await file.arrayBuffer();
        const blob = new Blob([fileBuffer], { type: "audio/webm" });

        // Prepare FormData with the correct Blob
        const whisperFormData = new FormData();
        whisperFormData.append("file", blob, "audio.webm");  // ✅ Fix: Use `Blob` instead of `Buffer`
        whisperFormData.append("model", "whisper-1");

        // Send the request to OpenAI Whisper API
        const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: whisperFormData,  // ✅ Send correct FormData
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
