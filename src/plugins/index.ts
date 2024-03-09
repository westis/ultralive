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
      // Now checking if the navigation is to the base URL of the app
      if (to.path === router.options.history.base) {
        next(redirectPath);
      } else {
        next();
      }
    } else {
      next();
    }
  });

  app.use(vuetify).use(router).use(pinia);
}
