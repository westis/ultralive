// src/api/2024-03-05-further6days.ts
import { DateTime, Duration } from "luxon";
import { eventRegistry } from "@/events/eventRegistry";
import { NormalizedEventData } from "@/types/NormalizedEvent.interface";
import { paceToSecondsPerKm, paceToSecondsPerMile } from "@/utils/timeUtils";

interface RawEventData {
  pid: string;
  name: string;
  time: string;
  distanceInKm: string;
  distanceInMiles: string;
  point: string;
  pace: string;
  paceAvg: string;
}

async function fetchEventData_20240305_further6days(): Promise<
  NormalizedEventData[]
> {
  const eventId = "220240305_further6days";
  const response = await fetch(
    "https://api.rtrt.me/events/TLMR-FURTHER-FEAT-2024/profiles/RH5KWABJ,RWGPA64T,RB3Y62DA,RY9T4VWJ,RCYVPFXM,RM93JEXU,RX7JML8D,RFW2UXP3,R6GMUPER,RB7V9PA2/splits?max=10000&appid=65bc00f7eca96e43f970aa14&token=07607b7c6c2409781943c9af7529f020"
  );
  if (!response.ok) throw new Error("Failed to fetch event data");
  const { list: lapsData } = await response.json();

  const eventDetails = eventRegistry[eventId];
  if (!eventDetails) throw new Error("Event details not found in registry");

  const raceStartTime = eventDetails.raceStartTime.toUTC();
  const raceDurationSeconds = Duration.fromISO(eventDetails.raceDuration).as(
    "seconds"
  );

  return lapsData.map((entry: RawEventData) => {
    const paceAvg = entry.paceAvg ? entry.paceAvg.split(" ")[0] : "0:00";

    // Ensure paceAvg and pace are defined before calling the conversion functions
    const paceAvgSecondsPerKm = paceAvg
      ? paceToSecondsPerKm(paceAvg)
      : Number.MAX_VALUE;
    const paceAvgSecondsPerMile = paceAvgSecondsPerKm * 1.60934;

    const lapTime = DateTime.fromISO(entry.time, { zone: "UTC" });
    const raceTimeInSecondsSinceStart = lapTime
      .diff(raceStartTime)
      .as("seconds");

    const accumulatedDistanceKm = parseFloat(entry.distanceInKm);
    const accumulatedDistanceMiles = accumulatedDistanceKm * 0.621371; // Convert km to miles

    // Estimate the total distance for both km and miles
    const kmEstimatedTotalDistance = raceDurationSeconds / paceAvgSecondsPerKm;
    const mileEstimatedTotalDistance = kmEstimatedTotalDistance * 0.621371;

    return {
      runnerId: entry.pid,
      runnerName: entry.name,
      raceTime: entry.time,
      distanceInKm: accumulatedDistanceKm,
      distanceInMiles: accumulatedDistanceMiles,
      raceTimeInSeconds: isNaN(raceTimeInSecondsSinceStart)
        ? 0
        : raceTimeInSecondsSinceStart, // Ensure we don't set NaN
      ProjectedDistanceInKm: kmEstimatedTotalDistance,
      ProjectedDistanceInMiles: mileEstimatedTotalDistance,
      avgPaceInSecondsPerKms: paceAvgSecondsPerKm,
      avgPaceInSecondsPerMile: paceAvgSecondsPerMile,
      splitPaceInSecondsPerKm: paceToSecondsPerKm(entry.pace),
      splitPaceInSecondsPerMile: paceToSecondsPerMile(entry.pace),
    };
  });
}

export { fetchEventData_20240305_further6days };
