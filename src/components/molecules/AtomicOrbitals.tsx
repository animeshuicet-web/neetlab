"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SOrbital from "./primitives/SOrbital";
import POrbital from "./primitives/POrbital";
import DOrbital from "./primitives/DOrbital";
import AxesHelper from "./primitives/AxesHelper";
import Nucleus from "./primitives/Nucleus";

// ===== Types =====
type Mode = "explorer" | "subshell" | "nodes";
type ExplorerOrbital = "1s" | "2s" | "3s" | "2p" | "3p" | "3d";
type SubshellChoice = "p" | "d";

type ExplorerNote = { shape: string; nodes: string; trick: string; fact: string };
type SubshellNote = { title: string; body: string; trick: string; fact: string };

// ===== Learning notes content =====
const explorerNotes: Record<ExplorerOrbital, ExplorerNote> = {
  "1s": {
    shape: "Spherical. No nodes. Smallest, lowest energy orbital.",
    nodes: "Radial = 0, Angular = 0, Total = 0",
    trick: "1s = simplest sphere, holds 2 electrons.",
    fact: "All s-orbitals are spherically symmetric — direction doesn't matter.",
  },
  "2s": {
    shape: "Spherical and bigger than 1s. The 1s shape is contained inside.",
    nodes: "Radial = 1, Angular = 0, Total = 1",
    trick: "n − ℓ − 1 = 2 − 0 − 1 = 1 radial node.",
    fact: "Each higher s-orbital is bigger and contains the lower ones inside.",
  },
  "3s": {
    shape: "Spherical, even bigger. Both 1s and 2s shapes nest inside.",
    nodes: "Radial = 2, Angular = 0, Total = 2",
    trick: "Higher n = more nodes. Always n − 1 total nodes.",
    fact: "Every higher s-orbital adds one more spherical node shell.",
  },
  "2p": {
    shape: "Two lobes pinched at the nucleus, opposite phases (orange/teal).",
    nodes: "Radial = 0, Angular = 1, Total = 1",
    trick: "p has 1 angular node = the plane between the two lobes.",
    fact: "Three p-orbitals (pₓ, p_y, p_z) — one per axis. Total 6 electrons.",
  },
  "3p": {
    shape: "Same pinched-lobe shape as 2p but bigger, with 2p contained inside.",
    nodes: "Radial = 1, Angular = 1, Total = 2",
    trick: "Same shape as 2p, but 3p has 1 extra radial node.",
    fact: "Shape stays the same across n; only size and nodes change.",
  },
  "3d": {
    shape: "Cloverleaf — four lobes between axes. d_z² is the special one.",
    nodes: "Radial = 0, Angular = 2, Total = 2",
    trick: "d has 2 angular nodes. Five d-orbitals → 10 electrons.",
    fact: "d_xy, d_yz, d_zx have lobes BETWEEN axes. d_x²−y² has lobes ON axes.",
  },
};

const subshellNotes: Record<SubshellChoice, SubshellNote> = {
  p: {
    title: "p-subshell — three orbitals",
    body: "pₓ, p_y, p_z all have identical pinched-lobe shape. Only orientation differs — one along each axis.",
    trick: "3 orbitals × 2 electrons = 6 electrons total in any p-subshell.",
    fact: "All three are degenerate (same energy) in a free atom.",
  },
  d: {
    title: "d-subshell — five orbitals",
    body: "Four cloverleaves (d_xy, d_yz, d_zx, d_x²−y²) plus the unique d_z² with its donut. All five degenerate in a free atom.",
    trick: "5 orbitals × 2 electrons = 10 electrons. That's why d-block has 10 columns.",
    fact: "d_z² looks different but has the same energy as the others.",
  },
};

