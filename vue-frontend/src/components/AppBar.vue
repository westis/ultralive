<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title @click="goToHome">
      <v-icon icon="mdi-timeline-clock" /> Ultra Live
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Conditionally rendered Log Out button -->
    <template v-if="isLoggedIn">
      <v-btn icon @click="logout" color="secondary">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>

    <v-btn icon @click="toggleTheme">
      <v-icon v-if="isDark" icon="mdi-white-balance-sunny" />
      <v-icon v-else icon="mdi-weather-night" />
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore"; // Adjust the path if necessary
import { computed } from "vue";

const authStore = useAuthStore(); // useAuthStore instance
const themeStore = useThemeStore();
const router = useRouter();

const logout = async () => {
  await authStore.signOut();
  router.push("/login");
};

const goToHome = () => {
  router.push("/");
};

const toggleTheme = () => {
  themeStore.toggleTheme(); // Assuming toggleTheme is a method in your themeStore
};

const isDark = computed(() => themeStore.isDark); // Make sure this matches your theme store's implementation
const isLoggedIn = computed(() => !!authStore.user); // Corrected to use the authStore instance
</script>

<style>
.v-app-bar-title {
  cursor: pointer;
}
</style>
