# CVeed — UX Specification

Companion to `DESIGN-SYSTEM.md`. Covers the public website, candidate product,
employer product, and the signature AI Recruiter experience — with layout,
components, states, and AI interactions for every screen.

Legend: 🟣 = primary CTA · ◻︎ = component · ⤷ = flow · ∅ = empty state · ⏳ = loading · 🤖 = AI moment.

---

## 0. UX architecture & sitemap

```
Public
 ├─ /                 Homepage
 ├─ /for-candidates   Candidate landing
 ├─ /for-employers    Employer landing
 ├─ /pricing
 ├─ /about
 └─ /contact

Auth
 ├─ /login
 └─ /signup           (role toggle: candidate | employer)

Candidate app (role: candidate)
 ├─ /candidate/onboarding   CV upload → AI extraction review → questions
 ├─ /candidate              Dashboard
 ├─ /candidate/profile      Profile editor (living profile)
 ├─ /candidate/opportunities  Open-To-Opportunities settings
 ├─ /candidate/video        Video introduction
 ├─ /candidate/notifications
 └─ /candidate/settings     Account

Employer app (role: employer)
 ├─ /employer               Dashboard (hiring requests)
 ├─ /employer/new           Create hiring request (AI Recruiter chat)
 ├─ /employer/requests/[id] Request details + search results
 ├─ /employer/requests/[id]/candidates/[cid]  Candidate profile view
 ├─ /employer/shortlists
 └─ /employer/settings      Company

Admin (role: admin)
 └─ /admin                  Dashboard, taxonomy, moderation
```

Navigation: **public** = top nav + footer. **App** = sticky top bar (logo, primary nav, profile menu) + content; mobile collapses nav into a bottom tab bar (Dashboard · Profile/Hiring · Notifications · Settings).

---

## 1. Core user journeys

**Candidate (target < 90s):**
`/ → Get started → Signup → Onboarding (paste CV) → 🤖 extract → review → answer ≤5 Qs → Dashboard (set Open-To-Opportunities) → discoverable.`

**Employer (target < 2 min):**
`/ → Start hiring → Signup → Company (6 fields) → New request → 🤖 chat brief → approve → Results → 🤖 ranked → shortlist.`

**Admin:** `Login → /admin → KPIs · recent candidates · taxonomy.`

---

## 2. Public website

Shared: sticky translucent nav (logo left; links center; "Sign in" + 🟣"Get started" right). Big type, generous whitespace, `fade-up` on scroll, product previews as real UI (not stock photos). Footer: logo, columns (Product / Company / Legal), language toggle (EN/AR).

### 2.1 Homepage `/`  *(implemented)*
- **Hero:** eyebrow pill → headline "The AI recruiter that finds talent **for you**." → subhead → 🟣"Start hiring — it's free" + ◻︎"Create your profile" → trust line.
- **Product preview:** AI Recruiter chat card (user bubble → AI follow-ups → structured tags).
- **How it works:** 3 numbered cards (upload once / describe / AI ranks).
- **Ranking preview:** copy + 3 live-style candidate cards with match %.
- **Split CTA:** ink card (employers) + purple card (candidates).
- **Animations:** hero `fade-up`; staggered cards; chat could type on view.

### 2.2 Candidate landing `/for-candidates`
- Hero: "Get discovered — without applying." 🟣"Create your profile".
- Sections: *Build once* (CV → profile preview) · *Stay private* (Open-To-Opportunities explainer with the 5 states) · *Get matched* · FAQ.
- Emotional, candidate-first; emphasize effort-free + privacy (passive discovery even while employed).

### 2.3 Employer landing `/for-employers`
- Hero: "Describe the role. Meet the shortlist." 🟣"Start hiring".
- Sections: *AI Recruiter* (chat demo) · *Ranked & explained* (match card) · *Built for SMEs* (no HR team needed) · *Local* (Arabic, QAR, NOC) · ROI strip (time saved) · CTA.

### 2.4 Pricing `/pricing`
- Toggle (monthly/annual). 3 tiers as cards: **Free (pilot)**, **Growth**, **Scale** — middle highlighted purple border + "Popular".
- Per-card: price, one-line value, feature checklist, CTA. Below: comparison table + FAQ. (MVP: employers free; keep tiers visually ready.)

