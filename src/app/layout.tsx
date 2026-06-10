import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { Logo } from "@/components/Logo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CVeed — AI Talent Discovery",
    template: "%s · CVeed",
  },
  description:
    "The AI recruiter for SMEs. Candidates build a profile once; employers describe who they need; AI does the matching.",
  applicationName: "CVeed",
  appleWebApp: { capable: true, title: "CVeed", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#6C3EF4",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  let user = null;
  let role: string | null = null;
  try {
    const res = await supabase.auth.getUser();
    user = res.data.user;
    if (user) {
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      role = data?.role ?? null;
    }
  } catch {
    // env not configured (e.g. preview render) — treat as logged out
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-canvas/80 backdrop-blur-xl">
          <div className="container-x flex h-16 items-center justify-between">
            <Link href="/" aria-label="CVeed home">
              <Logo />
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              {user ? (
                <>
                  {role === "candidate" && (
                    <Link href="/candidate/profile" className="rounded-lg px-3 py-2 text-ink/70 hover:text-ink">Profile</Link>
                  )}
                  {role === "employer" && (
                    <Link href="/employer" className="rounded-lg px-3 py-2 text-ink/70 hover:text-ink">Hiring</Link>
                  )}
                  {role === "admin" && (
                    <Link href="/admin" className="rounded-lg px-3 py-2 text-ink/70 hover:text-ink">Admin</Link>
                  )}
                  <form action={signOut}>
                    <button className="btn-ghost" type="submit">Sign out</button>
                  </form>
                </>
              ) : process.env.DEV_BYPASS === "1" ? (
                <span className="chip">Testing mode</span>
              ) : (
                <>
                  <Link href="/login" className="rounded-lg px-3 py-2 text-ink/70 hover:text-ink">Sign in</Link>
                  <Link href="/signup" className="btn-primary">Get started</Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t border-black/[0.06]">
          <div className="container-x flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
            <Logo />
            <p className="text-xs text-ink/40">© {new Date().getFullYear()} CVeed · AI Talent Discovery · Qatar &amp; GCC</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
