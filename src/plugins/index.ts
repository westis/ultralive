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
    const storedUrl = sessionStorage.redirect;
    if (storedUrl) {
      delete sessionStorage.redirect;
      // Create a URL object from the stored URL to parse it
      const redirectUrl = new URL(storedUrl);
      // Extract the pathname and search params, and hash (if any) relative to the app's base
      const basePath = import.meta.env.VITE_APP_BASE_URL;
      const relativePath =
        redirectUrl.pathname.replace(basePath, "") +
        redirectUrl.search +
        redirectUrl.hash;
      next(relativePath);
    } else {
      next(); // Proceed as normal
    }
  });

  app.use(vuetify).use(router).use(pinia);
}