### 2.5 About `/about`
- Mission ("AI must work harder than the user"), the GCC problem, principles, team, careers CTA. Calm editorial layout, max-w prose.

### 2.6 Contact `/contact`
- Two columns: short form (name, email, role select, message) + direct channels (email, WhatsApp — locally preferred). ∅/success: inline confirmation card. No CAPTCHA wall.

---

## 3. Candidate product

Shell: top bar + (mobile) bottom tabs. Calm `#FAFAFA` canvas, white cards.

### 3.1 Login `/login`
◻︎ centered card: email, password, 🟣"Sign in", link to signup, "Forgot password". ⏳ button → "Signing in…". Error: red helper. (Add Google OAuth later.)

### 3.2 Signup `/signup`
◻︎ card with **role toggle** (Candidate | Employer). Fields: name, email, password. 🟣"Create account". 🤖 none yet — speed first. ⤷ candidate → onboarding; employer → company setup.

### 3.3 CV upload `/candidate/onboarding` (step 1)
- ◻︎ large **drop zone** (drag-and-drop PDF/DOCX) **or** paste-text tab. "Use a sample CV" link.
- Copy: "Upload your CV — our AI does the rest." 🟣"Analyze with AI".
- ⏳ 🤖 narrated: "Reading your CV…" with skeleton of the review screen.
- ∅: friendly prompt + sample. Error: "Couldn't read that file — try pasting the text."

### 3.4 AI extraction review `/candidate/onboarding` (step 2) 🤖
- Two-part: **"Here's what we found"** card (title, years, summary, skill/lang/industry chips — all **editable inline**) + **"A few quick questions"** (≤5 dynamic fields: salary, availability, NOC, notice, job type).
- Confidence: low-confidence fields subtly flagged for review.
- 🟣"Save my profile" → Dashboard. ⏳ "Saving…". This screen *shows the AI working for them* — the magic moment.

### 3.5 Candidate dashboard `/candidate` 🤖  *(see §6)*

### 3.6 Profile editor `/candidate/profile`
- Sectioned, autosaving: Basics · Experience · Skills · Certifications · Languages · Salary · Preferences (roles/industries/locations) · CV file · Video.
- Each section a `.card`; chips are add/remove; "Re-upload CV" re-runs 🤖 extraction (diff view: "AI found 3 new skills — add them?").
- ◻︎ Profile-strength meter pinned top. ⏳ inline "Saved ✓".

### 3.7 Open-To-Opportunities `/candidate/opportunities`
- ◻︎ **segmented control / vertical radio** of 5 states (Not Looking → Available Immediately), each with a one-line description and an emoji/dot scale (red→green).
- Big current-status banner; change is instant + toast "You're now Open To Discussions." Privacy note: "Not Looking hides you from all employers."

### 3.8 Video introduction `/candidate/video`
- ◻︎ recorder (10–30s) with countdown + tips, or upload. Preview, re-record, 🟣"Use this video". States: ∅ (record prompt), ⏳ (uploading %), processing (Mux), ready (thumbnail). Optional — clearly skippable.

### 3.9 Notifications `/candidate/notifications`
- List of cards: type icon (match / profile viewed / system), title, snippet, time, unread purple dot. Filters (All / Matches / System). ∅: "No notifications yet — we'll tell you when an employer is interested." Mark-all-read.

### 3.10 Account settings `/candidate/settings`
- Tabs: Account (email, phone, WhatsApp, password) · Privacy (visibility, **delete my data / export**) · Notifications (email/push toggles) · Language. Save inline. Danger zone (delete) in red, confirm modal.

---

## 4. Employer product

Shell mirrors candidate. Focus: speed to shortlist.

### 4.1 Login — as §3.1.
### 4.2 Signup — role=employer → company setup.

### 4.3 Employer dashboard `/employer`
- Top: greeting + 🟣"New hiring request".
- ◻︎ **Hiring request cards** grid: title, role category, # candidates, # shortlisted, status pill, updated. Hover lift → details.
- Small KPI row: open requests · candidates surfaced · shortlisted.
- ∅: hero empty state "Describe who you need and let the AI find them." + 🟣 + example chips ("Sales Manager", "Accountant", "Chef").
- ⏳: skeleton cards.

