import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Results from "./Results";

export default async function RequestPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS ensures the employer only sees their own request.
  const { data: hr } = await supabase.from("hiring_requests").select("*").eq("id", params.id).single();
  if (!hr) notFound();

  // Load any existing matches with candidate info (admin client: reads across users,
  // but we've already verified this employer owns the request above).
  const admin = createAdminClient();
  const { data: matches } = await admin
    .from("matches")
    .select("*, candidates(current_title, expected_salary_max, availability, noc_status, open_to_opportunities, profiles(full_name))")
    .eq("hiring_request_id", params.id)
    .order("score", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{hr.title}</h1>
        <p className="text-sm text-slate-500">{hr.role_category} · {hr.location}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(hr.required_skills || []).map((s: string) => <span key={s} className="chip">{s}</span>)}
        </div>
      </div>

      <Results requestId={params.id} initialMatches={matches || []} />
    </div>
  );
}
