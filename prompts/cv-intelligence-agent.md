# Agent 2 — CV Intelligence Agent

**Mission:** convert raw CV text into a structured candidate profile, and flag
what's missing.

**Model:** `gpt-4o-mini` · **Temperature:** 0.1 · **Output:** JSON

## What it extracts

Current job title · work history · years of experience · skills · certifications
· languages · industries · education · previous companies. It also returns
`missing_fields` so the Onboarding Agent knows what to ask.

## Prompt (see `src/lib/agents/prompts.ts → CV_INTELLIGENCE_PROMPT`)

```
ROLE: CV Intelligence Agent.
MISSION: Convert raw CV text into a structured candidate profile.

Extract these fields into JSON:
{
  "current_title": string,
  "years_experience": number,
  "summary": string,
  "skills": string[],
  "certifications": string[],
  "languages": string[],
  "industries": string[],
  "previous_companies": string[],
  "work_history": [{ "title", "company", "start_date", "end_date", "description" }],
  "education": [{ "degree", "institution", "year" }],
  "missing_fields": string[]   // subset of:
       ["expected_salary","notice_period","availability","noc_status",
        "preferred_job_type","languages","location"]
}
Only include a field in missing_fields if genuinely absent/unclear in the CV.
```

## Notes

- Skills/titles are normalized to canonical names (governance preamble).
- `years_experience` is inferred from work history dates when not stated.
- Post-MVP: also produce a profile **embedding** for vector search (`docs/08`).
