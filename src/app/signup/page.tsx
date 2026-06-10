import Link from "next/link";
import { Logo } from "@/components/Logo";
import { signUp } from "./actions";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { role?: string; error?: string };
}) {
  const role = searchParams.role === "employer" ? "employer" : "candidate";

  return (
    <div className="container-x flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="w-full max-w-[400px] animate-fade-up">
        <div className="mb-6 flex justify-center">
          <Logo height={28} />
        </div>

        <div className="card-p">
          <h1 className="text-center text-[22px] font-semibold tracking-[-0.02em] text-ink">
            {role === "employer" ? "Start hiring with CVeed" : "Create your profile"}
          </h1>
          <p className="mt-1.5 text-center text-sm text-ink/55">
            {role === "employer"
              ? "Describe a role and meet your shortlist."
              : "Build it once and get discovered."}
          </p>

          {/* Role segmented control */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-black/[0.04] p-1">
            <RoleTab href="/signup?role=candidate" active={role === "candidate"}>Find a job</RoleTab>
            <RoleTab href="/signup?role=employer" active={role === "employer"}>I&apos;m hiring</RoleTab>
          </div>

          {searchParams.error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{searchParams.error}</p>
          )}

          <form action={signUp} className="mt-5 space-y-4">
            <input type="hidden" name="role" value={role} />
            <div>
              <label className="label">{role === "employer" ? "Contact person" : "Full name"}</label>
              <input name="full_name" required className="input" placeholder="e.g. Sara Ahmed" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" required className="input" placeholder="you@company.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" required minLength={6} className="input" placeholder="At least 6 characters" />
            </div>
            <button type="submit" className="btn-primary w-full">Create account</button>
          </form>

          <p className="mt-5 text-center text-xs text-ink/40">
            By continuing you agree to CVeed&apos;s Terms &amp; Privacy Policy.
          </p>
        </div>

        <p className="mt-5 text-center text-sm text-ink/55">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand hover:text-brand-dark">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function RoleTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-lg py-2 text-center text-sm font-medium transition ${
        active ? "bg-white text-ink shadow-soft" : "text-ink/50 hover:text-ink/80"
      }`}
    >
      {children}
    </Link>
  );
}
