"use client";

import * as THREE from "three";

interface AxesHelperProps {
  length?: number;
}

const AXIS_COLORS = {
  x: "#FF6B6B",
  y: "#4ECDC4",
  z: "#5DA9FF",
};

function Axis({
  direction,
  length,
  color,
}: {
  direction: [number, number, number];
  length: number;
  color: string;
}) {
  const dir = new THREE.Vector3(...direction).normalize();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(yAxis, dir);

  return (
    <group quaternion={quaternion}>
      {/* Thin cylinder along the axis */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, length * 2, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      {/* Cone at the +ve tip — marks axis direction */}
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[0.08, 0.2, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function AxesHelper({ length = 3.5 }: AxesHelperProps) {
  return (
    <group>
      <Axis direction={[1, 0, 0]} length={length} color={AXIS_COLORS.x} />
      <Axis direction={[0, 1, 0]} length={length} color={AXIS_COLORS.y} />
      <Axis direction={[0, 0, 1]} length={length} color={AXIS_COLORS.z} />
    </group>
  );
}