"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

// --- Color palette (matched to NEETlab brand) ---
const COLORS = {
  carbon: "#2c2c2c",
  carbonEmissive: "#1a1a1a",
  hydrogen: "#f0f0f0",
  hydrogenEmissive: "#888888",
  bond: "#666666",
  pOrbitalTop: "#E8550A",      // Orange — top lobe of each p-orbital
  pOrbitalBottom: "#4ECDC4",   // Teal — bottom lobe of each p-orbital
  electronCloud: "#E8550A",    // Orange tinted cloud
};

// --- Generate the 6 carbon positions in a regular hexagon (radius 1.4) ---
const RING_RADIUS = 1.4;
const CARBON_POSITIONS: [number, number, number][] = Array.from(
  { length: 6 },
  (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    return [RING_RADIUS * Math.cos(angle), 0, RING_RADIUS * Math.sin(angle)];
  }
);

// --- Hydrogens stick out radially from each carbon ---
const H_BOND_LENGTH = 1.0;
const HYDROGEN_POSITIONS: [number, number, number][] = CARBON_POSITIONS.map(
  ([x, _y, z]) => {
    const angle = Math.atan2(z, x);
    const r = RING_RADIUS + H_BOND_LENGTH;
    return [r * Math.cos(angle), 0, r * Math.sin(angle)];
  }
);

// --- A single atom (sphere) ---
function Atom({
  position,
  radius,
  color,
  emissive,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: string;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.15}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

// --- A bond (cylinder between two arbitrary points) ---
function Bond({
  start,
  end,
  thickness = 0.07,
  color = COLORS.bond,
}: {
  start: [number, number, number];
  end: [number, number, number];
  thickness?: number;
  color?: string;
}) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  const distance = startVec.distanceTo(endVec);
  const direction = endVec.clone().sub(startVec).normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <mesh
      position={midpoint.toArray()}
      quaternion={quaternion.toArray() as any}
    >
      <cylinderGeometry args={[thickness, thickness, distance, 12]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

// --- A p-orbital lobe (a slightly stretched sphere) ---
// Each carbon has 2 lobes: one above (orange), one below (teal)
function POrbitalLobe({
  carbonPos,
  isTop,
}: {
  carbonPos: [number, number, number];
  isTop: boolean;
}) {
  const offset = isTop ? 0.7 : -0.7;
  const position: [number, number, number] = [
    carbonPos[0],
    carbonPos[1] + offset,
    carbonPos[2],
  ];
  const color = isTop ? COLORS.pOrbitalTop : COLORS.pOrbitalBottom;

  return (
    <mesh position={position} scale={[0.5, 0.85, 0.5]}>
      <sphereGeometry args={[0.55, 20, 20]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

// --- Delocalized electron cloud (translucent torus above and below the ring) ---
function ElectronCloud() {
  return (
    <>
      {/* Top torus */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, 0.45, 24, 64]} />
        <meshStandardMaterial
          color={COLORS.electronCloud}
          emissive={COLORS.electronCloud}
          emissiveIntensity={0.5}
          transparent
          opacity={0.35}
          roughness={0.2}
        />
      </mesh>
      {/* Bottom torus */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS, 0.45, 24, 64]} />
        <meshStandardMaterial
          color={COLORS.electronCloud}
          emissive={COLORS.electronCloud}
          emissiveIntensity={0.5}
          transparent
          opacity={0.35}
          roughness={0.2}
        />
      </mesh>
    </>
  );
}

// --- The benzene molecule with toggle-able view ---
function BenzeneMolecule({ view }: { view: "porbitals" | "cloud" }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 6 Carbons */}
      {CARBON_POSITIONS.map((pos, i) => (
        <Atom
          key={`c-${i}`}
          position={pos}
          radius={0.4}
          color={COLORS.carbon}
          emissive={COLORS.carbonEmissive}
        />
      ))}

      {/* 6 Hydrogens */}
      {HYDROGEN_POSITIONS.map((pos, i) => (
        <Atom
          key={`h-${i}`}
          position={pos}
          radius={0.25}
          color={COLORS.hydrogen}
          emissive={COLORS.hydrogenEmissive}
        />
      ))}

      {/* 6 C-C bonds (around the ring) */}
      {CARBON_POSITIONS.map((pos, i) => {
        const next = CARBON_POSITIONS[(i + 1) % 6];
        return <Bond key={`cc-${i}`} start={pos} end={next} thickness={0.08} />;
      })}

      {/* 6 C-H bonds */}
      {CARBON_POSITIONS.map((pos, i) => (
        <Bond
          key={`ch-${i}`}
          start={pos}
          end={HYDROGEN_POSITIONS[i]}
          thickness={0.06}
        />
      ))}

      {/* Toggle: p-orbitals view vs delocalized cloud */}
      {view === "porbitals" &&
        CARBON_POSITIONS.map((pos, i) => (
          <group key={`p-${i}`}>
            <POrbitalLobe carbonPos={pos} isTop={true} />
            <POrbitalLobe carbonPos={pos} isTop={false} />
          </group>
        ))}

      {view === "cloud" && <ElectronCloud />}
    </group>
  );
}

// --- The Canvas wrapper that gets exported ---
export default function Benzene() {
  const [view, setView] = useState<"porbitals" | "cloud">("cloud");

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [3.5, 2.5, 4.5], fov: 50 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight
          position={[-5, -3, -5]}
          intensity={0.4}
          color="#E8550A"
        />
        <BenzeneMolecule view={view} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Toggle button — overlays bottom-center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 p-1 rounded-full bg-[#0a0a0f]/80 backdrop-blur border border-[#2a2a35]">
        <button
          onClick={() => setView("cloud")}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
            view === "cloud"
              ? "bg-[#E8550A] text-[#0a0a0f]"
              : "text-[#a8a297] hover:text-[#f5efe6]"
          }`}
        >
          π cloud
        </button>
        <button
          onClick={() => setView("porbitals")}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
            view === "porbitals"
              ? "bg-[#E8550A] text-[#0a0a0f]"
              : "text-[#a8a297] hover:text-[#f5efe6]"
          }`}
        >
          p-orbitals
        </button>
      </div>
    </div>
  );
}