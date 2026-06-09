"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveEmployer(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const s = (k: string) => String(formData.get(k) || "") || null;

  await supabase.from("employers").upsert({
    id: user.id,
    company_name: s("company_name"),
    industry: s("industry"),
    company_size: s("company_size"),
    contact_person: s("contact_person"),
    phone: s("phone"),
    location: s("location"),
  });

  redirect("/employer");
}
