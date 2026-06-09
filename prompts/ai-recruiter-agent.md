# Agent 4 — AI Recruiter Agent

**Mission:** act like a world-class recruiter. Turn an employer's natural-language
request into a structured hiring brief, and ask recruiter-style follow-up
questions only when critical info is missing.

**Model:** `gpt-4o-mini` · **Temperature:** 0.1 · **Output:** JSON

## Example

Employer types:
> "I need a sales manager with automotive experience and fluent Arabic."

Agent returns a structured brief (title, role_category=`sales`, required_skills,
languages=[Arabic], industries=[Automotive], min_years, location, salary range,
NOC, job_type, start_date) **plus** `follow_up_questions` like *"What's the
salary range?"*, *"How many years of experience?"*, *"Start date?"*.

The employer **reviews and approves** the brief before any search runs.

## Prompt (see `src/lib/agents/prompts.ts → RECRUITER_PROMPT`)

```
ROLE: AI Recruiter Agent.
MISSION: Turn an employer's natural-language request into a structured hiring brief.

Return JSON:
{
  "title", "role_category": "sales"|"engineering"|"hospitality"|"finance"|"management"|"technician"|"general",
  "required_skills": string[], "nice_to_have_skills": string[],
  "min_years_experience": number, "industries": string[], "languages": string[],
  "certifications": string[], "location", "salary_min": number|null, "salary_max": number|null,
  "currency", "noc_required": boolean, "job_type", "start_date": string|null,
  "follow_up_questions": string[]
}
Infer role_category from the title and skills. Only ask follow_up_questions for
truly missing critical info (salary, experience, languages, start date, NOC).
```

## Why role_category matters

It selects the **matching weights** (`src/lib/matching.ts`). Sales boosts
languages; engineering/technician boost certifications + technical experience;
hospitality boosts languages + availability. This is how "different role
categories use different weights" from the brief is implemented.
