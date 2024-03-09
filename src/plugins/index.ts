/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../stores";
import { createRouter, createWebHistory } from "vue-router/auto";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  });

  router.beforeEach((to, from, next) => {
    const redirectPath = sessionStorage.redirect;
    if (redirectPath) {
      delete sessionStorage.redirect;
      next(redirectPath); // Directly use the redirectPath
    } else {
      next(); // Proceed as normal
    }
  });

  app.use(vuetify).use(router).use(pinia);
}
