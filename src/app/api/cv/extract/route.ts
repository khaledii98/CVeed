import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runCvIntelligence, runOnboardingQuestions } from "@/lib/agents";

export const runtime = "nodejs";

/**
 * POST /api/cv/extract
 * Body: { cvText: string }
 * Runs the CV Intelligence Agent + Onboarding Agent and returns the extracted
 * profile plus the minimal follow-up questions. Does not save anything yet —
 * the candidate reviews first.
 */
export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { cvText } = await req.json();
  if (!cvText || typeof cvText !== "string" || cvText.trim().length < 30) {
    return NextResponse.json({ error: "Please paste at least a few lines of your CV." }, { status: 400 });
  }

  try {
    const profile = await runCvIntelligence(cvText);
    const { questions } = await runOnboardingQuestions(profile.missing_fields);
    return NextResponse.json({ profile, questions });
  } catch (e) {
    console.error("cv/extract failed", e);
    return NextResponse.json(
      { error: "The AI could not read this CV. Check your OpenAI key and try again." },
      { status: 500 }
    );
  }
}
