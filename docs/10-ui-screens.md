# 10. UI Screens

Design principles (from the brief): smooth, modern, simple, fast. Candidate
onboarding < 90s. Employer request < 2 min. Never feel like a long form. Every
screen below is built in the MVP.

## 10.1 Screen inventory

| Screen | Path | Role | Built |
|--------|------|------|:----:|
| Landing | `/` | public | ✅ |
| Sign up (candidate / employer toggle) | `/signup` | public | ✅ |
| Sign in | `/login` | public | ✅ |
| Candidate onboarding (CV → AI → questions) | `/candidate/onboarding` | candidate | ✅ |
| Candidate living profile + Open-To-Opportunities | `/candidate/profile` | candidate | ✅ |
| Employer company setup | `/employer/setup` | employer | ✅ |
| Employer dashboard (requests list) | `/employer` | employer | ✅ |
| New hiring request (NL → AI brief) | `/employer/new` | employer | ✅ |
| Ranked candidates + explanations | `/employer/requests/[id]` | employer | ✅ |
| Admin dashboard | `/admin` | admin | ✅ |

## 10.2 Key screens, described

**Onboarding (`/candidate/onboarding`)** — a two-step *wizard*, not a form:
1. One big textarea: "Paste your CV." A **Use a sample CV** link lets people try
   instantly. One button: **Analyze with AI**.
2. The AI shows what it found (title, experience, skill chips) + at most 5
   follow-up questions. One button: **Save my profile**.

**Living profile (`/candidate/profile`)** — top: title + completeness %. The
**Open to opportunities** dropdown is front and centre and editable any time.
Editable salary, availability, NOC, job type, skills, languages, industries,
locations. **Re-upload CV** button.

**New request (`/employer/new`)** — step 1: one textarea ("Who are you looking
for?") + **Use an example**. Step 2: the AI's structured brief, fully editable,
plus the recruiter's follow-up questions. Button: **Approve & find candidates**.

**Results (`/employer/requests/[id]`)** — a ranked list of cards. Each card:
candidate name + title, a big **match %**, an AI summary, and three columns:
**Strengths / Missing / Risks**, plus a footer row with salary, availability,
NOC, and open-status. One button up top: **Find & rank candidates** (or
**Re-run**).

## 10.3 Design system

- **Tailwind** with a single brand colour (`brand` indigo) defined in
  `tailwind.config.ts`.
- Reusable classes in `globals.css`: `.btn-primary`, `.btn-ghost`, `.card`,
  `.input`, `.label`, `.chip`.
- Recommended next step: adopt **shadcn/ui** for accessible inputs, dialogs,
  toasts; add skeleton loaders for the AI calls; add an Arabic/RTL toggle (GCC).

## 10.4 Mobile & RTL

The layout is responsive (max-width container, `sm:` breakpoints). For the GCC
market, plan **Arabic + right-to-left** support early — wrap copy in an i18n
library (e.g. `next-intl`) and set `dir="rtl"` when Arabic is selected.
