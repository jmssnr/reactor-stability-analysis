export type SimulationResult = { time: number; states: number[] }[];

export type Parameter = {
  value: number;
  min: number;
  max: number;
  label: string;
};

export type SimulationConfig = Record<string, Parameter>;
