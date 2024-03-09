// src/api/2024-03-09-torino-24h.js
import { Duration } from "luxon";

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

    // Convert d11 (km distance) from "20,260" to a float
    const kmDistance = parseFloat(entry.d11.replace(",", "."));

    // Calculate total time in seconds for the distance covered
    const totalTimeInSeconds = paceInSecondsPerKm * kmDistance;

    // Convert kmDistance to mileDistance
    const mileDistance = kmDistance * 0.621371;

    return {
      pid: entry.d3,
      name: entry.d4,
      time: totalTimeInSeconds, // This is the total time in seconds
      kmDistance: kmDistance,
      mileDistance: mileDistance,
      totalSeconds: totalTimeInSeconds,
      estimatedDistance: kmDistance, // Assuming direct distance covered
      pace: entry.d12,
    };
  });
}
