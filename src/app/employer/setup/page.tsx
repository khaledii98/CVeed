import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveEmployer } from "./actions";

export default async function EmployerSetup() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: employer } = await supabase.from("employers").select("*").eq("id", user.id).single();
  const e = employer || {};

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Company profile</h1>
      <p className="mt-1 text-sm text-slate-600">Tell us about your company so we can tailor matches.</p>

      <form action={saveEmployer} className="card mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <F name="company_name" label="Company name" dv={e.company_name} required />
          <F name="industry" label="Industry" dv={e.industry} />
          <F name="company_size" label="Company size" dv={e.company_size} placeholder="e.g. 1-10, 11-50" />
          <F name="contact_person" label="Contact person" dv={e.contact_person} />
          <F name="phone" label="Phone" dv={e.phone} />
          <F name="location" label="Location" dv={e.location} placeholder="e.g. Doha, Qatar" />
        </div>
        <button type="submit" className="btn-primary">Save &amp; continue</button>
      </form>
    </div>
  );
}

function F({ name, label, dv, placeholder, required }: { name: string; label: string; dv?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input name={name} defaultValue={dv ?? ""} placeholder={placeholder} required={required} className="input" />
    </div>
  );
}
