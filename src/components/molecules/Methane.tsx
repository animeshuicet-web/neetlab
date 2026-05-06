"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// --- Atom colors (CPK-inspired but tuned for our dark theme) ---
const COLORS = {
  carbon: "#2c2c2c",
  carbonEmissive: "#1a1a1a",
  hydrogen: "#f0f0f0",
  hydrogenEmissive: "#888888",
  bond: "#666666",
};

// --- Tetrahedral geometry: 4 H atoms at vertices of a tetrahedron ---
// These coordinates produce a perfect 109.5° tetrahedral angle
const HYDROGEN_POSITIONS: [number, number, number][] = [
  [1, 1, 1],
  [-1, -1, 1],
  [-1, 1, -1],
  [1, -1, -1],
];

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
      <sphereGeometry args={[radius, 32, 32]} />
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

// --- A bond (cylinder between carbon at origin and hydrogen at end) ---
function Bond({ end }: { end: [number, number, number] }) {
  const start = new THREE.Vector3(0, 0, 0);
  const endVec = new THREE.Vector3(...end);
  const midpoint = start.clone().add(endVec).multiplyScalar(0.5);
  const distance = start.distanceTo(endVec);

  // Orient cylinder along the bond axis
  const direction = endVec.clone().sub(start).normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <mesh position={midpoint.toArray()} quaternion={quaternion.toArray() as any}>
      <cylinderGeometry args={[0.08, 0.08, distance, 16]} />
      <meshStandardMaterial color={COLORS.bond} roughness={0.6} />
    </mesh>
  );
}

// --- The whole methane molecule, rotating slowly ---
function MethaneMolecule() {
  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotate slowly when not being dragged
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Carbon at center */}
      <Atom
        position={[0, 0, 0]}
        radius={0.5}
        color={COLORS.carbon}
        emissive={COLORS.carbonEmissive}
      />

      {/* 4 Hydrogens at tetrahedral vertices */}
      {HYDROGEN_POSITIONS.map((pos, i) => (
        <Atom
          key={i}
          position={pos}
          radius={0.3}
          color={COLORS.hydrogen}
          emissive={COLORS.hydrogenEmissive}
        />
      ))}

      {/* 4 C-H bonds */}
      {HYDROGEN_POSITIONS.map((pos, i) => (
        <Bond key={i} end={pos} />
      ))}
    </group>
  );
}

// --- The Canvas wrapper that gets exported ---
export default function Methane() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 4], fov: 50 }}
        dpr={[1, 2]} // Retina-aware but caps at 2x for mobile perf
      >
        {/* Lighting setup — ambient + directional gives depth */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#E8550A" />

        <MethaneMolecule />

        {/* Touch/drag controls — students can rotate it themselves */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}