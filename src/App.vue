// src/App.vue
<template>
  <v-app class="h-screen">
    <AppBar />
    <v-main class="h-100">
      <router-view />
    </v-main>
    <v-footer color="primary" app>
      <span class="text-caption">by Daniel Westergren / ultramarathon.se</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/stores/useThemeStore"; // Import the theme store
import { useTheme } from "vuetify";

const themeStore = useThemeStore();
const theme = useTheme();

const toggleTheme = () => {
  themeStore.toggleTheme(); // Toggle theme in the store
  theme.global.name.value = themeStore.theme; // Update Vuetify's theme
};

const isDark = computed(() => themeStore.theme === "dark"); // Compute based on theme store
</script>
