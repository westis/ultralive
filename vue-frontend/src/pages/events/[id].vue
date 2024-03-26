<template>
  <v-container class="pa-5">
    <v-row justify="center" class="">
      <v-col cols="12" class="py-1">
        <!-- Pass eventId as a prop to RaceTimer -->
        <RaceTimer :eventId="eventId" />
      </v-col>
      <v-col cols="12" class="py-1">
        <!-- Pass eventId as a prop to RaceChart -->
        <RaceChart :eventId="eventId" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import RaceTimer from "@/components/RaceTimer.vue";
import RaceChart from "@/components/RaceChart.vue";

const route = useRoute();
// Extract eventId from the route parameters
const eventId = route.params.id;
</script>

<style scoped>
/* Add any page-specific styling here */
</style>
