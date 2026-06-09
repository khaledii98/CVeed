import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Logged-in users go straight to their home.
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (data?.role === "employer") redirect("/employer");
    if (data?.role === "admin") redirect("/admin");
    redirect("/candidate/profile");
  }

  return (
    <div className="space-y-12">
      <section className="text-center">
        <span className="chip">Qatar &amp; GCC · for SMEs</span>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          The AI recruiter that finds talent <span className="text-brand">for you</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Not a job board. Candidates build one living profile. Employers describe who they need in plain language.
          CVeed&apos;s AI reads, structures, and ranks — so hiring takes minutes, not weeks.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup?role=employer" className="btn-primary">I&apos;m hiring</Link>
          <Link href="/signup?role=candidate" className="btn-ghost">I&apos;m looking</Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          { t: "Upload once", d: "Candidates upload a CV. The CV Intelligence Agent extracts skills, experience, certifications and more — no long forms." },
          { t: "Describe the need", d: "Employers type “I need a sales manager with automotive experience and fluent Arabic.” The AI Recruiter turns it into a structured brief." },
          { t: "AI ranks everyone", d: "The Screening Agent scores every candidate with a match %, strengths, gaps and risks — and explains why." },
        ].map((f) => (
          <div key={f.t} className="card">
            <h3 className="font-semibold text-slate-900">{f.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
