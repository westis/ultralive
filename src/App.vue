// src/App.vue
<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
    <v-footer color="primary" app>
      <span>by Daniel Westergren / ultramarathon.se</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";

const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}
</script>
