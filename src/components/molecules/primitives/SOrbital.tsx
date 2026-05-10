"use client";

import { Sphere } from "@react-three/drei";

interface SOrbitalProps {
  radius?: number;
  position?: [number, number, number];
  opacity?: number;
}

export default function SOrbital({
  radius = 1.4,
  position = [0, 0, 0],
  opacity = 0.45,
}: SOrbitalProps) {
  return (
    <Sphere args={[radius, 48, 48]} position={position}>
      <meshStandardMaterial
        color="#E8550A"
        emissive="#E8550A"
        emissiveIntensity={0.35}
        transparent
        opacity={opacity}
        roughness={0.4}
        metalness={0.1}
      />
    </Sphere>
  );
}