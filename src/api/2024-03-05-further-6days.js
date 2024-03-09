// src/api/2024-03-05-further6days.js
import {
  calculateTotalSeconds,
  estimateDistance,
  calculatePace,
} from "@/utils/timeUtils";
import { eventRegistry } from "@/events/eventRegistry";
import { Duration } from "luxon";

// Unique event ID
const eventId = "2024-03-05-further-6days";

export async function fetchEventData_20240305_further6days() {
  const response = await fetch(
    "https://api.rtrt.me/events/TLMR-FURTHER-FEAT-2024/profiles/RB3Y62DA,R6GMUPER,RB7V9PA2/splits?max=10000&appid=65bc00f7eca96e43f970aa14&token=07607b7c6c2409781943c9af7529f020"
  );
  if (!response.ok) throw new Error("Failed to fetch ultramarathon2024 data");
  const jsonData = await response.json();
  console.log("Received data:", jsonData);

  const raceDetails = eventRegistry[eventId];
  // Convert raceDuration from ISO 8601 to total seconds
  const totalRaceDurationInSeconds = Duration.fromISO(
    raceDetails.raceDuration
  ).as("seconds");

  return jsonData.list
    .filter((entry) => entry.kmDistance > 0)
    .map((entry) => {
      const totalSeconds = calculateTotalSeconds(entry.time);
      const estimatedTotalDistance = estimateDistance(
        totalSeconds,
        totalRaceDurationInSeconds,
        entry.kmDistance
      );

      return {
        pid: entry.pid,
        name: entry.name,
        time: entry.time,
        kmDistance: entry.kmDistance,
        mileDistance: entry.mileDistance,
        totalSeconds: totalSeconds,
        estimatedDistance: estimatedTotalDistance,
        pace: calculatePace(entry.time, entry.kmDistance),
      };
    });
}
