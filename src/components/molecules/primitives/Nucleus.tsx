"use client";

import { Sphere } from "@react-three/drei";

interface NucleusProps {
  size?: number;
  color?: string;
}

export default function Nucleus({
  size = 0.12,
  color = "#f5efe6",
}: NucleusProps) {
  return (
    <Sphere args={[size, 16, 16]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.3}
      />
    </Sphere>
  );
}