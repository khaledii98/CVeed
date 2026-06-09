# 11. User Flows

## 11.1 Candidate — "get discovered" (target < 90s)

```
Landing → "I'm looking" → sign up (name, email, password)
   → Onboarding: paste CV → "Analyze with AI"
        → AI extracts skills/experience/etc.
        → answers ≤5 missing questions (salary, NOC, availability…)
        → Save
   → Living profile: set "Open to opportunities" → done.
Candidate is now passively discoverable. They can edit anything, any time.
```

## 11.2 Employer — "find talent" (target < 2 min)

```
Landing → "I'm hiring" → sign up → company setup (6 fields)
   → Dashboard → "+ New hiring request"
        → type plain-language need → "Build brief with AI"
        → AI Recruiter returns a structured brief + follow-up questions
        → employer edits/approves → "Approve & find candidates"
   → Results: "Find & rank candidates"
        → deterministic scoring of all open candidates
        → AI Screening explains the top 6 (match %, strengths, gaps, risks)
   → employer reviews ranked list (and can shortlist).
```

## 11.3 Admin

```
Sign in (role = admin) → /admin
   → KPIs: #candidates, #employers, #requests, #matches
   → recent candidates table (name, title, status, completeness)
   (post-MVP: taxonomy management, moderation, agent-run logs)
```

## 11.4 Status lifecycle — Open To Opportunities

```
not_looking ──► slightly_open ──► open_to_discussions ──► actively_exploring ──► available_immediately
   (hidden from employer reads)        (visible to employers, weighted by openness)
```
Editable at all times from the profile. `not_looking` removes the candidate from
employer reads via RLS.

## 11.5 Hiring request lifecycle

```
draft (in the wizard) → open (approved & saved) → matching run → [shortlisting] → closed
```

## 11.6 Where each agent fires

| Step | Agent |
|------|-------|
| CV pasted | CV Intelligence (2) |
| Missing fields | Onboarding (1) |
| Company setup | Employer Onboarding (3, form) |
| NL need typed | AI Recruiter (4) |
| "Find & rank" | Matching (code) + AI Screening (6) |
| Throughout | Governance (7) + Data Consistency (5) |
