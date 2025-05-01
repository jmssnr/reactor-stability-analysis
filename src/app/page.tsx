"use client";

import LineChart from "@/components/line-chart";
import PhasePlane from "@/components/phase-plane";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { stirredTankReactorModel } from "@/core/tank-reactor-model";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { useState } from "react";

export default function SimulationPage() {
  const [initial, setInitial] = useState([1.2, 0]);

  const [parameters, setParameters] = useState<
    Record<string, { value: number; min: number; max: number; name: string }>
  >({
    volumetricFlowrate: { value: 200, min: 100, max: 300, name: "Flowrate" },
    inletConcentration: {
      value: 2e4,
      min: 1e4,
      max: 3e4,
      name: "Inlet Concentration",
    },
    inletTemperature: {
      value: 340,
      min: 300,
      max: 400,
      name: "Inlet Temperature",
    },
    coolantTemperature: {
      value: 370,
      min: 300,
      max: 400,
      name: "Coolant Temperature",
    },
  });

  const handleChange = (value: number[], name: string) => {
    const pastParameter = parameters[name];
    setParameters({
      ...parameters,
      [name]: { ...pastParameter, value: value[0] },
    });
  };

  const controls = Object.keys(parameters).map((p) => {
    const parameter = parameters[p];
    return (
      <div key={parameter.name} className="flex flex-col gap-2">
        <Label htmlFor={p}>{parameter.name}</Label>
        <div className="flex gap-2 items-center">
          <p className="font-thin text-sm">low</p>
          <Slider
            id={p}
            value={[parameter.value]}
            min={parameter.min}
            max={parameter.max}
            onValueChange={(v) => handleChange(v, p)}
          />
          <p className="font-thin text-sm">high</p>
        </div>
      </div>
    );
  });

  const model = stirredTankReactorModel(
    parameters.volumetricFlowrate.value / 1000 / 60,
    parameters.inletConcentration.value,
    parameters.inletTemperature.value,
    parameters.coolantTemperature.value
  );

  return (
    <main className="w-screen h-screen p-6 min-w-[1000px] min-h-[600px]">
      <div className="absolute top-14 left-24 flex flex-col gap-2 ">
        <Card className="w-[300px] h-fit ">
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>
              Change the parameters below and observe the effect on reactor
              stability.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">{controls}</CardContent>
        </Card>
        <LineChart width={300} height={200} model={model} initial={initial} />
      </div>
      <ParentSize>
        {({ width, height }) => (
          <PhasePlane
            width={width}
            height={height}
            model={model}
            initial={initial}
            setInitial={setInitial}
            parameters={parameters}
          />
        )}
      </ParentSize>
    </main>
  );
}
