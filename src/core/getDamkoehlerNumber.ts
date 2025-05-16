export const getDamkoehlerNumber = (
  volumetricFlowrate: number,
  vesselVolume: number,
  preExponentialFactor: number,
  activationEnergy: number,
  inletTemperature: number
) => {
  return (theta: number) =>
    (vesselVolume / volumetricFlowrate) *
    preExponentialFactor *
    Math.exp(-activationEnergy / 8.314 / inletTemperature / theta);
};
