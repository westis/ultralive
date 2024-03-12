// components/RaceTimer.vue
<template>
  <v-container class="pa-0">
    <v-card>
      <!-- Card Subtitle or Toolbar for Links -->
      <v-toolbar density="compact">
        <v-toolbar-title>{{ eventName }}</v-toolbar-title>

        <v-btn text :href="eventOfficialPage" target="_blank">
          <v-icon left>mdi-clock</v-icon>
          <span class="hidden-sm-and-down">Official Timing</span>
        </v-btn>
        <v-btn text :href="eventFacebookPage" target="_blank">
          <v-icon left>mdi-forum</v-icon>
          <span class="hidden-sm-and-down">Discuss</span>
        </v-btn>
      </v-toolbar>

      <!-- Card Text for Start Time and Elapsed Time -->
      <v-card-text class="py-2">
        <v-row justify="space-around">
          <v-col cols="4">
            <div class="text-center">
              <div class="text-overline">Start Time</div>
              <div>{{ raceStartTimeFormatted }}</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-center">
              <div class="text-overline">Elapsed Time</div>
              <div>{{ formattedTime }}</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-center">
              <div class="text-overline">Remaining Time</div>
              <div>{{ remainingTime }}</div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { eventRegistry } from "@/events/eventRegistry";
import { useRaceStore } from "@/stores/useRaceStore";
import { DateTime, Duration } from "luxon";

const props = defineProps({
  eventId: String,
});

// Assuming the event URLs are constants for now
const eventOfficialPage = computed(
  () => eventRegistry[props.eventId].eventOfficialPage
);
const eventFacebookPage = computed(
  () => eventRegistry[props.eventId].eventFacebookPage
);
const eventName = eventRegistry[props.eventId].eventName;
const raceStore = useRaceStore();
const raceStartTime = computed(() => raceStore.getRaceStartTime(props.eventId));

const raceStartTimeFormatted = computed(() =>
  raceStartTime.value
    ? raceStartTime.value.toFormat("yyyy-MM-dd HH:mm:ss")
    : "Loading..."
);

const formattedTime = ref("");
const remainingTime = ref("");

// Convert ISO 8601 duration to total seconds
const raceDurationInSeconds = computed(() => {
  const duration = eventRegistry[props.eventId].raceDuration;
  return Duration.fromISO(duration).as("seconds");
});

const updateTimer = () => {
  if (!raceStartTime.value || raceDurationInSeconds.value === undefined) return;

  const now = DateTime.now().setZone(raceStartTime.value.zone);
  let elapsedSeconds = now.diff(raceStartTime.value, "seconds").seconds;
  const raceEndTime = raceStartTime.value.plus({
    seconds: raceDurationInSeconds.value,
  });

  // Ensure elapsed time does not exceed the race duration
  if (now > raceEndTime) {
    elapsedSeconds = raceDurationInSeconds.value; // Cap elapsed time at race duration
  }

  const remainingSeconds = Math.max(
    raceDurationInSeconds.value - elapsedSeconds,
    0
  );

  formattedTime.value = formatSecondsAsTime(elapsedSeconds);
  remainingTime.value = formatSecondsAsTime(remainingSeconds);
};

const formatSecondsAsTime = (seconds) => {
  const raceTimeInSeconds = Math.floor(seconds);
  const hours = Math.floor(raceTimeInSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((raceTimeInSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (raceTimeInSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
};

setInterval(updateTimer, 1000);
onMounted(updateTimer);
</script>

<style scoped>
.text-overline {
  line-height: 1.2rem; /* Adjust this value as needed */
}
</style>
