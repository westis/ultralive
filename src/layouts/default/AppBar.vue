<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title>
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

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark); // Track if its dark mode

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}
</script>
