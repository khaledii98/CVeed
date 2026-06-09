"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ExtractedProfile } from "@/lib/types";

/** Rough completeness score (0–100) for the living profile. */
function completeness(c: Record<string, unknown>): number {
  const keys = [
    "current_title", "years_experience", "skills", "languages", "industries",
    "expected_salary_max", "availability", "noc_status", "preferred_job_type", "cv_text",
  ];
  const filled = keys.filter((k) => {
    const v = c[k];
    if (Array.isArray(v)) return v.length > 0;
    return v !== null && v !== undefined && v !== "" && v !== 0;
  }).length;
  return Math.round((filled / keys.length) * 100);
}

/** Save the reviewed profile + onboarding answers to the candidates table. */
export async function saveOnboarding(payload: {
  profile: ExtractedProfile;
  cvText: string;
  answers: Record<string, string>;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const a = payload.answers || {};
  const row = {
    id: user.id,
    current_title: payload.profile.current_title,
    years_experience: payload.profile.years_experience,
    summary: payload.profile.summary,
    skills: payload.profile.skills,
    certifications: payload.profile.certifications,
    languages: payload.profile.languages,
    industries: payload.profile.industries,
    previous_companies: payload.profile.previous_companies,
    work_history: payload.profile.work_history,
    education: payload.profile.education,
    cv_text: payload.cvText,
    expected_salary_max: a.expected_salary ? Number(a.expected_salary) : null,
    notice_period: a.notice_period || null,
    availability: a.availability || null,
    noc_status: (a.noc_status as "yes" | "no" | "unknown") || "unknown",
    preferred_job_type: a.preferred_job_type || null,
    updated_at: new Date().toISOString(),
  };

  const withScore = { ...row, completeness: completeness(row) };

  const { error } = await supabase.from("candidates").upsert(withScore);
  if (error) {
    console.error("saveOnboarding failed", error);
    redirect(`/candidate/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/candidate/profile?welcome=1");
}
