"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { HiringBrief } from "@/lib/types";

/** Persist the reviewed hiring brief and go to its results page. */
export async function createHiringRequest(payload: { brief: HiringBrief; raw: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const b = payload.brief;
  const { data, error } = await supabase
    .from("hiring_requests")
    .insert({
      employer_id: user.id,
      title: b.title,
      role_category: b.role_category,
      description_raw: payload.raw,
      required_skills: b.required_skills,
      nice_to_have_skills: b.nice_to_have_skills,
      min_years_experience: b.min_years_experience,
      industries: b.industries,
      languages: b.languages,
      certifications: b.certifications,
      location: b.location,
      salary_min: b.salary_min,
      salary_max: b.salary_max,
      currency: b.currency,
      noc_required: b.noc_required,
      job_type: b.job_type,
      start_date: b.start_date,
      status: "open",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("createHiringRequest failed", error);
    redirect(`/employer/new?error=${encodeURIComponent(error?.message || "Could not save")}`);
  }

  redirect(`/employer/requests/${data.id}`);
}
