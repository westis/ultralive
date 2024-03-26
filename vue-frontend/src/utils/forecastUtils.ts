import { NormalizedEventData } from "@/types/NormalizedEvent.interface";

export function calculateMovingAveragePace(
  splits: NormalizedEventData[],
  windowSize: number
): number[] {
  const movingAveragePaces = [];

  for (let i = windowSize - 1; i < splits.length; i++) {
    const pastData = splits.slice(i - windowSize + 1, i + 1); // Corrected slicing
    const totalPastRaceTime = pastData.reduce(
      (sum, point) => sum + point.raceTimeInSeconds,
      0
    );
    const averageRaceTime = totalPastRaceTime / pastData.length;
    const avgPaceInSecondsPerKm =
      averageRaceTime / pastData[pastData.length - 1].distanceInKm;
    movingAveragePaces.push(avgPaceInSecondsPerKm);
  }

  return movingAveragePaces;
}
