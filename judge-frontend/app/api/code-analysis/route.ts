import { NextResponse } from "next/server";
import { analyzeCodeWithGroq } from "@/app/lib/groq";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const code = typeof body?.code === "string" ? body.code.trim() : "";

        if (!code) {
            return NextResponse.json(
                { ok: false, error: "Code is required." },
                { status: 400 }
            );
        }

        const analysis = await analyzeCodeWithGroq(code);
        return NextResponse.json({ ok: true, analysis });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error ? error.message : "Failed to analyze code."
            },
            { status: 500 }
        );
    }
}
