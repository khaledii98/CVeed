# 1. Product Architecture

## 1.1 What we are building

CVeed is an **AI talent search engine + AI recruiter** for SMEs. Two sides:

- **Candidates** build a *living career profile* once (≤90s). The platform keeps it fresh and surfaces them to employers passively — even while employed — based on their **Open-To-Opportunities** status.
- **Employers** describe who they need in natural language. The **AI Recruiter Agent** turns it into a structured hiring brief; the **AI Screening Agent** ranks every candidate with a match %, strengths, risks, and a written rationale.

The product's defensibility is **structured, normalized, consistent data** + **explainable matching**, not job listings.

## 1.2 The four pillars

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CVeed PLATFORM                                │
│                                                                        │
│  1. INTAKE          2. STRUCTURING        3. MATCHING      4. DELIVERY  │
│  ─────────          ──────────────        ──────────      ──────────   │
│  CV upload          CV Intelligence       Vector recall   Ranked list  │
│  NL hiring req      Onboarding agents     Weighted score  Shortlists   │
│  Profile edits      Taxonomy mapping      Explanations    Notifications│
│                     Data Consistency      Re-rank on edit  Admin view  │
│                                                                        │
│              ▲ Governance & Consistency Layer wraps all of it ▲        │
└──────────────────────────────────────────────────────────────────────┘
```

## 1.3 Logical components

| Component | Responsibility | Tech |
|-----------|----------------|------|
| **Web app** | Candidate & employer UX, admin dashboard | Next.js App Router (SSR + RSC) |
| **Auth & RBAC** | Sign-up/in, roles (candidate / employer / admin) | Supabase Auth + RLS |
| **Profile service** | CRUD of living profiles, completeness scoring | Next.js Route Handlers + Supabase |
| **CV pipeline** | Upload → parse → extract → normalize → embed | Supabase Storage + Edge Function + OpenAI |
| **Agent orchestrator** | Runs the 7 agents with shared taxonomy + guardrails | Server-side TS module (`lib/agents`) |
| **Matching engine** | Vector recall + weighted re-rank + explanation | Postgres function + TS scorer |
| **Search/index** | pgvector HNSW over candidate & request embeddings | pgvector |
| **Notifications** | "New strong match" alerts | FCM + SendGrid |
| **Admin** | Moderation, taxonomy management, metrics | Next.js (admin role) |

## 1.4 Request lifecycle (employer "find me X")

```
Employer NL brief
   │
   ▼
AI Recruiter Agent ──► structured hiring_request (+ follow-up Qs)  ──► employer approves
   │
   ▼
Embed request  ──►  pgvector ANN over candidate_embeddings (top ~200 recall)
   │
   ▼
Weighted scorer (role-aware matrix) over structured fields  ──► top N
   │
   ▼
AI Screening Agent writes per-candidate: match %, summary, strengths, gaps, risks
   │
   ▼
Ranked results + shortlist  ──►  employer UI
```

Recall is cheap (vector). Scoring is deterministic (SQL/TS). The LLM only **explains** the top candidates — this keeps cost and latency bounded and rankings reproducible.

## 1.5 Why this shape

- **Cost & latency:** LLMs are used for extraction and *explaining* a bounded top-N, never for scanning the whole DB per query.
- **Reproducibility (Rule: same request = same ranking):** the numeric score is computed by deterministic code, not the LLM. The LLM output is cached and keyed by `(candidate_version, request_version, prompt_version)`.
- **Consistency (Agent 5 & 7):** one taxonomy + one weight registry shared by every code path. Employers can only search for fields that candidates are guaranteed to have.
- **Extensibility:** future agents (career, market intelligence, predictive) read the same structured tables and embeddings — no schema rewrite needed.

## 1.6 Environments

`local` (Supabase CLI) → `staging` (Supabase project + Vercel preview) → `production` (Supabase project + Vercel prod). Secrets in Vercel/Supabase env, never in repo. See `docs/13-technical-risks.md` for the secrets & PII posture.
