# 👋 START HERE — Running CVeed (beginner-friendly)

This guide assumes **minimal experience**. Follow it top to bottom. Copy-paste each command exactly. Take your time.

---

## The mental model (read this first)

There are **three places** involved:

1. **The cloud computer** where Claude built this app. (Not your Mac.)
2. **GitHub** — your online code storage. Claude *pushed* the code here.
3. **Your MacBook** — where you'll *download* and *run* the app.

> So the flow is: **Cloud → GitHub → Your Mac**. Your Mac does **not** need to be on while Claude works. You only need it now, to run the app.

You already have the three accounts we need: **GitHub**, **Supabase**, **OpenAI**. 

---

## Part 1 — Install the basic tools on your Mac (one time)

Open the **Terminal** app (press `Cmd + Space`, type "Terminal", hit Enter).

**1.1 — Install Node.js** (the engine that runs the app). Go to <https://nodejs.org> and download the **LTS** version (the big green button). Install it like any Mac app. Then confirm it worked — paste this into Terminal:

```bash
node --version
```

You should see something like `v20.x` or `v22.x`. If you see a version number, you're good.

**1.2 — Git** is already on your Mac. Confirm:

```bash
git --version
```

---

## Part 2 — Download the code to your Mac

In Terminal, paste these one at a time:

```bash
cd ~/Desktop
git clone https://github.com/khaledii98/cveed.git
cd cveed
git checkout claude/ai-talent-discovery-platform-k6bdf7
```

This puts a folder called **cveed** on your Desktop with all the code. The `checkout` line switches to the branch where Claude's work lives.

> If `git clone` asks for a username/password, GitHub now uses a "personal access token" instead of your password. Easiest alternative: install **GitHub Desktop** (<https://desktop.github.com>), sign in, and use it to "clone" the `cveed` repo visually. Then come back to Terminal and `cd` into the folder.

---

## Part 3 — Set up the database (Supabase)

**3.1 — Create the tables.** Go to <https://supabase.com/dashboard> → open your project → click **SQL Editor** (left sidebar) → **New query**. 

Open the file `supabase/schema.sql` from the `cveed` folder (use any text editor, even TextEdit), **select all, copy, and paste** it into the Supabase SQL editor. Click **Run** (bottom right). 

You should see "Success. No rows returned." That created all your tables, security rules, and the CV storage bucket. ✅

**3.2 — Enable email sign-ups (and turn off email confirmation for testing).** In Supabase: **Authentication → Sign In / Providers → Email**. Make sure **Email** is enabled. For easy testing, scroll to **"Confirm email"** and turn it **OFF** (so you can log in immediately without checking your inbox). You can turn it back on before launch.

---

## Part 4 — Add your secret keys

The app needs 4 keys. You'll put them in a file called `.env.local`.

**4.1 — Get the Supabase keys.** In Supabase: **Project Settings (gear icon) → API**. You need:
- **Project URL** (looks like `https://abcd1234.supabase.co`)
- **anon public** key (a long string)
- **service_role** key (another long string — keep this SECRET)

**4.2 — Get the OpenAI key.** Go to <https://platform.openai.com/api-keys> → **Create new secret key** → copy it (starts with `sk-`).

**4.3 — Create the file.** In Terminal (make sure you're in the `cveed` folder):

```bash
cp .env.example .env.local
open -e .env.local
```

That opens the file in TextEdit. Replace each placeholder with your real keys, then **save** (`Cmd + S`) and close. It should look like:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...your-service-role-key
OPENAI_API_KEY=sk-...your-openai-key
```

> ⚠️ Never share the `service_role` or `OPENAI_API_KEY`. The `.env.local` file is private and is never uploaded to GitHub (it's in `.gitignore`).

---

## Part 5 — Run the app! 🚀

In Terminal, in the `cveed` folder:

```bash
npm install
npm run dev
```

The first command downloads the app's building blocks (takes a minute). The second starts the app. When you see **"Ready"**, open your browser to:

### 👉 http://localhost:3000

---

## Part 6 — Try the full experience

**As a candidate:**
1. Click **"I'm looking"** → create an account.
2. On the onboarding screen, click **"Use a sample CV"** (or paste your own), then **"Analyze with AI"**.
3. Watch the AI extract your skills, experience, etc. Answer the 1–2 quick questions. Save.
4. On your profile, change **"Open to opportunities"** and save.

**As an employer** (use a *different* email — sign out first):
1. Click **"I'm hiring"** → create an account → fill in the company form.
2. Click **"+ New hiring request"** → click **"Use an example"** (or type your own need) → **"Build brief with AI"**.
3. Review the structured brief → **"Approve & find candidates"**.
4. On the results page, click **"Find & rank candidates"**. The AI scores and explains each candidate with a match %.

**Make yourself an admin** to see the dashboard: in Supabase SQL Editor, run (use the email you signed up with):

```sql
update public.profiles set role = 'admin' where email = 'YOUR-EMAIL@example.com';
```

Then visit <http://localhost:3000/admin>.

---

## Part 7 (optional) — Put it online so you don't need your Mac

Right now the app only runs while your Mac is on. To get a real public link:

1. Go to <https://vercel.com> → sign up with your **GitHub** account.
2. Click **Add New → Project** → import the `cveed` repo → pick the branch `claude/ai-talent-discovery-platform-k6bdf7`.
3. Under **Environment Variables**, add the same 4 keys from your `.env.local`.
4. Click **Deploy**. In ~2 minutes you'll get a public URL like `cveed.vercel.app`.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| `npm: command not found` | Node.js didn't install. Redo Part 1.1, then close and reopen Terminal. |
| "The AI could not read this CV" / recruiter fails | Your `OPENAI_API_KEY` is wrong, or your OpenAI account has no credit. Check <https://platform.openai.com/account/billing>. |
| Can't sign in right after sign-up | Turn OFF "Confirm email" in Supabase (Part 3.2), or check your inbox for the confirmation link. |
| "relation ... does not exist" errors | The schema didn't run. Redo Part 3.1. |
| Employer sees "No available candidates" | Create at least one candidate whose status is **not** "Not Looking". |
| Port 3000 in use | Run `npm run dev -- -p 3001` and use `localhost:3001`. |

---

## What to read next

- `README.md` — the big picture and links to all 16 design documents.
- `docs/12-roadmap.md` — what to build next, in order.
- `docs/10-ui-screens.md` — every screen and how it should look/feel.

You're not alone in this — come back to Claude any time and say "help me with **X**", and we'll do it together step by step.
