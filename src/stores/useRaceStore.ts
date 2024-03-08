// src/stores/useRaceStore.js
import { defineStore } from "pinia";
import { DateTime } from "luxon";
import { calculateTotalSeconds } from "@/utils/timeUtils";

export const useRaceStore = defineStore("race", {
  state: () => ({
    raceStartTime: DateTime.fromObject(
      { year: 2024, month: 3, day: 6, hour: 9, minute: 5, second: 4 },
      { zone: "UTC-08:00" }
    ),
    lastSplits: {} as Record<string, any>, // Type annotation for lastSplits object
  }),
  actions: {
    updateLastSplits(data) {
      data.forEach((entry) => {
        const currentEntry = this.lastSplits[entry.pid];
        if (
          !currentEntry ||
          calculateTotalSeconds(entry.time) >
            calculateTotalSeconds(currentEntry.time)
        ) {
          this.lastSplits[entry.pid] = entry;
        }
      });
    },
  },
});
