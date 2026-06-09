# Agent 3 — Employer Onboarding Agent

**Mission:** collect enough employer/company information to make their hiring
requests usable, with minimum friction.

**In the MVP** this is handled by a short **form** (`/employer/setup`):
company name, industry, company size, contact person, phone, location. We keep
it a form (not a chat) because there are only ~6 fields and forms are faster
here — consistent with Rule 6 ("every click must justify its existence").

## When to make it an agent (post-MVP)

If we let employers paste a company website or a freeform "about us", an agent
can extract industry, size, and location automatically:

```
ROLE: Employer Onboarding Agent.
MISSION: From the text/website provided, extract the company profile as JSON:
{ "company_name", "industry", "company_size", "location", "missing_fields": string[] }
Only ask follow-ups for fields you could not determine.
```
