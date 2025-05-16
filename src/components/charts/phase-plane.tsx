"use client";

import { MARGIN } from "@/components/charts/margin";
import SVGContainer from "@/components/charts/svg-container";
import { getBounds } from "@/components/charts/utils";
import { SimulationResult } from "@/core/types";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { Point } from "@visx/point";
import { scaleLinear } from "@visx/scale";
import { Line, LinePath } from "@visx/shape";
import { ticks } from "@visx/vendor/d3-array";
import * as motion from "motion/react-client";
import { useState } from "react";

const PhasePlane = (props: {
  width: number;
  height: number;
  initialConditions: number[];
  model: (x: number[]) => number[];
  solution: SimulationResult;
  heatRemovalLine: (theta: number) => number;
  heatGenerationCurve: (theta: number) => number;
  changeInitialConditions: (x0: number[]) => void;
}) => {
  const {
    width,
    height,
    initialConditions,
    model,
    solution,
    changeInitialConditions,
    heatRemovalLine,
    heatGenerationCurve,
  } = props;

  const [isDragging, setIsDragging] = useState(false);
  const { innerWidth, innerHeight } = getBounds(width, height);

  const beginDragging = () => setIsDragging(true);

  const stopDragging = () => setIsDragging(false);

  const xScale = scaleLinear({
    range: [0, innerWidth],
    domain: [0, 2],
  });

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, 1],
  });

  const trajectory = (
    <Group>
      <LinePath
        data={solution}
        y={(d) => yScale(d.states[1])}
        x={(d) => xScale(d.states[0])}
        className="stroke-chart-6 stroke-2 pointer-events-none"
      />
      <circle
        className=" fill-chart-6 hover:cursor-pointer animate-pulse pointer-events-none"
        cx={xScale(initialConditions[0])}
        cy={yScale(initialConditions[1])}
        r={15}
        opacity={0}
      />
      <circle
        className="fill-chart-6 hover:cursor-pointer"
        cx={xScale(initialConditions[0])}
        cy={yScale(initialConditions[1])}
        r={8}
        onMouseDown={beginDragging}
        onMouseUp={stopDragging}
      />
    </Group>
  );

  const vectorField = yScale.ticks(10).map((row) =>
    xScale.ticks(20).map((col) => {
      const [dx, dy] = model([col, row]);
      const length = 20;
      return (
        <Group key={`${row}-${col}`} opacity={1}>
          <motion.line
            x1={xScale(col)}
            y1={yScale(row)}
            x2={xScale(col + dx / length)}
            y2={yScale(row + dy / length)}
            className="stroke-secondary fill-transparent"
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
          />
        </Group>
      );
    })
  );

  const referenceLines = (
    <Group>
      <LinePath
        data={ticks(0, 2, 100)}
        x={(d) => xScale(d)}
        y={(d) => yScale(heatGenerationCurve(d))}
        className="stroke-chart-5 stroke-2 opacity-55"
      />
      <Line
        from={{ x: xScale(0), y: yScale(heatRemovalLine(0)) }}
        to={{ x: xScale(2), y: yScale(heatRemovalLine(2)) }}
        className="stroke-chart-4 stroke-2 opacity-55"
      />
    </Group>
  );

  const eventEmitter = (
    <rect
      width={innerWidth}
      height={innerHeight}
      fill="transparent"
      onPointerUp={stopDragging}
      onPointerMove={(e) => {
        if (isDragging) {
          const point = localPoint(e) || ({ x: 0, y: 0 } as Point);
          changeInitialConditions([
            xScale.invert(point.x - MARGIN.left),
            yScale.invert(point.y - MARGIN.top),
          ]);
        }
      }}
    />
  );

  return (
    <SVGContainer width={width} height={height}>
      <RectClipPath
        width={innerWidth}
        height={innerHeight}
        id={`clip-path-${innerWidth}-${innerHeight}`}
      />
      <Group clipPath={`url(#clip-path-${innerWidth}-${innerHeight})`}>
        <Group pointerEvents={"none"}>
          {vectorField}
          {referenceLines}
        </Group>
        {eventEmitter}
        {trajectory}
      </Group>
    </SVGContainer>
  );
};

export default PhasePlane;
