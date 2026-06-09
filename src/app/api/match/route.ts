import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreCandidate, type ScorableCandidate } from "@/lib/matching";
import { runScreening } from "@/lib/agents";
import type { HiringBrief, RoleCategory } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/** How many top candidates get a written AI explanation (bounds cost + latency). */
const EXPLAIN_TOP_N = 6;

/**
 * POST /api/match  Body: { requestId: string }
 *
 * 1. Verify the hiring request belongs to the signed-in employer (RLS-scoped read).
 * 2. Load open candidates (service role — needs to read across users).
 * 3. Score everyone deterministically (reproducible).
 * 4. Ask the AI Screening Agent to explain the top N.
 * 5. Save results to `matches` and return them.
 */
export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { requestId } = await req.json();

  // Ownership check via RLS: this only returns the row if the user owns it.
  const { data: hr } = await supabase.from("hiring_requests").select("*").eq("id", requestId).single();
  if (!hr) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  const brief: HiringBrief = {
    title: hr.title,
    role_category: (hr.role_category as RoleCategory) || "general",
    required_skills: hr.required_skills || [],
    nice_to_have_skills: hr.nice_to_have_skills || [],
    min_years_experience: Number(hr.min_years_experience) || 0,
    industries: hr.industries || [],
    languages: hr.languages || [],
    certifications: hr.certifications || [],
    location: hr.location || "",
    salary_min: hr.salary_min,
    salary_max: hr.salary_max,
    currency: hr.currency || "QAR",
    noc_required: hr.noc_required || false,
    job_type: hr.job_type || "full_time",
    start_date: hr.start_date,
    follow_up_questions: [],
  };

  const admin = createAdminClient();

  // Candidates who are at least slightly open.
  const { data: candidates } = await admin
    .from("candidates")
    .select("*, profiles(full_name)")
    .neq("open_to_opportunities", "not_looking");

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ matches: [], message: "No available candidates yet." });
  }

  // 1) Deterministic scoring for everyone.
  const scored = candidates
    .map((c) => {
      const { score, breakdown } = scoreCandidate(brief, c as unknown as ScorableCandidate);
      return { c, score, breakdown };
    })
    .sort((a, b) => b.score - a.score);

  // 2) AI explanations for the top N only.
  const top = scored.slice(0, EXPLAIN_TOP_N);
  const explained = await Promise.all(
    top.map(async ({ c, score, breakdown }) => {
      let detail = { summary: "", strengths: [] as string[], gaps: [] as string[], risks: [] as string[] };
      try {
        detail = await runScreening({
          brief,
          candidate: {
            title: c.current_title, years_experience: c.years_experience, skills: c.skills,
            languages: c.languages, industries: c.industries, certifications: c.certifications,
            expected_salary_max: c.expected_salary_max, availability: c.availability,
            noc_status: c.noc_status, open_to_opportunities: c.open_to_opportunities,
          },
          score,
          breakdown,
        });
      } catch (e) {
        console.error("screening failed for candidate", c.id, e);
      }
      return { c, score, breakdown, detail };
    })
  );

  // 3) Persist matches (service role bypasses RLS for the write).
  const rows = explained.map(({ c, score, breakdown, detail }) => ({
    hiring_request_id: requestId,
    candidate_id: c.id,
    score,
    breakdown,
    summary: detail.summary,
    strengths: detail.strengths,
    gaps: detail.gaps,
    risks: detail.risks,
  }));
  await admin.from("matches").upsert(rows, { onConflict: "hiring_request_id,candidate_id" });

  return NextResponse.json({ count: rows.length });
}
