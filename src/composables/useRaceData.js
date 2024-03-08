// src/composables/useRaceData.js
import { useRaceStore } from "@/stores/useRaceStore";
import { ref } from "vue";

// Updated to accept an eventId
const useRaceData = (eventId) => {
  const data = ref([]);
  const error = ref(null);
  const raceStore = useRaceStore();

  const fetchData = async () => {
    try {
      // Use the store's fetchData method, passing the eventId
      await raceStore.fetchData(eventId);
      // Access fetched data from the store
      if (raceStore.eventsData[eventId]) {
        data.value = raceStore.eventsData[eventId].lastSplits;
      } else {
        throw new Error("No data found for the event");
      }
    } catch (err) {
      error.value = err.message;
    }
  };

  return { data, error, fetchData };
};

export default useRaceData;
