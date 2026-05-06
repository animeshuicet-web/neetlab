import LabLayout from "@/components/lab/LabLayout";
import MethaneCanvas from "@/components/molecules/MethaneCanvas";
import { getLabBySlug } from "@/data/labs";

export const metadata = {
  title: "Methane (CH₄) — NEETlab",
  description:
    "Explore the tetrahedral geometry of methane in 3D. NEETlab interactive chemistry.",
};

export default function MethanePage() {
  const lab = getLabBySlug("methane")!;

  return (
    <LabLayout lab={lab}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* The 3D canvas — takes 2/3 on desktop, full width on mobile */}
        <div className="lg:col-span-2">
          <div className="aspect-square w-full rounded-2xl border border-[#1a1a25] bg-[#0f0f17] overflow-hidden">
            <MethaneCanvas />
          </div>
          <p className="text-center text-xs text-[#5a5750] mt-3 font-mono">
            drag to rotate · pinch zoom is locked for clarity
          </p>
        </div>

        {/* Learning notes — takes 1/3 on desktop, below canvas on mobile */}
        <aside className="space-y-6">
          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
              What you&apos;re seeing
            </h3>
            <p className="text-sm text-[#f5efe6] leading-relaxed">
              Methane (CH₄) has one carbon atom bonded to four hydrogens. The
              four bonds spread out as far apart as possible, forming a
              tetrahedron. This is the geometry of every sp³-hybridized carbon
              you&apos;ll meet in NEET.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
              Key NEET facts
            </h3>
            <ul className="space-y-2.5 text-sm text-[#f5efe6]">
              <li className="flex gap-2">
                <span className="text-[#E8550A]">▸</span>
                <span>
                  Bond angle: <strong className="text-[#FFD93D]">109.5°</strong>{" "}
                  — the only geometry that puts 4 bonds farthest apart
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#E8550A]">▸</span>
                <span>
                  Hybridization: <strong className="text-[#FFD93D]">sp³</strong>{" "}
                  — one s + three p orbitals mix
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#E8550A]">▸</span>
                <span>
                  C-H bond length:{" "}
                  <strong className="text-[#FFD93D]">109 pm</strong>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#E8550A]">▸</span>
                <span>
                  Geometry name:{" "}
                  <strong className="text-[#FFD93D]">tetrahedral</strong>
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
              Memory trick
            </h3>
            <p className="text-sm text-[#4ECDC4] leading-relaxed font-medium">
              4 hydrogens, 4 corners of a tetrahedron, 109.5° apart —
              maximum distance, minimum repulsion.
            </p>
          </section>

          <section className="pt-4 border-t border-[#1a1a25]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
              NEET-style question
            </h3>
            <p className="text-sm text-[#f5efe6] leading-relaxed mb-3">
              The hybridization of carbon in CH₄ and the bond angle are:
            </p>
            <ol className="space-y-1.5 text-sm text-[#a8a297] ml-1">
              <li>(A) sp², 120°</li>
              <li>(B) sp³, 109.5° ✓</li>
              <li>(C) sp, 180°</li>
              <li>(D) sp³d, 90°</li>
            </ol>
          </section>
        </aside>
      </div>
    </LabLayout>
  );
}