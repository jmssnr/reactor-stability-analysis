import { MARGIN } from "@/components/charts/margin";

export const getBounds = (width: number, height: number) => {
  return {
    innerWidth: width - MARGIN.left - MARGIN.right,
    innerHeight: height - MARGIN.top - MARGIN.bottom,
  };
};
