# 9. Matching Engine

Implemented in [`src/lib/matching.ts`](../src/lib/matching.ts). The guiding rule:
**the score is deterministic code; the LLM only explains it.** Same request →
same ranking, every time.

## 9.1 Default weight matrix (from the brief)

| Factor | Weight |
|--------|-------:|
| Skills | 25% |
| Experience | 20% |
| Industry | 15% |
| Certifications | 10% |
| Languages | 7% |
| Location | 7% |
| Salary alignment | 6% |
| Availability | 5% |
| Open To Opportunities | 3% |
| NOC status | 2% |

## 9.2 Role-aware weights

`weightsForRole(role_category)` tweaks then **re-normalizes to 100%**:

- **Sales:** +languages, +skills, −certifications (communication matters most).
- **Engineering / Technician:** +certifications, +experience, −languages.
- **Hospitality:** +languages, +availability, −certifications.
- **Finance:** +certifications, +experience.

This is how "different role categories use different weights" is implemented. The
`role_category` comes from the AI Recruiter Agent.

## 9.3 How each factor scores (0–1, then ×weight)

- **Skills / industries / certs / languages:** fraction of required items the
  candidate has (case-insensitive set overlap). Nothing required → full marks.
- **Experience:** `min(1, candidate_years / required_years)`.
- **Location:** exact match = 1, mismatch = 0.3, unknown = 0.5.
- **Salary:** candidate's expectation within budget = 1, decays as it exceeds.
- **Availability / open-to-opportunities:** mapped scores (immediate = 1 …
  not looking = 0).
- **NOC:** if required, `yes` = 1 / `no` = 0 / unknown = 0.5; if not required = 1.

Each factor's 0–100 value is returned in `breakdown` so we can show *why*.

## 9.4 Output (matches the brief's "Match Output")

Per candidate: **Match %** · **Summary** · **Strengths** · **Missing
requirements (gaps)** · **Risks** · **Salary** · **Availability** ·
**Open-To-Opportunities** · **NOC**. The first six come from the score +
Screening Agent; the rest are structured fields shown directly.

## 9.5 Pipeline

```
approve brief → (post-MVP: pgvector recall top 200) → scoreCandidate() for each
→ sort → AI Screening Agent explains top 6 → upsert into `matches` → render
```

## 9.6 Re-ranking on change

When a candidate edits their profile (or status), invalidate cached `matches`
rows that include them so the next view re-scores. For the MVP, employers simply
click **Re-run matching**.

## 9.7 Tuning

Weights live in one place (`DEFAULT_WEIGHTS` + `weightsForRole`). Post-MVP, move
them into a `role_weight_profiles` table so non-engineers can tune per role
without a deploy.
