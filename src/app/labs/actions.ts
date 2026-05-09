"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

/**
 * Toggle a lab's saved state for the current user.
 * - If the row exists in saved_labs → delete it (unsave)
 * - If it doesn't → insert it (save)
 *
 * Returns { saved: true } if the lab is now saved,
 *         { saved: false } if it was just unsaved,
 *         { error: string } on any failure.
 */
export async function toggleSaveLab(slug: string) {
  const supabase = await createClient();

  // Must be logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Validate slug — defensive, since this comes from the client
  if (!slug || typeof slug !== "string" || slug.length > 100) {
    return { error: "Invalid lab" };
  }

  // Is this lab already saved by this user?
  const { data: existing, error: lookupError } = await supabase
    .from("saved_labs")
    .select("id")
    .eq("user_id", user.id)
    .eq("lab_slug", slug)
    .maybeSingle();

  if (lookupError) {
    return { error: lookupError.message };
  }

  if (existing) {
    // Already saved → unsave (delete the row)
    const { error: deleteError } = await supabase
      .from("saved_labs")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    // Log analytics event (best-effort, ignore failures)
    await supabase.from("events").insert({
      user_id: user.id,
      event_type: "lab_unsave",
      lab_slug: slug,
    });

    revalidatePath(`/labs/${slug}`);
    revalidatePath("/dashboard");
    return { saved: false };
  } else {
    // Not saved → insert
    const { error: insertError } = await supabase
      .from("saved_labs")
      .insert({ user_id: user.id, lab_slug: slug });

    if (insertError) {
      return { error: insertError.message };
    }

    // Log analytics event
    await supabase.from("events").insert({
      user_id: user.id,
      event_type: "lab_save",
      lab_slug: slug,
    });

    revalidatePath(`/labs/${slug}`);
    revalidatePath("/dashboard");
    return { saved: true };
  }
}