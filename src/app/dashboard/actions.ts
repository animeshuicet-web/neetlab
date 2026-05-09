"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  // Get current user — required for the update
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Pull form values
  const name = (formData.get("name") as string)?.trim();
  const targetYear = formData.get("target_year") as string;
  const currentClass = formData.get("current_class") as string;

  // Build update payload — only include filled-in values
  const updates: Record<string, string | null> = {};
  if (name) updates.name = name;
  if (targetYear) updates.target_year = targetYear;
  if (currentClass) updates.current_class = currentClass;
  updates.updated_at = new Date().toISOString();

  // Update the profiles row
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  // Refresh the dashboard page so it shows new values
  revalidatePath("/dashboard");
  return { success: true };
}