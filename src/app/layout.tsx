import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "CVeed — AI Talent Discovery",
  description: "The AI recruiter for SMEs. Candidates build a profile once; employers describe who they need; AI does the matching.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = data?.role ?? null;
  }

  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-brand">CVeed</Link>
            <nav className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  {role === "candidate" && <Link href="/candidate/profile" className="text-slate-600 hover:text-brand">My Profile</Link>}
                  {role === "employer" && <Link href="/employer" className="text-slate-600 hover:text-brand">My Hiring</Link>}
                  {role === "admin" && <Link href="/admin" className="text-slate-600 hover:text-brand">Admin</Link>}
                  <span className="hidden text-slate-400 sm:inline">{user.email}</span>
                  <form action={signOut}>
                    <button className="btn-ghost" type="submit">Sign out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-600 hover:text-brand">Sign in</Link>
                  <Link href="/signup" className="btn-primary">Get started</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-slate-400">
          CVeed · AI Talent Discovery for SMEs · Qatar &amp; GCC
        </footer>
      </body>
    </html>
  );
}
