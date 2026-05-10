"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { createLobeGeometry } from "./lobeProfile";

type DVariant = "xy" | "yz" | "zx" | "x2-y2" | "z2";

interface DOrbitalProps {
  variant: DVariant;
  size?: number;
  position?: [number, number, number];
  opacity?: number;
}

const ORANGE = "#E8550A";
const TEAL = "#4ECDC4";

interface LobeSpec {
  rotation: [number, number, number];
  color: string;
}

function Lobe({
  geometry,
  rotation,
  color,
  opacity,
  wireOpacity,
}: {
  geometry: THREE.LatheGeometry;
  rotation: [number, number, number];
  color: string;
  opacity: number;
  wireOpacity: number;
}) {
  return (
    <group rotation={rotation}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          transparent
          opacity={opacity}
          roughness={0.45}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={wireOpacity}
        />
      </mesh>
    </group>
  );
}

export default function DOrbital({
  variant,
  size = 1.5,
  position = [0, 0, 0],
  opacity,
}: DOrbitalProps) {
  const finalOpacity = opacity ?? 0.45;
  const wireOpacity = 0.2;

  // Lobe geometry shared across all four lobes of a cloverleaf
  const lobeGeom = useMemo(
    () => createLobeGeometry(size, size * 0.38, 28, 28),
    [size]
  );

  // Special case: d_z² has 2 lobes along z + a torus in xy plane
  if (variant === "z2") {
    return (
      <group position={position}>
        {/* Top lobe along +z */}
        <Lobe
          geometry={lobeGeom}
          rotation={[Math.PI / 2, 0, 0]}
          color={ORANGE}
          opacity={finalOpacity}
          wireOpacity={wireOpacity}
        />
        {/* Bottom lobe along -z */}
        <Lobe
          geometry={lobeGeom}
          rotation={[-Math.PI / 2, 0, 0]}
          color={ORANGE}
          opacity={finalOpacity}
          wireOpacity={wireOpacity}
        />
        {/* Torus donut in xy plane */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.65, size * 0.18, 16, 40]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.35}
            transparent
            opacity={finalOpacity}
            roughness={0.45}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.65, size * 0.18, 16, 40]} />
          <meshBasicMaterial color={TEAL} wireframe transparent opacity={wireOpacity} />
        </mesh>
      </group>
    );
  }

  // Define lobe orientations for the four-lobe variants.
  // Lathe builds along +y, pinch at origin. We rotate to point each lobe outward.
  let specs: LobeSpec[] = [];

  if (variant === "x2-y2") {
    // Lobes ON the x and y axes
    specs = [
      { rotation: [0, 0, -Math.PI / 2], color: ORANGE }, // +x
      { rotation: [0, 0, Math.PI / 2], color: ORANGE }, // -x
      { rotation: [0, 0, 0], color: TEAL }, // +y
      { rotation: [Math.PI, 0, 0], color: TEAL }, // -y
    ];
  } else if (variant === "xy") {
    // Lobes BETWEEN x and y (in xy plane, at 45°)
    const half = Math.PI / 2;
    specs = [
      { rotation: [0, 0, -half / 2], color: ORANGE }, // +x+y
      { rotation: [0, 0, Math.PI + half / 2], color: ORANGE }, // -x-y
      { rotation: [0, 0, -Math.PI + half / 2], color: TEAL }, // -x+y
      { rotation: [0, 0, half / 2 + Math.PI], color: TEAL }, // +x-y
    ];
    // Cleaner version using direct angles:
    specs = [
      { rotation: [0, 0, -Math.PI / 4], color: ORANGE },
      { rotation: [0, 0, (3 * Math.PI) / 4], color: ORANGE },
      { rotation: [0, 0, Math.PI / 4], color: TEAL },
      { rotation: [0, 0, (-3 * Math.PI) / 4], color: TEAL },
    ];
  } else if (variant === "yz") {
    // Lobes BETWEEN y and z axes (in yz plane)
    specs = [
      { rotation: [Math.PI / 4, 0, 0], color: ORANGE },
      { rotation: [(-3 * Math.PI) / 4, 0, 0], color: ORANGE },
      { rotation: [-Math.PI / 4, 0, 0], color: TEAL },
      { rotation: [(3 * Math.PI) / 4, 0, 0], color: TEAL },
    ];
  } else {
    // zx: lobes BETWEEN z and x axes (in zx plane)
    specs = [
      { rotation: [0, 0, 0], euler_first: true, color: ORANGE } as never,
    ];
    // Use a different approach — combined rotations
    specs = [
      { rotation: [Math.PI / 2, Math.PI / 4, 0], color: ORANGE },
      { rotation: [Math.PI / 2, (-3 * Math.PI) / 4, 0], color: ORANGE },
      { rotation: [Math.PI / 2, -Math.PI / 4, 0], color: TEAL },
      { rotation: [Math.PI / 2, (3 * Math.PI) / 4, 0], color: TEAL },
    ];
  }

  return (
    <group position={position}>
      {specs.map((s, i) => (
        <Lobe
          key={i}
          geometry={lobeGeom}
          rotation={s.rotation}
          color={s.color}
          opacity={finalOpacity}
          wireOpacity={wireOpacity}
        />
      ))}
    </group>
  );
}