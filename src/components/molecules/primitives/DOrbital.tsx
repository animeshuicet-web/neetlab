"use client";

import * as THREE from "three";

type DVariant = "xy" | "yz" | "zx" | "x2-y2" | "z2";

interface DOrbitalProps {
  variant: DVariant;
  size?: number;
  position?: [number, number, number];
  opacity?: number;
}

const ORANGE = "#E8550A";
const TEAL = "#4ECDC4";

function Lobe({
  pos,
  scale,
  color,
  opacity,
  size,
}: {
  pos: [number, number, number];
  scale: [number, number, number];
  color: string;
  opacity: number;
  size: number;
}) {
  return (
    <mesh position={pos} scale={scale}>
      <sphereGeometry args={[size * 0.55, 28, 28]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={opacity}
        roughness={0.35}
      />
    </mesh>
  );
}

export default function DOrbital({
  variant,
  size = 1.5,
  position = [0, 0, 0],
  opacity = 0.55,
}: DOrbitalProps) {
  const off = size * 0.65;
  const lobeScale: [number, number, number] = [0.7, 0.7, 0.7];

  // Cloverleaf orbitals (xy, yz, zx) — lobes BETWEEN axes (45° rotation)
  // x²-y² orbital — lobes ON the x and y axes
  // z² orbital — 2 lobes on z axis + torus in xy plane

  if (variant === "z2") {
    return (
      <group position={position}>
        {/* Top lobe along +z (orange) */}
        <Lobe
          pos={[0, 0, off * 1.1]}
          scale={[0.6, 0.6, 1.1]}
          color={ORANGE}
          opacity={opacity}
          size={size}
        />
        {/* Bottom lobe along -z (orange — same phase as top in d_z²) */}
        <Lobe
          pos={[0, 0, -off * 1.1]}
          scale={[0.6, 0.6, 1.1]}
          color={ORANGE}
          opacity={opacity}
          size={size}
        />
        {/* Donut in xy plane (teal — opposite phase) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.7, size * 0.22, 16, 48]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.4}
            transparent
            opacity={opacity}
            roughness={0.35}
          />
        </mesh>
      </group>
    );
  }

  if (variant === "x2-y2") {
    return (
      <group position={position}>
        {/* Lobes along +x, -x (orange) */}
        <Lobe pos={[off, 0, 0]} scale={lobeScale} color={ORANGE} opacity={opacity} size={size} />
        <Lobe pos={[-off, 0, 0]} scale={lobeScale} color={ORANGE} opacity={opacity} size={size} />
        {/* Lobes along +y, -y (teal — opposite sign) */}
        <Lobe pos={[0, off, 0]} scale={lobeScale} color={TEAL} opacity={opacity} size={size} />
        <Lobe pos={[0, -off, 0]} scale={lobeScale} color={TEAL} opacity={opacity} size={size} />
      </group>
    );
  }

  // Cloverleaf orbitals — lobes between axes
  // d_xy: lobes in xy plane, between x and y axes
  // d_yz: lobes in yz plane
  // d_zx: lobes in zx plane
  const diag = off * 0.75;
  let positions: Array<[number, number, number]> = [];
  let colors: string[] = [];

  if (variant === "xy") {
    positions = [
      [diag, diag, 0],
      [-diag, -diag, 0],
      [diag, -diag, 0],
      [-diag, diag, 0],
    ];
    colors = [ORANGE, ORANGE, TEAL, TEAL];
  } else if (variant === "yz") {
    positions = [
      [0, diag, diag],
      [0, -diag, -diag],
      [0, diag, -diag],
      [0, -diag, diag],
    ];
    colors = [ORANGE, ORANGE, TEAL, TEAL];
  } else {
    // zx
    positions = [
      [diag, 0, diag],
      [-diag, 0, -diag],
      [diag, 0, -diag],
      [-diag, 0, diag],
    ];
    colors = [ORANGE, ORANGE, TEAL, TEAL];
  }

  return (
    <group position={position}>
      {positions.map((p, i) => (
        <Lobe
          key={i}
          pos={p}
          scale={lobeScale}
          color={colors[i]}
          opacity={opacity}
          size={size}
        />
      ))}
    </group>
  );
}