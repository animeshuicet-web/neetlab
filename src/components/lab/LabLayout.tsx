import { redirect } from "next/navigation";
import { Lab, DOMAIN_META, DIFFICULTY_META } from "@/data/labs";
import SiteNav from "@/components/nav/SiteNav";
import SaveLabButton from "@/components/lab/SaveLabButton";
import { createClient } from "@/lib/supabase-server";

interface LabLayoutProps {
  lab: Lab;
  children: React.ReactNode;
}

export default async function LabLayout({ lab, children }: LabLayoutProps) {
  const domainMeta = DOMAIN_META[lab.domain];
  const diffMeta = DIFFICULTY_META[lab.difficulty];

  // Server-fetch auth + saved state so the button knows what to render
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lab gating — must be logged in to view individual lab pages.
  // Catalog at /labs stays public for SEO; this only gates /labs/[slug].
  if (!user) {
    redirect(`/login?next=/labs/${lab.slug}`);
  }

  // User is guaranteed here — fetch saved state
  const { data: existing } = await supabase
    .from("saved_labs")
    .select("id")
    .eq("user_id", user.id)
    .eq("lab_slug", lab.slug)
    .maybeSingle();
  const initialSaved = !!existing;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5efe6]">
      {/* Top nav */}
      <SiteNav />

      {/* Lab header */}
      <header className="px-6 pt-10 pb-6 border-b border-[#1a1a25]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider"
              style={{
                backgroundColor: `${domainMeta.color}1a`,
                color: domainMeta.color,
              }}
            >
              {domainMeta.label}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider"
              style={{
                backgroundColor: `${diffMeta.color}1a`,
                color: diffMeta.color,
              }}
            >
              {diffMeta.label}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#1a1a25] text-[#a8a297]">
              NEET: {lab.weightage} Q
            </span>
            {lab.is3D && (
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#1a1a25] text-[#a8a297]">
                3D
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            {lab.title}
          </h1>
          <p className="text-sm md:text-base text-[#a8a297] mb-2">
            {lab.chapter}
          </p>
          <p className="text-base md:text-lg text-[#a8a297] max-w-3xl leading-relaxed mb-5">
            {lab.description}
          </p>

          {/* Save lab button — user is always logged in here (gated above) */}
          <SaveLabButton
            slug={lab.slug}
            initialSaved={initialSaved}
            isLoggedIn={true}
          />
        </div>
      </header>

      {/* Lab content (children) */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#1a1a25] text-center text-xs text-[#5a5750]">
        Built by Animesh Singh ·{" "}
        <span className="text-[#a8a297]">@neetyaari</span>
      </footer>
    </main>
  );
}