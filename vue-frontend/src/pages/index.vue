//
<template>
  <v-container>
    <v-card>
      <v-card-title>Events</v-card-title>
      <v-list density="compact">
        <v-list-item
          v-for="(event, id) in eventRegistry"
          :key="id"
          @click="goToEvent(id)"
          class="clickable"
        >
          <template v-slot:prepend>
            <!-- Replace 'mdi-calendar' with your desired icon -->
            <v-icon icon="mdi-run-fast"></v-icon>
          </template>

          <v-list-item-title>{{ event.eventName }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { eventRegistry } from "@/events/eventRegistry";
import { useRouter } from "vue-router";

const router = useRouter();

const goToEvent = (eventId) => {
  router.push(`/events/${eventId}`);
};
</script>
