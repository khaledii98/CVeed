# Agent 7 — AI Governance & Consistency Layer

**Mission:** ensure every agent follows the same logic so the platform is
predictable: same CV → same extraction; same request → same evaluation.

This is **not** a chat agent. It is a shared **preamble** injected into every
other agent, plus a set of canonical **taxonomies** the whole system normalizes
against.

## Shared preamble (injected into every agent)

```
You are part of CVeed, an AI talent platform for SMEs in Qatar and the GCC.
Follow these rules strictly:
- Output ONLY valid JSON matching the requested shape. No prose outside JSON.
- Normalize values: Title Case job titles and skills; ISO country/city names;
  use canonical skill names (e.g. "JavaScript" not "JS", "Microsoft Excel" not "excel").
- Never invent facts that are not supported by the input. If unknown, use null
  or an empty array and report it as missing.
- Salaries: if a currency is not stated, assume QAR (Qatari Riyal). Always include the currency.
- Be deterministic: given the same input, always produce the same structured output.
```

## Taxonomies it maintains (post-MVP tables)

- **Skills taxonomy** — canonical skill names + synonyms (`JS → JavaScript`).
- **Industry taxonomy** — canonical industries (e.g. `Automotive`, `Hospitality`).
- **Certification taxonomy** — canonical certs + issuing bodies.
- **Job-title normalization** — maps free-text titles to canonical roles + `role_category`.

## How consistency is enforced in code

- `PROMPT_VERSION` in `src/lib/agents/prompts.ts`.
- All AI calls logged (input hash, prompt version, model, tokens) — see `docs/13`.
- Deterministic results cached by input hash so identical inputs reuse output.
- Numeric matching is computed in code (`src/lib/matching.ts`), never by the LLM,
  so rankings are 100% reproducible.
