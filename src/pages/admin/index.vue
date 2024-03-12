// src/pages/admin/index.vue

<template>
  <v-container>
    <h1>Admin Dashboard</h1>
    <v-btn @click="refreshAnnotations">Refresh Annotations</v-btn>
    <!-- More admin functionality can be added here -->
  </v-container>
</template>

<script setup>
const router = useRouter();
const refreshAnnotations = inject("refreshAnnotations");

// Example function to navigate back to the main page
function backToMain() {
  router.push("/");
}
</script>

<route>
{
  "meta": {"requiresAuth": true}
}
</route>
