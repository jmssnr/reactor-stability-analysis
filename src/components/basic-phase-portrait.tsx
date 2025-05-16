import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
const MARGIN = { top: 35, left: 35, right: 35, bottom: 35 };

const BasicPhasePortrait = (props: {
  width: number;
  height: number;
  data: { states: number[]; time: number }[];
  heatGen: { theta: number; conversion: number }[];
  heatRel: { theta: number; conversion: number }[];
}) => {
  const { width, height, data, heatGen, heatRel } = props;
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

  const trajectory = (
    <Group>
      <LinePath
        data={data}
        y={(d) => yScale(d.states[1])}
        x={(d) => xScale(d.states[0])}
        stroke={"green"}
        strokeWidth={2}
      />
    </Group>
  );

  const heatGenCurve = (
    <LinePath
      data={heatGen}
      x={(d) => xScale(d.theta)}
      y={(d) => yScale(d.conversion)}
      stroke={"red"}
      strokeWidth={2}
    />
  );

  const heatRelCurve = (
    <LinePath
      data={heatRel}
      x={(d) => xScale(d.theta)}
      y={(d) => yScale(d.conversion)}
      stroke={"blue"}
      strokeWidth={2}
    />
  );

  return (
    <svg width={width} height={height}>
      <Group left={MARGIN.left} top={MARGIN.top}>
        <AxisBottom
          scale={xScale}
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
        {trajectory}
        {heatGenCurve}
        {heatRelCurve}
      </Group>
    </svg>
  );
};

export default BasicPhasePortrait;
