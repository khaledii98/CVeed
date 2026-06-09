# CVeed — AI Talent Discovery Platform

> An AI-powered talent **search engine** and **AI recruiter** for SMEs — starting in Qatar & the GCC.
> Not a job board. Candidates build a living career profile once; employers describe who they need in plain language; **AI does the matching**.

---

## What this repository contains

This is the **architecture + foundation** for the MVP. It is organised so an engineering team can start building on day one.

```
CVeed/
├── README.md                  ← you are here
├── docs/                      ← the 16 deliverables (architecture → launch)
├── supabase/
│   ├── migrations/            ← runnable SQL: schema, pgvector, RLS, functions
│   └── seed.sql               ← taxonomy + role-weight seed data
├── prompts/                   ← production prompts for all 7 AI agents
└── (app scaffold)             ← Next.js folder structure (see docs/07)
```

## The 16 deliverables

| # | Deliverable | File |
|---|-------------|------|
| 1 | Product Architecture | [docs/01-product-architecture.md](docs/01-product-architecture.md) |
| 2 | System Design | [docs/02-system-design.md](docs/02-system-design.md) |
| 3 | Database Schema | [docs/03-database-schema.md](docs/03-database-schema.md) |
| 4 | Supabase Tables | [supabase/migrations/](supabase/migrations/) |
| 5 | RLS Policies | [docs/04-rls-policies.md](docs/04-rls-policies.md) · [migration 0006](supabase/migrations/0006_rls_policies.sql) |
| 6 | API Design | [docs/05-api-design.md](docs/05-api-design.md) |
| 7 | Folder Structure | [docs/06-folder-structure.md](docs/06-folder-structure.md) |
| 8 | AI Prompts | [prompts/](prompts/) · [docs/07-ai-agents.md](docs/07-ai-agents.md) |
| 9 | Embedding Strategy | [docs/08-embedding-strategy.md](docs/08-embedding-strategy.md) |
| 10 | Matching Engine | [docs/09-matching-engine.md](docs/09-matching-engine.md) |
| 11 | UI Screens | [docs/10-ui-screens.md](docs/10-ui-screens.md) |
| 12 | User Flows | [docs/11-user-flows.md](docs/11-user-flows.md) |
| 13 | Development Roadmap | [docs/12-roadmap.md](docs/12-roadmap.md) |
| 14 | Build Order | [docs/12-roadmap.md#build-order](docs/12-roadmap.md) |
| 15 | Technical Risks | [docs/13-technical-risks.md](docs/13-technical-risks.md) |
| 16 | Launch Strategy | [docs/14-launch-strategy.md](docs/14-launch-strategy.md) |

## Product philosophy (non-negotiable)

1. **AI works harder than the user.** Candidate onboarding < 90s (max 3 min). Employer hiring request < 2 min (max 5 min).
2. Every searchable employer field **must** exist as a structured candidate field (enforced by the Data Consistency Agent + DB constraints).
3. We store **living career profiles**, not static CVs.
4. Same CV → same extraction. Same request → same ranking. (Governance Layer.)

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js (App Router) · TypeScript · Tailwind · shadcn/ui |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Vector search | pgvector (HNSW) |
| AI | OpenAI API (`gpt-4o` / `gpt-4o-mini`) |
| Embeddings | OpenAI `text-embedding-3-small` (1536-dim) |
| Video | Mux (or Cloudflare Stream) |
| Notifications | Firebase Cloud Messaging |
| Email | SendGrid |

## Getting started (for the dev team)

```bash
# 1. Install Supabase CLI and start a local stack
supabase start

# 2. Apply migrations + seed taxonomies/weights
supabase db reset            # runs migrations/ then seed.sql

# 3. App (after scaffolding — see docs/06)
cp .env.example .env.local   # fill OpenAI, Supabase, Mux, SendGrid keys
npm install
npm run dev
```

## MVP scope (build only this)

Auth · Candidate Profiles · Employer Profiles · CV Upload · AI Extraction · Open-To-Opportunities · AI Recruiter Agent · AI Screening Agent · Candidate Ranking · Employer Shortlists · Admin Dashboard.

**Explicitly out of MVP** (but the architecture leaves seams for them): Career coaching, salary intelligence, predictive analytics, in-app interviews, freelancer/referral marketplaces, premium plans.
