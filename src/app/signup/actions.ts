"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const full_name = String(formData.get("full_name"));
  const role = formData.get("role") === "employer" ? "employer" : "candidate";

  const supabase = createClient();

  // The DB trigger handle_new_user() reads these metadata fields to create the profile row.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role } },
  });

  if (error) {
    redirect(`/signup?role=${role}&error=${encodeURIComponent(error.message)}`);
  }

  // Send the new user to finish setup.
  redirect(role === "employer" ? "/employer/setup" : "/candidate/onboarding");
}
