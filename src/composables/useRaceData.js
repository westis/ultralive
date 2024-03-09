// src/composables/useRaceData.js
import { useRaceStore } from "@/stores/useRaceStore";

const useRaceData = (eventId) => {
  const data = ref([]);
  const error = ref(null);
  const loading = ref(false); // Add a loading state
  const raceStore = useRaceStore();
  const lastUpdated = ref(null);

  const fetchData = async () => {
    loading.value = true; // Set loading to true before fetching data
    try {
      await raceStore.fetchData(eventId);
      if (raceStore.eventsData[eventId]) {
        data.value = raceStore.eventsData[eventId].lastSplits;
        lastUpdated.value = new Date();
      } else {
        throw new Error("No data found for the event");
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false; // Reset loading state after fetching data
    }
  };

  return { data, error, fetchData, loading, lastUpdated };
};

export default useRaceData;
