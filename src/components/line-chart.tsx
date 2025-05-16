"use client";

import { Card } from "@/components/ui/card";
import { rungeKuttaIntegration } from "@/core/runge-kutta-integration";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
const MARGIN = { top: 35, left: 35, right: 35, bottom: 35 };

const LineChart = (props: {
  width: number;
  height: number;
  initial: number[];
  model: (x: number[]) => number[];
}) => {
  const { width, height, model, initial } = props;
  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const timeScale = scaleLinear({
    range: [0, innerWidth],
    domain: [0, 20],
  });

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, 2],
  });

  const x = rungeKuttaIntegration(initial, [0, 20], model);

  const lines = (
    <Group>
      <LinePath
        data={x}
        y={(d) => yScale(d.states[0])}
        x={(d) => timeScale(d.time)}
        className="stroke-chart-1"
        strokeWidth={2}
      />
      <LinePath
        data={x}
        y={(d) => yScale(d.states[1])}
        x={(d) => timeScale(d.time)}
        className="stroke-chart-2"
        strokeWidth={2}
      />
    </Group>
  );

  return (
    <Card className="relative">
      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <AxisBottom
            scale={timeScale}
            top={innerHeight}
            labelProps={{
              fill: "#98A7C0",
              textAnchor: "middle",
              verticalAnchor: "middle",
              fontSize: 16,
              fontWeight: 600,
            }}
            stroke={"#98A7C0"}
            tickStroke={"#2A2A2A"}
            tickLabelProps={{
              fill: "#98A7C0",
              textAnchor: "middle",
              verticalAnchor: "middle",
              fontSize: 10,
            }}
          />
          <AxisLeft
            scale={yScale}
            hideZero
            labelProps={{
              fill: "#98A7C0",
              textAnchor: "middle",
              verticalAnchor: "middle",
              fontSize: 16,
              fontWeight: 600,
            }}
            stroke={"#98A7C0"}
            tickStroke={"#2A2A2A"}
            tickLabelProps={{
              fill: "#98A7C0",
              textAnchor: "end",
              verticalAnchor: "end",
              fontSize: 10,
            }}
          />
          {lines}
        </Group>
      </svg>
    </Card>
  );
};

export default LineChart;
