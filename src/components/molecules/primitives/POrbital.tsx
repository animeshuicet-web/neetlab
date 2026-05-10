"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface POrbitalProps {
  axis?: "x" | "y" | "z";
  size?: number;
  position?: [number, number, number];
  opacity?: number;
}

export default function POrbital({
  axis = "z",
  size = 1.6,
  position = [0, 0, 0],
  opacity = 0.55,
}: POrbitalProps) {
  // Lobe geometry: stretched ellipsoid. Use sphere scaled along one axis.
  const { topPos, bottomPos, scale } = useMemo(() => {
    const offset = size * 0.7;
    const scaleVec: [number, number, number] = [0.55, 0.55, 1];
    let topP: [number, number, number] = [0, 0, offset];
    let botP: [number, number, number] = [0, 0, -offset];
    let s: [number, number, number] = scaleVec;

    if (axis === "x") {
      topP = [offset, 0, 0];
      botP = [-offset, 0, 0];
      s = [1, 0.55, 0.55];
    } else if (axis === "y") {
      topP = [0, offset, 0];
      botP = [0, -offset, 0];
      s = [0.55, 1, 0.55];
    }

    return { topPos: topP, bottomPos: botP, scale: s };
  }, [axis, size]);

  return (
    <group position={position}>
      {/* Positive phase lobe (orange) */}
      <mesh position={topPos} scale={scale}>
        <sphereGeometry args={[size * 0.7, 32, 32]} />
        <meshStandardMaterial
          color="#E8550A"
          emissive="#E8550A"
          emissiveIntensity={0.4}
          transparent
          opacity={opacity}
          roughness={0.35}
        />
      </mesh>
      {/* Negative phase lobe (teal) */}
      <mesh position={bottomPos} scale={scale}>
        <sphereGeometry args={[size * 0.7, 32, 32]} />
        <meshStandardMaterial
          color="#4ECDC4"
          emissive="#4ECDC4"
          emissiveIntensity={0.4}
          transparent
          opacity={opacity}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}