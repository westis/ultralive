<template>
  <v-container class="pa-5">
    <v-row justify="center">
      <v-col cols="12">
        <race-timer />
      </v-col>
      <v-col cols="12">
        <race-chart />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import RaceTimer from "@/components/RaceTimer.vue";
import RaceChart from "@/components/RaceChart.vue";
</script>

<style scoped>
/* Add any page-specific styling here */
</style>
