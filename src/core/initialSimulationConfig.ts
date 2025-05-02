export const initialSimulationConfig = {
  volumetricFlowrate: { value: 200, min: 100, max: 300, label: "Flowrate" },
  inletConcentration: {
    value: 2e4,
    min: 1e4,
    max: 3e4,
    label: "Inlet Concentration",
  },
  inletTemperature: {
    value: 340,
    min: 300,
    max: 400,
    label: "Inlet Temperature",
  },
  coolantTemperature: {
    value: 370,
    min: 300,
    max: 400,
    label: "Coolant Temperature",
  },
};

export const startingInitialConditions: [number, number] = [1.2, 0.5];
