# 5. API Design

CVeed uses Next.js **Route Handlers** (for AI work that returns JSON) and
**Server Actions** (for form submissions / DB writes). Most simple CRUD goes
through Server Actions + the RLS-scoped Supabase client — so there are few
hand-written endpoints to maintain.

## 5.1 AI endpoints (Route Handlers)

| Method & path | Auth | Body | Returns | Agent |
|---------------|------|------|---------|-------|
| `POST /api/cv/extract` | candidate | `{ cvText }` | `{ profile, questions }` | CV Intelligence + Onboarding |
| `POST /api/recruiter` | employer | `{ request }` | `{ brief }` | AI Recruiter |
| `POST /api/match` | employer | `{ requestId }` | `{ count }` (saves `matches`) | Matching + AI Screening |

All three:
- run on the **Node.js runtime** (`export const runtime = "nodejs"`),
- check the session with the RLS-scoped server client,
- return friendly error messages (e.g. "Check your OpenAI key").

`/api/match` also sets `maxDuration = 60` because it calls the LLM for several
candidates.

## 5.2 Server Actions (mutations)

| Action | File | Effect |
|--------|------|--------|
| `signUp` / `signIn` / `signOut` | `app/(auth)` | Supabase auth |
| `saveOnboarding` | `candidate/onboarding/actions.ts` | upsert `candidates` |
| `updateProfile` | `candidate/profile/actions.ts` | update editable fields |
| `saveEmployer` | `employer/setup/actions.ts` | upsert `employers` |
| `createHiringRequest` | `employer/new/actions.ts` | insert `hiring_requests` |

## 5.3 Conventions

- **Validation:** request bodies are checked (length/shape) before hitting the
  LLM; production should add `zod` schemas (already a dependency).
- **Errors:** return `{ error: string }` with a 4xx/5xx; never leak stack traces.
- **Idempotency:** `matches` upsert is keyed on `(hiring_request_id, candidate_id)`
  so re-running matching overwrites rather than duplicates.
- **Cost guard:** `/api/match` only sends the top `EXPLAIN_TOP_N` (6) candidates
  to the screening model.

## 5.4 Post-MVP additions

`POST /api/cv/upload` (PDF/DOCX → text via a parser), `POST /api/embeddings/rebuild`
(batch re-embed), webhook endpoints for Mux (video ready) and SendGrid (email
events), and a notifications endpoint for the Opportunity Agent.
