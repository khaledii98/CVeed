# 4. Row Level Security (RLS) Policies

RLS is Postgres enforcing "who can see/change which rows" **in the database
itself** — so even if app code has a bug, the DB won't leak data. Every table is
`enable row level security`. Full SQL: [`supabase/schema.sql`](../supabase/schema.sql).

## 4.1 Policy summary

| Table | SELECT | INSERT / UPDATE / DELETE |
|-------|--------|--------------------------|
| `profiles` | own row, or admin | own row |
| `candidates` | own row · **employers** may read candidates who are *not* "Not Looking" · admin | own row only |
| `employers` | own row, or admin | own row |
| `hiring_requests` | own (employer) or admin | own (employer) |
| `matches` | the owning employer · the candidate themselves · admin | **server-side only** (service role) |
| `storage.objects` (cvs bucket) | owner only | owner only |

## 4.2 Why this shape

- **Passive discovery with privacy:** employers can read candidate profiles, but
  **only** those who signalled openness (`open_to_opportunities <> 'not_looking'`).
  A candidate who sets "Not Looking" disappears from employer reads instantly.
- **Matches are written by trusted server code.** The matching API uses the
  `service_role` key (bypasses RLS) to read across all candidates and write
  results. Users never write to `matches` directly. Reads are still locked down
  by the `matches_read` policy.
- **Admin** is a role check via `is_admin()`, not a separate table.

## 4.3 The service-role rule (important)

The `service_role` key **bypasses RLS** and must **only** be used in server-side
code (`src/lib/supabase/admin.ts`, imported only by API route handlers). It is
never exposed to the browser. User-facing reads/writes always go through the
RLS-scoped client (`server.ts` / `client.ts`).

## 4.4 Testing RLS (recommended before launch)

1. Sign in as candidate A; confirm you cannot select candidate B's row.
2. Sign in as employer; confirm you can read open candidates but not "Not Looking" ones.
3. Confirm a candidate cannot read another employer's `hiring_requests`.
4. Confirm the `matches` write path only works with the service role.