### 4.4 Create hiring request `/employer/new` — **AI Recruiter chat** 🤖 *(see §5)*

### 4.5 Hiring request details `/employer/requests/[id]`
- Header: title, role category, location, status; actions (Edit brief, Re-run, Close).
- ◻︎ **Brief summary** card (editable tags: skills, languages, salary, NOC, start).
- Tabs: **Candidates** (results) · **Shortlist** · **Brief**.
- 🟣"Find & rank candidates" → ⏳ narrated 🤖 ("Scoring 142 candidates… writing explanations…") → results.

### 4.6 Candidate search results `/employer/requests/[id]` → Candidates  *(see §7)*

### 4.7 Candidate profile view
- Two-column: left = profile (summary, experience timeline, skills, certs, languages, education, video); right sticky = **match panel** (match %, ring, breakdown bars, strengths/gaps/risks, salary, availability, NOC, Open-To status) + 🟣"Shortlist" + "Contact".
- 🤖 "Why ranked here" expandable rationale. ∅ video: placeholder. Respect candidate privacy settings.

### 4.8 Shortlisted candidates `/employer/shortlists`
- Compact cards/table of saved candidates across requests; columns: name, role, match %, status, note. Bulk: message, export, remove. ∅: "Shortlist candidates to compare them here."

### 4.9 Company settings `/employer/settings`
- Company profile (name, industry, size, logo, location), team members (later), billing (later), notifications, language. Inline save.

---

## 5. AI Recruiter experience (the most important screen) 🤖

Route `/employer/new`. **Feels like ChatGPT**, purpose-built for hiring.

### Layout
- Centered conversation column (`max-w-2xl`), sticky composer at bottom, optional right rail (desktop) showing the **live structured brief** building up as they talk.
- Empty start: friendly prompt + **example chips**: "Sales manager, automotive, fluent Arabic" · "Accountant, 3+ yrs, English" · "Chef, Italian cuisine".

### Conversation flow
1. Employer types: *"I need a sales manager with automotive experience."*
2. 🤖 **streams** a warm, recruiter-style reply and asks **only missing criticals** (salary range? years? start date? NOC?) — one or two at a time, with quick-reply chips ("15k–18k QAR", "ASAP", "Not required").
3. Each answer updates the **right-rail brief** (or an inline brief card on mobile) in real time — fields fill with a subtle highlight.
4. When enough info exists, 🤖 posts a **Hiring Brief card** inside the chat: title, role category, required/nice-to-have skills, experience, industries, languages, certs, location, salary, NOC, job type, start date — **all editable**.
5. 🟣"Approve & find candidates" → creates the request and runs matching.

### Components
- ◻︎ chat bubbles (§2.5), typing dots, streaming caret, suggested-reply chips, editable brief card, sticky composer (textarea that grows, send button, "use example").
### States
- ⏳ typing indicator while AI thinks; token streaming.
- ∅ first load: prompt + examples.
- Error: inline "I had trouble — try rephrasing" with retry.
- Edit: tapping a brief field opens inline edit; AI acknowledges ("Updated to 5+ years").

### Principles
- The employer should **never feel they're filling a form** — it's a conversation.
- Ask the **fewest** questions; infer the rest (role_category, currency=QAR, etc.).
- Always end with a reviewable, editable structured brief before searching.

---

## 6. Candidate dashboard (detailed) 🤖

Route `/candidate`. Feels like a modern SaaS home.

### Layout (desktop: 2/3 + 1/3; mobile: stacked)
- **Hero strip:** avatar/initials, name, current title, **Open-To-Opportunities** segmented control (editable inline, instant save).
- **Profile strength** card: big % + thin purple meter + "Complete these to reach 100%": checklist (add salary, add video, add 2 skills) — each a quick action. 🤖 suggestions: "Add 'Salesforce' — common for your roles."
- **Snapshot grid** (cards): Salary expectation · Availability · NOC status · Top skills (chips) · Certifications. Each editable in place.
- **Notifications** preview: latest 3 + "See all".
- **Career insights** (placeholder, premium-locked): blurred teaser card "Coming soon — salary benchmarks & skill-gap analysis" with a lock — designed-for, not built.
- ∅ (new user): prompt to finish profile. ⏳: skeleton cards. 🤖: gentle, never nagging.

