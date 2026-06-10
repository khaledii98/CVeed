import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { devLogin } from "./actions";

/**
 * TESTING-ONLY entry. Only renders when DEV_BYPASS=1 is set in the environment.
 * Lets you jump into the app as a demo user without signing up. Not linked
 * anywhere public. Remove (or unset DEV_BYPASS) before launch.
 */
export default function DevLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  if (process.env.DEV_BYPASS === "0") notFound();

  return (
    <div className="container-x flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="w-full max-w-[400px] text-center">
        <div className="mb-6 flex justify-center">
          <Logo height={28} />
        </div>
        <div className="card-p">
          <span className="chip">Testing mode</span>
          <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-ink">Jump straight in</h1>
          <p className="mt-1.5 text-sm text-ink/55">Enter the app as a demo user — no sign-up needed.</p>

          {searchParams.error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{searchParams.error}</p>
          )}

          <div className="mt-6 space-y-2.5">
            <form action={devLogin.bind(null, "employer")}>
              <button className="btn-primary w-full">Enter as Employer →</button>
            </form>
            <form action={devLogin.bind(null, "candidate")}>
              <button className="btn-dark w-full">Enter as Candidate →</button>
            </form>
            <form action={devLogin.bind(null, "admin")}>
              <button className="btn-ghost w-full">Enter as Admin →</button>
            </form>
          </div>
        </div>
        <p className="mt-5 text-xs text-ink/40">This page is hidden in production and only appears when testing.</p>
      </div>
    </div>
  );
}
