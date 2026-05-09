import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { labs as allLabs } from "@/data/labs";

export const metadata = {
  title: "Dashboard · NEETlab",
  description: "Your saved labs, profile, and progress on NEETlab.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, target_year, current_class, role, created_at")
    .eq("id", user.id)
    .single();

  const { data: savedRows } = await supabase
    .from("saved_labs")
    .select("lab_slug, saved_at")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  const savedSlugs = (savedRows ?? []).map((r) => r.lab_slug);

  const savedLabs = savedSlugs
    .map((slug) => {
      const lab = allLabs.find((l) => l.slug === slug);
      if (!lab) return null;
      const savedAt = savedRows?.find((r) => r.lab_slug === slug)?.saved_at;
      return { ...lab, savedAt };
    })
    .filter(Boolean) as ((typeof allLabs)[number] & { savedAt?: string })[];

  const createdAt = profile?.created_at
    ? new Date(profile.created_at)
    : new Date();
  const daysOnPlatform = Math.max(
    1,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  const safeProfile = profile ?? {
    id: user.id,
    name: "",
    email: user.email ?? "",
    target_year: null,
    current_class: null,
    role: "student",
    created_at: new Date().toISOString(),
  };

  const targetYear = profile?.target_year ?? null;

  return (
    <DashboardClient
      profile={safeProfile}
      savedLabs={savedLabs}
      stats={{
        savedCount: savedLabs.length,
        daysOnPlatform: daysOnPlatform,
        targetYear: targetYear,
      }}
    />
  );
}