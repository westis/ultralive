// src/events/eventRegistry.ts
import { DateTime } from "luxon";
import { fetchEventData_20240305_further6days } from "@/api/220240305_further6days";
import { fetchEventData_20240309_torino24h } from "@/api/20240309-torino24h";
import { NormalizedEventData } from "@/types/NormalizedEvent.interface";

interface Annotation {
  distance: number;
  name: string;
  color: string;
  offset: { x: number; y: number };
}

interface EventConfig {
  eventName: string;
  fetchData: () => Promise<NormalizedEventData[]>;
  raceStartTime: DateTime;
  raceDuration: string;
  eventOfficialPage: string;
  eventFacebookPage: string;
  annotations: Annotation[];
}

interface EventRegistry {
  [key: string]: EventConfig;
}

export const eventRegistry: EventRegistry = {
  "220240305_further6days": {
    eventName: "FURTHER 6 Days",
    fetchData: fetchEventData_20240305_further6days,
    raceStartTime: DateTime.fromISO("2024-03-06T09:05:00", {
      zone: "UTC-08:00",
    }),
    raceDuration: "PT144H",
    eventOfficialPage: "https://www.lululemonfurther.com/",
    eventFacebookPage: "https://www.facebook.com/groups/1162388407189194",
    annotations: [
      {
        distance: 1036.8,
        name: "Men 6D World Record",
        color: "#388E3C",
        offset: { x: 0, y: 0 },
      },
      {
        distance: 883.631,
        name: "Women 6D World Record",
        color: "#512DA8",
        offset: { x: 0, y: 0 },
      },
    ],
  },
  "20240309-torino24h": {
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
    annotations: [
      {
        distance: 272.086,
        name: "Nordic Record (Men)",
        color: "#008FFB",
        offset: { x: 0, y: 0 },
      },
      {
        distance: 261.17,
        name: "European/Nordic Record (Women)",
        color: "#775DD0",
        offset: { x: 0, y: 0 },
      },
      {
        distance: 277.439,
        name: "Course Record (Men)",
        color: "#008FFB",
        offset: { x: 0, y: 0 },
      },
      {
        distance: 244.495,
        name: "Course Record (Women)",
        color: "#775DD0",
        offset: { x: 0, y: 0 },
      },
    ],
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