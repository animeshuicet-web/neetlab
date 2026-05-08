import LabLayout from "@/components/lab/LabLayout";
import AtomicOrbitalsCanvas from "@/components/molecules/AtomicOrbitalsCanvas";

const lab = {
  slug: "atomic-orbitals",
  title: "Atomic Orbitals Explorer",
  shortTitle: "Atomic Orbitals",
  chapter: "Structure of Atom",
  domain: "physical" as const,
  difficulty: "easy" as const,
  weightage: "1-2 questions",
  description:
    "Explore 3D shapes of s, p and d orbitals interactively.",
  tags: ["orbitals", "3D", "visualization", "NEET"],
  is3D: true,
  published: true,
};

export default function AtomicOrbitalsPage() {
  return (
    <LabLayout lab={lab}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        
        {/* LEFT: 3D CANVAS PLACEHOLDER */}
        <div className="aspect-square overflow-hidden rounded-3xl border border-[#1a1a25] bg-[#0f0f17]">
  <AtomicOrbitalsCanvas />
</div>

        {/* RIGHT: NOTES PANEL */}
        <div className="rounded-3xl border border-[#1a1a25] bg-[#0f0f17] p-6 space-y-6">
          
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#5a5750]">
              What you're seeing
            </p>

            <p className="text-sm leading-relaxed text-[#f5efe6]">
              Atomic orbitals are regions in space where electrons are most likely to be found.
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#5a5750]">
              Key NEET facts
            </p>

            <ul className="space-y-2 text-sm text-[#a8a297]">
              <li>• s orbitals are spherical</li>
              <li>• p orbitals are dumbbell-shaped</li>
              <li>• d orbitals are cloverleaf-shaped</li>
            </ul>
          </div>

        </div>
      </div>
    </LabLayout>
  );
}