/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import { createRouter, createWebHistory } from "vue-router/auto";

// Types
import type { App } from "vue";

import VueMeta from "vue-meta";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // the routes property is handled by the plugin
});

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(VueMeta);
}
