// src/App.vue
<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
    <v-footer color="primary" app>
      <span class="text-caption">by Daniel Westergren / ultramarathon.se</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useSanityClient } from "vue-sanity";
import { useThemeStore } from "@/stores/useThemeStore"; // Import the theme store
import { useTheme } from "vuetify";

// Initialize Sanity client
useSanityClient({
  projectId: "7lcnlqg7", // Replace with your project ID
  dataset: "yourDataset", // Replace with your dataset
  useCdn: process.env.NODE_ENV === "production",
});

const themeStore = useThemeStore();
const theme = useTheme();

const toggleTheme = () => {
  themeStore.toggleTheme(); // Toggle theme in the store
  theme.global.name.value = themeStore.theme; // Update Vuetify's theme
};

const isDark = computed(() => themeStore.theme === "dark"); // Compute based on theme store
</script>
