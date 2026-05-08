"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Nucleus() {
  return (
    <mesh>
      <sphereGeometry args={[0.12, 64, 64]} />

      <meshStandardMaterial
        color="#fff3b0"
        emissive="#ffe08a"
        emissiveIntensity={1.2}
        roughness={0.15}
      />
    </mesh>
  );
}

function DensityField() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // subtle breathing motion
    const t = state.clock.elapsedTime;

    const pulse =
      1 + Math.sin(t * 1.2) * 0.015;

    groupRef.current.scale.set(
      pulse,
      pulse,
      pulse
    );

    groupRef.current.rotation.y += 0.0015;
  });

  return (
    <group ref={groupRef}>
      
      {/* OUTER DENSITY */}
      <Sphere args={[1.65, 96, 96]}>
        <meshPhysicalMaterial
          color="#ff7a1a"
          transparent
          opacity={0.035}
          roughness={0}
          transmission={1}
          thickness={0.5}
          clearcoat={1}
        />
      </Sphere>

      {/* MID DENSITY */}
      <Sphere args={[1.3, 96, 96]}>
        <meshPhysicalMaterial
          color="#ff9a3d"
          transparent
          opacity={0.06}
          roughness={0}
          transmission={1}
          thickness={0.6}
          clearcoat={1}
        />
      </Sphere>

      {/* INNER DENSITY */}
      <Sphere args={[0.95, 96, 96]}>
        <meshPhysicalMaterial
          color="#ffd3a1"
          transparent
          opacity={0.09}
          roughness={0}
          transmission={1}
          thickness={0.7}
          clearcoat={1}
        />
      </Sphere>
    </group>
  );
}

function Axes() {
  return (
    <group>
      
      {/* X */}
      <Line
        points={[
          [-2.5, 0, 0],
          [2.5, 0, 0],
        ]}
        color="#803333"
        lineWidth={1}
      />

      {/* Y */}
      <Line
        points={[
          [0, -2.5, 0],
          [0, 2.5, 0],
        ]}
        color="#336644"
        lineWidth={1}
      />

      {/* Z */}
      <Line
        points={[
          [0, 0, -2.5],
          [0, 0, 2.5],
        ]}
        color="#335580"
        lineWidth={1}
      />
    </group>
  );
}

export default function AtomicOrbitals() {
  return (
    <div className="h-full w-full bg-[#050505]">
      <Canvas
        camera={{
          position: [0, 0, 4.2],
          fov: 42,
        }}
      >
        {/* atmospheric depth */}
        <fog
          attach="fog"
          args={["#050505", 5, 9]}
        />

        {/* lighting */}
        <ambientLight intensity={0.35} />

        <directionalLight
          position={[4, 3, 5]}
          intensity={1.2}
          color="#ffffff"
        />

        <pointLight
          position={[0, 0, 0]}
          intensity={3}
          color="#ffcc88"
        />

        {/* scene */}
        <Axes />
        <DensityField />
        <Nucleus />

        {/* interaction */}
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
}