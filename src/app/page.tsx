"use client";

import PhasePortrait from "@/components/phase-portrait";
import { reactorModel } from "@/core/reactor-model";
import { ParentSize } from "@visx/responsive";

export default function Home() {
  const model = reactorModel();
  return (
    <main className="w-screen h-screen bg-black p-6">
      <ParentSize>
        {({ width, height }) => (
          <PhasePortrait width={width} height={height} model={model} />
        )}
      </ParentSize>
    </main>
  );
}
