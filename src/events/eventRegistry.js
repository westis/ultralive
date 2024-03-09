// src/events/eventRegistry.js

import { DateTime } from "luxon";
import { fetchEventData_20240305_further6days } from "@/api/2024-03-05-further-6days";
import { fetchEventData_20240309_torino24h } from "@/api/2024-03-09-torino-24h";

export const eventRegistry = {
  "2024-03-05-further-6days": {
    eventName: "FURTHER 6 Days",
    fetchData: fetchEventData_20240305_further6days,
    raceStartTime: DateTime.fromISO("2024-03-06T09:05:00", {
      zone: "UTC-08:00",
    }),
    raceDuration: "PT144H",
    eventOfficialPage: "https://www.lululemonfurther.com/",
    eventFacebookPage: "https://www.facebook.com/groups/1162388407189194",
  },
  "2024-03-09-torino-24h": {
    // This is the key for the new event
    eventName: "Torino 24 Hours",
    fetchData: fetchEventData_20240309_torino24h,
    raceStartTime: DateTime.fromISO("2024-03-09T10:00:00", {
      // Assuming the date and time for the example, adjust as needed
      zone: "UTC+01:00", // Adjust the timezone according to the event location
    }),
    raceDuration: "PT24H",
    eventOfficialPage: "https://my.raceresult.com/280730/live",
    eventFacebookPage: "",
  },
  // "2024-03-09-skovde-6h": {
  //   eventName: "Skovde 6 Hours",
  //   fetchData: fetchEventData_20240309_skovde6h,
  //   raceStartTime: DateTime.fromISO("2024-03-09T09:00:00", {
  //     zone: "UTC+01:00",
  //   }),
  //   raceDuration: "PT6H",
  // },
};
