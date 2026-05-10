import LabLayout from "@/components/lab/LabLayout";
import AtomicOrbitalsCanvas from "@/components/molecules/AtomicOrbitalsCanvas";
import { getLabBySlug } from "@/data/labs";
import { notFound } from "next/navigation";

export default async function AtomicOrbitalsPage() {
  const lab = getLabBySlug("atomic-orbitals");
  if (!lab) notFound();

  return (
    <LabLayout lab={lab}>
      <div className="space-y-6">
        <AtomicOrbitalsCanvas />

        <div className="bg-[#0f0f17] border border-[#1a1a25] rounded-lg p-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-3">
            How to use this lab
          </div>
          <ul className="text-[#f5efe6] text-sm leading-relaxed space-y-2">
            <li>
              <span className="text-[#E8550A] font-mono">Explorer</span> — pick any
              orbital from 1s to 3d. See its shape and node count.
            </li>
            <li>
              <span className="text-[#E8550A] font-mono">Subshell</span> — see all p
              or all d orbitals together. Why 3 p's = 6 electrons, 5 d's = 10.
            </li>
            <li>
              <span className="text-[#5a5750] font-mono">Nodes (soon)</span> —
              radial and angular node visualization is coming in v2.
            </li>
          </ul>
        </div>

        <div className="bg-[#0f0f17] border border-[#1a1a25] rounded-lg p-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-3">
            NEET-style question
          </div>
          <div className="text-[#f5efe6] text-sm leading-relaxed mb-3">
            The total number of nodes in a 3p orbital is:
          </div>
          <div className="text-sm font-mono text-[#a8a297] space-y-1">
            <div>(A) 1</div>
            <div>(B) 2</div>
            <div>(C) 3</div>
            <div>(D) 0</div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1a1a25]">
            <span className="text-[#4ECDC4] text-xs font-mono">
              ✓ Answer: (B) 2
            </span>
            <span className="text-[#a8a297] text-xs ml-2">
              Total nodes = n − 1 = 3 − 1 = 2 (1 radial + 1 angular)
            </span>
          </div>
        </div>
      </div>
    </LabLayout>
  );
}