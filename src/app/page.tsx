"use client";

import PhasePortrait from "@/components/phase-portrait";
import { scaledLotkaVolterraModel } from "@/core/lotka-volterra-model";
import { ParentSize } from "@visx/responsive";

export default function Home() {
  const model = scaledLotkaVolterraModel(5);
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
