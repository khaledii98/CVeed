import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OPEN_TO_OPPORTUNITIES } from "@/lib/types";
import { updateProfile } from "./actions";

export default async function ProfilePage({ searchParams }: { searchParams: { welcome?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: candidate } = await supabase.from("candidates").select("*").eq("id", user.id).single();

  // No profile yet → send to onboarding.
  if (!candidate) redirect("/candidate/onboarding");

  const c = candidate;

  return (
    <div className="space-y-6">
      {searchParams.welcome && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          🎉 Your profile is live! Employers can now discover you based on your Open-To-Opportunities status.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{c.current_title || "Your profile"}</h1>
          <p className="text-sm text-slate-500">Profile completeness: {c.completeness ?? 0}%</p>
        </div>
        <Link href="/candidate/onboarding" className="btn-ghost">Re-upload CV</Link>
      </div>

      {c.summary && <p className="text-slate-700">{c.summary}</p>}

      <form action={updateProfile} className="card space-y-5">
        <div>
          <label className="label">Open to opportunities <span className="text-slate-400">(editable any time)</span></label>
          <select name="open_to_opportunities" defaultValue={c.open_to_opportunities} className="input">
            {OPEN_TO_OPPORTUNITIES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="current_title" label="Current title" defaultValue={c.current_title} />
          <Field name="expected_salary_max" label="Expected salary (max, QAR/month)" type="number" defaultValue={c.expected_salary_max} />
          <Field name="availability" label="Availability" defaultValue={c.availability} placeholder="e.g. Immediately, 1 month" />
          <div>
            <label className="label">NOC status</label>
            <select name="noc_status" defaultValue={c.noc_status || "unknown"} className="input">
              <option value="unknown">Not sure</option>
              <option value="yes">Have NOC</option>
              <option value="no">No NOC</option>
            </select>
          </div>
          <Field name="preferred_job_type" label="Preferred job type" defaultValue={c.preferred_job_type} placeholder="Full time" />
          <Field name="preferred_locations" label="Preferred locations (comma separated)" defaultValue={(c.preferred_locations || []).join(", ")} />
        </div>

        <Field name="skills" label="Skills (comma separated)" defaultValue={(c.skills || []).join(", ")} />
        <Field name="languages" label="Languages (comma separated)" defaultValue={(c.languages || []).join(", ")} />
        <Field name="industries" label="Industries (comma separated)" defaultValue={(c.industries || []).join(", ")} />

        <button type="submit" className="btn-primary">Save changes</button>
      </form>
    </div>
  );
}

function Field({
  name, label, defaultValue, type = "text", placeholder,
}: {
  name: string; label: string; defaultValue?: string | number | null; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} className="input" />
    </div>
  );
}
