import Link from "next/link";
import { signUp } from "./actions";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { role?: string; error?: string };
}) {
  const role = searchParams.role === "employer" ? "employer" : "candidate";

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">
          {role === "employer" ? "Find talent with AI." : "Build your profile once. Get discovered."}
        </p>

        {searchParams.error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
        )}

        <form action={signUp} className="mt-6 space-y-4">
          <input type="hidden" name="role" value={role} />

          <div className="flex gap-2">
            <Link
              href="/signup?role=candidate"
              className={`flex-1 rounded-lg border px-3 py-2 text-center text-sm ${role === "candidate" ? "border-brand bg-brand-light text-brand-dark" : "border-slate-300 text-slate-600"}`}
            >
              I&apos;m a candidate
            </Link>
            <Link
              href="/signup?role=employer"
              className={`flex-1 rounded-lg border px-3 py-2 text-center text-sm ${role === "employer" ? "border-brand bg-brand-light text-brand-dark" : "border-slate-300 text-slate-600"}`}
            >
              I&apos;m hiring
            </Link>
          </div>

          <div>
            <label className="label">{role === "employer" ? "Contact person name" : "Full name"}</label>
            <input name="full_name" required className="input" placeholder="e.g. Sara Ahmed" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" required minLength={6} className="input" placeholder="At least 6 characters" />
          </div>

          <button type="submit" className="btn-primary w-full">Create account</button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-brand">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
