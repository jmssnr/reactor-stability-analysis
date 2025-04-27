export const scaledLotkaVolterraModel = (alpha: number) => {
  return (x: number[]) => {
    return [alpha * x[0] - x[0] * x[1], -x[1] + x[0] * x[1]];
  };
};
