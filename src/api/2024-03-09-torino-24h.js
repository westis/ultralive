// src/api/2024-03-09-torino-24h.js
import { Duration } from "luxon";
import {
  calculateMilePaceFromKmPace,
  estimateDistance,
} from "@/utils/timeUtils";
import { eventRegistry } from "@/events/eventRegistry";

// Unique event ID for the Torino event
const eventId = "2024-03-09-torino-24h"; // Ensure this matches an entry in your event registry

// Predefined list of participant IDs for the event
const participantIds = ["35", "44"]; // Replace "ID1", "ID2", "ID3" with actual participant IDs

export async function fetchEventData_20240309_torino24h() {
  // Convert the list of participant IDs into a comma-separated string for the URL
  const idsParam = participantIds.join(",");
  const url = `https://live.spolp.se/torino/?id=${idsParam}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Torino event data");
  const jsonData = await response.json();

  return jsonData.map((entry) => {
    // Convert d12 (pace) from "m:ss" to total seconds per km
    const paceParts = entry.d12.split(":");
    const paceInSecondsPerKm =
      parseInt(paceParts[0], 10) * 60 + parseInt(paceParts[1], 10);

    const milePace = calculateMilePaceFromKmPace(paceInSecondsPerKm);

    // Convert d11 (km distance) from "20,260" to a float
    const kmDistance = parseFloat(entry.d11.replace(",", "."));

    // Calculate total time in seconds for the distance covered
    const totalTimeInSeconds = paceInSecondsPerKm * kmDistance;

    // Convert totalTimeInSeconds to a Luxon Duration object
    const totalTimeDuration = Duration.fromObject({
      seconds: totalTimeInSeconds,
    });

    // Format the time as HH:MM:SS.ss
    const formattedTime = totalTimeDuration.toFormat("hh:mm:ss.SS");

    // Convert kmDistance to mileDistance
    const mileDistance = kmDistance * 0.621371;

    // Get total race duration in seconds from the event registry
    const raceDetails = eventRegistry[eventId];
    const totalRaceDurationInSeconds = Duration.fromISO(
      raceDetails.raceDuration
    ).as("seconds");

    // Calculate estimatedDistance
    const estimatedTotalDistance = estimateDistance(
      totalTimeInSeconds,
      totalRaceDurationInSeconds,
      kmDistance
    );

    return {
      pid: entry.d3,
      name: entry.d4,
      time: formattedTime, // This is the total time in seconds
      kmDistance: kmDistance,
      mileDistance: mileDistance,
      totalSeconds: totalTimeInSeconds,
      estimatedDistance: estimatedTotalDistance, // Assuming direct distance covered
      kmPace: entry.d12,
      milePace: milePace,
    };
  });
}
