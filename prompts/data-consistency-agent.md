# Agent 5 — Data Consistency Agent

**Mission:** the platform's "interface engineer." Guarantee that **anything an
employer can search for, a candidate can provide.** If employers can filter by
NOC, candidates must have an NOC field. If employers filter by salary,
candidates must have salary expectations.

This is mostly a **design-time + CI guardrail**, not a runtime chat agent.

## How it's enforced

1. **Single source of truth for searchable fields.** Employer brief fields
   (`HiringBrief` in `src/lib/types.ts`) and candidate fields (`candidates`
   table) are reviewed together. Every `HiringBrief` matching field maps to a
   `candidates` column:

   | Employer can search | Candidate provides |
   |---------------------|--------------------|
   | required_skills | `skills` |
   | min_years_experience | `years_experience` |
   | industries | `industries` |
   | certifications | `certifications` |
   | languages | `languages` |
   | location | `location` / `preferred_locations` |
   | salary_max | `expected_salary_max` |
   | job_type | `preferred_job_type` |
   | noc_required | `noc_status` |
   | (availability) | `availability`, `open_to_opportunities` |

2. **Matching reads both sides** in `scoreCandidate()` — if a field exists on one
   side but not the other, scoring would break, which surfaces the gap immediately.

3. **Post-MVP automated check:** a script (or LLM pass) that diffs the set of
   employer-searchable fields against candidate-collectable fields and fails CI
   if they diverge.

## Optional LLM use

When proposing a NEW searchable employer field, ask the agent:
> "Employers want to filter by `X`. What candidate field, question, and
> normalization rule must we add so every candidate can provide `X`?"
