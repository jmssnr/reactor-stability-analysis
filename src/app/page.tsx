"use client";

import LineChart from "@/components/line-chart";
import PhasePortrait from "@/components/phase-portrait";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { reactorModel } from "@/core/reactor-model";
import { ParentSize } from "@visx/responsive";
import { useState } from "react";

export default function Home() {
  const [initial, setInitial] = useState([1.2, 0]);
  const [parameters, setParameters] = useState<Record<string, number>>({
    bodenstein: 1,
    stanton: 1,
    tau: 400,
  });

  const handleChange = (value: number[], name: string) => {
    setParameters({ ...parameters, [name]: value[0] });
  };

  const model = reactorModel(
    parameters.stanton,
    parameters.bodenstein,
    parameters.tau
  );
  return (
    <main className="w-screen h-screen p-6">
      <div className="absolute top-14 left-24 flex flex-col gap-2">
        <Card className="w-[350px] h-fit ">
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>
              Modify the below parameters to observe the effect on reactor
              stability.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="bodenstein">Boldenstein Number</Label>
              <Slider
                id="bodenstein"
                min={0}
                max={2}
                step={0.01}
                onValueChange={(v) => handleChange(v, "bodenstein")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="stanton">Stanton Number</Label>
              <Slider
                id="stanton"
                min={0}
                max={2}
                step={0.01}
                onValueChange={(v) => handleChange(v, "stanton")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tau">Residence Time</Label>
              <Slider
                id="tau"
                min={300}
                max={1000}
                step={0.01}
                onValueChange={(v) => handleChange(v, "tau")}
              />
            </div>
          </CardContent>
        </Card>
        <LineChart width={350} height={200} model={model} initial={initial} />
      </div>

      <ParentSize>
        {({ width, height }) => (
          <PhasePortrait
            width={width}
            height={height}
            model={model}
            initial={initial}
            setInitial={setInitial}
          />
        )}
      </ParentSize>
    </main>
  );
}
