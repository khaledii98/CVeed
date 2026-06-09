# 7. AI Agents

Seven agents. Full prompts live in [`/prompts`](../prompts/) and the executable
versions in [`src/lib/agents/prompts.ts`](../src/lib/agents/prompts.ts).

| # | Agent | In MVP | Model | Where it runs |
|---|-------|--------|-------|---------------|
| 1 | Candidate Onboarding | ✅ | gpt-4o-mini | `/api/cv/extract` |
| 2 | CV Intelligence | ✅ | gpt-4o-mini | `/api/cv/extract` |
| 3 | Employer Onboarding | ✅ (form) | — | `/employer/setup` |
| 4 | AI Recruiter | ✅ | gpt-4o-mini | `/api/recruiter` |
| 5 | Data Consistency | ⚙️ design-time | — | schema + CI guardrail |
| 6 | AI Screening | ✅ | gpt-4o | `/api/match` |
| 7 | Governance Layer | ✅ | — | shared preamble + taxonomies |

## Orchestration

Every agent call goes through `callJSON()` in `src/lib/openai.ts`, which:
1. Sends a **versioned system prompt** + the shared governance preamble.
2. Forces **JSON output** (`response_format: json_object`).
3. Uses **temperature 0.1** for determinism.
4. (Recommended next step) logs the run to an `agent_runs` table with input hash,
   prompt version, model, tokens, latency — for cost tracking and reproducibility.

## The division of labour that keeps it cheap & consistent

- **Extraction & structuring** (agents 1, 2, 4): cheap model, JSON out.
- **Scoring**: *not an LLM* — deterministic code (`matching.ts`).
- **Explanation** (agent 6): the better model, but only for the top 6 candidates.
- **Governance** (agents 5, 7): rules + taxonomies shared by everything, so "same
  CV = same extraction" and "same request = same ranking" hold.

## Adding a new agent later (e.g. Opportunity Agent)

1. Add a versioned prompt to `prompts.ts` and a `.md` to `/prompts`.
2. Add a `runX()` wrapper in `agents/index.ts`.
3. Call it from a Route Handler or a scheduled job.
The taxonomies and structured tables are already there to read from.
