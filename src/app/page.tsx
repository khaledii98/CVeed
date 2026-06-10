import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";

export default async function Home({ searchParams }: { searchParams: { devError?: string } }) {
  const supabase = createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (data?.role === "employer") redirect("/employer");
      if (data?.role === "admin") redirect("/admin");
      redirect("/candidate/profile");
    }
  } catch {
    // not configured — render the public landing
  }

  // TESTING: login is bypassed by default during this phase — the cards drop
  // you straight into the app with no sign-up/login. Set DEV_BYPASS=0 to turn
  // real auth back on (we'll do that before launch).
  const bypass = process.env.DEV_BYPASS !== "0";

  return (
    <section className="container-x flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center pb-24 text-center">
      <span className="pill animate-fade-up">AI Talent Discovery · Qatar &amp; GCC</span>

      <div className="mt-7 animate-fade-up [animation-delay:60ms]">
        <Logo variant="wordmark" height={52} />
      </div>

      <p className="mt-6 max-w-xl animate-fade-up text-[17px] leading-relaxed text-ink/60 [animation-delay:120ms]">
        CVeed uses AI to connect the right talent with the right opportunities — making hiring
        and career growth smarter, faster, and more efficient.
      </p>

      <p className="mt-9 animate-fade-up text-sm font-medium text-ink/40 [animation-delay:150ms]">
        Are you hiring, or looking for a job?
      </p>

      {searchParams.devError && (
        <p className="mt-6 max-w-md rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{searchParams.devError}</p>
      )}

      <div className="mt-5 grid w-full max-w-2xl animate-fade-up gap-4 [animation-delay:180ms] sm:grid-cols-2">
        <ChoiceCard
          href={bypass ? "/dev-enter?as=employer" : "/signup?role=employer"}
          title="I'm hiring"
          desc="Describe a role and get a ranked, explained shortlist."
          cta="Start hiring"
          icon={<BriefcaseIcon />}
          accent
        />
        <ChoiceCard
          href={bypass ? "/dev-enter?as=candidate" : "/signup?role=candidate"}
          title="I'm looking for a job"
          desc="Build your profile once and get discovered by employers."
          cta="Create profile"
          icon={<SparkIcon />}
        />
      </div>

      {bypass ? (
        <p className="mt-8 animate-fade-up text-sm text-ink/45 [animation-delay:240ms]">
          Testing mode — login is bypassed.
        </p>
      ) : (
        <p className="mt-8 animate-fade-up text-sm text-ink/45 [animation-delay:240ms]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand hover:text-brand-dark">Sign in</Link>
        </p>
      )}
    </section>
  );
}

function ChoiceCard({
  href, title, desc, cta, icon, accent = false,
}: {
  href: string;
  title: string; desc: string; cta: string; icon: React.ReactNode; accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card group flex w-full flex-col items-start p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${accent ? "bg-brand text-white" : "bg-brand-light text-brand"}`}>
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{desc}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand">
        {cta}
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="none">
          <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 3c.6 4 1.6 5 5.5 5.5C13.6 9 12.6 10 12 14c-.6-4-1.6-5-5.5-5.5C10.4 8 11.4 7 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18.5 14c.3 1.8.8 2.3 2.5 2.6-1.7.3-2.2.8-2.5 2.4-.3-1.6-.8-2.1-2.5-2.4 1.7-.3 2.2-.8 2.5-2.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
