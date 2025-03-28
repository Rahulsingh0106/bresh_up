import { NextResponse } from "next/server";

export async function GET(req) {
    console.log("🔹 API Route Hit: /api/getToken");

    const apiKey = process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY;
    console.log(apiKey)
    if (!apiKey) {
        console.error("❌ API Key is missing");
        return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }

    return NextResponse.json({ token: apiKey }, { status: 200 });
}
