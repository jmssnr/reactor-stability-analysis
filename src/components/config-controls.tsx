import ParameterSlider from "@/components/parameter-slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { initialSimulationConfig } from "@/core/initialSimulationConfig";
import { SimulationConfig } from "@/core/types";

const ConfigControls = (props: {
  simulationConfig: SimulationConfig;
  handleChangeConfig: (value: number[], key: string) => void;
}) => {
  const { simulationConfig, handleChangeConfig } = props;
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Simulation Parameters</CardTitle>
        <CardDescription>
          Change the parameters below and observe the effect on reactor
          stability.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {Object.keys(initialSimulationConfig).map((p) => {
          const parameter = simulationConfig[p];
          return (
            <ParameterSlider
              key={p}
              parameterkey={p}
              label={parameter.label}
              value={parameter.value}
              min={parameter.min}
              max={parameter.max}
              onChange={(v) => handleChangeConfig(v, p)}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ConfigControls;
