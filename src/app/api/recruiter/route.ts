import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runRecruiter } from "@/lib/agents";

export const runtime = "nodejs";

/**
 * POST /api/recruiter
 * Body: { request: string }   (natural language, e.g. "I need a sales manager…")
 * Returns a structured HiringBrief the employer can review before saving.
 */
export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { request } = await req.json();
  if (!request || typeof request !== "string" || request.trim().length < 10) {
    return NextResponse.json({ error: "Tell us a bit more about who you need." }, { status: 400 });
  }

  try {
    const brief = await runRecruiter(request);
    return NextResponse.json({ brief });
  } catch (e) {
    console.error("recruiter failed", e);
    return NextResponse.json({ error: "The AI Recruiter failed. Check your OpenAI key." }, { status: 500 });
  }
}
