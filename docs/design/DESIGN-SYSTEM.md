# CVeed — Design System

> Feels like **Apple · Linear · Stripe · Notion · Arc**. Never like LinkedIn, Bayt, Indeed, GulfTalent or legacy HR software.
> Premium · Modern · Minimal · Fast · Trustworthy · **AI-native**.
> Guiding law: **"AI must work harder than the user."** The interface should feel closer to ChatGPT than to recruitment software.

This document is the single source of truth for visual language. The tokens here are already implemented in `tailwind.config.ts` and `src/app/globals.css`.

---

## 1. Brand foundations

### 1.1 Logo
- **Mark:** purple CV block — a magnifier "C" + CV page + "v", white on `#6C3EF4`.
- **Wordmark:** "CVeed" (purple "eed").
- **Tagline:** `AI TALENT DISCOVERY` (letter-spaced caps).
- Assets: `/public/brand/cveed-logo.png` (lockup), `cveed-mark.png` (badge/app icon), `cveed-mark-white.png`, `cveed-mark-purple.png`.
- **Clear space:** keep at least the height of the badge around the lockup. Never recolor, stretch, or add effects.

### 1.2 Color palette

| Token | Hex | Use |
|-------|-----|-----|
| **Primary Purple** | `#6C3EF4` | Primary actions, accents, focus, brand moments. Use *sparingly*. |
| Purple Dark | `#5A2FD8` | Hover/pressed on primary. |
| Purple Light | `#F1ECFE` | Tints, chips, avatars, soft fills. |
| **Black / Ink** | `#111111` | Text, dark surfaces, secondary buttons. |
| White | `#FFFFFF` | Cards, inputs. |
| **Light Background** | `#FAFAFA` | App canvas. |

**Neutrals** are expressed as ink opacities (Apple-style): text `ink/100`, secondary `ink/70`, tertiary `ink/50`, hint `ink/40`, borders `black/[0.06]`. This keeps the palette tiny and consistent.

**Semantic:** success `#16A34A`, warning `#D97706`, danger `#DC2626` — used only in tags/inline, never as large fills. Purple is the only "loud" color.

**Rule:** one accent. If everything is purple, nothing is. Most of the screen is white/`#FAFAFA` + ink; purple punctuates.

### 1.3 Typography

- **Display / UI:** **SF Pro Display** where available (Apple platforms), **Inter** everywhere else (loaded via `next/font`). No decorative fonts.
- Tight tracking on headings (`-0.02em`/`-0.03em`), default body tracking `-0.011em`.

| Role | Size / line | Weight |
|------|-------------|--------|
| Display (hero) | 40–60px / 1.05 | 600 |
| H1 | 32–40px / 1.1 | 600 |
| H2 | 24–30px / 1.2 | 600 |
| H3 | 18–20px | 600 |
| Body | 15–17px / 1.6 | 400 |
| Body-sm | 13–14px | 400/500 |
| Caption | 11–12px | 500 |
| Mono (data) | — | SF Mono / ui-monospace for IDs, scores optional |

Numbers (match %, salary) may use tabular figures.

---

## 2. Core components

All radii, shadows, and states below are tokenized in Tailwind.

### 2.1 Buttons (`globals.css`)
- **Primary** (`.btn-primary`): purple fill, white text, soft shadow, `active:scale-[0.98]`. The single most important action per view.
- **Dark** (`.btn-dark`): `#111` fill — high-emphasis neutral (e.g. "Start hiring" on light).
- **Ghost** (`.btn-ghost`): white, hairline border — secondary.
- **Subtle** (`.btn-subtle`): translucent ink fill — tertiary/toolbar.
- Sizes: default + `.btn-lg`. Radius `rounded-xl`. 150ms transitions. Never more than one primary per screen.

### 2.2 Cards (`.card`, `.card-p`)
White, `rounded-2xl`, hairline border `black/6%`, `shadow-soft`. Hover lift (`shadow-lift`) only when interactive. No heavy borders or drop shadows — depth comes from subtle elevation.