---

## 7. Candidate search results (detailed)

Route: `/employer/requests/[id]` → Candidates tab. **Premium, scannable cards.**

### Card anatomy
```
┌───────────────────────────────────────────────────────────┐
│ [AV]  Sara A.                                      92%  ⟲   │
│       Sales Manager · Automotive · Doha            match     │
│       8 yrs · Available in 1 month · Open To Discussions     │
│       [B2B Sales] [Arabic] [Salesforce] [+3]                 │
│       ─────────────────────────────────────────────────     │
│       ✓ Strong automotive B2B background                     │
│       △ No formal certification                              │
│                                   [View profile]  [☆ Shortlist]│
└───────────────────────────────────────────────────────────┘
```
- **Shown:** Match %, name, current role, years, location, availability, Open-To status, key skills, one strength + one gap, View Profile + Shortlist.
- **Sort/filter bar:** sort by match/availability/salary; quick filters (Open now, has NOC, salary ≤). Result count + "AI ranked 142 candidates".
- **Score:** purple % (optionally a thin ring). Lower matches fade slightly.
- ∅: "No candidates yet — run the search." / "No one matches strongly — broaden the brief?" with a 🤖 suggestion.
- ⏳: skeleton cards + narrated AI progress.
- 🤖: each card's strength/gap come from the Screening agent; "View profile" reveals full rationale.

---

## 8. Mobile vs desktop

**Mobile (primary for GCC):**
- Bottom tab bar; single-column; sticky CTAs; large 44px targets; sheets/drawers instead of modals.
- AI Recruiter: full-screen chat, brief shown as an inline card (no right rail).
- Results: full-width cards, filters in a bottom sheet.
- "Add to Home Screen" PWA → app-like.

**Desktop:**
- Two-column layouts (content + context rail), command-bar feel, hover states, keyboard shortcuts (`⌘K` search/new — later).
- AI Recruiter shows live brief in right rail.

Design **mobile-first**, enhance for desktop.

---

## 9. UI inspiration references
- **Apple** — restraint, type, whitespace, product-as-hero.
- **Linear** — speed, sticky translucent nav, keyboard-first, subtle motion.
- **Stripe** — trust, gradients used sparingly, immaculate spacing, docs-grade clarity.
- **Notion** — friendly emptiness, inline editing, calm cards.
- **Arc** — playful-but-premium color accenting, delightful micro-moments.
- **ChatGPT / Claude** — the conversational AI surface for the Recruiter & onboarding.

---

## 10. What to design first in Figma (build order)
1. **Foundations:** color styles, type styles, grid, icon set, effects (the tokens here).
2. **Core components:** buttons, inputs, cards, tags, chat bubbles, score/meter, empty/skeleton.
3. **AI Recruiter chat** (the differentiator) — desktop + mobile.
4. **Candidate onboarding** (upload → extraction review).
5. **Candidate dashboard** + **search results cards**.
6. **Candidate profile view (employer side)** with match panel.
7. **Public homepage** + candidate/employer landings.
8. Settings, notifications, pricing, auth.
Prototype the two hero flows (employer chat→shortlist, candidate upload→dashboard) for user testing.

---

## 11. Design roadmap (MVP)

| Phase | Design deliverable |
|-------|--------------------|
| 1 | Design system in Figma + tokens mirrored in code *(tokens done)* |
| 2 | Auth, candidate onboarding + extraction review, candidate dashboard |
| 3 | AI Recruiter chat (the signature screen) + hiring request details |
| 4 | Search results cards + candidate profile/match panel + shortlist |
| 5 | Public site (home + 2 landings), settings, notifications, pricing |
| 6 | Arabic/RTL pass, empty/loading/error polish, motion pass, a11y audit |

Ship each screen behind the same component library so the whole product stays
visually consistent and fast to extend.
