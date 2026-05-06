import { supabase } from "@/lib/supabase";

export default async function Home() {
  // Sanity check — confirms Supabase client initializes without errors
  

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5efe6] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo / Brand mark */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-[#E8550A] flex items-center justify-center text-2xl font-bold text-[#0a0a0f]">
          N
        </div>
        <span className="font-mono text-sm tracking-widest text-[#a8a297] uppercase">
          NEET • Lab
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-bold text-center max-w-3xl leading-tight tracking-tight">
        Chemistry you can{" "}
        <span className="text-[#E8550A]">touch</span>,{" "}
        <span className="text-[#4ECDC4]">rotate</span>, and{" "}
        <span className="text-[#FFD93D]">understand</span>.
      </h1>

      {/* Subhead */}
      <p className="mt-6 text-lg md:text-xl text-[#a8a297] text-center max-w-2xl leading-relaxed">
        India&apos;s first interactive 3D chemistry platform built for NEET aspirants. Stop memorizing. Start exploring.
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button className="px-8 py-3.5 rounded-full bg-[#E8550A] text-[#0a0a0f] font-semibold hover:bg-[#ff6b1f] transition-colors">
          Explore Labs (Free)
        </button>
        <button className="px-8 py-3.5 rounded-full border border-[#2a2a35] text-[#f5efe6] font-medium hover:border-[#E8550A] hover:text-[#E8550A] transition-colors">
          See How It Works
        </button>
      </div>

      {/* Status badge */}
      <div className="mt-16 px-4 py-2 rounded-full border border-[#2a2a35] flex items-center gap-2 text-sm text-[#a8a297]">
        <span className="h-2 w-2 rounded-full bg-[#4ECDC4] animate-pulse"></span>
        <span>Building in public — first 10 labs launching in 12 weeks</span>
      </div>

      

      {/* Footer */}
      <footer className="mt-24 text-xs text-[#5a5750] text-center">
        Built by Animesh Singh · Lucknow ·{" "}
        <span className="text-[#a8a297]">@neetyaari</span>
      </footer>
    </main>
  );
}