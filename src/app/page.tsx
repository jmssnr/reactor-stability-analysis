"use client";

import PhasePlane from "@/components/charts/phase-plane";
import StateTimeChart from "@/components/charts/state-time-chart";
import ConfigControls from "@/components/config-controls";
import {
  initialSimulationConfig,
  startingInitialConditions,
} from "@/core/initialSimulationConfig";
import { SimulationConfig } from "@/core/types";

import { rungeKuttaIntegration } from "@/core/runge-kutta-integration";
import { stirredTankReactorModel } from "@/core/tank-reactor-model";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { useState } from "react";

export default function Trial() {
  const [initialConditions, setInitialConditions] = useState<number[]>(
    startingInitialConditions
  );
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>(
    initialSimulationConfig
  );

  const handleChangeSimulationConfig = (value: number[], key: string) => {
    const newConfig = {
      ...simulationConfig,
      [key]: { ...simulationConfig[key], value: value[0] },
    };
    setSimulationConfig(newConfig);
  };

  const handleChangeInitialCondition = (newInitialCondition: number[]) =>
    setInitialConditions(newInitialCondition);

  const { reactorModel, heatGenerationCurve, heatRemovalLine } =
    stirredTankReactorModel(
      simulationConfig.volumetricFlowrate.value / 1000 / 60,
      simulationConfig.inletConcentration.value,
      simulationConfig.inletTemperature.value,
      simulationConfig.coolantTemperature.value
    );

  const states = rungeKuttaIntegration(
    initialConditions,
    [0, 10],
    reactorModel
  );

  return (
    <main className="w-screen h-screen p-4 min-w-[1000px] min-h-[700px]">
      <div
        className="absolute top-14 left-24 flex flex-col gap-2 w-[350px]"
        style={{ userSelect: "none" }}
      >
        <ConfigControls
          simulationConfig={simulationConfig}
          handleChangeConfig={handleChangeSimulationConfig}
        />
        <ParentSize>
          {({ width, height }) => (
            <StateTimeChart width={width} height={height} solution={states} />
          )}
        </ParentSize>
      </div>
      <ParentSize>
        {({ width, height }) => (
          <PhasePlane
            width={width}
            height={height}
            model={reactorModel}
            solution={states}
            changeInitialConditions={handleChangeInitialCondition}
            initialConditions={initialConditions}
            heatGenerationCurve={heatGenerationCurve}
            heatRemovalLine={heatRemovalLine}
          />
        )}
      </ParentSize>
    </main>
  );
}