### 2.3 Inputs (`.input`, `.label`)
White, `rounded-xl`, hairline border; focus = purple border + 4px `brand/10` ring. Generous padding. Labels are small, `ink/70`. Errors: red hairline + helper text below. Prefer **few fields**; let AI fill the rest.

### 2.4 Tags & chips
- `.chip` — purple-tint pill (skills, brand facts).
- `.tag` — neutral outline pill (metadata, filters).
- Match score = purple number, not a tag.

### 2.5 AI chat components (signature)
- **User bubble:** ink fill, white text, `rounded-2xl rounded-br-md`, right-aligned.
- **AI bubble:** `brand-light` fill, ink text, `rounded-2xl rounded-bl-md`, left-aligned.
- **Typing indicator:** three pulsing dots in `brand`.
- **Streaming:** tokens stream in (like ChatGPT); a thin caret while generating.
- **Structured output card:** when the AI produces a brief/profile, render it as an editable card *inside* the conversation with `.tag` facts.
- **Suggested replies:** small `.btn-subtle` chips under the AI bubble.

### 2.6 Tables
Borderless rows, hairline dividers (`black/6%`), sticky header in `ink/50` caption case, row hover `black/[0.02]`. Right-align numbers. Used in admin; elsewhere prefer cards.

### 2.7 Progress & scores
- **Profile strength:** thin track (`black/8%`) + purple fill, % label. `rounded-full`, 6px.
- **Match %:** large purple number + optional thin ring (conic gradient) for hero cards.
- **Step progress:** dots/segments, current = purple.

### 2.8 Empty states
Centered: small purple-tint icon badge, one-line headline, one supporting line, one primary action. Calm, never apologetic. Example: "No candidates yet — describe who you need and let the AI find them." + **New hiring request**.

### 2.9 Loading / skeletons
- **Skeletons** (`.skeleton`) for lists/cards — shimmering neutral blocks, never spinners for content.
- **AI work** gets *narrated* progress: "Reading your CV…", "Scoring 142 candidates…", "Writing explanations…" — reinforces "AI working hard."
- Buttons show inline label change ("Analyzing…") + disabled, not a separate spinner.

### 2.10 Icons
Line icons, 1.75px stroke, rounded caps (Lucide / SF Symbols style). Monochrome `ink/70`; purple only when active. Avoid filled/colorful icon sets.

### 2.11 Motion
- Entrance: `fade-up` (8px, 500ms, easeOutExpo), subtle stagger (60–120ms).
- Hover: 150ms; press: `scale-0.98`.
- Page transitions: gentle fade.
- Respect `prefers-reduced-motion`. Motion is *quiet confidence*, never bouncy.

---

## 3. Layout & spacing
- Base unit 4px; section rhythm in 8s (`mt-24` between major sections).
- Content max-width `max-w-6xl` (`.container-x`); reading columns `max-w-2xl/3xl`.
- Generous whitespace is a feature, not emptiness.
- Sticky, translucent, `backdrop-blur` top nav (Arc/Linear feel).

## 4. Accessibility & i18n
- Contrast: ink on white passes AA; purple text only at ≥16px/semibold or on light tint.
- Focus rings always visible (the 4px purple ring).
- **Arabic / RTL** is first-class for GCC: design mirrors with `dir="rtl"`; keep numerals localizable; plan an Arabic UI toggle early.
- Hit targets ≥44px on mobile.

## 5. Do / Don't
| Do | Don't |
|----|-------|
| One purple accent, lots of white | Rainbow dashboards |
| Hairline borders + soft shadow | Heavy cards, hard shadows |
| Narrate AI work | Generic spinners |
| Few fields, AI fills the rest | Long forms |
| Tight, modern type | Decorative fonts |
| Conversational copy | Corporate HR jargon |
