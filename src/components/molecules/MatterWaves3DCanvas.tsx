"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * Matter Waves 3D — STEP 3c
 *
 * Layout fix: controls now take dedicated space BELOW the canvas, not as an
 * overlay. The parent (LabRenderer) wraps us in aspect-square w-full overflow-hidden,
 * so we use flex-col internally:
 *   - 3D scene takes flex-1 (most of the space)
 *   - Controls take their own fixed-height row at the bottom
 *
 * Math & sampling unchanged from 3b.
 */

// ============================================================
// Helpers
// ============================================================
function isIntegerN(n: number, tol = 0.04): boolean {
  return Math.abs(n - Math.round(n)) < tol && Math.round(n) >= 1;
}

const A_BOHR = 1.0;

function psi(x: number, y: number, z: number, n: number, l: number): number {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r < 0.001) return 0;
  const rho = r / A_BOHR;
  const cosTheta = z / r;

  if (l === 0) {
    if (n === 1) return Math.exp(-rho);
    if (n === 2) return (1 - rho / 2) * Math.exp(-rho / 2);
    if (n === 3) return (1 - (2 * rho) / 3 + (2 * rho * rho) / 27) * Math.exp(-rho / 3);
    if (n === 4) {
      const u = rho / 4;
      return (1 - 3 * u + (5 / 2) * u * u - (1 / 6) * u * u * u) * Math.exp(-u);
    }
  } else if (l === 1) {
    if (n === 2) return rho * cosTheta * Math.exp(-rho / 2);
    if (n === 3) return rho * (1 - rho / 6) * cosTheta * Math.exp(-rho / 3);
    if (n === 4) {
      const u = rho / 4;
      return rho * (1 - u + (1 / 5) * u * u) * cosTheta * Math.exp(-u);
    }
  } else if (l === 2) {
    const angular = 3 * cosTheta * cosTheta - 1;
    if (n === 3) return rho * rho * angular * Math.exp(-rho / 3);
    if (n === 4) {
      const u = rho / 4;
      return rho * rho * (1 - u / 3) * angular * Math.exp(-u);
    }
  }
  return 0;
}

function boundaryRadius(n: number, l: number): number {
  if (l === 0) {
    if (n === 1) return 2.0;
    if (n === 2) return 3.5;
    if (n === 3) return 5.5;
    return 7.5;
  }
  if (l === 1) {
    if (n === 2) return 3.5;
    if (n === 3) return 5.5;
    return 7.5;
  }
  if (n === 3) return 6.0;
  return 8.0;
}

function maxPsiSquared(n: number, l: number): number {
  if (l === 0) return 1.0;
  if (l === 1) {
    if (n === 2) return 0.55;
    return 0.7;
  }
  return 4.0;
}

function densityPowerFor(n: number, l: number): number {
  if (l === 0) return 2.5;
  if (l === 1) return 3.0;
  return 2.8;
}

interface SamplePoint {
  x: number;
  y: number;
  z: number;
  sign: 1 | -1;
  density: number;
}

function samplePoint(n: number, l: number): SamplePoint {
  const power = densityPowerFor(n, l);
  const psiMax2 = maxPsiSquared(n, l);
  const Rmax = boundaryRadius(n, l);

  for (let attempt = 0; attempt < 60; attempt++) {
    const u = Math.random();
    const centerBias = 2.5;
    const r = Rmax * Math.pow(u, 1 / centerBias);
    const cosT = 2 * Math.random() - 1;
    const sinT = Math.sqrt(1 - cosT * cosT);
    const phi = Math.random() * 2 * Math.PI;
    const x = r * sinT * Math.cos(phi);
    const y = r * sinT * Math.sin(phi);
    const z = r * cosT;

    const psiVal = psi(x, y, z, n, l);
    const psi2 = (psiVal * psiVal) / psiMax2;
    const accept = Math.pow(psi2, 1 / power);
    if (Math.random() < accept) {
      return { x, y, z, sign: psiVal >= 0 ? 1 : -1, density: psi2 };
    }
  }
  return { x: 0.3, y: 0, z: 0, sign: 1, density: 0.1 };
}

