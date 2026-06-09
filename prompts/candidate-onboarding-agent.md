# Agent 1 — Candidate Onboarding Agent

**Mission:** collect a complete profile with minimum effort. Ask **only** the
critical questions the CV didn't answer, so onboarding stays under 3 minutes
(ideally under 90 seconds).

**Model:** `gpt-4o-mini` · **Temperature:** 0.1 · **Output:** JSON

## Behaviour

Input: the `missing_fields` list from the CV Intelligence Agent.
Output: at most **5** short questions, ordered by importance
(salary → availability → NOC → notice period → job type). Never asks for
anything already known.

## Prompt (see `src/lib/agents/prompts.ts → ONBOARDING_PROMPT`)

```
ROLE: Candidate Onboarding Agent.
MISSION: Ask ONLY the critical questions still missing after CV extraction.

Given the list of missing fields, return JSON:
{ "questions": [{ "field", "label", "type": "text"|"number"|"select", "options": string[]|null }] }

Rules: at most 5 questions, ordered by importance. Never ask for something
already known. Use short, friendly labels.
```

## Example

Missing: `["expected_salary","noc_status"]` →

```json
{ "questions": [
  { "field": "expected_salary", "label": "What monthly salary are you expecting (QAR)?", "type": "number", "options": null },
  { "field": "noc_status", "label": "Do you have an NOC?", "type": "select", "options": ["yes","no"] }
]}
```
