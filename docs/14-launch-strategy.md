# 14. Launch Strategy

Market: **SMEs in Qatar**, then the wider GCC. The wedge is *AI does the work*:
SMEs without HR teams get a shortlist in minutes instead of sifting WhatsApp
groups and CV piles.

## 14.1 The cold-start problem (solve candidates first)

A two-sided marketplace is worthless empty. Sequence:

1. **Seed candidates (weeks 1–4).** Run candidate-sign-up campaigns *before*
   selling to employers. Channels: university career centres, professional
   WhatsApp/Telegram groups, LinkedIn, partnerships with training institutes.
   Hook: "Build your profile once in 90 seconds and get discovered — even while
   employed." Aim for a few hundred quality profiles in target sectors
   (sales, hospitality, engineering, accounting, technicians).

2. **Concierge employers (weeks 3–8).** Hand-pick 5–10 friendly SMEs. Onboard
   them personally; you run their first hiring request *with* them. Deliver a
   ranked shortlist within 24h. This sells the magic and teaches you match quality.

3. **Tighten the loop.** Use pilot feedback to tune weights/prompts and the
   taxonomy. Track time-to-shortlist and employer "this is a good match?" votes.

## 14.2 Positioning

- **Not a job board.** "Your AI recruiter." Employers describe the role in one
  sentence; CVeed returns ranked, explained candidates.
- **For candidates:** "Get discovered without applying."
- **Local trust:** Arabic support, QAR salaries, NOC awareness — built in.

## 14.3 Pricing (post-MVP; architecture leaves room)

- **Free for candidates** (always — supply side).
- **Employers:** start free during pilot. Then per-hiring-request or a monthly
  subscription with a cap on active requests. (Premium agents — career coaching,
  market intelligence — are explicitly out of MVP but designed-for later.)

## 14.4 Metrics that matter

| Metric | Why |
|--------|-----|
| Candidate onboarding completion rate & **time** (<90s goal) | Core promise |
| Profile completeness % | Match quality |
| Employer time-to-first-shortlist | Core promise |
| "Good match?" thumbs-up rate on top 3 | Quality of the engine |
| Active "Open-To-Opportunities" candidates | Liquidity |
| Repeat hiring requests per employer | Retention / value |

## 14.5 Go-to-market checklist
- [ ] Landing page + Arabic version.
- [ ] 200–500 seeded candidates in target sectors.
- [ ] 5–10 pilot SMEs lined up.
- [ ] Analytics (e.g. PostHog) on both funnels.
- [ ] Feedback button on every match.
- [ ] WhatsApp as a support + notification channel (locally preferred).
- [ ] Legal: privacy policy, terms, PDPPL-aligned consent.

## 14.6 90-day launch plan
- **Days 1–30:** productionize MVP (file upload, emails), seed candidates.
- **Days 31–60:** concierge-onboard pilot SMEs, run real matches, tune.
- **Days 61–90:** open self-serve employer sign-up in Qatar; iterate on retention.
