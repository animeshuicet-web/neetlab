"use client";

import dynamic from "next/dynamic";

const AtomicOrbitals = dynamic(() => import("./AtomicOrbitals"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-md mx-auto flex items-center justify-center text-[#a8a297] text-sm">
      loading 3D engine…
    </div>
  ),
});

export default function AtomicOrbitalsCanvas() {
  return <AtomicOrbitals />;
}