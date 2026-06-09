"use client";

import { useState } from "react";
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

export default function OnboardingWizard() {
  const [step, setStep] = useState<Step>("input");
  const [cvText, setCvText] = useState("");
  const [profile, setProfile] = useState<ExtractedProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // saveOnboarding redirects on success.
  }

  if (step === "input") {
    return (
      <div className="card space-y-4">
        <div>
          <label className="label">Paste your CV text</label>
          <p className="mb-2 text-xs text-slate-500">
            Tip: open your CV (PDF or Word), select all (Ctrl/Cmd+A), copy, and paste here.
          </p>
          <textarea
            className="input min-h-[220px] font-mono text-xs"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your full CV here..."
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="button" className="text-xs text-brand underline" onClick={() => setCvText(SAMPLE_CV)}>
            Use a sample CV
          </button>
          <button className="btn-primary" disabled={loading || cvText.trim().length < 30} onClick={analyze}>
            {loading ? "Reading your CV…" : "Analyze with AI"}
          </button>
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
    );
  }

  // step === "review"
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-semibold">Here&apos;s what the AI found</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="Title" value={profile?.current_title} />
          <Row label="Experience" value={`${profile?.years_experience} years`} />
          <Row label="Summary" value={profile?.summary} />
          <ChipRow label="Skills" items={profile?.skills} />
          <ChipRow label="Languages" items={profile?.languages} />
          <ChipRow label="Industries" items={profile?.industries} />
          <ChipRow label="Certifications" items={profile?.certifications} />
        </dl>
      </div>

      {questions.length > 0 && (
        <div className="card">
          <h2 className="font-semibold">A few quick questions</h2>
          <p className="text-xs text-slate-500">The AI only asks for what your CV didn&apos;t mention.</p>
          <div className="mt-4 space-y-4">
            {questions.map((q) => (
              <div key={q.field}>
                <label className="label">{q.label}</label>
                {q.type === "select" && q.options ? (
                  <select
                    className="input"
                    value={answers[q.field] || ""}
                    onChange={(e) => setAnswers({ ...answers, [q.field]: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {q.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input"
                    type={q.type === "number" ? "number" : "text"}
                    value={answers[q.field] || ""}
                    onChange={(e) => setAnswers({ ...answers, [q.field]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button className="btn-ghost" onClick={() => setStep("input")}>Back</button>
        <button className="btn-primary" disabled={loading} onClick={save}>
          {loading ? "Saving…" : "Save my profile"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 font-medium text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

function ChipRow({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 font-medium text-slate-500">{label}</dt>
      <dd className="flex flex-wrap gap-1">
        {items.map((i) => (
          <span key={i} className="chip">{i}</span>
        ))}
      </dd>
    </div>
  );
}
