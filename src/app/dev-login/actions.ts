"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * TESTING ONLY — signs you straight into a demo account, bypassing sign-up.
 * Gated by the DEV_BYPASS env flag (see dev-login/page.tsx). Remove before launch.
 */
const DEMO = {
  employer: { email: "demo.employer@cveed.app", full_name: "Demo Employer", home: "/employer" },
  candidate: { email: "demo.candidate@cveed.app", full_name: "Demo Candidate", home: "/candidate/profile" },
  admin: { email: "demo.admin@cveed.app", full_name: "Demo Admin", home: "/admin" },
} as const;

const PASSWORD = "CveedDemo!2026";

export async function devLogin(role: keyof typeof DEMO) {
  if (process.env.DEV_BYPASS === "0") redirect("/");

  const d = DEMO[role];
  const admin = createAdminClient();

  // Ensure the demo user exists (ignore "already exists").
  await admin.auth.admin
    .createUser({
      email: d.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: d.full_name, role },
    })
    .catch(() => {});

  // Sign in to set the session cookies.
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: d.email, password: PASSWORD });
  if (error) redirect(`/dev-login?error=${encodeURIComponent(error.message)}`);

  // Make sure the profile row carries the right role (in case it pre-existed).
  const { data: { user } } = await supabase.auth.getUser();
  if (user) await admin.from("profiles").update({ role }).eq("id", user.id);

  redirect(d.home);
}
