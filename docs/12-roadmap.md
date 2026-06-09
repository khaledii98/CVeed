# 12. Development Roadmap & Build Order

Target: **MVP live in 3–6 months.** What's in this repo already covers most of
Phases 0–4 as a working demo; the roadmap hardens it for real users.

## Build order (do them in this sequence)

### Phase 0 — Foundations ✅ (in this repo)
1. Next.js + TypeScript + Tailwind scaffold.
2. Supabase project + `schema.sql` (tables, RLS, storage, triggers).
3. Auth (sign up/in, roles, session middleware).

### Phase 1 — Candidate core ✅ (in this repo)
4. CV paste → **CV Intelligence Agent** → structured profile.
5. **Onboarding Agent** → minimal questions.
6. Living profile editor + **Open-To-Opportunities**.

### Phase 2 — Employer core ✅ (in this repo)
7. Company setup.
8. **AI Recruiter Agent**: NL → structured brief → approve.

### Phase 3 — Matching ✅ (in this repo)
9. Deterministic **matching engine** (role-aware weights).
10. **AI Screening Agent** explanations + ranked results.

### Phase 4 — Admin ✅ (in this repo)
11. Admin dashboard (KPIs, recent candidates).

### Phase 5 — Production hardening (next 4–8 weeks)
12. **Real CV file upload** (PDF/DOCX → text) + store original in Storage.
13. **Embeddings + pgvector recall** (Stage 1 of matching) once the pool grows.
14. **Shortlists** UI + employer ↔ candidate contact/reveal flow.
15. **Email (SendGrid)** + **push (Firebase)**: "new strong match" / "profile viewed".
16. **Intro video** upload via Mux/Cloudflare Stream (10–30s).
17. **Agent-run logging** table + cost dashboard; result caching by input hash.
18. **Taxonomies** (skills/industries/certifications) + admin management.
19. **Arabic / RTL** localization.
20. RLS test suite + basic e2e tests; rate-limiting on AI endpoints.

### Phase 6 — Launch
21. Seed candidates (Qatar/GCC), onboard 5–10 pilot SMEs, instrument analytics.

## Suggested timeline

| Month | Focus |
|-------|-------|
| 1 | Phases 0–2 productionized (auth, candidate, employer) |
| 2 | Phase 3 matching + Phase 4 admin, internal testing |
| 3 | Phase 5: file upload, emails, shortlists, video |
| 4 | pgvector, taxonomies, RTL, hardening, security review |
| 5 | Closed pilot with real SMEs + candidates; iterate on match quality |
| 6 | Public launch in Qatar |

## Team (lean)
1 full-stack dev (you + AI pair) for MVP; add 1 frontend + 1 part-time
designer in Phase 5. A recruiter advisor to tune weights & prompts is high-leverage.
