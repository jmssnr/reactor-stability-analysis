"use client";
import { rungeKuttaIntegration } from "@/core/runge-kutta-integration";
import {
  getHeatGenerationCurve,
  getHeatReleasedLine,
} from "@/core/tank-reactor-model";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { Point } from "@visx/point";
import { scaleLinear } from "@visx/scale";
import { Line, LinePath } from "@visx/shape";
import { Text } from "@visx/text";
import * as motion from "motion/react-client";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

const MARGIN = { top: 35, left: 35, right: 35, bottom: 35 };

const PhasePlane = (props: {
  width: number;
  height: number;
  initial: number[];
  setInitial: Dispatch<SetStateAction<number[]>>;
  model: (x: number[]) => number[];
  parameters: Record<
    string,
    {
      value: number;
      min: number;
      max: number;
      name: string;
    }
  >;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { width, height, model, initial, setInitial, parameters } = props;

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = scaleLinear({
    range: [0, innerWidth],
    domain: [0, 2],
  });

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, 1],
  });

  const states = rungeKuttaIntegration(initial, [0, 20], model);

  const heatGen = useMemo(
    () =>
      getHeatGenerationCurve(
        parameters.volumetricFlowrate.value / 1000 / 60,
        parameters.inletTemperature.value
      ),
    [parameters.volumetricFlowrate.value, parameters.inletTemperature.value]
  );

  const heatRel = useMemo(
    () =>
      getHeatReleasedLine(
        parameters.volumetricFlowrate.value / 1000 / 60,
        parameters.inletTemperature.value,
        parameters.inletConcentration.value,
        parameters.coolantTemperature.value
      ),
    [
      parameters.volumetricFlowrate.value,
      parameters.inletTemperature.value,
      parameters.inletConcentration.value,
      parameters.coolantTemperature.value,
    ]
  );

  const trajectory = (
    <Group>
      <LinePath
        data={states}
        y={(d) => yScale(d.states[1])}
        x={(d) => xScale(d.states[0])}
        className="stroke-chart-6 stroke-2"
      />
    </Group>
  );

  const heatGenCurve = (
    <LinePath
      data={heatGen}
      x={(d) => xScale(d.theta)}
      y={(d) => yScale(d.conversion)}
      className="stroke-chart-5 stroke-2 opacity-55"
    />
  );

  const heatRelCurve = (
    <LinePath
      data={heatRel}
      x={(d) => xScale(d.theta)}
      y={(d) => yScale(d.conversion)}
      className="stroke-chart-4 stroke-2 opacity-55"
    />
  );

  const grid = yScale.ticks(10).map((row) =>
    xScale.ticks(20).map((col) => {
      const [dx, dy] = model([col, row])

      const length = 20; //70 * Math.sqrt(dx ** 2 + dy ** 2);

      return (
        <Group key={`${row}-${col}`} opacity={1}>
          <motion.line
            x1={xScale(col)}
            y1={yScale(row)}
            x2={xScale(col + dx / length)}
            y2={yScale(row + dy / length)}
            fill={"transparent"}
            // stroke="#98A7C0"
            className="stroke-secondary"
            animate={{
              pathLength: [0, 1],
              opacity: [1, 0],
            }}
            transition={{ repeat: Infinity, duration: 2, type: "tween" }}
          />
          <circle
            cx={xScale(col)}
            cy={yScale(row)}
            r={2}
            className="fill-secondary"
            opacity={0.5}
          />
        </Group>
      );
    })
  );

  const initialCircle = (
    <Group>
      <circle
        className=" fill-chart-6 hover:cursor-pointer animate-pulse pointer-events-none"
        cx={xScale(initial[0])}
        cy={yScale(initial[1])}
        r={15}
        opacity={0}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      />
      <circle
        className="fill-chart-6 hover:cursor-pointer"
        cx={xScale(initial[0])}
        cy={yScale(initial[1])}
        r={8}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      />
    </Group>
  );

  const yAxis = (
    <Group>
      <Text y={150} x={-10} angle={270} className="fill-chart-2">
        Conversion
      </Text>
      <Line
        from={{ x: -15, y: 50 }}
        to={{ x: -15, y: 10 }}
        className="stroke-chart-2 stroke-2"
        markerEnd="url(#arrow)"
      />
    </Group>
  );

  const xAxis = (
    <Group>
      <Text y={innerHeight + 25} x={innerWidth - 270} className="fill-chart-1">
        Normalized Temperature
      </Text>
      <Line
        from={{ x: innerWidth - 60, y: innerHeight + 20 }}
        to={{ x: innerWidth - 10, y: innerHeight + 20 }}
        className="stroke-chart-1 stroke-2 "
        markerEnd="url(#arrow2)"
      />
    </Group>
  );

  return (
    <svg
      width={width}
      height={height}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={(e) => {
        if (isDragging) {
          const point = localPoint(e) || ({ x: 0, y: 0 } as Point);

          setInitial([
            xScale.invert(point.x - MARGIN.left),
            yScale.invert(point.y - MARGIN.top),
          ]);
        }
      }}
    >
      <defs>
        <marker
          id="arrowY"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          className="fill-chart-6"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          className="fill-chart-2"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <marker
          id="arrow2"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          className="fill-chart-1"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>

      <Group left={MARGIN.left} top={MARGIN.top}>
        <RectClipPath
          width={innerWidth}
          height={innerHeight}
          id={`clip-path-${innerWidth}-${innerHeight}`}
        />

        <Group style={{ userSelect: "none" }}>
          {yAxis}
          {xAxis}
          {/* <AxisBottom
            scale={xScale}
            top={innerHeight}
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
              textAnchor: "middle",
              verticalAnchor: "middle",
              fontSize: 15,
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
              fontSize: 15,
            }}
          /> */}
        </Group>
        <Group clipPath={`url(#clip-path-${innerWidth}-${innerHeight})`}>
          {grid}
          {heatGenCurve}
          {heatRelCurve}
          {trajectory}
          {initialCircle}
        </Group>
      </Group>
    </svg>
  );
};

export default PhasePlane;
