"use client";

import { useEffect, useState } from "react";
import type { HiringBrief } from "@/lib/types";
import { createHiringRequest } from "./actions";

const EXAMPLES = [
  "Sales manager with automotive experience and fluent Arabic, Doha, ~15,000 QAR, start within a month.",
  "Accountant, 3+ years, English & Arabic, knows QuickBooks.",
  "Chef with 5 years in Italian cuisine, fluent English.",
];

const SAMPLE_BRIEF: HiringBrief = {
  title: "Sales Manager",
  role_category: "sales",
  required_skills: ["B2B Sales", "Negotiation", "Arabic"],
  nice_to_have_skills: ["Salesforce"],
  min_years_experience: 5,
  industries: ["Automotive"],
  languages: ["Arabic", "English"],
  certifications: [],
  location: "Doha",
  salary_min: null,
  salary_max: 15000,
  currency: "QAR",
  noc_required: false,
  job_type: "full_time",
  start_date: "1 month",
  follow_up_questions: ["Is an NOC required?", "Any preferred automotive brands?"],
};

export default function RecruiterWizard() {
  const [step, setStep] = useState<"input" | "review">("input");
  const [raw, setRaw] = useState("");
  const [brief, setBrief] = useState<HiringBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "review") {
      setBrief(SAMPLE_BRIEF);
      setStep("review");
    }
  }, []);

  async function analyze() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: raw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBrief(data.brief);
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!brief) return;
    setLoading(true);
    await createHiringRequest({ brief, raw });
  }

  function patch(field: keyof HiringBrief, value: unknown) {
    if (!brief) return;
    setBrief({ ...brief, [field]: value });
  }

  if (step === "input") {
    return (
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink">Who are you looking for?</h1>
        <p className="mt-1.5 text-ink/55">Describe the role in plain language. The AI Recruiter turns it into a structured brief.</p>

        <div className="card mt-6 p-5">
          <textarea
            className="input min-h-[150px] resize-none text-[15px] leading-relaxed"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder='e.g. "I need a chef with 5 years experience in Italian cuisine, fluent English…"'
          />
          <div className="mt-4 flex items-center justify-end">
            <button className="btn-primary" disabled={loading || raw.trim().length < 10} onClick={analyze}>
              {loading ? <span className="inline-flex items-center gap-2"><Spinner /> Thinking like a recruiter…</span> : "Build brief with AI"}
            </button>
          </div>
          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/35">Try an example</p>
          <div className="mt-2 flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setRaw(ex)} className="rounded-xl border border-black/[0.07] bg-white px-4 py-2.5 text-left text-sm text-ink/70 transition hover:border-black/15 hover:text-ink">
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink">Review your hiring brief</h1>
        <p className="mt-1.5 text-ink/55">The AI structured your request — edit anything before you search.</p>
      </div>

      <div className="card-p space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-brand"><SparkDot /> Drafted by AI Recruiter</div>
        <Text label="Job title" value={brief?.title} onChange={(v) => patch("title", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Role category" value={brief?.role_category} onChange={(v) => patch("role_category", v)} />
          <Text label="Min years experience" value={String(brief?.min_years_experience ?? 0)} onChange={(v) => patch("min_years_experience", Number(v))} />
          <Text label="Location" value={brief?.location} onChange={(v) => patch("location", v)} />
          <Text label="Max salary (QAR)" value={brief?.salary_max ? String(brief.salary_max) : ""} onChange={(v) => patch("salary_max", v ? Number(v) : null)} />
        </div>
        <ListField label="Required skills" value={brief?.required_skills} onChange={(v) => patch("required_skills", v)} />
        <ListField label="Languages" value={brief?.languages} onChange={(v) => patch("languages", v)} />
        <ListField label="Industries" value={brief?.industries} onChange={(v) => patch("industries", v)} />
        <ListField label="Certifications" value={brief?.certifications} onChange={(v) => patch("certifications", v)} />
      </div>

      {brief && brief.follow_up_questions.length > 0 && (
        <div className="rounded-2xl border border-brand/15 bg-brand-light/50 p-5">
          <h3 className="text-sm font-semibold text-ink">A recruiter would also ask</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-ink/70">
            {brief.follow_up_questions.map((q) => (
              <li key={q} className="flex gap-2"><span className="text-brand">•</span> {q}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink/40">Answer these by editing the fields above for better matches.</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button className="btn-ghost" onClick={() => setStep("input")}>Back</button>
        <button className="btn-primary" disabled={loading} onClick={save}>
          {loading ? "Saving…" : "Approve & find candidates"}
        </button>
      </div>
    </div>
  );
}

function Text({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ListField({ label, value, onChange }: { label: string; value?: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className="label">{label} <span className="text-ink/35">(comma separated)</span></label>
      <input className="input" value={(value || []).join(", ")} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
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
