import { callJSON, MODELS } from "@/lib/openai";
import {
  CV_INTELLIGENCE_PROMPT,
  ONBOARDING_PROMPT,
  RECRUITER_PROMPT,
  SCREENING_PROMPT,
} from "./prompts";
import type {
  ExtractedProfile,
  HiringBrief,
  MatchResult,
} from "@/lib/types";

/**
 * Agent 2 — CV Intelligence Agent.
 * Raw CV text -> structured candidate profile.
 */
export async function runCvIntelligence(cvText: string): Promise<ExtractedProfile> {
  const data = await callJSON<ExtractedProfile>({
    system: CV_INTELLIGENCE_PROMPT,
    user: `CV TEXT:\n"""\n${cvText}\n"""`,
  });
  // Defensive defaults so the UI never breaks on a sparse CV.
  return {
    current_title: data.current_title || "",
    years_experience: Number(data.years_experience) || 0,
    summary: data.summary || "",
    skills: data.skills || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    industries: data.industries || [],
    previous_companies: data.previous_companies || [],
    work_history: data.work_history || [],
    education: data.education || [],
    missing_fields: data.missing_fields || [],
  };
}

/**
 * Agent 1 — Candidate Onboarding Agent.
 * Missing-field list -> minimal set of follow-up questions.
 */
export async function runOnboardingQuestions(
  missingFields: string[]
): Promise<{ questions: { field: string; label: string; type: string; options: string[] | null }[] }> {
  if (missingFields.length === 0) return { questions: [] };
  return callJSON({
    system: ONBOARDING_PROMPT,
    user: `MISSING FIELDS: ${JSON.stringify(missingFields)}`,
  });
}

/**
 * Agent 4 — AI Recruiter Agent.
 * Natural-language request -> structured hiring brief (+ follow-up questions).
 */
export async function runRecruiter(naturalRequest: string): Promise<HiringBrief> {
  const brief = await callJSON<HiringBrief>({
    system: RECRUITER_PROMPT,
    user: `EMPLOYER REQUEST:\n"""\n${naturalRequest}\n"""`,
  });
  return {
    ...brief,
    required_skills: brief.required_skills || [],
    nice_to_have_skills: brief.nice_to_have_skills || [],
    industries: brief.industries || [],
    languages: brief.languages || [],
    certifications: brief.certifications || [],
    follow_up_questions: brief.follow_up_questions || [],
    currency: brief.currency || "QAR",
  };
}

/**
 * Agent 6 — AI Screening Agent.
 * Writes the human explanation for ONE candidate given the deterministic score.
 */
export async function runScreening(input: {
  brief: HiringBrief;
  candidate: Record<string, unknown>;
  score: number;
  breakdown: Record<string, number>;
}): Promise<Pick<MatchResult, "summary" | "strengths" | "gaps" | "risks">> {
  const data = await callJSON<Pick<MatchResult, "summary" | "strengths" | "gaps" | "risks">>({
    model: MODELS.screening,
    system: SCREENING_PROMPT,
    user: `HIRING BRIEF:\n${JSON.stringify(input.brief)}\n\nCANDIDATE PROFILE:\n${JSON.stringify(
      input.candidate
    )}\n\nPRE-COMPUTED SCORE: ${input.score}\nBREAKDOWN: ${JSON.stringify(input.breakdown)}`,
  });
  return {
    summary: data.summary || "",
    strengths: data.strengths || [],
    gaps: data.gaps || [],
    risks: data.risks || [],
  };
}
