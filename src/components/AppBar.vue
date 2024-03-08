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
import { useTheme } from "vuetify";
import { useRouter } from "vue-router";
import { computed } from "vue";

const theme = useTheme();
const router = useRouter();
const isDark = computed(() => theme.global.current.value.dark); // Track if its dark mode

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
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
