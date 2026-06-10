"use client";

import { useEffect, useState } from "react";
import type { ExtractedProfile } from "@/lib/types";
import { saveOnboarding } from "./actions";

type Question = { field: string; label: string; type: string; options: string[] | null };
type Step = "input" | "review";

const SAMPLE_CV = `Sales Manager with 8 years of experience in the automotive industry in Doha, Qatar.
Skills: B2B sales, negotiation, CRM (Salesforce), team leadership, account management.
Languages: Arabic (native), English (fluent).
Experience:
- Sales Manager, Al Futtaim Motors (2018-2025): led a team of 6, grew revenue 30%.
- Sales Executive, Toyota Qatar (2016-2018).
Education: BBA in Marketing, Qatar University, 2016.
Certifications: Certified Sales Professional (CSP).`;

// Used only to preview the review step (visit ?demo=review). Harmless otherwise.
const SAMPLE_PROFILE: ExtractedProfile = {
  current_title: "Sales Manager",
  years_experience: 8,
  summary: "Automotive sales leader with 8 years in Doha, strong B2B and team leadership track record.",
  skills: ["B2B Sales", "Negotiation", "Salesforce", "Team Leadership", "Account Management"],
  certifications: ["Certified Sales Professional"],
  languages: ["Arabic", "English"],
  industries: ["Automotive"],
  previous_companies: ["Al Futtaim Motors", "Toyota Qatar"],
  work_history: [],
  education: [{ degree: "BBA in Marketing", institution: "Qatar University", year: "2016" }],
  missing_fields: ["expected_salary", "availability", "noc_status"],
};
const SAMPLE_QUESTIONS: Question[] = [
  { field: "expected_salary", label: "Expected monthly salary (QAR)", type: "number", options: null },
  { field: "availability", label: "When can you start?", type: "select", options: ["Immediately", "1 month", "2 months", "3 months"] },
  { field: "noc_status", label: "Do you have an NOC?", type: "select", options: ["yes", "no", "unknown"] },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState<Step>("input");
  const [cvText, setCvText] = useState("");
  const [profile, setProfile] = useState<ExtractedProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Design preview only.
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "review") {
      setProfile(SAMPLE_PROFILE);
      setQuestions(SAMPLE_QUESTIONS);
      setStep("review");
    }
  }, []);

  async function analyze() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cv/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setProfile(data.profile);
      setQuestions(data.questions || []);
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!profile) return;
    setLoading(true);
    await saveOnboarding({ profile, cvText, answers });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Stepper step={step} />

      {step === "input" ? (
        <div className="mt-8 animate-fade-up">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink">Let&apos;s build your profile</h1>
          <p className="mt-1.5 text-ink/55">Paste your CV — our AI reads it and only asks for what&apos;s missing.</p>

          <div className="card mt-6 p-5">
            <textarea
              className="input min-h-[240px] resize-none text-[13px] leading-relaxed"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your full CV here…  (open your CV, select all, copy, paste)"
            />
            <div className="mt-4 flex items-center justify-between">
              <button type="button" className="text-sm font-medium text-brand hover:text-brand-dark" onClick={() => setCvText(SAMPLE_CV)}>
                Use a sample CV
              </button>
              <button className="btn-primary" disabled={loading || cvText.trim().length < 30} onClick={analyze}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> Reading your CV…
                  </span>
                ) : (
                  "Analyze with AI"
                )}
              </button>
            </div>
            {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>}
          </div>

          <p className="mt-4 text-center text-xs text-ink/40">🔒 Your CV is private and only used to build your profile.</p>
        </div>
      ) : (
        <div className="mt-8 animate-fade-up space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink">Here&apos;s what we found</h1>
            <p className="mt-1.5 text-ink/55">Review what the AI extracted — you can edit anything later.</p>
          </div>

          <div className="card-p">
            <div className="flex items-center gap-2 text-sm font-medium text-brand">
              <SparkDot /> Extracted from your CV
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Title" value={profile?.current_title} />
              <Row label="Experience" value={profile ? `${profile.years_experience} years` : undefined} />
              <Row label="Summary" value={profile?.summary} />
              <ChipRow label="Skills" items={profile?.skills} />
              <ChipRow label="Languages" items={profile?.languages} />
              <ChipRow label="Industries" items={profile?.industries} />
              <ChipRow label="Certifications" items={profile?.certifications} />
            </dl>
          </div>

          {questions.length > 0 && (
            <div className="card-p">
              <h2 className="font-semibold text-ink">A few quick questions</h2>
              <p className="mt-0.5 text-sm text-ink/50">The AI only asks for what your CV didn&apos;t mention.</p>
              <div className="mt-4 space-y-4">
                {questions.map((q) => (
                  <div key={q.field}>
                    <label className="label">{q.label}</label>
                    {q.type === "select" && q.options ? (
                      <select className="input" value={answers[q.field] || ""} onChange={(e) => setAnswers({ ...answers, [q.field]: e.target.value })}>
                        <option value="">Select…</option>
                        {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input className="input" type={q.type === "number" ? "number" : "text"} value={answers[q.field] || ""} onChange={(e) => setAnswers({ ...answers, [q.field]: e.target.value })} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button className="btn-ghost" onClick={() => setStep("input")}>Back</button>
            <button className="btn-primary" disabled={loading} onClick={save}>
              {loading ? "Saving…" : "Save my profile"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { key: "input", label: "Upload CV" },
    { key: "review", label: "Review" },
  ];
  return (
    <div className="flex items-center justify-center gap-3">
      {items.map((it, i) => {
        const active = it.key === step;
        const done = step === "review" && it.key === "input";
        return (
          <div key={it.key} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${active || done ? "bg-brand text-white" : "bg-black/[0.06] text-ink/40"}`}>
                {done ? "✓" : i + 1}
              </span>
              <span className={`text-sm font-medium ${active || done ? "text-ink" : "text-ink/40"}`}>{it.label}</span>
            </div>
            {i === 0 && <span className="h-px w-8 bg-black/10" />}
          </div>
        );
      })}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-ink/45">{label}</dt>
      <dd className="text-ink/90">{value}</dd>
    </div>
  );
}

function ChipRow({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-ink/45">{label}</dt>
      <dd className="flex flex-wrap gap-1.5">
        {items.map((i) => <span key={i} className="chip">{i}</span>)}
      </dd>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SparkDot() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 4c.5 3.5 1.5 4.5 5 5-3.5.5-4.5 1.5-5 5-.5-3.5-1.5-4.5-5-5 3.5-.5 4.5-1.5 5-5Z" fill="currentColor" />
    </svg>
  );
}
