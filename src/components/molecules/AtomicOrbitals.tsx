"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SOrbital from "./primitives/SOrbital";
import POrbital from "./primitives/POrbital";
import DOrbital from "./primitives/DOrbital";

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
    shape: "Spherical with one radial node inside (a thin shell where ψ = 0).",
    nodes: "Radial = 1, Angular = 0, Total = 1",
    trick: "n − ℓ − 1 = 2 − 0 − 1 = 1 radial node.",
    fact: "2s is bigger than 1s and has a node — but you can't see it from outside.",
  },
  "3s": {
    shape: "Spherical with two radial nodes inside.",
    nodes: "Radial = 2, Angular = 0, Total = 2",
    trick: "Higher n = more nodes. Always n − 1 total nodes.",
    fact: "Every higher s-orbital adds one more spherical node shell.",
  },
  "2p": {
    shape: "Dumbbell along one axis. Two lobes with opposite phase (orange/teal).",
    nodes: "Radial = 0, Angular = 1, Total = 1",
    trick: "p has 1 angular node = the plane between the two lobes.",
    fact: "Three p-orbitals (pₓ, p_y, p_z) — one per axis. Total 6 electrons.",
  },
  "3p": {
    shape: "Dumbbell shape but bigger, with one extra radial node inside each lobe.",
    nodes: "Radial = 1, Angular = 1, Total = 2",
    trick: "Same shape as 2p, but 3p has 1 extra radial node.",
    fact: "Shape stays same across n; only size and nodes change.",
  },
  "3d": {
    shape: "Cloverleaf — four lobes. d_z² is the odd one (donut + 2 lobes).",
    nodes: "Radial = 0, Angular = 2, Total = 2",
    trick: "d has 2 angular nodes. Five d-orbitals → 10 electrons.",
    fact: "d_xy, d_yz, d_zx have lobes BETWEEN axes. d_x²−y² has lobes ON axes.",
  },
};

const subshellNotes: Record<SubshellChoice, SubshellNote> = {
  p: {
    title: "p-subshell — three orbitals",
    body: "pₓ, p_y, p_z all have identical dumbbell shape. Only the orientation differs — one along each axis.",
    trick: "3 orbitals × 2 electrons = 6 electrons total in any p-subshell.",
    fact: "All three are degenerate (same energy) in a free atom.",
  },
  d: {
    title: "d-subshell — five orbitals",
    body: "Four cloverleaves (d_xy, d_yz, d_zx, d_x²−y²) plus the unique d_z² with its donut. All five degenerate in a free atom.",
    trick: "5 orbitals × 2 electrons = 10 electrons. That's why d-block has 10 columns.",
    fact: "d_z² looks different but has the same energy as the others. The donut + 2 lobes is mathematically equivalent to a cloverleaf.",
  },
};

// ===== Component =====
export default function AtomicOrbitals() {
  const [mode, setMode] = useState<Mode>("explorer");
  const [orbital, setOrbital] = useState<ExplorerOrbital>("2p");
  const [subshell, setSubshell] = useState<SubshellChoice>("p");

  // ===== Render the 3D scene based on mode =====
  function renderScene() {
    if (mode === "explorer") {
      switch (orbital) {
        case "1s":
          return <SOrbital radius={1.0} opacity={0.5} />;
        case "2s":
          return <SOrbital radius={1.6} opacity={0.45} />;
        case "3s":
          return <SOrbital radius={2.0} opacity={0.4} />;
        case "2p":
          return <POrbital axis="z" size={1.8} />;
        case "3p":
          return <POrbital axis="z" size={2.2} opacity={0.5} />;
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
      const spacing = 4.5;
      return (
        <>
          <DOrbital variant="xy" size={1.3} position={[-spacing, spacing * 0.5, 0]} />
          <DOrbital variant="yz" size={1.3} position={[0, spacing * 0.5, 0]} />
          <DOrbital variant="zx" size={1.3} position={[spacing, spacing * 0.5, 0]} />
          <DOrbital variant="x2-y2" size={1.3} position={[-spacing * 0.6, -spacing * 0.5, 0]} />
          <DOrbital variant="z2" size={1.3} position={[spacing * 0.6, -spacing * 0.5, 0]} />
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
        <div className="flex gap-2 mb-4 flex-wrap">
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
          <Canvas camera={{ position: [4, 3, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <pointLight position={[-10, -10, -5]} intensity={0.4} color="#4ECDC4" />
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
    </div>
  );
}