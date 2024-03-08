<template>
  <v-row>
    <v-col cols="6">
      <v-card class="text-center px-4 py-3">
        <v-card-title class="text-overline"> Start Time </v-card-title>
        <v-card-text class="text-h6">
          {{ raceStartTime.toFormat("yyyy-MM-dd HH:mm:ss") }}
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6">
      <v-card class="text-center px-4 py-3">
        <v-card-title class="text-overline"> Elapsed Time </v-card-title>
        <v-card-text class="text-h6">
          {{ formattedTime }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { DateTime } from "luxon";
import { ref } from "vue";

export default {
  setup() {
    // Set the race start time
    const raceStartTime = DateTime.fromObject(
      {
        year: 2024,
        month: 3,
        day: 6,
        hour: 9,
        minute: 5,
        second: 4,
      },
      { zone: "UTC-08:00" } // Timezone in the second argument
    );

    // Ref to hold the formatted time
    const formattedTime = ref("");

    // Update the elapsed time every second
    const updateTimer = () => {
      const now = DateTime.now().setZone("UTC-8");
      const elapsed = now.diff(raceStartTime);
      formattedTime.value = elapsed.toFormat("hh:mm:ss");
    };
    setInterval(updateTimer, 1000); // Update every second

    return {
      raceStartTime,
      formattedTime,
    };
  },
};
</script>
