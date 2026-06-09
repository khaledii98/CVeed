import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function EmployerHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: employer } = await supabase.from("employers").select("company_name").eq("id", user.id).single();
  if (!employer) redirect("/employer/setup");

  const { data: requests } = await supabase
    .from("hiring_requests")
    .select("id, title, role_category, status, created_at")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{employer.company_name || "Your hiring"}</h1>
          <p className="text-sm text-slate-500">Your hiring requests</p>
        </div>
        <Link href="/employer/new" className="btn-primary">+ New hiring request</Link>
      </div>

      {(!requests || requests.length === 0) ? (
        <div className="card text-center">
          <p className="text-slate-600">No hiring requests yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Describe who you need in plain language and let the AI Recruiter do the rest.
          </p>
          <Link href="/employer/new" className="btn-primary mt-4 inline-flex">Create your first request</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Link key={r.id} href={`/employer/requests/${r.id}`} className="card flex items-center justify-between hover:border-brand">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-slate-500">{r.role_category} · {new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <span className="chip">{r.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
