# AI Agent Prompts

These are the **human-readable** versions of CVeed's agent prompts. The
**executable** versions (what the app actually sends to OpenAI) live in
[`src/lib/agents/prompts.ts`](../src/lib/agents/prompts.ts). Keep the two in
sync and bump `PROMPT_VERSION` whenever you change one (governance rule:
"same input → same output", auditable).

| Agent | File | In MVP? |
|-------|------|---------|
| 1 — Candidate Onboarding | [candidate-onboarding-agent.md](candidate-onboarding-agent.md) | ✅ |
| 2 — CV Intelligence | [cv-intelligence-agent.md](cv-intelligence-agent.md) | ✅ |
| 3 — Employer Onboarding | [employer-onboarding-agent.md](employer-onboarding-agent.md) | ✅ (form-based in MVP) |
| 4 — AI Recruiter | [ai-recruiter-agent.md](ai-recruiter-agent.md) | ✅ |
| 5 — Data Consistency | [data-consistency-agent.md](data-consistency-agent.md) | ⚙️ design-time |
| 6 — AI Screening | [ai-screening-agent.md](ai-screening-agent.md) | ✅ |
| 7 — Governance & Consistency Layer | [governance-layer.md](governance-layer.md) | ✅ (shared rules) |

## Prompt design principles

1. **Always JSON.** Every agent returns strict JSON (we use OpenAI `response_format: json_object`).
2. **Low temperature (0.1).** Determinism matters more than creativity here.
3. **Shared governance preamble.** Every prompt is prefixed with the rules in `governance-layer.md` so all agents normalize data the same way.
4. **Never invent facts.** Unknown → `null` / empty array → reported as missing.
5. **Versioned.** Changing a prompt bumps `PROMPT_VERSION` so cached results can be invalidated.
