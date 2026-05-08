"use client";

import dynamic from "next/dynamic";

const AtomicOrbitals = dynamic(
  () => import("./AtomicOrbitals"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-[#a8a297]">
        loading 3D engine...
      </div>
    ),
  }
);

export default function AtomicOrbitalsCanvas() {
  return <AtomicOrbitals />;
}