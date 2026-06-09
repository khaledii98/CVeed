"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Match = Record<string, any>;

const OPEN_LABELS: Record<string, string> = {
  not_looking: "Not Looking",
  slightly_open: "Slightly Open",
  open_to_discussions: "Open To Discussions",
  actively_exploring: "Actively Exploring",
  available_immediately: "Available Immediately",
};

export default function Results({ requestId, initialMatches }: { requestId: string; initialMatches: Match[] }) {
  const router = useRouter();
  const [matches] = useState<Match[]>(initialMatches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runMatching() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Matching failed.");
      router.refresh(); // reload the server component to show saved matches
    } catch (e) {
      setError(e instanceof Error ? e.message : "Matching failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ranked candidates {matches.length > 0 && `(${matches.length})`}</h2>
        <button className="btn-primary" onClick={runMatching} disabled={loading}>
          {loading ? "AI is screening candidates…" : matches.length ? "Re-run matching" : "Find & rank candidates"}
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {matches.length === 0 && !loading && (
        <div className="card text-sm text-slate-600">
          No matches yet. Click <strong>Find &amp; rank candidates</strong> — the AI will score every available
          candidate, then explain the best fits.
        </div>
      )}

      {matches.map((m, i) => {
        const c = m.candidates || {};
        const name = c.profiles?.full_name || "Candidate";
        return (
          <div key={m.id || i} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-slate-500">{c.current_title}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand">{Math.round(m.score)}%</div>
                <div className="text-xs text-slate-400">match</div>
              </div>
            </div>

            {m.summary && <p className="mt-3 text-sm text-slate-700">{m.summary}</p>}

            <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
              <Block title="Strengths" items={m.strengths} tone="green" />
              <Block title="Missing / gaps" items={m.gaps} tone="amber" />
              <Block title="Risks" items={m.risks} tone="red" />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>💰 {c.expected_salary_max ? `${c.expected_salary_max} QAR` : "Salary n/a"}</span>
              <span>📅 {c.availability || "Availability n/a"}</span>
              <span>🪪 NOC: {c.noc_status || "unknown"}</span>
              <span>🔎 {OPEN_LABELS[c.open_to_opportunities] || c.open_to_opportunities}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Block({ title, items, tone }: { title: string; items?: string[]; tone: "green" | "amber" | "red" }) {
  const colors = {
    green: "text-green-700",
    amber: "text-amber-700",
    red: "text-red-700",
  }[tone];
  return (
    <div>
      <p className={`font-medium ${colors}`}>{title}</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
        {(items || []).length === 0 ? <li className="list-none text-slate-400">—</li> : items!.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}
