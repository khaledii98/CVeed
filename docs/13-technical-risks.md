# 13. Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **AI extraction errors** (wrong skills/experience) | Bad matches, lost trust | Low temperature + strict JSON; always let the user **review/edit** extracted data before saving; show the source; log runs. |
| **Inconsistent results** (same CV → different output) | Looks unreliable | Deterministic scoring in code; versioned prompts; cache by input hash; temperature 0.1. |
| **LLM cost blow-up** | Burns runway | Cheap model for extraction; expensive model only for top-6 explanations; cache; (post-MVP) per-employer rate limits + monthly budget alerts. |
| **Latency** on match/extract | Feels slow | Bound the candidate set (vector recall) + only explain top N; stream/progress UI; `maxDuration` set. |
| **PII / data protection** | Legal + trust | RLS everywhere; private Storage bucket; service-role key server-only; encrypt at rest (Supabase default); plan PDPPL (Qatar) / GDPR-style consent + delete-my-data. |
| **Leaking the service-role key** | Full data breach | Key only in `src/lib/supabase/admin.ts`, imported only by API routes; never `NEXT_PUBLIC_`; rotate if exposed. |
| **Prompt injection** (malicious CV/brief text) | Skewed extraction | Treat CV/brief as data, not instructions; constrain outputs to JSON schema; validate/normalize against taxonomy; never execute model output. |
| **Cold-start liquidity** (few candidates/employers) | No value either side | Seed candidates first; concierge-match for first SMEs (see `docs/14`). |
| **Bias / fairness** in ranking | Ethical + legal | Transparent, explainable weights; avoid protected attributes in scoring; audit explanations; human-in-the-loop. |
| **Embedding/model drift** when upgrading models | Rankings shift unexpectedly | Pin model versions; re-embed everything on upgrade; keep `PROMPT_VERSION`. |
| **Vendor lock-in** (Supabase/OpenAI) | Switching cost | Standard Postgres + pgvector (portable); thin agent wrapper makes swapping LLM providers a one-file change. |
| **Scaling matching** beyond ~100k candidates | Slow queries | pgvector HNSW recall + region partitioning + move matching to a queue/worker. |

## Security checklist before launch
- [ ] RLS tested per role (candidate/employer/admin) — see `docs/04`.
- [ ] Service-role key never shipped to client; verified in build output.
- [ ] Auth email confirmation ON in production.
- [ ] Rate-limit `/api/*` AI endpoints.
- [ ] Input validation (zod) on all AI endpoints.
- [ ] "Delete my data" + data-export flow.
- [ ] Secrets in Vercel/Supabase env, not in git.
- [ ] Dependency + secret scanning in CI.
