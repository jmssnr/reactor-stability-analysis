import SVGContainer from "@/components/charts/svg-container";
import { getBounds } from "@/components/charts/utils";
import { Card } from "@/components/ui/card";
import { SimulationResult } from "@/core/types";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";

const StateTimeChart = (props: {
  width: number;
  height: number;
  solution: SimulationResult;
}) => {
  const { width, height, solution } = props;

  const { innerWidth, innerHeight } = getBounds(width, height);

  const timeScale = scaleLinear({
    range: [0, innerWidth],
    domain: [0, 10],
  });

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, 2],
  });

  const lines = (
    <Group>
      <LinePath
        data={solution}
        x={(d) => timeScale(d.time)}
        y={(d) => yScale(d.states[0])}
        className="stroke-chart-1"
        strokeWidth={2}
      />
      <LinePath
        data={solution}
        x={(d) => timeScale(d.time)}
        y={(d) => yScale(d.states[1])}
        className="stroke-chart-2"
        strokeWidth={2}
      />
    </Group>
  );
  const xAxis = (
    <AxisBottom
      scale={timeScale}
      top={innerHeight}
      stroke="hsl(var(--border))"
      tickStroke="hsl(var(--border))"
      tickLabelProps={{
        fill: "hsl(var(--border))",
      }}
    />
  );
  const yAxis = (
    <AxisLeft
      scale={yScale}
      stroke="hsl(var(--border))"
      tickStroke="hsl(var(--border))"
      tickLabelProps={{
        fill: "hsl(var(--border))",
      }}
    />
  );

  return (
    <Card className="relative h-[250px] w-fit">
      <SVGContainer width={width} height={height}>
        {xAxis}
        {yAxis}
        {lines}
      </SVGContainer>
    </Card>
  );
};

export default StateTimeChart;
