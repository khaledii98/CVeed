"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Route to the right home based on role.
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  if (data?.role === "employer") redirect("/employer");
  if (data?.role === "admin") redirect("/admin");
  redirect("/candidate/profile");
}
