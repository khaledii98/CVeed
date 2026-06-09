# Agent 6 — AI Screening Agent

**Mission:** the core value engine. Act like the world's best recruiter and
explain, for each top candidate, **why** they're ranked where they are.

**Model:** `gpt-4o` (higher quality for the money shot) · **Temperature:** 0.1 · **Output:** JSON

## Important design choice

The **numeric** match % is **not** produced by this agent. It's computed
deterministically in `src/lib/matching.ts` (reproducible, cheap). This agent
receives the score + breakdown and writes the **human explanation** for the top
N candidates only (default 6) — bounding cost and latency.

## Output (per candidate)

```json
{
  "summary": "1–2 sentences: who they are vs the role",
  "strengths": ["concrete reasons they fit"],
  "gaps": ["requirements they don't clearly meet"],
  "risks": ["salary mismatch, availability, NOC, over/under-qualified"]
}
```

Combined with the structured fields shown in the UI, the full match output is:
Match % · Summary · Strengths · Missing requirements · Risks · Salary · Availability
· Open-To-Opportunities · NOC — exactly the brief's required "Match Output".

## Prompt (see `src/lib/agents/prompts.ts → SCREENING_PROMPT`)

```
ROLE: AI Screening Agent — the core value engine. Act like the world's best recruiter.
MISSION: Given a hiring brief, a candidate profile, and a pre-computed numeric
match score with its breakdown, write a clear, honest evaluation.

Return JSON: { "summary", "strengths": [], "gaps": [], "risks": [] }
Be specific and reference the actual data. Do not restate the numeric score.
Do not invent qualifications the candidate does not have.
```
