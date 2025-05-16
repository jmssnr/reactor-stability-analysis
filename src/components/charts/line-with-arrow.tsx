import { MARGIN } from "@/components/charts/margin";
import { getStringWidthAndHeight } from "@/components/charts/utils";
import { Group } from "@visx/group";
import { Line } from "@visx/shape";
import { Text } from "@visx/text";

const LineWithArrow = (props: {
  label: string;
  className: string;
  type: "xAxis" | "yAxis";
}) => {
  const { className, label, type } = props;

  const { width: LABEL_WIDTH, height: LABEL_HEIGHT } = getStringWidthAndHeight(
    label,
    {
      fontSize: 16,
      fontFamily: "sans-serif",
    }
  );

  const ARROW_LENGTH = 100;

  const PADDING = 15;

  if (type === "xAxis") {
    return (
      <Group
        className={className}
        left={innerWidth - LABEL_WIDTH - ARROW_LENGTH}
        top={innerHeight + MARGIN.bottom}
      >
        <Text className="stroke-none fill-inherit" fontSize={16}>
          {label}
        </Text>
        <Line
          from={{ x: LABEL_WIDTH + PADDING, y: -LABEL_HEIGHT / 4 }}
          to={{ x: LABEL_WIDTH + ARROW_LENGTH, y: -LABEL_HEIGHT / 4 }}
          className="stroke-inherit stroke-1"
          markerEnd="url(#arrow)"
        />
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          className="fill-inherit"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </Group>
    );
  }

  return (
    <Group className={className}>
      <Text className="fill-inherit">{label}</Text>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
        className="fill-inherit"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </Group>
  );
};

export default LineWithArrow;
