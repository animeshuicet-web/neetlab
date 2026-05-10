"use client";

import { Sphere } from "@react-three/drei";

interface SOrbitalProps {
  radius?: number;
  position?: [number, number, number];
  opacity?: number;
  isInner?: boolean;
}

export default function SOrbital({
  radius = 1.4,
  position = [0, 0, 0],
  opacity,
  isInner = false,
}: SOrbitalProps) {
  // If inner, render slightly more opaque so it reads as a "core" through the outer shell
  const finalOpacity = opacity ?? (isInner ? 0.55 : 0.32);

  return (
    <group position={position}>
      {/* Solid filled sphere — the orbital cloud */}
      <Sphere args={[radius, 48, 48]}>
        <meshStandardMaterial
          color="#E8550A"
          emissive="#E8550A"
          emissiveIntensity={0.3}
          transparent
          opacity={finalOpacity}
          roughness={0.5}
          metalness={0.05}
          depthWrite={false}
        />
      </Sphere>

      {/* Wireframe outline — gives the orbital a defined edge */}
      <Sphere args={[radius, 32, 24]}>
        <meshBasicMaterial
          color="#E8550A"
          wireframe
          transparent
          opacity={isInner ? 0.25 : 0.18}
        />
      </Sphere>
    </group>
  );
}