"use client";

import Link from "next/link";
import ProfileForm from "./ProfileForm";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  target_year: string | null;
  current_class: string | null;
  role: string;
  created_at: string;
};

type SavedLab = {
  slug: string;
  title: string;
  shortTitle: string;
  chapter: string;
  domain: "physical" | "inorganic" | "organic";
  difficulty: "easy" | "medium" | "hard";
  weightage: string;
  description: string;
  tags: string[];
  is3D: boolean;
  published: boolean;
  savedAt?: string;
};

type Stats = {
  savedCount: number;
  daysOnPlatform: number;
  targetYear: string | null;
};

const domainColors: Record<SavedLab["domain"], string> = {
  physical: "bg-[#E8550A]/15 text-[#E8550A] border-[#E8550A]/30",
  inorganic: "bg-[#4ECDC4]/15 text-[#4ECDC4] border-[#4ECDC4]/30",
  organic: "bg-[#FFD93D]/15 text-[#FFD93D] border-[#FFD93D]/30",
};

const difficultyDots: Record<SavedLab["difficulty"], string> = {
  easy: "●○○",
  medium: "●●○",
  hard: "●●●",
};

export default function DashboardClient({
  profile,
  savedLabs,
  stats,
}: {
  profile: Profile;
  savedLabs: SavedLab[];
  stats: Stats;
}) {
  const firstName =
    profile.name?.split(" ")[0] || profile.email.split("@")[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5efe6]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a8a297]">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Hey, {firstName} ⬡
          </h1>
          <p className="mt-2 text-sm text-[#a8a297]">
            Your saved labs, profile, and progress.
          </p>
        </header>

        {/* Stats cards */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Labs saved"
            value={stats.savedCount.toString()}
            accent="#E8550A"
          />
          <StatCard
            label="Days on NEETlab"
            value={stats.daysOnPlatform.toString()}
            accent="#4ECDC4"
          />
          <StatCard
            label="Target NEET"
            value={stats.targetYear ?? "—"}
            accent="#FFD93D"
            hint={stats.targetYear ? null : "Set in profile below"}
          />
        </section>

        {/* Profile section */}
        <section className="mb-10">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#a8a297]">
            Profile
          </h2>
          <div className="rounded-2xl border border-[#1a1a25] bg-[#0f0f17] p-5 sm:p-6">
            <ProfileForm profile={profile} />
          </div>
        </section>

        {/* Saved labs section */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#a8a297]">
              Saved labs
            </h2>
            <Link
              href="/labs"
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8550A] hover:underline"
            >
              Browse all →
            </Link>
          </div>

          {savedLabs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {savedLabs.map((lab) => (
                <Link
                  key={lab.slug}
                  href={`/labs/${lab.slug}`}
                  className="group rounded-2xl border border-[#1a1a25] bg-[#0f0f17] p-5 transition hover:border-[#E8550A]/40 hover:bg-[#13131c]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${domainColors[lab.domain]}`}
                    >
                      {lab.domain}
                    </span>
                    {lab.is3D && (
                      <span className="rounded-full border border-[#1a1a25] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#a8a297]">
                        3D
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[10px] tracking-widest text-[#5a5750]">
                      {difficultyDots[lab.difficulty]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight text-[#f5efe6] group-hover:text-[#E8550A]">
                    {lab.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#a8a297]">
                    {lab.chapter}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-[#a8a297]">
                    {lab.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: string;
  accent: string;
  hint?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-[#1a1a25] bg-[#0f0f17] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a8a297]">
        {label}
      </p>
      <p
        className="mt-3 text-3xl font-black tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] text-[#5a5750]">{hint}</p>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#1a1a25] bg-[#0f0f17]/50 p-10 text-center">
      <p className="font-mono text-3xl">⬡</p>
      <p className="mt-3 text-sm text-[#f5efe6]">
        No saved labs yet.
      </p>
      <p className="mt-1 text-xs text-[#a8a297]">
        Save a lab to revisit it from here anytime.
      </p>
      <Link
        href="/labs"
        className="mt-4 inline-block rounded-full border border-[#E8550A]/40 bg-[#E8550A]/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#E8550A] transition hover:bg-[#E8550A]/20"
      >
        Browse labs →
      </Link>
    </div>
  );
}