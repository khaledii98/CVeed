# 8. Embedding Strategy

Embeddings turn text into vectors so we can find candidates that are *semantically*
similar to a role — even when the job titles differ ("rule: do not match solely by
job title"). The MVP ships the schema for this; turning on vector recall is a
follow-up once the candidate pool grows.

## 8.1 Model & dimensions

- **Model:** OpenAI `text-embedding-3-small` → **1536 dimensions** (good quality,
  low cost). Column: `vector(1536)` on `candidates` and `hiring_requests`.
- Upgrade path: `text-embedding-3-large` (3072-dim) if recall quality needs it —
  a column type change + re-embed.

## 8.2 What we embed

**Candidate** — a compact "profile document":
```
{current_title}. {summary}
Skills: {skills}. Industries: {industries}. Languages: {languages}.
Experience: {years} years. Certifications: {certifications}.
Recent roles: {work_history titles + companies}.
```

**Hiring request** — a compact "need document":
```
{title} ({role_category}). Required: {required_skills}.
Industries: {industries}. Languages: {languages}. Min {min_years} years.
Location: {location}. Certifications: {certifications}.
```

We embed normalized text (canonical skills/titles) so the vectors are consistent.

## 8.3 When embeddings are (re)built

- Candidate: after onboarding and after any profile edit that changes the
  document above → `helper embed()` in `src/lib/openai.ts` → `upsert` into
  `candidates.embedding`.
- Hiring request: when the brief is approved.
- Re-embeds are idempotent and safe to batch (`POST /api/embeddings/rebuild`, post-MVP).

## 8.4 How it plugs into matching (the two-stage design)

```
Stage 1 — RECALL (cheap, broad):  pgvector ANN
   SELECT id FROM candidates
   ORDER BY embedding <=> :request_embedding   -- cosine distance
   LIMIT 200;                                  -- top ~200 semantically closest

Stage 2 — RE-RANK (precise):  scoreCandidate() weighted matrix on those 200
Stage 3 — EXPLAIN:            AI Screening Agent on the top 6
```

**MVP simplification:** with a small candidate pool we skip Stage 1 and score
everyone directly (see `matching.ts`). The numbers and explanations are identical;
Stage 1 is purely a performance optimization for scale. Add it by creating an HNSW
index and an `match_candidates(request_id)` SQL function:

```sql
create index on candidates using hnsw (embedding vector_cosine_ops);
```

## 8.5 Cost note

`text-embedding-3-small` is ~$0.02 per 1M tokens — embedding a whole candidate
base is cents. Cache by content hash so we never re-embed unchanged text.
