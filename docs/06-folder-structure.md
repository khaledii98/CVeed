# 6. Folder Structure

```
CVeed/
├── README.md                  Project overview + links to all 16 deliverables
├── START-HERE.md              Beginner setup guide (run it on your Mac)
├── package.json               Dependencies & scripts
├── next.config.mjs            Next.js config
├── tailwind.config.ts         Design tokens (brand colours)
├── middleware.ts              Refreshes the Supabase auth session each request
├── .env.example               Template for your secret keys
│
├── docs/                      The 16 design deliverables (this folder)
│
├── prompts/                   Human-readable AI agent prompts
│
├── supabase/
│   ├── schema.sql             ⭐ Paste-and-run: all tables + RLS + storage
│   └── migrations/            Same schema, split into ordered migration files
│
└── src/
    ├── app/                   Next.js App Router (pages = folders)
    │   ├── layout.tsx         Shared header/nav/footer
    │   ├── page.tsx           Landing page
    │   ├── actions.ts         Shared server actions (sign out)
    │   ├── login/             Sign in
    │   ├── signup/            Sign up (candidate or employer)
    │   ├── candidate/
    │   │   ├── onboarding/    CV paste → AI extract → questions  (Wizard.tsx)
    │   │   └── profile/       Living profile + Open-To-Opportunities editor
    │   ├── employer/
    │   │   ├── setup/         Company profile form
    │   │   ├── page.tsx       Employer dashboard (list hiring requests)
    │   │   ├── new/           NL brief → AI Recruiter → approve  (Wizard.tsx)
    │   │   └── requests/[id]/ Ranked candidates + AI explanations (Results.tsx)
    │   ├── admin/             Admin dashboard (stats + recent candidates)
    │   └── api/
    │       ├── cv/extract/    CV Intelligence + Onboarding agents
    │       ├── recruiter/     AI Recruiter agent
    │       └── match/         Matching engine + AI Screening agent
    │
    └── lib/
        ├── supabase/
        │   ├── client.ts      Browser client (anon key, RLS)
        │   ├── server.ts      Server client (reads session cookie, RLS)
        │   ├── admin.ts       Service-role client (server only, bypasses RLS)
        │   └── middleware.ts  Session refresh helper
        ├── openai.ts          OpenAI client + JSON/embedding helpers
        ├── types.ts           Shared TypeScript types (mirror the DB)
        ├── matching.ts        Deterministic scoring engine + role weights
        └── agents/
            ├── prompts.ts     Versioned system prompts (executable)
            └── index.ts       runCvIntelligence / runRecruiter / runScreening …
```

## Conventions

- **Pages are Server Components by default** (fast, secure). We add `"use client"`
  only for interactive widgets (the wizards, the profile form, results).
- **`actions.ts` next to a route** holds that route's Server Actions.
- **`Wizard.tsx` / `Results.tsx`** are the client islands — they call the API
  routes and render AI output.
- **Anything touching the `service_role` key lives under `src/lib/supabase/admin.ts`**
  and is only imported by `app/api/**` route handlers.
