# Supabase migrations

Two ways to set up your database — pick one:

### Option A — Beginner (no command line) ✅ recommended
Open the Supabase dashboard → **SQL Editor** → paste the contents of
[`../schema.sql`](../schema.sql) → **Run**. Done. (See `START-HERE.md`, Part 3.)

### Option B — Supabase CLI (for developers)
```bash
supabase db reset      # applies migrations/ in order, then ../seed.sql
```

`0001_init.sql` is identical to `schema.sql` — it creates every table, enum,
RLS policy, trigger, and the private `cvs` storage bucket. As the schema evolves,
add new numbered files (`0002_*.sql`, `0003_*.sql`, …) rather than editing
`0001_init.sql`, so existing databases can upgrade cleanly.
