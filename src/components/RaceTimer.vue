// components/RaceTimer.vue
<template>
  <v-row>
    <v-col cols="6" class="pt-0">
      <v-card class="text-center px-4 py-0 my-0">
        <v-card-title class="text-overline py-0"> Start Time </v-card-title>
        <v-card-text class="text-subtitle-1">
          {{ raceStartTime.toFormat("yyyy-MM-dd HH:mm:ss") }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6" class="pt-0">
      <v-card class="text-center px-4 py-0 my-0">
        <v-card-title class="text-overline py-0"> Elapsed Time </v-card-title>
        <v-card-text class="text-subtitle-1">
          {{ formattedTime }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { useRaceStore } from "@/stores/useRaceStore";
import { DateTime } from "luxon";

export default {
  setup() {
    const raceStore = useRaceStore();
    const formattedTime = ref("");

    // Update the elapsed time every second
    const updateTimer = () => {
      const now = DateTime.now().setZone("UTC-8");
      const elapsed = now.diff(raceStore.raceStartTime);
      formattedTime.value = elapsed.toFormat("hh:mm:ss");
    };
    setInterval(updateTimer, 1000); // Update every second

    return {
      raceStartTime: raceStore.raceStartTime,
      formattedTime,
    };
  },
};
</script>
