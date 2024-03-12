// src/composables/useRaceData.js
import { useRaceStore } from "@/stores/useRaceStore";
import { NormalizedEventData } from "@/types/NormalizedEvent.interface";
import { Ref, ref } from "vue";

interface RaceData {
  [runnerId: string]: NormalizedEventData;
}

interface UseRaceDataReturn {
  data: Ref<RaceData | NormalizedEventData[] | []>;
  error: Ref<string | null>;
  fetchData: () => Promise<void>;
  loading: Ref<boolean>;
  lastUpdated: Ref<Date | null>;
}

const useRaceData = (eventId: string): UseRaceDataReturn => {
  const data: Ref<NormalizedEventData[] | []> = ref([]);
  const error: Ref<string | null> = ref(null);
  const loading = ref(false);
  const raceStore = useRaceStore();
  const lastUpdated: Ref<Date | null> = ref(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      await raceStore.fetchData(eventId);
      if (raceStore.eventsData[eventId]) {
        data.value = Object.values(raceStore.eventsData[eventId].lastSplits);
        lastUpdated.value = new Date();
      } else {
        throw new Error("No data found for the event");
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unexpected error occurred";
    } finally {
      loading.value = false;
    }
  };

  return { data, error, fetchData, loading, lastUpdated };
};

export default useRaceData;
