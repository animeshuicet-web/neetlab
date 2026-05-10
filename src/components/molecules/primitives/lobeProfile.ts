// Lobe profile generator for p and d orbitals.
// Pure sine-based math — guaranteed no NaN, no negative radii.

import * as THREE from "three";

export function generateLobeProfile(
  length: number = 1.5,
  maxRadius: number = 0.55,
  segments: number = 20
): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const symmetric = Math.sin(Math.PI * t);
    const skew = 0.5 * Math.cos(Math.PI * t);
    const r = symmetric * (1 + skew * 0.5) * maxRadius;
    const safeR = Math.max(0, r);
    points.push(new THREE.Vector2(safeR, t * length));
  }

  points[0] = new THREE.Vector2(0, 0);
  points[points.length - 1] = new THREE.Vector2(0, length);

  return points;
}

export function createLobeGeometry(
  length: number = 1.5,
  maxRadius: number = 0.55,
  radialSegments: number = 20,
  profileSegments: number = 20
): THREE.LatheGeometry {
  const profile = generateLobeProfile(length, maxRadius, profileSegments);
  return new THREE.LatheGeometry(profile, radialSegments);
}