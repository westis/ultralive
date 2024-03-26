// src/events/eventRegistry.ts
import { ref, watchEffect } from "vue";
import { useSanityFetcher } from "vue-sanity";
import { DateTime } from "luxon";

interface Annotation {
  distance: number;
  name: string;
  color: string;
  offset: { x: number; y: number };
}

interface EventConfig {
  eventName: string;
  raceStartTime: DateTime;
  raceDuration: string;
  eventOfficialPage: string;
  eventFacebookPage: string;
  annotations: Annotation[];
}

// You might need to adjust the type based on the actual data structure you expect from Sanity
interface SanityEvent {
  eventName: string;
  raceStartTime: string; // Assuming ISO string format
  raceDuration: string;
  eventOfficialPage: string;
  eventFacebookPage: string;
  annotations: Annotation[];
}

const eventRegistry = ref<Record<string, EventConfig>>({});

const fetchEventRegistry = async () => {
  const { data: sanityData, error } =
    useSanityFetcher<SanityEvent[]>(`*[_type == "event"]`);

  watchEffect(() => {
    if (sanityData.value) {
      const newRegistry: Record<string, EventConfig> = {};
      sanityData.value.forEach((event) => {
        const eventId = event.slug.current; // Assuming you have a slug for each event
        newRegistry[eventId] = {
          eventName: event.eventName,
          raceStartTime: DateTime.fromISO(event.raceStartTime),
          raceDuration: event.raceDuration,
          eventOfficialPage: event.eventOfficialPage,
          eventFacebookPage: event.eventFacebookPage,
          annotations: event.annotations.map((annotation) => ({
            ...annotation,
            offset: { x: annotation.offset.x, y: annotation.offset.y },
          })),
        };
      });
      eventRegistry.value = newRegistry;
    }
  });

  if (error.value) {
    console.error(
      "Failed to fetch event data from Sanity:",
      error.value.message
    );
  }
};

// Call this function in an appropriate place in your app, for example, in App.vue or in a specific view component.
fetchEventRegistry();

export { eventRegistry };
