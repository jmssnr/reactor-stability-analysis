export const reactorModel = () => {
  const flowrate = 200 / 1000 / 60;
  const height = 2;
  const diameter = 1;
  const jacketSurface = Math.PI * diameter * height;
  const jacketVolume = (Math.PI / 4) * diameter ** 2 * height;
  const residenceTime = jacketVolume / flowrate;
  const preExponentialFactor = 6e3;
  const activationEnergy = 5.5e4;
  const reactionEnthalpy = -1.2e5;
  const initialInletConcentration = 2e4;
  const inletTemperature = 340;
  const density = 1300;
  const heatCapacity = 4.2e3;
  const heatTransferCoefficient = 4000;
  const coolantTemperature = 370;
  const universalGasConstant = 8.314;

  const bodenstein =
    (-1 * reactionEnthalpy * initialInletConcentration) /
    density /
    heatCapacity /
    inletTemperature;

  const stanton =
    (heatTransferCoefficient * jacketSurface) /
    density /
    heatCapacity /
    flowrate;

  const thetaCoolant = coolantTemperature / inletTemperature;

  return (x: number[]) => {
    const [theta, X] = x;

    const damkoehlerNumber =
      residenceTime *
      preExponentialFactor *
      Math.exp(
        -activationEnergy / universalGasConstant / theta / inletTemperature
      );

    return [
      1 -
        theta +
        bodenstein * damkoehlerNumber * (1 - X) +
        stanton * (thetaCoolant - theta),
      -1 * X + damkoehlerNumber * (1 - X),
    ];
  };
};
