import Link from "next/link";
import { Logo } from "@/components/Logo";
import { signIn } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="container-x flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="w-full max-w-[400px] animate-fade-up">
        <div className="mb-6 flex justify-center">
          <Logo height={28} />
        </div>

        <div className="card-p">
          <h1 className="text-center text-[22px] font-semibold tracking-[-0.02em] text-ink">Welcome back</h1>
          <p className="mt-1.5 text-center text-sm text-ink/55">Sign in to your CVeed account.</p>

          {searchParams.error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">{searchParams.error}</p>
          )}

          <form action={signIn} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" required className="input" placeholder="you@company.com" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
                <span className="mb-1.5 text-xs text-ink/40">Forgot?</span>
              </div>
              <input name="password" type="password" required className="input" placeholder="Your password" />
            </div>
            <button type="submit" className="btn-primary w-full">Sign in</button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-ink/55">
          New to CVeed?{" "}
          <Link href="/signup" className="font-medium text-brand hover:text-brand-dark">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
