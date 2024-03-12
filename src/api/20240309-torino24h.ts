// src/api/2024-03-09-torino-24h.ts
import { Duration } from "luxon";
import {
  calculateMilePaceFromKmPace,
  estimateDistance,
  paceToSecondsPerKm,
} from "@/utils/timeUtils";
import { eventRegistry } from "@/events/eventRegistry";
import { NormalizedEventData } from "@/types/NormalizedEvent.interface";

const eventId = "20240309-torino24h";
const participantIds = ["35", "44"];

interface FetchResponseItem {
  d3: string; // runnerId
  d4: string; // runnerName
  d6: string; // Lap number
  d11: string; // Distance in KM for the lap
  d12: string; // Average Pace in MM:SS per KM
}

export async function fetchEventData_20240309_torino24h(): Promise<
  NormalizedEventData[]
> {
  const idsParam = participantIds.join(",");
  const url = `https://live.spolp.se/torino/?id=${idsParam}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Torino event data");
  const jsonData: FetchResponseItem[] = await response.json();

  const raceDetails = eventRegistry[eventId];
  const totalRaceDurationInSeconds = Duration.fromISO(
    raceDetails.raceDuration
  ).as("seconds");

  let previousDistance = 0;
  let previousTimeInSeconds = 0;

  return jsonData.map((entry) => {
    // Removed 'index' since it's not used
    const distanceInKm = parseFloat(entry.d11.replace(",", "."));
    const paceInSecondsPerKm = paceToSecondsPerKm(entry.d12);

    // Calculate total seconds using the current lap's distanceInKm and pace
    const currentTimeInSeconds = distanceInKm * paceInSecondsPerKm;
    const lapDistance = distanceInKm - previousDistance; // Distance covered in the current lap
    const lapTimeInSeconds = currentTimeInSeconds - previousTimeInSeconds; // Time taken for the current lap

    const splitPaceInSecondsPerKm =
      lapDistance > 0 ? lapTimeInSeconds / lapDistance : 0; // Avoid division by zero
    const splitPaceInSecondsPerMile = calculateMilePaceFromKmPace(
      splitPaceInSecondsPerKm
    );

    const ProjectedDistanceInKm = estimateDistance(
      currentTimeInSeconds,
      totalRaceDurationInSeconds,
      distanceInKm
    );
    const ProjectedDistanceInMiles = ProjectedDistanceInKm * 0.621371;

    previousDistance = distanceInKm;
    previousTimeInSeconds = currentTimeInSeconds;

    return {
      runnerId: entry.d3,
      runnerName: entry.d4,
      raceTime: entry.d12, // Consider proper formatting for race time if necessary
      distanceInKm: distanceInKm,
      distanceInMiles: distanceInKm * 0.621371,
      raceTimeInSeconds: currentTimeInSeconds,
      ProjectedDistanceInKm,
      ProjectedDistanceInMiles,
      avgPaceInSecondsPerKm: paceInSecondsPerKm,
      avgPaceInSecondsPerMile: calculateMilePaceFromKmPace(paceInSecondsPerKm),
      splitPaceInSecondsPerKm,
      splitPaceInSecondsPerMile,
    };
  });
}
