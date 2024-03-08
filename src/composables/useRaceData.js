// src/composables/useRaceData.js
import { useRaceStore } from "@/stores/useRaceStore";
import { calculateTotalSeconds } from "@/utils/timeUtils";

const useRaceData = () => {
  const data = ref(null);
  const error = ref(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.rtrt.me/events/TLMR-FURTHER-FEAT-2024/profiles/RB3Y62DA,R6GMUPER,RB7V9PA2/splits?max=10000&appid=65bc00f7eca96e43f970aa14&token=07607b7c6c2409781943c9af7529f020"
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const jsonData = await response.json();
      data.value = jsonData.list
        .filter((entry) => entry.kmDistance > 0)
        .map((entry) => ({
          time: entry.time,
          pid: entry.pid,
          name: entry.name,
          kmDistance: entry.kmDistance,
          totalSeconds: calculateTotalSeconds(entry.time), // Add this line
          pace: calculatePace(entry.time, entry.kmDistance),
        }));
      const raceStore = useRaceStore();
      raceStore.updateLastSplits(jsonData.list);
    } catch (err) {
      error.value = err.message;
    }
  };

  // Update or add this function
  const calculatePace = (timeString, kmDistance) => {
    const totalSeconds = calculateTotalSeconds(timeString);
    return kmDistance > 0 ? totalSeconds / kmDistance : 0;
  };

  return { data, error, fetchData };
};

export default useRaceData;
