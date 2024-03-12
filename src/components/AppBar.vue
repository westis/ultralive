<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title @click="goToHome">
      <v-icon icon="mdi-timeline-clock" /> Ultra Live
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleTheme">
      <v-icon v-if="isDark" icon="mdi-white-balance-sunny" />
      <v-icon v-else icon="mdi-weather-night" />
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/stores/useThemeStore"; // Import your Pinia theme store
import { useRouter } from "vue-router";
import { computed, watch } from "vue";
import { useTheme } from "vuetify";

const themeStore = useThemeStore(); // Use the theme store
const theme = useTheme();
const router = useRouter();

// Compute based on the theme stored in Pinia
const isDark = computed(() => themeStore.theme === "dark");

// Watch for changes in the Pinia store and update Vuetify's theme accordingly
watch(
  isDark,
  (newValue) => {
    theme.global.name.value = newValue ? "dark" : "light";
  },
  { immediate: true }
);

function toggleTheme() {
  themeStore.toggleTheme(); // Toggle the theme in the Pinia store instead of directly in Vuetify
}

function goToHome() {
  router.push("/");
}
</script>

<style>
/* Make the title clickable */
.v-app-bar-title {
  cursor: pointer;
}
</style>
