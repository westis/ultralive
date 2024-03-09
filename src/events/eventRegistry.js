// src/events/eventRegistry.js

import { DateTime } from "luxon";
import { fetchEventData_20240305_further6days } from "@/api/2024-03-05-further-6days";

export const eventRegistry = {
  "2024-03-05-further-6days": {
    eventName: "FURTHER 6 Days",
    fetchData: fetchEventData_20240305_further6days,
    raceStartTime: DateTime.fromISO("2024-03-06T09:05:00", {
      zone: "UTC-08:00",
    }),
    raceDuration: "PT144H",
  },

  // Add more events as needed
};
