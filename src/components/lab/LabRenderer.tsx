"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Lab } from "@/data/labs";
import { getLabType } from "@/data/labs";

interface LabRendererProps {
  lab: Lab;
}

export default function LabRenderer({ lab }: LabRendererProps) {
  const type = getLabType(lab);

  const ReactComponent = useMemo(() => {
    if (type !== "react" || !lab.componentName) return null;
    return dynamic(
      () =>
        import(`@/components/molecules/${lab.componentName}Canvas`).catch(
          () => ({ default: () => <ComingSoon name={lab.componentName!} /> })
        ),
      { ssr: false, loading: () => <Loading /> }
    );
  }, [type, lab.componentName]);

  if (type === "html") {
    if (!lab.htmlPath) {
      return <ErrorBox message="HTML lab is missing htmlPath in labs.ts" />;
    }
    return (
      <div className="aspect-square w-full rounded-2xl border border-[#1a1a25] bg-[#0f0f17] overflow-hidden">
        <iframe
          src={lab.htmlPath}
          title={lab.title}
          sandbox="allow-scripts"
          className="w-full h-full block"
          loading="lazy"
        />
      </div>
    );
  }

  if (type === "react") {
    if (!lab.componentName) {
      return <ErrorBox message="React lab is missing componentName in labs.ts" />;
    }
    if (!ReactComponent) return <Loading />;
    return (
      <div className="aspect-square w-full rounded-2xl border border-[#1a1a25] bg-[#0f0f17] overflow-hidden">
        <ReactComponent />
      </div>
    );
  }

  return <ErrorBox message={`Unknown lab type: ${type}`} />;
}

function Loading() {
  return (
    <div className="aspect-square w-full rounded-2xl border border-[#1a1a25] bg-[#0f0f17] flex items-center justify-center">
      <p className="text-[#a8a297] text-sm font-mono uppercase tracking-[0.3em]">
        loading lab…
      </p>
    </div>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="aspect-square w-full rounded-2xl border border-[#1a1a25] bg-[#0f0f17] flex flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-[#E8550A] text-2xl font-black">Coming soon</p>
      <p className="text-[#a8a297] text-sm">
        Component <span className="font-mono text-[#f5efe6]">{name}Canvas.tsx</span> not built yet.
      </p>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="aspect-square w-full rounded-2xl border border-[#FF6B6B] bg-[#0f0f17] flex items-center justify-center p-6">
      <p className="text-[#FF6B6B] text-sm font-mono text-center">{message}</p>
    </div>
  );
}