// src/api/2024-03-05-further6days.js
import {
  calculateTotalSeconds,
  estimateDistance,
  calculatePaces,
} from "@/utils/timeUtils";
import { eventRegistry } from "@/events/eventRegistry";
import { Duration } from "luxon";

// Unique event ID
const eventId = "2024-03-05-further-6days";

export async function fetchEventData_20240305_further6days() {
  const response = await fetch(
    "https://api.rtrt.me/events/TLMR-FURTHER-FEAT-2024/profiles/RB3Y62DA,R6GMUPER,RB7V9PA2,RH5KWABJ,RM93JEXU,RCYVPFXM/splits?max=10000&appid=65bc00f7eca96e43f970aa14&token=07607b7c6c2409781943c9af7529f020"
  );
  if (!response.ok) throw new Error("Failed to fetch ultramarathon2024 data");
  const jsonData = await response.json();
  console.log("Received data:", jsonData);

  const raceDetails = eventRegistry[eventId];
  const totalRaceDurationInSeconds = Duration.fromISO(
    raceDetails.raceDuration
  ).as("seconds");

  return jsonData.list
    .filter((entry) => parseFloat(entry.kmDistance) > 0)
    .map((entry) => {
      const totalSeconds = calculateTotalSeconds(entry.time);
      const estimatedTotalDistance = estimateDistance(
        totalSeconds,
        totalRaceDurationInSeconds,
        parseFloat(entry.kmDistance) // Ensure kmDistance is a number
      );
      const { kmPace, milePace } = calculatePaces(
        entry.time,
        parseFloat(entry.kmDistance)
      );

      return {
        pid: entry.pid,
        name: entry.name,
        time: entry.time,
        kmDistance: parseFloat(entry.kmDistance), // Convert kmDistance to a number
        mileDistance: parseFloat(entry.mileDistance), // Convert mileDistance to a number
        totalSeconds: totalSeconds,
        estimatedDistance: estimatedTotalDistance,
        kmPace,
        milePace,
      };
    });
}
