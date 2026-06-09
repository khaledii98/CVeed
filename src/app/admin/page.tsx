import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") {
    return (
      <div className="card">
        <h1 className="text-xl font-bold">Admins only</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account is not an admin. To make yourself an admin, run this in the Supabase SQL Editor:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`update public.profiles set role = 'admin' where email = '${user.email}';`}
        </pre>
      </div>
    );
  }

  const admin = createAdminClient();
  const [{ count: candidates }, { count: employers }, { count: requests }, { count: matches }] = await Promise.all([
    admin.from("candidates").select("*", { count: "exact", head: true }),
    admin.from("employers").select("*", { count: "exact", head: true }),
    admin.from("hiring_requests").select("*", { count: "exact", head: true }),
    admin.from("matches").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentCandidates } = await admin
    .from("candidates")
    .select("id, current_title, open_to_opportunities, completeness, updated_at, profiles(full_name, email)")
    .order("updated_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Candidates" value={candidates ?? 0} />
        <Stat label="Employers" value={employers ?? 0} />
        <Stat label="Hiring requests" value={requests ?? 0} />
        <Stat label="Matches run" value={matches ?? 0} />
      </div>

      <div className="card">
        <h2 className="font-semibold">Recent candidates</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr><th className="py-2">Name</th><th>Title</th><th>Status</th><th>Complete</th></tr>
          </thead>
          <tbody>
            {(recentCandidates || []).map((c: any) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="py-2">{c.profiles?.full_name || c.profiles?.email || "—"}</td>
                <td>{c.current_title || "—"}</td>
                <td>{c.open_to_opportunities}</td>
                <td>{c.completeness ?? 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card text-center">
      <div className="text-3xl font-bold text-brand">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
