import { ticks } from "@visx/vendor/d3-array";

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

const getDamkoehlerNumber = (
  residenceTime: number,
  inletTemperature: number
) => {
  return (theta: number) =>
    residenceTime *
    preExponentialFactor *
    Math.exp(-activationEnergy / 8.314 / inletTemperature / theta);
};

export const getHeatGenerationCurve = (
  volumetricFlowrate: number,
  inletTemperature: number
) => {
  const theta = ticks(0, 2, 100);

  const residenceTime = vesselVolume / volumetricFlowrate;

  const damkoehlerComputation = getDamkoehlerNumber(
    residenceTime,
    inletTemperature
  );

  return theta.map((t) => ({
    theta: t,
    conversion: damkoehlerComputation(t) / (1 + damkoehlerComputation(t)),
  }));
};

export const getHeatReleasedLine = (
  volumetricFlowrate: number,
  inletTemperature: number,
  inletConcentration: number,
  coolantTemperature: number
) => {
  const theta = ticks(0, 2, 100);

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

  const thetaCoolant = coolantTemperature / inletTemperature;

  return theta.map((t) => ({
    theta: t,
    conversion:
      (1 / dimensionlessTemperatureRise) *
      (t - stantonNumber * (thetaCoolant - t) - 1),
  }));
};

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

  const residenceTime = vesselVolume / volumetricFlowrate;

  const thetaCoolant = coolantTemperature / inletTemperature;

  return (x: number[]) => {
    const [theta, conversion] = x;

    const damkoehlerNumber =
      residenceTime *
      preExponentialFactor *
      Math.exp(-activationEnergy / 8.314 / inletTemperature / theta);

    return [
      1 -
        theta +
        dimensionlessTemperatureRise * damkoehlerNumber * (1 - conversion) +
        stantonNumber * (thetaCoolant - theta),
      -conversion + damkoehlerNumber * (1 - conversion),
    ];
  };
};
