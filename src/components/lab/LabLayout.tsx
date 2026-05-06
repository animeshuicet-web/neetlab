import Link from "next/link";
import { Lab, DOMAIN_META, DIFFICULTY_META } from "@/data/labs";

interface LabLayoutProps {
  lab: Lab;
  children: React.ReactNode;
}

export default function LabLayout({ lab, children }: LabLayoutProps) {
  const domainMeta = DOMAIN_META[lab.domain];
  const diffMeta = DIFFICULTY_META[lab.difficulty];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5efe6]">
      {/* Top nav */}
      <nav className="px-6 py-5 border-b border-[#1a1a25]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-lg bg-[#E8550A] flex items-center justify-center text-base font-bold text-[#0a0a0f] group-hover:scale-110 transition-transform">
              N
            </div>
            <span className="font-mono text-xs tracking-widest text-[#a8a297] uppercase">
              NEET • Lab
            </span>
          </Link>
          <Link
            href="/labs"
            className="text-sm text-[#a8a297] hover:text-[#E8550A] transition-colors"
          >
            ← All labs
          </Link>
        </div>
      </nav>

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
          <p className="text-base md:text-lg text-[#a8a297] max-w-3xl leading-relaxed">
            {lab.description}
          </p>
        </div>
      </header>

      {/* Lab content (children) */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#1a1a25] text-center text-xs text-[#5a5750]">
        Built by Animesh Singh · Allen Career Institute, Lucknow ·{" "}
        <span className="text-[#a8a297]">@neetyaari</span>
      </footer>
    </main>
  );
}