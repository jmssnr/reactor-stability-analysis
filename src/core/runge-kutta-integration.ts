import { SimulationResult } from "@/core/types";

export const rungeKuttaIntegration = (
  x0: number[],
  tspan: [number, number],
  fun: (x: number[]) => number[]
): SimulationResult => {
  const stepSize = 0.00125;
  const deltaTime = tspan[1] - tspan[0];
  const numberSteps = deltaTime / stepSize;

  const x = [{ states: x0, time: 0 }];

  for (let step = 1; step <= numberSteps; step++) {
    const k1 = fun(x[step - 1].states);
    const k2 = fun(
      x[step - 1].states.map((xi, i) => xi + 0.5 * stepSize * k1[i])
    );
    const k3 = fun(
      x[step - 1].states.map((xi, i) => xi + 0.5 * stepSize * k2[i])
    );
    const k4 = fun(x[step - 1].states.map((xi, i) => xi + stepSize * k3[i]));

    const xtemp = [];
    for (let i = 0; i < x0.length; i++) {
      xtemp.push(
        x[step - 1].states[i] +
          (stepSize / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
      );
    }

    x.push({ states: xtemp, time: x[step - 1].time + stepSize });
  }

  return x;
};
