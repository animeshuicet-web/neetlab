"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { createLobeGeometry } from "./lobeProfile";

interface POrbitalProps {
  axis?: "x" | "y" | "z";
  size?: number;
  position?: [number, number, number];
  opacity?: number;
  isInner?: boolean;
}

const ORANGE = "#E8550A";
const TEAL = "#4ECDC4";

export default function POrbital({
  axis = "z",
  size = 1.6,
  position = [0, 0, 0],
  opacity,
  isInner = false,
}: POrbitalProps) {
  const finalOpacity = opacity ?? (isInner ? 0.6 : 0.45);
  const wireOpacity = isInner ? 0.3 : 0.2;

  // Build the lobe geometry once
  const lobeGeom = useMemo(
    () => createLobeGeometry(size, size * 0.4, 32, 32),
    [size]
  );

  // Each axis needs its own rotation. The lathe builds the lobe along +y,
  // pinch at origin, tip at +y direction. We need:
  //   z-axis lobes: rotate +90° around x to point along +z and -z
  //   x-axis lobes: rotate +90° around z to point along +x and -x
  //   y-axis lobes: identity (already along +y)

  const { topRotation, bottomRotation } = useMemo(() => {
    if (axis === "z") {
      return {
        topRotation: new THREE.Euler(Math.PI / 2, 0, 0),
        bottomRotation: new THREE.Euler(-Math.PI / 2, 0, 0),
      };
    }
    if (axis === "x") {
      return {
        topRotation: new THREE.Euler(0, 0, -Math.PI / 2),
        bottomRotation: new THREE.Euler(0, 0, Math.PI / 2),
      };
    }
    // y axis: top points up (identity), bottom points down (flip 180° around x or z)
    return {
      topRotation: new THREE.Euler(0, 0, 0),
      bottomRotation: new THREE.Euler(Math.PI, 0, 0),
    };
  }, [axis]);

  return (
    <group position={position}>
      {/* Positive phase lobe (orange) */}
      <group rotation={topRotation}>
        <mesh geometry={lobeGeom}>
          <meshStandardMaterial
            color={ORANGE}
            emissive={ORANGE}
            emissiveIntensity={0.35}
            transparent
            opacity={finalOpacity}
            roughness={0.45}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={lobeGeom}>
          <meshBasicMaterial
            color={ORANGE}
            wireframe
            transparent
            opacity={wireOpacity}
          />
        </mesh>
      </group>

      {/* Negative phase lobe (teal) */}
      <group rotation={bottomRotation}>
        <mesh geometry={lobeGeom}>
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.35}
            transparent
            opacity={finalOpacity}
            roughness={0.45}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={lobeGeom}>
          <meshBasicMaterial
            color={TEAL}
            wireframe
            transparent
            opacity={wireOpacity}
          />
        </mesh>
      </group>
    </group>
  );
}