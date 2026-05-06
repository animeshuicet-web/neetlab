"use client";

import dynamic from "next/dynamic";

const Benzene = dynamic(() => import("./Benzene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[#a8a297] text-sm font-mono">loading 3D engine…</div>
    </div>
  ),
});

export default function BenzeneCanvas() {
  return <Benzene />;
}