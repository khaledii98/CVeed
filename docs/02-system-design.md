# 2. System Design

## 2.1 High-level diagram

```
                         ┌─────────────────────────────┐
                         │        Next.js (Vercel)      │
   Candidate / Employer  │  App Router · RSC · Route    │
   / Admin browsers ────►│  Handlers · Server Actions   │
                         └──────────────┬──────────────┘
                                        │ (service + anon keys)
              ┌─────────────────────────┼──────────────────────────┐
              ▼                         ▼                          ▼
   ┌───────────────────┐   ┌────────────────────────┐   ┌──────────────────┐
   │  Supabase Auth    │   │   Postgres + pgvector  │   │ Supabase Storage │
   │  (JWT, RBAC)      │   │   tables · RLS · RPC   │   │  CVs · videos    │
   └───────────────────┘   └───────────┬────────────┘   └──────────────────┘
                                        │
                       ┌────────────────┴─────────────────┐
                       ▼                                   ▼
          ┌────────────────────────┐         ┌──────────────────────────┐
          │ Supabase Edge Functions │         │   External services       │
          │  - cv-extract           │────────►│  OpenAI (chat + embed)    │
          │  - rebuild-embeddings    │         │  Mux / Cloudflare Stream  │
          │  - run-matching          │         │  SendGrid · Firebase FCM  │
          └────────────────────────┘         └──────────────────────────┘
```

## 2.2 Component responsibilities

### Web app (Next.js)
- **RSC** for read-heavy pages (profile, results) — fetch with the user's RLS-scoped client.
- **Server Actions / Route Handlers** for mutations and for calling the agent orchestrator (keeps OpenAI keys server-side).
- **Streaming** for agent chat (onboarding, recruiter) using the AI SDK's streamed responses.

### Agent orchestrator (`lib/agents`)
A plain server-side TypeScript module — no separate service needed for MVP. Each agent = `system prompt (versioned) + JSON schema + model + temperature`. Calls go through one `callAgent()` wrapper that:
1. Injects the shared **taxonomy snapshot** (skills/industries/certs) and **governance rules**.
2. Forces **structured output** (JSON schema / tool calling).
3. Logs every run to `agent_runs` with input hash, prompt version, model, tokens, latency.
4. Caches deterministic results by input hash.

### CV pipeline
1. Client uploads to Storage bucket `cvs/` (RLS: owner-only).
2. Insert `candidate_documents` row → triggers `cv-extract` Edge Function (or a Route Handler on submit).
3. Extract text (pdf/docx), run **CV Intelligence Agent**, normalize against taxonomy, write structured rows, compute completeness.
4. **Candidate Onboarding Agent** computes the *minimum* missing critical questions and drives a short chat.
5. Build the candidate embedding; upsert into `candidate_embeddings`.

### Matching
- `run-matching` (RPC `match_candidates(request_id)`): vector recall → weighted score (role-aware) → return top N with breakdown.
- AI Screening Agent runs only over the returned top N to produce explanations; results cached in `matches`.

## 2.3 Data flow guarantees

| Concern | Mechanism |
|---------|-----------|
| Tenant isolation | RLS on every table keyed by `auth.uid()` / employer membership |
| Determinism | numeric scoring in SQL; LLM explanations cached by version keys |
| Consistency | single `taxonomy` + `role_weight_profiles`; Data Consistency Agent audits drift |
| Freshness | profile edit → re-embed → invalidate affected `matches` |
| Cost control | `gpt-4o-mini` for extraction/onboarding; `gpt-4o` only for final screening of top-N |

## 2.4 Scaling notes (post-MVP)
- pgvector HNSW handles low-hundred-thousands of candidates comfortably; partition by region when needed.
- Move `cv-extract` and `run-matching` to a queue (Supabase `pg_cron` + `pgmq`, or a worker) when concurrency grows.
- Embedding rebuilds are idempotent and batchable.
