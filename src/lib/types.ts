/**
 * Shared TypeScript types for CVeed.
 * These mirror the database tables in supabase/schema.sql.
 */

export type UserRole = "candidate" | "employer" | "admin";

/** Candidate availability / interest level — editable at any time. */
export type OpenToOpportunities =
  | "not_looking"
  | "slightly_open"
  | "open_to_discussions"
  | "actively_exploring"
  | "available_immediately";

export const OPEN_TO_OPPORTUNITIES: { value: OpenToOpportunities; label: string }[] = [
  { value: "not_looking", label: "Not Looking" },
  { value: "slightly_open", label: "Slightly Open" },
  { value: "open_to_discussions", label: "Open To Discussions" },
  { value: "actively_exploring", label: "Actively Exploring" },
  { value: "available_immediately", label: "Available Immediately" },
];

export type NocStatus = "yes" | "no" | "unknown";
export type JobType = "full_time" | "part_time" | "contract" | "temporary" | "any";

export interface WorkHistoryItem {
  title: string;
  company: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
}

/** The structured profile the CV Intelligence Agent produces. */
export interface ExtractedProfile {
  current_title: string;
  years_experience: number;
  summary: string;
  skills: string[];
  certifications: string[];
  languages: string[];
  industries: string[];
  previous_companies: string[];
  work_history: WorkHistoryItem[];
  education: EducationItem[];
  /** Fields the CV did not contain — drives the onboarding questions. */
  missing_fields: string[];
}

/** The structured hiring brief the AI Recruiter Agent produces. */
export interface HiringBrief {
  title: string;
  role_category: RoleCategory;
  required_skills: string[];
  nice_to_have_skills: string[];
  min_years_experience: number;
  industries: string[];
  languages: string[];
  certifications: string[];
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  noc_required: boolean;
  job_type: JobType;
  start_date: string | null;
  /** Recruiter-style questions to ask if key info is missing. */
  follow_up_questions: string[];
}

export type RoleCategory =
  | "sales"
  | "engineering"
  | "hospitality"
  | "finance"
  | "management"
  | "technician"
  | "general";

/** Per-candidate output of the AI Screening Agent. */
export interface MatchResult {
  candidate_id: string;
  score: number; // 0–100
  breakdown: Record<string, number>;
  summary: string;
  strengths: string[];
  gaps: string[];
  risks: string[];
}
