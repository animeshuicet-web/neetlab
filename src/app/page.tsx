import { supabase } from "@/lib/supabase";
import BenzeneCanvas from "@/components/molecules/BenzeneCanvas";
import Link from "next/link";

export default async function Home() {
  // Keep Supabase imported so we know connection still works
  void supabase;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5efe6] flex flex-col items-center px-6 py-12">
     {/* Logo / Brand mark — wordmark with hexagon accent */}
      <div className="mb-10 flex flex-col items-center gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#f5efe6]">
            NEET<span className="text-[#E8550A]">lab</span>
          </span>
          <span className="text-2xl md:text-3xl text-[#E8550A] -translate-y-1">⬡</span>
        </div>
        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-[#5a5750]">
          interactive · 3D · chemistry
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-3xl leading-tight tracking-tight">
        Chemistry you can{" "}
        <span className="text-[#E8550A]">touch</span>,{" "}
        <span className="text-[#4ECDC4]">rotate</span>, and{" "}
        <span className="text-[#FFD93D]">understand</span>.
      </h1>

      {/* Subhead */}
      <p className="mt-6 text-base md:text-xl text-[#a8a297] text-center max-w-2xl leading-relaxed">
        India&apos;s first interactive 3D chemistry platform built for NEET aspirants. Stop memorizing. Start exploring.
      </p>

      {/* === The 3D molecule === */}
      <div className="mt-10 w-full max-w-lg aspect-square">
        <BenzeneCanvas />
        <p className="text-center text-xs text-[#a8a297] mt-2 font-mono">
          benzene (C₆H₆) · drag to rotate · toggle view above
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/labs"
          className="px-8 py-3.5 rounded-full bg-[#E8550A] text-[#0a0a0f] font-semibold hover:bg-[#ff6b1f] transition-colors text-center"
        >
          Explore Labs (Free)
        </Link>
        <Link
          href="/labs/methane"
          className="px-8 py-3.5 rounded-full border border-[#2a2a35] text-[#f5efe6] font-medium hover:border-[#E8550A] hover:text-[#E8550A] transition-colors text-center"
        >
          Try First Lab
        </Link>
      </div>

      {/* Status badge */}
      <div className="mt-12 px-4 py-2 rounded-full border border-[#2a2a35] flex items-center gap-2 text-sm text-[#a8a297]">
        <span className="h-2 w-2 rounded-full bg-[#4ECDC4] animate-pulse"></span>
        <span>Building in public — first 10 labs launching in 12 weeks</span>
      </div>

      {/* Footer */}
      <footer className="mt-20 mb-4 text-xs text-[#5a5750] text-center">
        Built by Animesh Singh · Allen Career Institute, Lucknow ·{" "}
        <span className="text-[#a8a297]">@neetyaari</span>
      </footer>
    </main>
  );
}