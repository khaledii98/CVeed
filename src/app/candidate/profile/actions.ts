"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OpenToOpportunities } from "@/lib/types";

/** Update the editable parts of the living career profile. */
export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const str = (k: string) => {
    const v = formData.get(k);
    return v === null || v === "" ? null : String(v);
  };
  const num = (k: string) => {
    const v = formData.get(k);
    return v === null || v === "" ? null : Number(v);
  };
  const list = (k: string) =>
    String(formData.get(k) || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  await supabase
    .from("candidates")
    .update({
      open_to_opportunities: formData.get("open_to_opportunities") as OpenToOpportunities,
      current_title: str("current_title"),
      expected_salary_max: num("expected_salary_max"),
      availability: str("availability"),
      noc_status: (str("noc_status") as "yes" | "no" | "unknown") || "unknown",
      preferred_job_type: str("preferred_job_type"),
      skills: list("skills"),
      languages: list("languages"),
      industries: list("industries"),
      preferred_locations: list("preferred_locations"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  revalidatePath("/candidate/profile");
}
