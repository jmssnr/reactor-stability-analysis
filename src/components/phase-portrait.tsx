"use client";
import { getHeatGenerationCurve, getHeatReleased } from "@/core/reactor-model";
import { rungeKuttaIntegration } from "@/core/runge-kutta-integration";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { Point } from "@visx/point";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import * as motion from "motion/react-client";
import { Dispatch, SetStateAction, useState } from "react";

const MARGIN = { top: 35, left: 35, right: 35, bottom: 35 };

const PhasePortrait = (props: {
  width: number;
  height: number;
  initial: number[];
  setInitial: Dispatch<SetStateAction<number[]>>;
  model: (x: number[]) => number[];
  tau: number;
  stanton: number;
  bodenstein: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const {
    width,
    height,
    model,
    initial,
    setInitial,
    tau,
    stanton,
    bodenstein,
  } = props;

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

  const states = rungeKuttaIntegration(initial, [0, 15], model);

  const heatRel = getHeatReleased(stanton, bodenstein);
  const heatGen = getHeatGenerationCurve(tau);

  const heatGenLine = (
    <LinePath
      data={heatGen}
      x={(d) => xScale(d.theta)}
      y={(d) => yScale(d.conversion)}
      stroke={"blue"}
      strokeWidth={2}
    />
  );

  const heatReleasedLine = (
    <LinePath
      data={heatRel}
      x={(d) => xScale(d.theta)}
      y={(d) => yScale(d.conversion)}
      stroke={"blue"}
      strokeWidth={2}
    />
  );

  const grid = yScale.ticks(30).map((row) =>
    xScale.ticks(40).map((col) => {
      const [dx, dy] = model([col, row]);

      const length = 200; //70 * Math.sqrt(dx ** 2 + dy ** 2);

      return (
        <Group key={`${row}-${col}`} opacity={0.6}>
          {/* <circle cx={xScale(col)} cy={yScale(row)} r={2} fill="#98A7C0" /> */}

          <motion.line
            x1={xScale(col)}
            y1={yScale(row)}
            x2={xScale(col + dx / length)}
            y2={yScale(row + dy / length)}
            fill={"transparent"}
            stroke="#98A7C0"
            animate={{
              pathLength: [0, 1],
              opacity: [1, 0.5],
              // pathLength: [0, 1, 0],
            }}
            // initial={{ pathLength: 0.001, opacity: 0 }}
            // animate={{ pathLength: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, type: "tween" }}
          />
          {/* <Line
            from={{ x: xScale(col), y: yScale(row) }}
            to={{ x: xScale(col + dx / length), y: yScale(row + dy / length) }}
            stroke="#98A7C0"
            markerEnd="url(#arrow)"
          /> */}
        </Group>
      );
    })
  );

  const initialCircle = (
    <Group>
      <circle
        className="hover:cursor-pointer animate-pulse pointer-events-none"
        cx={xScale(initial[0])}
        cy={yScale(initial[1])}
        r={15}
        opacity={0}
        fill="#f24391"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      />
      <circle
        className="hover:cursor-pointer"
        cx={xScale(initial[0])}
        cy={yScale(initial[1])}
        r={8}
        fill="#f24391"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      />
    </Group>
  );

  const line = (
    <LinePath
      data={states}
      x={(d) => xScale(d.states[0])}
      y={(d) => yScale(d.states[1])}
      stroke={"#f24391"}
      strokeWidth={2}
    />
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
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          fill="#98A7C0"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <Group left={MARGIN.left} top={MARGIN.top}>
        {grid}
        <Group style={{ userSelect: "none" }}>
          <AxisBottom
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
          />
        </Group>
        {line}
        {initialCircle}
        {heatGenLine}
        {heatReleasedLine}
      </Group>
    </svg>
  );
};

export default PhasePortrait;
