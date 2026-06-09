"use client";

import { useState } from "react";
import type { HiringBrief } from "@/lib/types";
import { createHiringRequest } from "./actions";

const SAMPLE = "I need a sales manager with automotive experience and fluent Arabic, based in Doha. Budget around 15,000 QAR. Should be able to start within a month.";

export default function RecruiterWizard() {
  const [step, setStep] = useState<"input" | "review">("input");
  const [raw, setRaw] = useState("");
  const [brief, setBrief] = useState<HiringBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="card space-y-4">
        <div>
          <label className="label">Who are you looking for?</label>
          <textarea
            className="input min-h-[140px]"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder='e.g. "I need a chef with 5 years experience in Italian cuisine, fluent English…"'
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="button" className="text-xs text-brand underline" onClick={() => setRaw(SAMPLE)}>
            Use an example
          </button>
          <button className="btn-primary" disabled={loading || raw.trim().length < 10} onClick={analyze}>
            {loading ? "Thinking like a recruiter…" : "Build brief with AI"}
          </button>
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
    );
  }

  // review
  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="font-semibold">Review &amp; edit the brief</h2>

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
        <div className="card">
          <h3 className="font-semibold">The recruiter would also ask</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {brief.follow_up_questions.map((q) => <li key={q}>{q}</li>)}
          </ul>
          <p className="mt-2 text-xs text-slate-400">Answer these by editing the fields above for better matches.</p>
        </div>
      )}

      <div className="flex justify-between">
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
      <label className="label">{label} <span className="text-slate-400">(comma separated)</span></label>
      <input
        className="input"
        value={(value || []).join(", ")}
        onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
      />
    </div>
  );
}
