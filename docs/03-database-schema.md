# 3. Database Schema

The runnable source of truth is [`supabase/schema.sql`](../supabase/schema.sql)
(paste-and-run) and the numbered files in
[`supabase/migrations/`](../supabase/migrations/). This document explains it.

## 3.1 Entity overview

```
auth.users (Supabase-managed)
   │ 1:1
   ▼
profiles ──1:1── candidates ──┐
   │                          │ scored against
   │ 1:1                      ▼
employers ──1:many── hiring_requests ──1:many── matches ──many:1── candidates
```

## 3.2 Tables

| Table | Purpose | Key columns |
|-------|---------|-------------|
| `profiles` | one row per auth user; the role switch | `id` (=auth.uid), `role`, `full_name`, `email`, `phone`, `whatsapp`, `location` |
| `candidates` | the **living career profile** | structured CV fields + `open_to_opportunities`, salary, NOC, availability, `embedding vector(1536)`, `completeness` |
| `employers` | company profile | `company_name`, `industry`, `company_size`, `contact_person`, `location` |
| `hiring_requests` | structured brief from the AI Recruiter | requirements arrays, salary range, `role_category`, `embedding`, `status` |
| `matches` | screening output (cached) | `score`, `breakdown jsonb`, `summary`, `strengths/gaps/risks text[]`, `shortlisted` |

Post-MVP taxonomy tables (`skills`, `industries`, `certifications`,
`job_titles`, `role_weight_profiles`) are described in `docs/07` & `docs/09`.

## 3.3 Design decisions

- **`profiles.id = auth.users.id`** and `candidates.id = profiles.id`. One-to-one
  by shared primary key keeps RLS trivial (`auth.uid() = id`).
- **Arrays (`text[]`) for skills/languages/industries** in the MVP for speed.
  When we need fuzzy/normalized search at scale, we migrate to join tables
  against the taxonomy (the matching code already lower-cases + compares, so the
  migration is contained).
- **`jsonb` for `work_history`, `education`, `breakdown`** — flexible, rarely
  filtered on directly.
- **`embedding vector(1536)`** present from day one (even if the MVP scorer
  doesn't require it) so enabling vector recall later is a code change, not a
  migration.
- **Enums** (`user_role`, `open_to_opportunities`, `noc_status`) guarantee valid
  values at the DB level.
- **`completeness int`** — denormalized score so we can nudge candidates and so
  admins can spot weak profiles.

## 3.4 Triggers & functions

- `handle_new_user()` — after a row is added to `auth.users`, auto-creates the
  matching `profiles` row using sign-up metadata (`full_name`, `role`).
- `is_admin()` / `is_employer()` — `security definer` helpers used by RLS.

## 3.5 Indexes

- `idx_matches_request (hiring_request_id)` — fast results loading.
- `idx_candidates_open (open_to_opportunities)` — fast candidate-pool filtering.
- Post-MVP: HNSW index on `candidates.embedding` for ANN recall (`docs/08`).
