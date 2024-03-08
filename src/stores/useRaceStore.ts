// src/stores/useRaceStore.js
import { defineStore } from "pinia";
import { eventRegistry } from "@/events/eventRegistry";
import { calculateTotalSeconds } from "@/utils/timeUtils";

export const useRaceStore = defineStore("race", {
  state: () => ({
    eventsData: {}, // Stores data for each event, including allSplits by pid and the latest splits
  }),
  actions: {
    async fetchData(eventId) {
      const eventConfig = eventRegistry[eventId];
      if (!eventConfig) {
        throw new Error("Event not found");
      }

      try {
        const splits = await eventConfig.fetchData();
        if (!this.eventsData[eventId]) {
          this.eventsData[eventId] = {
            allSplits: {},
            lastSplits: {},
          };
        }

        splits.forEach((split) => {
          // Calculate totalSeconds once and store it
          const totalSeconds = calculateTotalSeconds(split.time);

          // Group allSplits by pid
          if (!this.eventsData[eventId].allSplits[split.pid]) {
            this.eventsData[eventId].allSplits[split.pid] = [];
          }
          this.eventsData[eventId].allSplits[split.pid].push({
            ...split,
            totalSeconds,
          });

          // Update lastSplits
          const currentLastSplit =
            this.eventsData[eventId].lastSplits[split.pid];
          if (
            !currentLastSplit ||
            totalSeconds > calculateTotalSeconds(currentLastSplit.time)
          ) {
            this.eventsData[eventId].lastSplits[split.pid] = {
              ...split,
              totalSeconds,
            };
          }
          // Sort the splits array by totalSeconds for the current pid
          this.eventsData[eventId].allSplits[split.pid].sort(
            (a, b) => a.totalSeconds - b.totalSeconds
          );
        });
      } catch (err) {
        console.error("Error fetching event data:", err.message);
      }
    },
  },
  getters: {
    // Getters to retrieve race start time and the last splits for display
    getRaceStartTime: (state) => (eventId) => {
      if (!eventRegistry[eventId]) {
        console.error("Event not found:", eventId);
        return null;
      }
      return eventRegistry[eventId].raceStartTime;
    },
    getLastSplits: (state) => (eventId) => {
      return state.eventsData[eventId]?.lastSplits;
    },
    // Getter to retrieve all splits for the chart
    getAllSplits: (state) => (eventId) => {
      return state.eventsData[eventId]?.allSplits;
    },
  },
});