// ===== Component =====
export default function AtomicOrbitals() {
  const [mode, setMode] = useState<Mode>("explorer");
  const [orbital, setOrbital] = useState<ExplorerOrbital>("2p");
  const [subshell, setSubshell] = useState<SubshellChoice>("p");
  const [showInner, setShowInner] = useState<boolean>(true);

  // Show inner-orbital toggle only when relevant (n ≥ 2 in explorer mode)
  const innerToggleRelevant =
    mode === "explorer" && ["2s", "3s", "3p"].includes(orbital);

  // ===== Render the 3D scene based on mode =====
  function renderScene() {
    if (mode === "explorer") {
      switch (orbital) {
        case "1s":
          return <SOrbital radius={1.0} />;
        case "2s":
          return (
            <>
              <SOrbital radius={1.7} />
              {showInner && <SOrbital radius={0.7} isInner />}
            </>
          );
        case "3s":
          return (
            <>
              <SOrbital radius={2.3} opacity={0.22} />
              {showInner && (
                <>
                  <SOrbital radius={1.4} opacity={0.32} isInner />
                  <SOrbital radius={0.6} opacity={0.55} isInner />
                </>
              )}
            </>
          );
        case "2p":
          return <POrbital axis="z" size={1.8} />;
        case "3p":
          return (
            <>
              <POrbital axis="z" size={2.4} opacity={0.35} />
              {showInner && <POrbital axis="z" size={1.3} isInner />}
            </>
          );
        case "3d":
          return <DOrbital variant="xy" size={1.8} />;
      }
    }

    if (mode === "subshell") {
      if (subshell === "p") {
        return (
          <>
            <POrbital axis="x" size={1.6} />
            <POrbital axis="y" size={1.6} />
            <POrbital axis="z" size={1.6} />
          </>
        );
      }
      // d-subshell — show all five at the same nucleus, overlapping
      return (
        <>
          <DOrbital variant="xy" size={1.5} opacity={0.32} />
          <DOrbital variant="yz" size={1.5} opacity={0.32} />
          <DOrbital variant="zx" size={1.5} opacity={0.32} />
          <DOrbital variant="x2-y2" size={1.5} opacity={0.32} />
          <DOrbital variant="z2" size={1.5} opacity={0.32} />
        </>
      );
    }

    return <SOrbital radius={1.4} opacity={0.2} />;
  }

  // ===== Render learning notes based on mode =====
  function renderNotes() {
    if (mode === "explorer") {
      const n = explorerNotes[orbital];
      return (
        <div className="space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-1">
              What you're seeing
            </div>
            <div className="text-[#f5efe6] text-sm leading-relaxed">{n.shape}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-1">
              Nodes
            </div>
            <div className="text-[#f5efe6] text-sm font-mono">{n.nodes}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-1">
              Memory trick
            </div>
            <div className="text-[#FFD93D] text-sm leading-relaxed">{n.trick}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-1">
              NEET fact
            </div>
            <div className="text-[#f5efe6] text-sm leading-relaxed">{n.fact}</div>
          </div>
        </div>
      );
    }

    if (mode === "subshell") {
      const n = subshellNotes[subshell];
      return (
        <div className="space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-1">
              {n.title}
            </div>
            <div className="text-[#f5efe6] text-sm leading-relaxed">{n.body}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-1">
              Memory trick
            </div>
            <div className="text-[#FFD93D] text-sm leading-relaxed">{n.trick}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#a8a297] mb-1">
              NEET fact
            </div>
            <div className="text-[#f5efe6] text-sm leading-relaxed">{n.fact}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-[#a8a297] text-sm leading-relaxed">
        Coming in v2: see radial nodes as transparent shells, angular nodes as planes.
        For now, use Explorer mode — node counts shown for each orbital.
      </div>
    );
  }

  // ===== Layout =====
  return (
    <div className="w-full">
      {/* Mode tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["explorer", "subshell", "nodes"] as Mode[]).map((m) => {
          const isActive = mode === m;
          const isDisabled = m === "nodes";
          const label =
            m === "explorer" ? "Explorer" : m === "subshell" ? "Subshell" : "Nodes (soon)";
          return (
            <button
              key={m}
              onClick={() => !isDisabled && setMode(m)}
              disabled={isDisabled}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] rounded transition-colors ${
                isActive
                  ? "bg-[#E8550A] text-white"
                  : isDisabled
                  ? "bg-[#0f0f17] text-[#5a5750] border border-[#1a1a25] cursor-not-allowed"
                  : "bg-[#0f0f17] text-[#a8a297] border border-[#1a1a25] hover:border-[#E8550A] hover:text-[#f5efe6]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Sub-pickers per mode */}
      {mode === "explorer" && (
        <div className="flex gap-2 mb-4 flex-wrap items-center">
          {(["1s", "2s", "3s", "2p", "3p", "3d"] as ExplorerOrbital[]).map((o) => (
            <button
              key={o}
              onClick={() => setOrbital(o)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                orbital === o
                  ? "bg-[#E8550A] text-white"
                  : "bg-[#0f0f17] text-[#a8a297] border border-[#1a1a25] hover:border-[#E8550A]"
              }`}
            >
              {o}
            </button>
          ))}

          {/* Inner orbital toggle */}
          {innerToggleRelevant && (
            <button
              onClick={() => setShowInner(!showInner)}
              className={`ml-2 px-3 py-1.5 text-xs rounded transition-colors ${
                showInner
                  ? "bg-[#4ECDC4] text-[#0a0a0f]"
                  : "bg-[#0f0f17] text-[#a8a297] border border-[#1a1a25] hover:border-[#4ECDC4]"
              }`}
            >
              {showInner ? "✓ Inner orbitals" : "Show inner orbitals"}
            </button>
          )}
        </div>
      )}

      {mode === "subshell" && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["p", "d"] as SubshellChoice[]).map((s) => (
            <button
              key={s}
              onClick={() => setSubshell(s)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                subshell === s
                  ? "bg-[#E8550A] text-white"
                  : "bg-[#0f0f17] text-[#a8a297] border border-[#1a1a25] hover:border-[#E8550A]"
              }`}
            >
              {s}-subshell
            </button>
          ))}
        </div>
      )}

      {/* Layout: canvas + notes */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 aspect-square max-w-md lg:max-w-none mx-auto w-full bg-[#0a0a0f] rounded-lg border border-[#1a1a25] overflow-hidden">
          <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.4} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ECDC4" />
            <pointLight position={[0, 0, 8]} intensity={0.3} color="#E8550A" />

            {/* Always visible: axes + nucleus */}
            <AxesHelper length={3.5} />
            <Nucleus />

            {/* Mode-specific orbital scene */}
            {renderScene()}

            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={15}
              autoRotate
              autoRotateSpeed={0.6}
            />
          </Canvas>
        </div>

        <div className="bg-[#0f0f17] border border-[#1a1a25] rounded-lg p-5">
          {renderNotes()}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#a8a297]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
          <span>x axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#4ECDC4]" />
          <span>y axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#5DA9FF]" />
          <span>z axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f5efe6]" />
          <span>nucleus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#E8550A]" />
          <span>+ phase</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#4ECDC4]" />
          <span>− phase</span>
        </div>
      </div>
    </div>
  );
}