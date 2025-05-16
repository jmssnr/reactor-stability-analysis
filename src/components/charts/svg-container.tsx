import { MARGIN } from "@/components/charts/margin";
import { Group } from "@visx/group";

const SVGContainer = (props: {
  width: number;
  height: number;
  children: React.ReactNode;
}) => {
  const { width, height, children } = props;
  return (
    <svg width={width} height={height}>
      <Group top={MARGIN.top} left={MARGIN.left}>
        {children}
      </Group>
    </svg>
  );
};

export default SVGContainer;
