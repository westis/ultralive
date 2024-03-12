// src/stores/useRaceStore.ts
import { defineStore } from "pinia";
import { eventRegistry } from "@/events/eventRegistry";
import { NormalizedEventData } from "@/types/NormalizedEvent.interface";

// Define interfaces for state structure
interface EventData {
  allSplits: Record<string, NormalizedEventData[]>;
  lastSplits: Record<string, NormalizedEventData>;
}

interface EventsData {
  [eventId: string]: {
    allSplits: Record<string, NormalizedEventData[]>; // Corrected
    lastSplits: Record<string, NormalizedEventData>; // Corrected
  };
}

export const useRaceStore = defineStore("race", {
  state: (): { eventsData: EventsData } => ({
    eventsData: {}, // Initializing with proper type
  }),
  actions: {
    async fetchData(eventId: string) {
      const eventConfig = eventRegistry[eventId];
      if (!eventConfig) {
        throw new Error("Event not found");
      }

      try {
        const splits: NormalizedEventData[] = await eventConfig.fetchData();

        const eventState: EventData = this.eventsData[eventId] || {
          allSplits: {},
          lastSplits: {},
        };

        splits.forEach((split) => {
          const runnerId = split.runnerId;

          // Ensure initialization of arrays and objects for the runnerId
          if (!eventState.allSplits[runnerId]) {
            eventState.allSplits[runnerId] = [];
          }

          eventState.allSplits[runnerId].push(split);

          // Determine if this is the latest split
          const currentLastSplit = eventState.lastSplits[runnerId];
          if (
            !currentLastSplit ||
            split.raceTimeInSeconds > currentLastSplit.raceTimeInSeconds
          ) {
            eventState.lastSplits[runnerId] = split;
          }

          // Sort the splits array by raceTimeInSeconds for the current runnerId
          eventState.allSplits[runnerId].sort(
            (a, b) => a.raceTimeInSeconds - b.raceTimeInSeconds
          );
        });

        // Update or initialize the event data in the store
        this.eventsData[eventId] = eventState;
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching event data:", err.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    },
  },
  getters: {
    getRaceStartTime: () => (eventId: string) => {
      // Access the event registry directly, as `state` is not used
      if (!eventRegistry[eventId]) {
        console.error("Event not found:", eventId);
        return null;
      }
      return eventRegistry[eventId].raceStartTime;
    },
    getLastSplits: (state) => {
      return (
        eventId: string
      ): Record<string, NormalizedEventData> | undefined => {
        return state.eventsData[eventId]?.lastSplits;
      };
    },
    getAllSplits: (state) => {
      return (
        eventId: string
      ): Record<string, NormalizedEventData[]> | undefined => {
        return state.eventsData[eventId]?.allSplits;
      };
    },
  },
});
