// components/RaceTimer.vue
<template>
  <v-container class="py-0">
    <v-card>
      <!-- Card Subtitle or Toolbar for Links -->
      <v-toolbar density="compact">
        <v-toolbar-title>{{ eventName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text :href="eventOfficialPage" target="_blank"
          >Official Timing</v-btn
        >
        <v-btn text :href="eventFacebookPage" target="_blank">Discuss</v-btn>
        <!-- Add more links as needed -->
      </v-toolbar>

      <!-- Card Text for Start Time and Elapsed Time -->
      <v-card-text class="py-2">
        <v-row justify="space-around">
          <v-col cols="6">
            <div class="text-center">
              <div class="text-overline">Start Time</div>
              <div>{{ raceStartTimeFormatted }}</div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-center">
              <div class="text-overline">Elapsed Time</div>
              <div>{{ formattedTime }}</div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { eventRegistry } from "@/events/eventRegistry";
import { defineProps } from "vue";
import { useRaceStore } from "@/stores/useRaceStore";
import { DateTime } from "luxon";

// Define props to include eventId
const props = defineProps({
  eventId: String,
});

const eventOfficialPage = "https://www.lululemonfurther.com/"; // Replace with actual URL
const eventFacebookPage = "https://www.facebook.com/groups/1162388407189194"; // Replace with actual URL

const eventName = eventRegistry[props.eventId].eventName;
const raceStore = useRaceStore();

// Directly use props.eventId for reactive raceStartTime computation
const raceStartTime = computed(() => raceStore.getRaceStartTime(props.eventId));

const raceStartTimeFormatted = computed(() => {
  return raceStartTime.value
    ? raceStartTime.value.toFormat("yyyy-MM-dd HH:mm:ss")
    : "Loading...";
});

const formattedTime = ref("");

const updateTimer = () => {
  if (!raceStartTime.value) return;

  const now = DateTime.now().setZone(raceStartTime.value.zone);
  const elapsed = now
    .diff(raceStartTime.value, ["hours", "minutes", "seconds"])
    .toObject();

  formattedTime.value = `${elapsed.hours
    ?.toString()
    .padStart(2, "0")}:${elapsed.minutes
    ?.toString()
    .padStart(2, "0")}:${Math.floor(elapsed.seconds)
    ?.toString()
    .padStart(2, "0")}`;
};

setInterval(updateTimer, 1000);
onMounted(updateTimer);
</script>
