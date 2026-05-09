import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import {
  getPublishedLabs,
  DOMAIN_META,
  DIFFICULTY_META,
} from "@/data/labs";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Labs — NEETlab",
  description:
    "Interactive 3D chemistry labs for NEET aspirants. Explore orbitals, molecules, mechanisms, and more.",
};

export default async function LabsCatalog() {
  const labs = getPublishedLabs();

  // Check auth so we can adapt card UX for logged-out users
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5efe6]">
      {/* Top nav */}
      <SiteNav />

      {/* Page header */}
      <header className="px-6 pt-16 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            All Labs
          </h1>
          <p className="text-lg text-[#a8a297] max-w-2xl">
            Interactive chemistry, built for NEET. Pick a lab and start exploring.
            New labs added regularly — building in public.
          </p>
          {!isLoggedIn && (
            <p className="text-sm text-[#5a5750] mt-4 font-mono">
              <Link
                href="/login"
                className="text-[#E8550A] hover:underline"
              >
                Log in
              </Link>{" "}
              or{" "}
              <Link
                href="/signup"
                className="text-[#E8550A] hover:underline"
              >
                sign up free
              </Link>{" "}
              to open any lab — takes 10 seconds.
            </p>
          )}
        </div>
      </header>

      {/* Labs grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {labs.map((lab) => {
            const domainMeta = DOMAIN_META[lab.domain];
            const diffMeta = DIFFICULTY_META[lab.difficulty];
            // Logged-out users go to login first; logged-in users go straight to the lab
            const href = isLoggedIn
              ? `/labs/${lab.slug}`
              : `/login?next=/labs/${lab.slug}`;
            return (
              <Link
                key={lab.slug}
                href={href}
                className="group block p-6 rounded-2xl border border-[#1a1a25] bg-[#0f0f17] hover:border-[#E8550A]/40 hover:bg-[#13131c] transition-all"
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider"
                    style={{
                      backgroundColor: `${domainMeta.color}1a`,
                      color: domainMeta.color,
                    }}
                  >
                    {domainMeta.label}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider"
                    style={{
                      backgroundColor: `${diffMeta.color}1a`,
                      color: diffMeta.color,
                    }}
                  >
                    {diffMeta.label}
                  </span>
                  {lab.is3D && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#1a1a25] text-[#a8a297]">
                      3D
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:text-[#E8550A] transition-colors">
                  {lab.shortTitle}
                </h2>

                {/* Chapter */}
                <p className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
                  {lab.chapter}
                </p>

                {/* Description */}
                <p className="text-sm text-[#a8a297] leading-relaxed mb-4 line-clamp-3">
                  {lab.description}
                </p>

                {/* Footer — adapts to login state */}
                <div className="flex items-center justify-between pt-4 border-t border-[#1a1a25]">
                  <span className="text-xs font-mono text-[#5a5750]">
                    NEET: {lab.weightage} Q
                  </span>
                  {isLoggedIn ? (
                    <span className="text-xs font-mono text-[#a8a297] group-hover:text-[#E8550A] transition-colors">
                      Open lab →
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-[#5a5750] group-hover:text-[#a8a297] transition-colors inline-flex items-center gap-1.5">
                      <LockIconSm />
                      Log in to open
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#1a1a25] text-center text-xs text-[#5a5750]">
        Built by Animesh Singh ·{" "}
        <span className="text-[#a8a297]">@neetyaari</span>
      </footer>
    </main>
  );
}

// Small lock icon for the catalog footer hint
function LockIconSm() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}