export const getResidenceTime = (
  volumetricFlowrate: number,
  vesselVolume: number
) => {
  return vesselVolume / volumetricFlowrate;
};
