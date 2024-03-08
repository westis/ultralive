// src/api/2024-03-05-further-6days.js
import { calculateTotalSeconds, calculatePace } from "@/utils/timeUtils"; // Ensure these utility functions are defined and exported

// Unique event ID
const eventId = "2024-03-05-further-6days";

export async function fetchEventData_20240305_further6days() {
  const response = await fetch(
    "https://api.rtrt.me/events/TLMR-FURTHER-FEAT-2024/profiles/RB3Y62DA,R6GMUPER,RB7V9PA2/splits?max=10000&appid=65bc00f7eca96e43f970aa14&token=07607b7c6c2409781943c9af7529f020"
  );
  if (!response.ok) throw new Error("Failed to fetch ultramarathon2024 data");
  const jsonData = await response.json();

  // Assuming jsonData.list contains your raw event data
  return jsonData.list
    .filter((entry) => entry.kmDistance > 0)
    .map((entry) => ({
      pid: entry.pid,
      name: entry.name,
      time: entry.time,
      kmDistance: entry.kmDistance,
      mileDistance: entry.mileDistance,
      totalSeconds: calculateTotalSeconds(entry.time),
      // Calculate pace here as needed
      pace: calculatePace(entry.time, entry.kmDistance),
    }));
}
