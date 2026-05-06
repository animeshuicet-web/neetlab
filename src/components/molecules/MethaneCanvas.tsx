"use client";

import dynamic from "next/dynamic";

// Load Methane only on client (3D needs window/WebGL)
const Methane = dynamic(() => import("./Methane"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[#a8a297] text-sm font-mono">loading 3D engine…</div>
    </div>
  ),
});

export default function MethaneCanvas() {
  return <Methane />;
}