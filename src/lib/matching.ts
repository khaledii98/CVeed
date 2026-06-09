import type { HiringBrief, RoleCategory } from "@/lib/types";

/**
 * Deterministic matching engine.
 *
 * Why deterministic (not the LLM)? Governance rule: "same request = same
 * ranking". The numeric score is computed here in plain code so it is
 * reproducible, explainable, and cheap. The LLM (AI Screening Agent) only
 * writes the human explanation for the top candidates afterwards.
 *
 * At scale this is preceded by a pgvector recall step (see docs/09); for the
 * demo we score every open-to-opportunities candidate directly.
 */

/** Default matching matrix from the product brief (weights sum to 1.0). */
export const DEFAULT_WEIGHTS = {
  skills: 0.25,
  experience: 0.2,
  industry: 0.15,
  certifications: 0.1,
  languages: 0.07,
  location: 0.07,
  salary: 0.06,
  availability: 0.05,
  open_to_opportunities: 0.03,
  noc: 0.02,
} as const;

export type WeightKey = keyof typeof DEFAULT_WEIGHTS;
export type Weights = Record<WeightKey, number>;

/**
 * Role-aware weight overrides. Different role categories value different things
 * (sales -> languages/communication; engineering -> certs/technical experience;
 * hospitality -> languages/customer-facing). We tweak then re-normalize to 1.0.
 */
export function weightsForRole(role: RoleCategory): Weights {
  const w: Weights = { ...DEFAULT_WEIGHTS };
  switch (role) {
    case "sales":
      w.languages += 0.06;
      w.skills += 0.02;
      w.certifications -= 0.04;
      break;
    case "engineering":
    case "technician":
      w.certifications += 0.07;
      w.experience += 0.03;
      w.languages -= 0.04;
      break;
    case "hospitality":
      w.languages += 0.06;
      w.availability += 0.03;
      w.certifications -= 0.04;
      break;
    case "finance":
      w.certifications += 0.05;
      w.experience += 0.02;
      break;
    default:
      break;
  }
  return normalize(w);
}

function normalize(w: Weights): Weights {
  const total = Object.values(w).reduce((a, b) => a + Math.max(0, b), 0) || 1;
  const out = {} as Weights;
  (Object.keys(w) as WeightKey[]).forEach((k) => {
    out[k] = Math.max(0, w[k]) / total;
  });
  return out;
}

/** A candidate's fields relevant to scoring (subset of the candidates table). */
export interface ScorableCandidate {
  skills: string[] | null;
  certifications: string[] | null;
  languages: string[] | null;
  industries: string[] | null;
  years_experience: number | null;
  location: string | null;
  expected_salary_max: number | null;
  availability: string | null;
  open_to_opportunities: string | null;
  noc_status: string | null;
}

const lower = (arr: string[] | null | undefined) =>
  (arr || []).map((s) => s.trim().toLowerCase()).filter(Boolean);

/** Fraction of `required` items that appear in `have` (0..1). */
function overlap(required: string[], have: string[]): number {
  if (required.length === 0) return 1; // nothing required -> full marks
  const set = new Set(have);
  const hits = required.filter((r) => set.has(r)).length;
  return hits / required.length;
}

const OPEN_SCORE: Record<string, number> = {
  available_immediately: 1,
  actively_exploring: 0.85,
  open_to_discussions: 0.65,
  slightly_open: 0.4,
  not_looking: 0,
};

/**
 * Score one candidate against a hiring brief. Returns the overall 0–100 score
 * and a per-factor breakdown (also 0–100) so we can show WHY.
 */
export function scoreCandidate(
  brief: HiringBrief,
  c: ScorableCandidate
): { score: number; breakdown: Record<string, number> } {
  const w = weightsForRole(brief.role_category);

  const factors: Record<WeightKey, number> = {
    skills: overlap(lower(brief.required_skills), lower(c.skills)),
    experience: c.years_experience
      ? Math.min(1, c.years_experience / Math.max(1, brief.min_years_experience || 1))
      : 0,
    industry: overlap(lower(brief.industries), lower(c.industries)),
    certifications: overlap(lower(brief.certifications), lower(c.certifications)),
    languages: overlap(lower(brief.languages), lower(c.languages)),
    location:
      brief.location && c.location
        ? c.location.trim().toLowerCase() === brief.location.trim().toLowerCase()
          ? 1
          : 0.3
        : 0.5,
    salary: salaryScore(brief, c),
    availability: c.availability ? 1 : 0.5,
    open_to_opportunities: OPEN_SCORE[c.open_to_opportunities || "not_looking"] ?? 0,
    noc: brief.noc_required ? (c.noc_status === "yes" ? 1 : c.noc_status === "no" ? 0 : 0.5) : 1,
  };

  let total = 0;
  const breakdown: Record<string, number> = {};
  (Object.keys(w) as WeightKey[]).forEach((k) => {
    const contribution = factors[k] * w[k];
    total += contribution;
    breakdown[k] = Math.round(factors[k] * 100);
  });

  return { score: Math.round(total * 100), breakdown };
}

function salaryScore(brief: HiringBrief, c: ScorableCandidate): number {
  if (!brief.salary_max || !c.expected_salary_max) return 0.5; // unknown -> neutral
  // Full marks if candidate expectation is within the employer's max budget.
  if (c.expected_salary_max <= brief.salary_max) return 1;
  const over = (c.expected_salary_max - brief.salary_max) / brief.salary_max;
  return Math.max(0, 1 - over); // decays as expectation exceeds budget
}
