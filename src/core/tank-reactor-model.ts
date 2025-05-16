// Fixed parameters
const vesselHeight = 2; // [m]
const vesselDiameter = 1; // [m]
const preExponentialFactor = 6e3; // [1/s]
const activationEnergy = 5.5e4; // [J/mol]
const reactionEnthalpy = -1.2e5; // [J/K/mol]
const density = 1300; // [kg/m3]
const heatCapacity = 4.2e3; // [J/kg/K]
const heatTransferCoefficient = 4000; // [W/m2/K]

// Computed constant parameters
const vesselJacketSurfaceArea = Math.PI * vesselDiameter * vesselHeight; // [m^2]
const vesselVolume = (Math.PI / 4) * vesselDiameter ** 2 * vesselHeight; // [m^3]

export const stirredTankReactorModel = (
  volumetricFlowrate: number,
  inletConcentration: number,
  inletTemperature: number,
  coolantTemperature: number
) => {
  const stantonNumber =
    (heatTransferCoefficient * vesselJacketSurfaceArea) /
    density /
    heatCapacity /
    volumetricFlowrate;

  const dimensionlessTemperatureRise =
    (-reactionEnthalpy * inletConcentration) /
    density /
    heatCapacity /
    inletTemperature;

  const getDamkoehlerNumber = (theta: number) =>
    (vesselVolume / volumetricFlowrate) *
    preExponentialFactor *
    Math.exp(-activationEnergy / 8.314 / inletTemperature / theta);
  const thetaCoolant = coolantTemperature / inletTemperature;

  const reactorModel = (x: number[]) => {
    const [theta, conversion] = x;
    const damkoehlerNumber = getDamkoehlerNumber(theta);
    return [
      1 -
        theta +
        dimensionlessTemperatureRise * damkoehlerNumber * (1 - conversion) +
        stantonNumber * (thetaCoolant - theta),
      -conversion + damkoehlerNumber * (1 - conversion),
    ];
  };

  const heatGenerationCurve = (theta: number) => {
    const damkoehlerNumber = getDamkoehlerNumber(theta);
    return damkoehlerNumber / (1 + damkoehlerNumber);
  };
  const heatRemovalLine = (theta: number) =>
    (1 / dimensionlessTemperatureRise) *
    (theta - stantonNumber * (thetaCoolant - theta) - 1);

  return { reactorModel, heatGenerationCurve, heatRemovalLine };
};
