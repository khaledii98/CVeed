import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TESTING ONLY — GET /dev-enter?as=employer|candidate|admin
 * Signs you straight into a demo account (no sign-up/login) and redirects into
 * the app. Disabled when DEV_BYPASS=0. Remove before launch.
 */
const DEMO = {
  employer: { email: "demo.employer@cveed.app", full_name: "Demo Employer", home: "/employer" },
  candidate: { email: "demo.candidate@cveed.app", full_name: "Demo Candidate", home: "/candidate/onboarding" },
  admin: { email: "demo.admin@cveed.app", full_name: "Demo Admin", home: "/admin" },
} as const;
const PASSWORD = "CveedDemo!2026";

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (process.env.DEV_BYPASS === "0") return NextResponse.redirect(new URL("/", url));

  const as = (url.searchParams.get("as") || "employer") as keyof typeof DEMO;
  const d = DEMO[as] ?? DEMO.employer;

  try {
    const admin = createAdminClient();

    // Ensure the demo user exists (ignore "already registered").
    await admin.auth.admin
      .createUser({
        email: d.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: d.full_name, role: as },
      })
      .catch(() => {});

    // Sign in — this sets the auth session cookies.
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: d.email, password: PASSWORD });
    if (error) {
      return NextResponse.redirect(new URL(`/?devError=${encodeURIComponent(error.message)}`, url));
    }

    // Make sure the profile row carries the right role, and seed a minimal
    // company so the employer lands on a usable dashboard.
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await admin.from("profiles").update({ role: as }).eq("id", user.id);
      if (as === "employer") {
        await admin.from("employers").upsert({ id: user.id, company_name: "Demo Company", industry: "General", location: "Doha" });
      }
    }

    return NextResponse.redirect(new URL(d.home, url));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Demo sign-in failed";
    return NextResponse.redirect(new URL(`/?devError=${encodeURIComponent(msg)}`, url));
  }
}
