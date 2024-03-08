// src/composables/useRaceData.js
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
      data.value = jsonData.list.map((entry) => ({
        time: entry.time,
        pid: entry.pid,
        name: entry.name,
        kmDistance: entry.kmDistance,
        totalSeconds: calculateTotalSeconds(entry.time), // Add this line
        pace: calculatePace(entry.time, entry.kmDistance),
      }));
    } catch (err) {
      error.value = err.message;
    }
  };

  // Add this function to your composable
  const calculateTotalSeconds = (timeString) => {
    const parts = timeString.split(":").map(parseFloat);
    let totalSeconds;
    if (parts.length === 4) {
      totalSeconds =
        parts[0] * 86400 + parts[1] * 3600 + parts[2] * 60 + parts[3];
    } else if (parts.length === 3) {
      totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
      throw new Error("Invalid time format");
    }
    return totalSeconds;
  };

  // Update or add this function
  const calculatePace = (timeString, kmDistance) => {
    const totalSeconds = calculateTotalSeconds(timeString);
    return kmDistance > 0 ? totalSeconds / kmDistance : 0;
  };

  return { data, error, fetchData };
};

export default useRaceData;