// ============================================================
// Cloud
// ============================================================
const CLOUD_COUNT = 350;
const MIN_TTL = 14;
const MAX_TTL = 34;

interface CloudDot {
  x: number;
  y: number;
  z: number;
  sign: 1 | -1;
  ttl: number;
  baseScale: number;
}

function OrbitalCloud({ n, l }: { n: number; l: number }) {
  const posMeshRef = useRef<THREE.InstancedMesh>(null);
  const negMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const hiddenMatrix = useMemo(() => {
    const m = new THREE.Matrix4();
    m.makeScale(0, 0, 0);
    m.setPosition(0, 1000, 0);
    return m;
  }, []);

  const dots = useMemo<CloudDot[]>(() => {
    return Array.from({ length: CLOUD_COUNT }, () => ({
      x: 0, y: 0, z: 0, sign: 1 as 1 | -1,
      ttl: Math.floor(Math.random() * MAX_TTL),
      baseScale: 1,
    }));
  }, []);

  useMemo(() => {
    dots.forEach((d) => (d.ttl = Math.floor(Math.random() * 4)));
  }, [n, l, dots]);

  useFrame((state) => {
    if (!posMeshRef.current || !negMeshRef.current) return;
    const t = state.clock.getElapsedTime();
    let posIdx = 0;
    let negIdx = 0;

    for (let i = 0; i < CLOUD_COUNT; i++) {
      const dot = dots[i];
      dot.ttl -= 1;
      if (dot.ttl <= 0) {
        const point = samplePoint(n, l);
        dot.x = point.x; dot.y = point.y; dot.z = point.z;
        dot.sign = point.sign;
        dot.baseScale = 0.5 + 1.6 * Math.pow(point.density, 0.5);
        dot.ttl = MIN_TTL + Math.floor(Math.random() * (MAX_TTL - MIN_TTL));
      }
      const flicker = 0.75 + 0.25 * Math.sin(t * 6.5 + i * 0.5);
      dummy.position.set(dot.x, dot.y, dot.z);
      dummy.scale.setScalar(dot.baseScale * flicker);
      dummy.updateMatrix();

      if (dot.sign === 1) {
        posMeshRef.current.setMatrixAt(posIdx++, dummy.matrix);
      } else {
        negMeshRef.current.setMatrixAt(negIdx++, dummy.matrix);
      }
    }
    for (let i = posIdx; i < CLOUD_COUNT; i++) posMeshRef.current.setMatrixAt(i, hiddenMatrix);
    for (let i = negIdx; i < CLOUD_COUNT; i++) negMeshRef.current.setMatrixAt(i, hiddenMatrix);
    posMeshRef.current.instanceMatrix.needsUpdate = true;
    negMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={posMeshRef} args={[undefined, undefined, CLOUD_COUNT]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffeb3b" transparent opacity={0.75}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={negMeshRef} args={[undefined, undefined, CLOUD_COUNT]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#4dd0e1" transparent opacity={0.75}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </>
  );
}

function BoundarySphere({ radius }: { radius: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshBasicMaterial color="#ffa726" transparent opacity={0.08}
        side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

// ============================================================
// Labels
// ============================================================
const SHAPE_LABEL: Record<number, string> = { 0: "s", 1: "p", 2: "d" };
function orbitalName(n: number, l: number): string {
  return `${n}${SHAPE_LABEL[l]}`;
}
function orbitalDescription(n: number, l: number): string {
  if (l === 0) {
    if (n === 1) return "spherical, no nodes";
    return `spherical with ${n - 1} radial node${n - 1 === 1 ? "" : "s"}`;
  }
  if (l === 1) {
    if (n === 2) return "dumbbell, nodal plane through nucleus";
    return `dumbbell with ${n - 2} radial node${n - 2 === 1 ? "" : "s"}`;
  }
  if (l === 2) {
    if (n === 3) return "two lobes + equatorial donut";
    return `dz²-shape with ${n - 3} radial node${n - 3 === 1 ? "" : "s"}`;
  }
  return "";
}

// ============================================================
// Main
// ============================================================
export default function MatterWaves3DCanvas() {
  const [n, setN] = useState<number>(2);
  const [l, setL] = useState<number>(1);

  const effectiveL = Math.min(l, n - 1);
  const Rmax = boundaryRadius(n, effectiveL);
  const cameraDistance = Math.max(5, Rmax * 1.7);

  const sAvailable = true;
  const pAvailable = n >= 2;
  const dAvailable = n >= 3;

  return (
    // KEY CHANGE: flex column instead of relative+absolute overlay
    // Canvas takes the top, controls take a dedicated row at the bottom
    <div className="w-full h-full bg-[#0a0806] flex flex-col">
      {/* 3D scene — takes ALL available space minus the controls below */}
      <div className="flex-1 min-h-0 relative">
        <Canvas
          camera={{ position: [0, 0, cameraDistance], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 5, 5]} intensity={0.9} color="#ffd9a8" />
          <pointLight position={[-4, -2, -3]} intensity={0.4} color="#ff7043" />

          <mesh>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshStandardMaterial color="#ff7043" emissive="#ff7043" emissiveIntensity={1.2} />
          </mesh>

          <BoundarySphere radius={Rmax} />
          <OrbitalCloud n={n} l={effectiveL} />

          <OrbitControls enablePan={false} minDistance={3} maxDistance={20} rotateSpeed={0.6} />
        </Canvas>

        {/* Floating label on the canvas itself (top centre) */}
        <div className="absolute top-2 left-0 right-0 text-center pointer-events-none">
          <div className="inline-block bg-[#1a1410cc] backdrop-blur-sm border border-[#ffa72633] rounded-full px-4 py-1">
            <span className="text-[10px] tracking-widest uppercase text-[#b09478] mr-2">Orbital</span>
            <span className="font-bold text-[#ffa726] text-lg tracking-wider">{orbitalName(n, effectiveL)}</span>
          </div>
          <div className="text-[10px] text-[#b09478] mt-1 px-4">
            {orbitalDescription(n, effectiveL)}
          </div>
        </div>
      </div>

      {/* Controls panel — fixed at the bottom, takes its own dedicated height */}
      <div className="flex-shrink-0 bg-[#1a1410] border-t border-[#ffa72633] p-3 space-y-2.5">
        {/* Shape picker — s / p / d */}
        <div>
          <div className="text-[10px] tracking-wide uppercase text-[#b09478] mb-1">
            Shape · ℓ
          </div>
          <div className="flex gap-1.5">
            {[
              { l: 0, label: "s", available: sAvailable },
              { l: 1, label: "p", available: pAvailable },
              { l: 2, label: "d", available: dAvailable },
            ].map((opt) => (
              <button
                key={opt.l}
                onClick={() => opt.available && setL(opt.l)}
                disabled={!opt.available}
                className={`flex-1 py-2 px-2 rounded text-[14px] font-bold tracking-wide border transition-colors ${
                  !opt.available
                    ? "bg-transparent text-[#7a6249] border-[#ffa72615] cursor-not-allowed"
                    : effectiveL === opt.l
                    ? "bg-[#ffa726] text-[#0a0806] border-[#ffa726]"
                    : "bg-transparent text-[#b09478] border-[#ffa72633] hover:text-[#ffa726]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* n slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-wide uppercase text-[#b09478]">
              Shell · n
            </span>
            <span className="font-mono text-[#ffa726] text-sm">{n}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            className="w-full h-9 cursor-pointer accent-[#ffa726]"
            aria-label="Principal quantum number n"
          />
          <div className="flex justify-between text-[10px] text-[#7a6249] mt-0.5 px-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-3 pt-0.5 text-[10px] text-[#b09478]">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#ffeb3b" }} />
            ψ &gt; 0
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#4dd0e1" }} />
            ψ &lt; 0
          </span>
          <span className="text-[#7a6249]">90% boundary</span>
        </div>
      </div>
    </div>
  );
}